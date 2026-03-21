import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { tavily } from "@tavily/core";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { AIModel, AIOptions } from "@/types";

const globalGeminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
const globalAnthropicKey = process.env.ANTHROPIC_API_KEY || "";
const globalOpenAIKey = process.env.OPENAI_API_KEY || "";
const globalTavilyKey = process.env.TAVILY_API_KEY || "tvly-demo";

async function getUserKeys(): Promise<{ gemini?: string, tavily?: string, anthropic?: string, ollama?: string, openai?: string }> {
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
 */
export async function ai(prompt: string, options: AIOptions = {}): Promise<string> {
  const { model = "gemini", system, maxTokens = 2000 } = options;
  
  const userKeys = await getUserKeys();
  if (userKeys.ollama) {
    return ollamaText(prompt, system, userKeys.ollama);
  }

  if (model === "openai" || userKeys.openai && model !== "claude") {
    // If user provided an OpenAI key, use it as default unless explicitly claude
    return openAIText(prompt, system, maxTokens, userKeys);
  }

  if (model === "claude" || userKeys.anthropic && !userKeys.gemini) {
    return claudeText(prompt, system, maxTokens, userKeys);
  }

  return geminiText(prompt, system, maxTokens, userKeys);
}

async function openAIText(prompt: string, system?: string, maxTokens: number = 2000, userKeys: { openai?: string } = {}): Promise<string> {
  const keys = Object.keys(userKeys).length > 0 ? userKeys : await getUserKeys();
  const apiKey = keys.openai || globalOpenAIKey;
  if (!apiKey) throw new Error("OpenAI key required but not found.");

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      ...(system ? [{ role: "system", content: system } as const] : []),
      { role: "user", content: prompt }
    ],
    max_tokens: maxTokens,
  });
  return response.choices[0].message.content || "";
}

async function ollamaText(prompt: string, system?: string, ollamaUrl: string = "http://localhost:11434"): Promise<string> {
  try {
    const url = new URL("/api/generate", ollamaUrl).toString();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5-coder", // Defaulting to Qwen as per the audio and user request
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
 * Live Web Search AI
 * 
 * Performs a real-time web search for context before asking the LLM to generate.
 * This ensures the AI has live, accurate data (e.g., for competitor analysis).
 */
export async function research_ai(query: string, prompt: string, options: AIOptions = {}): Promise<string> {
  try {
    const userKeys = await getUserKeys();
    const searchClient = tavily({ apiKey: userKeys.tavily || globalTavilyKey });

    // 1. Fetch live context
    const searchResult = await searchClient.search(query, {
      searchDepth: "advanced",
      includeImages: false,
      includeRawContent: false,
      maxResults: 5,
    });

    // 2. Format context
    const context = searchResult.results
      .map((r, i) => `Source ${i + 1} (${r.url}):\n${r.content}`)
      .join("\n\n");

    // 3. Inject context into the LLM prompt
    const enrichedPrompt = `LIVE WEB SEARCH RESULTS:\n${context}\n\n---\n\nUSER TASK:\n${prompt}`;
    
    // 4. Generate with live context
    return ai(enrichedPrompt, { 
      ...options, 
      system: `${options.system || "You are an elite researcher."}\n\nYou have been provided with real-time web search results. Use this data absolutely strictly to answer the user's task. If the search results contradict your training data, trust the search results.` 
    });
  } catch (error) {
    console.error("[Live Search Error]:", error);
    // Fallback to standard AI if search fails
    return ai(prompt, options);
  }
}

/**
 * Adaptive AI — Self-Improving Prompt Engine
 * 
 * This is the key differentiator. Before every execution, it:
 * 1. Queries the God-Brain for the latest system optimization directives
 * 2. Injects them into the system prompt as learned context
 * 3. Executes the user's prompt with the benefit of accumulated intelligence
 * 
 * Over time, SOVEREIGN gets measurably better at closing leads, writing copy,
 * and analyzing competitors — without any human retraining.
 */
export async function adaptive_ai(prompt: string, options: AIOptions = {}): Promise<string> {
  // Dynamically import to avoid circular dependency
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
