import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { tavily } from "@tavily/core";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nimChat } from "./nvidia";
import type { AIOptions } from "@/types";

const globalGeminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
const globalAnthropicKey = process.env.ANTHROPIC_API_KEY || "";
const globalTavilyKey = process.env.TAVILY_API_KEY || "tvly-demo";

async function getUserKeys(): Promise<{ gemini?: string, tavily?: string, anthropic?: string, ollama?: string, nvidia?: string }> {
  try {
    const user = await currentUser();
    if (user?.primaryEmailAddress?.emailAddress) {
      const userSettings = await db.query.settings.findFirst({
        where: eq(settings.userEmail, user.primaryEmailAddress.emailAddress)
      });
      if (userSettings?.apiKeys) {
        return JSON.parse(userSettings.apiKeys);
      }
    }
  } catch (e) {
    console.error("Failed to load user API keys in ai.ts:", e);
  }
  return {};
}

// Fallback global clients
const globalGenAI = new GoogleGenerativeAI(globalGeminiKey);
const globalAnthropic = new Anthropic({ apiKey: globalAnthropicKey });

/**
 * Unified AI text generation router.
 * Single entry point for all AI calls across the entire platform.
 * 
 * Routing priority:
 * 1. Ollama (local, $0) — if configured
 * 2. NVIDIA NIM (free open-source models) — if model is "nim" or NIM key exists
 * 3. Gemini (Google free tier) — default
 * 4. Claude (Anthropic) — if explicitly selected or BYOK key exists
 */
export async function ai(prompt: string, options: AIOptions = {}): Promise<string> {
  const { model = "gemini", system, maxTokens = 2000 } = options;
  
  const userKeys = await getUserKeys();

  // 1. Local execution (cost: $0)
  if (userKeys.ollama) {
    return ollamaText(prompt, system, userKeys.ollama);
  }

  // 2. NVIDIA NIM open-source models (cost: $0)
  if (model === "nim" || (userKeys.nvidia && model !== "claude" && model !== "gemini")) {
    return nimText(prompt, system, maxTokens);
  }

  // 3. Claude (BYOK only)
  if (model === "claude" || (userKeys.anthropic && !userKeys.gemini)) {
    return claudeText(prompt, system, maxTokens, userKeys);
  }

  // 4. Gemini (default — Google free tier)
  return geminiText(prompt, system, maxTokens, userKeys);
}

/**
 * NVIDIA NIM — Free open-source model execution.
 * Routes to Nemotron Ultra 253B (God Brain) for maximum quality.
 */
async function nimText(prompt: string, system?: string, maxTokens: number = 2000): Promise<string> {
  const messages = [
    ...(system ? [{ role: "system", content: system }] : []),
    { role: "user", content: prompt }
  ];
  return nimChat("nvidia/llama-3.1-nemotron-ultra-253b", messages, { maxTokens, temperature: 0.6 });
}

async function ollamaText(prompt: string, system?: string, ollamaUrl: string = "http://localhost:11434"): Promise<string> {
  try {
    const url = new URL("/api/generate", ollamaUrl).toString();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5-coder",
        prompt: prompt,
        system: system || "",
        stream: false
      })
    });
    if (!res.ok) throw new Error("Ollama request failed");
    const data = await res.json();
    return data.response;
  } catch (err) {
    console.error("Local Ollama Node failed:", err);
    throw err;
  }
}

async function geminiText(prompt: string, system?: string, maxTokens: number = 2000, userKeys: { gemini?: string } = {}): Promise<string> {
  const keys = Object.keys(userKeys).length > 0 ? userKeys : await getUserKeys();
  const client = keys.gemini ? new GoogleGenerativeAI(keys.gemini) : globalGenAI;
  
  const model = client.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: system || undefined,
    generationConfig: { maxOutputTokens: maxTokens }
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function claudeText(prompt: string, system?: string, maxTokens: number = 2000, userKeys: { anthropic?: string } = {}): Promise<string> {
  const keys = Object.keys(userKeys).length > 0 ? userKeys : await getUserKeys();
  const client = keys.anthropic ? new Anthropic({ apiKey: keys.anthropic }) : globalAnthropic;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    ...(system ? { system } : {}),
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

/**
 * Live Web Search AI — Tavily scrape + LLM synthesis.
 */
export async function research_ai(query: string, prompt: string, options: AIOptions = {}): Promise<string> {
  try {
    const userKeys = await getUserKeys();
    const searchClient = tavily({ apiKey: userKeys.tavily || globalTavilyKey });

    const searchResult = await searchClient.search(query, {
      searchDepth: "advanced",
      includeImages: false,
      includeRawContent: false,
      maxResults: 5,
    });

    const context = searchResult.results
      .map((r, i) => `Source ${i + 1} (${r.url}):\n${r.content}`)
      .join("\n\n");

    const enrichedPrompt = `LIVE WEB SEARCH RESULTS:\n${context}\n\n---\n\nUSER TASK:\n${prompt}`;
    
    return ai(enrichedPrompt, { 
      ...options, 
      system: `${options.system || "You are an elite researcher."}\n\nYou have been provided with real-time web search results. Use this data absolutely strictly to answer the user's task. If the search results contradict your training data, trust the search results.` 
    });
  } catch (error) {
    console.error("[Live Search Error]:", error);
    return ai(prompt, options);
  }
}

/**
 * Adaptive AI — Self-Improving Prompt Engine with Pinecone Memory.
 */
export async function adaptive_ai(prompt: string, options: AIOptions = {}): Promise<string> {
  const { recall } = await import("./memory");
  
  let learnedDirectives = "";
  try {
    const optimizations = await recall("SYSTEM_OPTIMIZATION directive", 2);
    if (optimizations.length > 0) {
      learnedDirectives = optimizations
        .map(o => o.entry.text)
        .join("\n\n");
    }
  } catch {
    // If recall fails, proceed without optimizations
  }

  const enhancedSystem = [
    options.system || "You are SOVEREIGN, an elite autonomous AI marketing system.",
    learnedDirectives ? `\n\n--- LEARNED OPTIMIZATION DIRECTIVES (Auto-Injected) ---\n${learnedDirectives}\n--- END DIRECTIVES ---` : "",
  ].join("");

  return ai(prompt, { ...options, system: enhancedSystem });
}

/**
 * Generate embeddings using Gemini for vector memory.
 */
export async function embed(text: string): Promise<number[]> {
  const userKeys = await getUserKeys();
  const client = userKeys.gemini ? new GoogleGenerativeAI(userKeys.gemini) : globalGenAI;
  
  const model = client.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
