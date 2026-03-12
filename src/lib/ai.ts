import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import type { AIModel, AIOptions } from "@/types";

const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
const anthropicKey = process.env.ANTHROPIC_API_KEY || "";

const genAI = new GoogleGenerativeAI(geminiKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

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
 * Generate embeddings using Gemini for vector memory.
 */
export async function embed(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
