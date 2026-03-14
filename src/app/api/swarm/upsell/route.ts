import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry, tenants } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * AI-Powered Upsell Engine
 * 
 * Analyzes a tenant's telemetry data and, when metrics hit
 * predefined thresholds, generates a compelling upsell proposal
 * using Gemini 2.5 Pro.
 */
export async function POST(req: Request) {
  try {
    const { tenantId } = await req.json();

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Get tenant info
    const tenant = await db.select().from(tenants).where(eq(tenants.id, tenantId));
    if (tenant.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get their telemetry stats
    const events = await db
      .select()
      .from(globalTelemetry)
      .where(eq(globalTelemetry.tenantId, tenantId))
      .orderBy(desc(globalTelemetry.timestamp));

    const totalActions = events.length;
    const leadEvents = events.filter(e => e.eventType.includes("lead")).length;
    const seoEvents = events.filter(e => e.eventType.includes("seo") || e.eventType.includes("programmatic")).length;

    // Check upsell thresholds
    const triggers: string[] = [];
    if (leadEvents >= 50) triggers.push(`Client has ${leadEvents} leads — ready for Closer Agent upgrade`);
    if (seoEvents >= 100) triggers.push(`Client has ${seoEvents} SEO pages — ready for state-wide expansion`);
    if (totalActions >= 500) triggers.push(`Client has ${totalActions} total actions — platform heavily utilized`);

    if (triggers.length === 0) {
      return NextResponse.json({
        success: true,
        upsellReady: false,
        message: "Client hasn't hit upsell thresholds yet",
        metrics: { totalActions, leadEvents, seoEvents },
      });
    }

    // Generate the upsell proposal with Gemini
    const { text: proposal } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `You are the UMBRA Revenue Director. A client is performing exceptionally well and is ready for an upgrade.

CURRENT PLAN: ${tenant[0].plan}
NODE ID: ${tenant[0].nodeId}
ACTIVITY: ${totalActions} autonomous actions, ${leadEvents} leads, ${seoEvents} SEO pages

UPSELL TRIGGERS:
${triggers.map(t => `• ${t}`).join("\n")}

Write a short, compelling upsell email (max 150 words) that:
1. Congratulates them on their results
2. Shows specific metrics as proof of ROI
3. Introduces the next tier with a clear benefit
4. Creates urgency without being pushy
5. Ends with a simple CTA

Tone: professional, data-driven, premium. No fluff.`,
    });

    // Log the upsell event
    await db.insert(globalTelemetry).values({
      tenantId,
      eventType: "upsell_proposal_generated",
      payload: JSON.stringify({ triggers, proposal, generatedAt: new Date().toISOString() }),
    });

    return NextResponse.json({
      success: true,
      upsellReady: true,
      triggers,
      proposal,
      metrics: { totalActions, leadEvents, seoEvents },
    });
  } catch (error) {
    console.error("[Upsell Engine Error]:", error);
    return NextResponse.json({ error: "Upsell generation failed" }, { status: 500 });
  }
}
