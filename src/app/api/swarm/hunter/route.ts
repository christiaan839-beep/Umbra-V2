import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

/**
 * Outbound Lead Hunter Agent
 * 
 * Command the God-Brain to synthesize hyper-personalized, "Anti-Slop"
 * outreach scripts for specific niches. Generates the "Free Audit" 
 * Trojan Horse pitch to secure $5,000/mo retained clients.
 */
export async function POST(req: Request) {
  try {
    const { tenantId, niche, location, prospectName } = await req.json();

    if (!niche || !location) {
      return NextResponse.json({ error: "Missing campaign parameters" }, { status: 400 });
    }

    const { text: pitchJson } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `Act as a lethal, high-level growth consultant running an elite AI Automation Agency (UMBRA).
You are sending a cold outreach DM/Email to a business owner.

PROSPECT NAME: ${prospectName || "Business Owner"}
NICHE: ${niche}
LOCATION: ${location} (e.g., South Africa)

CRITICAL "ANTI-SLOP" RULES:
1. NEVER say "I hope this email finds you well."
2. NEVER say "I run an AI agency."
3. Keep it under 5 sentences. Brutally concise.
4. The hook: You ran an AI audit on their funnel and found they are bleeding capital by paying humans for tasks your system automates.
5. The CTA: Ask if you can send them the free audit report.

Output EXACTLY as this JSON format, and NOTHING ELSE:
{
  "subject_line": "Aggressive, high-open-rate subject line (3 words max)",
  "pitch_body": "The exact message to send",
  "follow_up_1": "A 1-sentence bump message to send 48 hours later"
}`,
    });

    let campaign;
    try {
      const cleaned = pitchJson.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      campaign = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse script JSON from Gemini" }, { status: 500 });
    }

    // Log the generated asset to the telemetry grid
    await db.insert(globalTelemetry).values({
      tenantId: tenantId || "system",
      eventType: "outbound_campaign_synthesized",
      payload: JSON.stringify({ niche, location, subject: campaign.subject_line }),
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("[Hunter Agent Error]:", error);
    return NextResponse.json({ error: "Outbound synthesis failed" }, { status: 500 });
  }
}
