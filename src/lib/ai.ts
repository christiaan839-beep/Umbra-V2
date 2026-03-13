import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { tavily } from "@tavily/core";
import type { AIModel, AIOptions } from "@/types";

const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
const anthropicKey = process.env.ANTHROPIC_API_KEY || "";
const tavilyKey = process.env.TAVILY_API_KEY || "tvly-demo";

const genAI = new GoogleGenerativeAI(geminiKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });
const tvly = tavily({ apiKey: tavilyKey });

/**
 * Unified AI text generation router.
 * Single entry point for all AI calls across the entire platform.
 */
export async function ai(prompt: string, options: AIOptions = {}): Promise<string> {
  const { model = "gemini", system, maxTokens = 2000 } = options;

  if (model === "claude") {
    return claudeText(prompt, system, maxTokens);
  }
  return geminiText(prompt, system, maxTokens);
}

async function geminiText(prompt: string, system?: string, maxTokens: number = 2000): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: system || undefined,
    generationConfig: { maxOutputTokens: maxTokens }
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function claudeText(prompt: string, system?: string, maxTokens: number = 2000): Promise<string> {
  const response = await anthropic.messages.create({
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
    // 1. Fetch live context
    const searchResult = await tvly.search(query, {
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
 * Over time, UMBRA gets measurably better at closing leads, writing copy,
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
    options.system || "You are UMBRA, an elite autonomous AI marketing system.",
    learnedDirectives ? `\n\n--- LEARNED OPTIMIZATION DIRECTIVES (Auto-Injected) ---\n${learnedDirectives}\n--- END DIRECTIVES ---` : "",
  ].join("");

  return ai(prompt, { ...options, system: enhancedSystem });
}

/**
 * Generate embeddings using Gemini for vector memory.
 */
export async function embed(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
