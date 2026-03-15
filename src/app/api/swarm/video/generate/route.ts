import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { allowed } = rateLimit(`video:${ip}`);
    if (!allowed) return rateLimitResponse();

    const { prompt, platform, duration } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
      return NextResponse.json({ error: "Invalid or missing prompt (max 1000 chars)." }, { status: 400 });
    }

    const systemPrompt = `You are the UMBRA Video Synthesis Engine. You generate detailed production scripts for short-form video ads.

OUTPUT FORMAT: Return ONLY a valid JSON object with these exact keys:
- "title": The video title (under 60 chars)
- "hook": The first 3 seconds hook text (attention-grabbing)
- "script": Array of scene objects, each with: "timestamp", "visual", "narration", "textOverlay"
- "cta": The call-to-action text
- "hashtags": Array of 5-8 relevant hashtags
- "musicMood": Suggested background music mood
- "estimatedDuration": Duration in seconds

RULES:
1. No markdown or backticks outside the JSON.
2. Every script must follow the hook-value-CTA framework.
3. Optimize for ${platform || "instagram reels"} algorithm.
4. Target duration: ${duration || 30} seconds.`;

    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `${systemPrompt}\n\nCREATIVE BRIEF: ${prompt}`,
    });

    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```[a-z]*\n/i, "").replace(/\n```$/i, "");
    const startIdx = cleanText.indexOf("{");
    const endIdx = cleanText.lastIndexOf("}") + 1;
    if (startIdx === -1 || endIdx === 0) throw new Error("Model did not return valid JSON.");
    cleanText = cleanText.substring(startIdx, endIdx);

    const videoScript = JSON.parse(cleanText);

    return NextResponse.json({ success: true, videoScript });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Video Synthesis Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
