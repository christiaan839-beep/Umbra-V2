import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, globalTelemetry } from "@/db/schema";
import crypto from "crypto";

/**
 * Demo Provisioning API
 * 
 * Creates an instant demo account with a pre-populated UMBRA node.
 * Used on the /demo and /scan pages to give prospects a live preview
 * of the dashboard with sample telemetry data.
 */
export async function POST(req: Request) {
  try {
    const { email, businessName } = await req.json();

    // Generate a demo node ID
    const nodeId = `DEMO-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const demoId = crypto.randomUUID();

    // Create a demo tenant
    await db.insert(tenants).values({
      id: demoId,
      clerkUserId: `demo_${crypto.randomUUID().slice(0, 8)}`,
      nodeId,
      plan: "ghost",
    });

    // Seed sample telemetry events so the dashboard looks alive
    const sampleEvents = [
      { eventType: "lead_scraped", payload: JSON.stringify({ leadId: "L-001", source: "Website", clientName: "Demo Lead" }) },
      { eventType: "seo_page_deployed", payload: JSON.stringify({ city: "New York", service: "AI Marketing" }) },
      { eventType: "social_post_created", payload: JSON.stringify({ platform: "instagram", topic: "AI Growth Hacking" }) },
      { eventType: "lead_qualified", payload: JSON.stringify({ score: 87, method: "Gemini Analysis" }) },
      { eventType: "email_sequence_sent", payload: JSON.stringify({ sequence: "Onboarding", step: 1 }) },
      { eventType: "competitor_analyzed", payload: JSON.stringify({ competitor: "Sample Corp", weaknesses: 3 }) },
      { eventType: "deal_closed", payload: JSON.stringify({ amount: 4500, clientName: "Enterprise Client", source: "AI Outbound" }) },
      { eventType: "programmatic_page_rendered", payload: JSON.stringify({ city: "Austin", service: "Digital Strategy" }) },
    ];

    for (const event of sampleEvents) {
      await db.insert(globalTelemetry).values({
        tenantId: demoId,
        eventType: event.eventType,
        payload: event.payload,
      });
    }

    return NextResponse.json({
      success: true,
      demoId,
      nodeId,
      portalUrl: `/portal/${demoId}`,
      message: `Demo node ${nodeId} provisioned with ${sampleEvents.length} sample events`,
    });
  } catch (error) {
    console.error("[Demo Provision Error]:", error);
    return NextResponse.json({ error: "Failed to provision demo" }, { status: 500 });
  }
}
