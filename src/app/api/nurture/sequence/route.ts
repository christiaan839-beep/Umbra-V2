import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

/**
 * Lead Nurture Sequence API
 * 
 * Generates a personalized multi-email drip sequence using Gemini 2.5 Pro.
 * Each email is crafted based on the lead's industry, pain points, and
 * position in the funnel.
 */
export async function POST(req: Request) {
  try {
    const { leadName, email, industry, painPoints, source } = await req.json();

    if (!leadName || !email) {
      return NextResponse.json({ error: "Missing leadName or email" }, { status: 400 });
    }

    const { text: sequenceJson } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `You are UMBRA's elite email copywriter. Generate a 5-email nurture sequence for a new lead.

LEAD: ${leadName}
EMAIL: ${email}
INDUSTRY: ${industry || "General"}
PAIN POINTS: ${painPoints || "Marketing ROI, scaling, automation"}
SOURCE: ${source || "Website scan"}

Generate EXACTLY 5 emails in this JSON format:
[
  {
    "day": 0,
    "subject": "...",
    "body": "...",
    "cta": "..."
  }
]

SEQUENCE STRATEGY:
- Email 1 (Day 0): Welcome + immediate value (share an insight about their industry)
- Email 2 (Day 2): Social proof — case study of a similar client's results
- Email 3 (Day 5): Education — teach them something about AI marketing
- Email 4 (Day 8): Soft pitch — "Here's what UMBRA would do for your business"
- Email 5 (Day 12): Urgency — limited spots, book a call

RULES:
- Each email under 150 words
- Subject lines must create curiosity
- Professional but conversational tone
- Include specific numbers and metrics
- End each with a clear CTA

Output ONLY the JSON array, no explanation.`,
    });

    let sequence;
    try {
      // Strip markdown code fences if present
      const cleaned = sequenceJson.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      sequence = JSON.parse(cleaned);
    } catch {
      sequence = [{ day: 0, subject: "Welcome to UMBRA", body: sequenceJson, cta: "Learn more" }];
    }

    // Log the nurture sequence generation
    await db.insert(globalTelemetry).values({
      tenantId: "system",
      eventType: "nurture_sequence_generated",
      payload: JSON.stringify({ leadName, email, industry, emailCount: sequence.length }),
    });

    return NextResponse.json({
      success: true,
      sequence,
      metadata: { leadName, email, industry, generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("[Nurture Sequence Error]:", error);
    return NextResponse.json({ error: "Failed to generate nurture sequence" }, { status: 500 });
  }
}
