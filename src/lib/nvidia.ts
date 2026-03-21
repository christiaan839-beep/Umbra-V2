import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';

/**
 * Retrieve the NVIDIA NIM API key — checks BYOK vault first, falls back to env.
 */
async function getNvidiaKey(): Promise<string> {
  try {
    const user = await currentUser();
    if (user?.primaryEmailAddress?.emailAddress) {
      const userSettings = await db.query.settings.findFirst({
        where: eq(settings.userEmail, user.primaryEmailAddress.emailAddress)
      });
      if (userSettings?.apiKeys) {
        const keys = JSON.parse(userSettings.apiKeys);
        if (keys.nvidia) return keys.nvidia;
      }
    }
  } catch {
    // Fall through to env
  }
  return process.env.NVIDIA_NIM_API_KEY || process.env.NVIDIA_API_KEY || '';
}

/**
 * Generic NVIDIA NIM chat completion — used by ALL NIM agent routes.
 * Pulls the API key from the BYOK vault first, falls back to env variables.
 */
export async function nimChat(
  model: string,
  messages: { role: string; content: string }[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<string> {
  const apiKey = await getNvidiaKey();
  if (!apiKey) throw new Error("NVIDIA NIM API key not configured. Add it in Settings > API Keys.");

  const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`NVIDIA NIM Error (${response.status}): ${response.statusText}. ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 1. The Core Brain: Nemotron-4-340B-Instruct & Llama-3-70B-Instruct
 */
export async function callNemotron(prompt: string, model: 'nvidia/nemotron-4-340b-instruct' | 'meta/llama3-70b-instruct' = 'meta/llama3-70b-instruct') {
  return nimChat(model, [{ role: 'user', content: prompt }]);
}

/**
 * 2. The Visionary: Cosmos-Reason (Visual Analysis)
 */
export async function analyzeWithCosmos(imageUrl: string, prompt: string = "Analyze this website for UI/UX flaws and business model weaknesses.") {
  return nimChat('nvidia/cosmos-nemotron-34b', [
    { role: 'user', content: `${prompt} [Image URL: ${imageUrl}]` }
  ], { maxTokens: 500 });
}

/**
 * 3. The Voice Cartel: Audio Transcription
 * Falls back to OpenAI Whisper if available; otherwise returns error.
 */
export async function transcribeAudio(audioBase64: string): Promise<{ text: string }> {
  // Attempt OpenAI Whisper via BYOK
  try {
    const user = await currentUser();
    let openaiKey = process.env.OPENAI_API_KEY || '';
    if (user?.primaryEmailAddress?.emailAddress) {
      const userSettings = await db.query.settings.findFirst({
        where: eq(settings.userEmail, user.primaryEmailAddress.emailAddress)
      });
      if (userSettings?.apiKeys) {
        const keys = JSON.parse(userSettings.apiKeys);
        if (keys.openai) openaiKey = keys.openai;
      }
    }

    if (openaiKey) {
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const formData = new FormData();
      formData.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm');
      formData.append('model', 'whisper-1');

      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openaiKey}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return { text: data.text };
      }
    }
  } catch {
    // Fall through
  }

  return { text: "[Transcription requires an OpenAI API key. Add one in Settings > API Keys.]" };
}
