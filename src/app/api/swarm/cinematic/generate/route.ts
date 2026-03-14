import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export async function POST(req: Request) {
  try {
    const { topic, style = "cinematic" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic for script generation" }, { status: 400 });
    }

    const styleGuides: Record<string, string> = {
      cinematic: "Write a 30-second cinematic video ad script. Use dramatic pauses, strong visual cues, and a powerful call-to-action. Format: VISUAL: [description] | VOICEOVER: [narration] | MUSIC: [direction]",
      documentary: "Write a 45-second documentary-style video script. Fact-driven, authoritative tone. Include B-roll suggestions.",
      testimonial: "Write a 20-second testimonial-style script. Conversational, authentic, trust-building. Include suggested speaker notes.",
      hook: "Write a 5-second scroll-stopping hook for social media video. Must create instant curiosity or urgency.",
    };

    const prompt = `You are the Sovereign AI Cinematic Director. ${styleGuides[style] || styleGuides.cinematic}

Topic: ${topic}

Requirements:
- Must be psychologically compelling
- Must include exact timing marks
- Must specify camera movements where applicable
- Output clean, production-ready script`;

    const result = await model.generateContent(prompt);
    const script = result.response.text();

    return NextResponse.json({
      success: true,
      script,
      style,
      topic,
      model: "gemini-2.5-pro",
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[Cinematic Generate Error]:", error);
    const msg = error instanceof Error ? error.message : "Script generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
