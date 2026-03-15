import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { allowed } = rateLimit(`competitor:${ip}`);
    if (!allowed) return rateLimitResponse();

    const { competitorUrl, niche, clientName } = await req.json();

    if (!niche || typeof niche !== "string" || niche.length > 200) {
      return NextResponse.json({ error: "Invalid or missing niche (max 200 chars)." }, { status: 400 });
    }

    const systemPrompt = `You are the UMBRA Competitive Warfare Intelligence Engine. You analyze competitor positioning and generate actionable counter-strategies.

OUTPUT FORMAT: Return ONLY a valid JSON object with these exact keys:
- "threatLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
- "competitorProfile": A brief 2-sentence profile of the competitor landscape
- "weaknesses": Array of 3-5 competitor weaknesses you've identified
- "counterStrategies": Array of 3-5 specific, actionable counter-strategies
- "contentAngles": Array of 3 content ideas that would outposition competitors
- "urgentAction": A single high-priority action item

RULES:
1. No markdown, no backticks, no text outside the JSON.
2. Be extremely specific and actionable — no generic advice.
3. Frame everything in terms of competitive advantage.`;

    const userPrompt = `Analyze the competitive landscape for ${clientName ? `"${clientName}" in ` : ""}the "${niche}" niche.${competitorUrl ? ` Key competitor URL: ${competitorUrl}` : ""} Generate a comprehensive threat assessment and counter-strategy brief.`;

    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `${systemPrompt}\n\n${userPrompt}`,
    });

    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```[a-z]*\n/i, "").replace(/\n```$/i, "");
    const startIdx = cleanText.indexOf("{");
    const endIdx = cleanText.lastIndexOf("}") + 1;
    if (startIdx === -1 || endIdx === 0) throw new Error("Model did not return valid JSON.");
    cleanText = cleanText.substring(startIdx, endIdx);

    const report = JSON.parse(cleanText);

    return NextResponse.json({ success: true, report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Competitive Scanner Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
