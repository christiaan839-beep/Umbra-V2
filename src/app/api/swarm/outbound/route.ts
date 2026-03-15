import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { niche, location, count } = await req.json();

    if (!niche) {
      return NextResponse.json({ error: "Missing target niche." }, { status: 400 });
    }

    const systemPrompt = `You are the UMBRA Autonomous Outbound Engine. You generate hyper-personalized cold outreach emails for acquiring new agency clients.

OUTPUT FORMAT: Return ONLY a valid JSON array of objects. Each object must have these exact keys:
- "prospect": The fictional but realistic business name and owner name
- "subject": A compelling, short email subject line (under 60 chars)
- "body": The full email body (2-3 paragraphs, professional but bold)

RULES:
1. Do NOT include markdown, backticks, or any text outside the JSON array.
2. Each email must feel deeply personal — reference the prospect's industry pain points.
3. Position the sender as running a proprietary AI system that delivers results in 30 days.
4. Include a clear CTA (book a call, reply, etc).
5. Never use generic filler. Every sentence must carry weight.
6. The tone should be confident, direct, and high-value — like a $10K/mo consultant reaching out.`;

    const userPrompt = `Generate ${count || 3} cold outreach emails targeting "${niche}" businesses${location ? ` in ${location}` : ""}. Make each prospect unique with different pain points and angles.`;

    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `${systemPrompt}\n\n${userPrompt}`,
    });

    let cleanText = text.trim();
    // Strip markdown code blocks
    cleanText = cleanText.replace(/^```[a-z]*\n/i, "").replace(/\n```$/i, "");
    
    // Find JSON array boundaries
    const startIdx = cleanText.indexOf("[");
    const endIdx = cleanText.lastIndexOf("]") + 1;
    if (startIdx === -1 || endIdx === 0) throw new Error("Model did not return valid JSON.");
    cleanText = cleanText.substring(startIdx, endIdx);

    const emails = JSON.parse(cleanText);

    return NextResponse.json({ emails });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Outbound Engine Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
