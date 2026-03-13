import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { prompt, platform, duration, style } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    const output = await ai(`
Video Brief Request:
Topic/Product: ${prompt}
Platform: ${platform || "instagram reels"}
Target Duration: ${duration || 30} seconds
Visual Style: ${style || "modern, sleek, high-energy"}

Create a complete video production brief with scene-by-scene breakdown.
Return valid JSON with: title, concept, script, scenes (array with scene_number, duration_seconds, visual_prompt, voiceover, text_overlay), style, music_mood, target_duration_seconds, platform.`,
      {
        system: `You are a video creative director. Create detailed video production briefs for AI video generation tools like Veo 3.1 and HeyGen. Always return valid JSON.`,
        taskType: "content",
      }
    );

    let brief;
    try { brief = JSON.parse(output); } catch { brief = { raw: output }; }

    return NextResponse.json({ success: true, brief, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("[Video API]:", error);
    return NextResponse.json({ error: "Video brief failed" }, { status: 500 });
  }
}
