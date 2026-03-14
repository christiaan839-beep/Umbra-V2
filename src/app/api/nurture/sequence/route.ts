import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

/**
 * Automated Lead Nurture Sequence Engine
 * 
 * Generates personalized drip email sequences using Gemini 2.5 Pro.
 * Each email is tailored to the lead's industry, pain points, and
 * position in the funnel.
 * 
 * POST: Generate a personalized sequence for a new lead
 */
export async function POST(req: Request) {
  try {
    const { leadEmail, leadName, industry, painPoint, source, tenantId } = await req.json();

    if (!leadEmail || !leadName) {
      return NextResponse.json({ error: "Missing leadEmail or leadName" }, { status: 400 });
    }

    // Generate a 5-email nurture sequence with Gemini
    const { text: sequenceJson } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `You are an elite email marketing strategist for UMBRA, a premium AI marketing agency.

Generate a 5-email nurture sequence for this lead:
- Name: ${leadName}
- Email: ${leadEmail}
- Industry: ${industry || "Unknown"}
- Pain Point: ${painPoint || "needs more leads and revenue"}
- Source: ${source || "website"}

REQUIREMENTS:
- Email 1 (Day 0): Welcome + immediate value — share a specific, actionable insight
- Email 2 (Day 2): Case study proof — show a result (e.g., "Client X went from 5 to 47 leads/week")
- Email 3 (Day 5): Authority building — position UMBRA as the clear expert
- Email 4 (Day 8): Objection handling — address common concerns about AI marketing
- Email 5 (Day 12): Urgency CTA — limited spots, schedule a strategy call

RULES:
- Subject lines must have 40-60% open rate potential (curiosity + benefit)
- Each email: 100-150 words only. No fluff.
- Personalize using the lead's name and industry throughout
- End each email with a single, clear CTA
- Tone: confident, data-driven, premium — like talking to a friend who's also a CEO

OUTPUT FORMAT: Return a valid JSON array of objects with keys: "day", "subject", "body", "cta"`,
    });

    // Parse the sequence
    let sequence;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = sequenceJson.match(/\[[\s\S]*\]/);
      sequence = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(sequenceJson);
    } catch {
      sequence = [{ day: 0, subject: "Welcome to UMBRA", body: sequenceJson, cta: "Schedule a call" }];
    }

    // Log the nurture event
    if (tenantId) {
      await db.insert(globalTelemetry).values({
        tenantId,
        eventType: "nurture_sequence_generated",
        payload: JSON.stringify({
          leadEmail,
          leadName,
          industry,
          emailCount: sequence.length,
          generatedAt: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({
      success: true,
      leadEmail,
      sequence,
      message: `Generated ${sequence.length}-email nurture sequence for ${leadName}`,
    });
  } catch (error) {
    console.error("[Nurture Sequence Error]:", error);
    return NextResponse.json({ error: "Sequence generation failed" }, { status: 500 });
  }
}
