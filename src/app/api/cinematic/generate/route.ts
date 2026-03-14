import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

/**
 * Cinematic Studio API
 * 
 * Uses Gemini 2.5 Pro to write highly optimized, viral short-form
 * video scripts (TikTok/Reels/Shorts). It breaks the video down
 * second-by-second, mapping voiceover lines to visual B-Roll prompts.
 * Designed to be fed into ElevenLabs (Voice) and HeyGen (Avatars).
 */
export async function POST(req: Request) {
  try {
    const { tenantId, topic, targetAudience, tone } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const { text: scriptJson } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `Act as an elite TikTok / YouTube Shorts viral producer. 
Your agency (UMBRA) builds autonomous AI marketing systems.

Write a 45-60 second hyper-viral video script. 
TOPIC: ${topic}
TARGET AUDIENCE: ${targetAudience || "Business owners, Agency founders"}
TONE: ${tone || "Cynical, authoritative, anti-slop, fast-paced"}

CRITICAL RULES:
1. The first 3 seconds (The Hook) must be highly controversial or visually shocking.
2. 8th-grade reading level. Very short, punchy sentences.
3. No AI jargon ("delve", "landscape", "synergy"). 
4. Include visual B-roll prompts for an AI video generator (like Runway or Sora).
5. End with a strong CTA to click the link in bio for a free "AGI Audit".

Output EXACTLY as this JSON format, and NOTHING ELSE:
{
  "title": "Internal working title",
  "hook": "The explosive first 3 seconds",
  "scenes": [
    {
      "timestamp": "0:00-0:03",
      "voiceover": "The exact words spoken",
      "visualPrompt": "Detailed prompt for AI image/video generation",
      "onScreenText": "Aggressive caption text"
    }
  ],
  "estimatedLengthSeconds": 45
}`,
    });

    let script;
    try {
      const cleaned = scriptJson.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      script = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse script JSON from Gemini" }, { status: 500 });
    }

    // Log the generated asset
    await db.insert(globalTelemetry).values({
      tenantId: tenantId || "system",
      eventType: "cinematic_script_generated",
      payload: JSON.stringify({ topic, title: script.title }),
    });

    return NextResponse.json({ success: true, script });
  } catch (error) {
    console.error("[Cinematic Studio Error]:", error);
    return NextResponse.json({ error: "Cinematic execution failed" }, { status: 500 });
  }
}
