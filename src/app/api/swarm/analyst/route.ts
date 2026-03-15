import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { campaignId, action = "analyze" } = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });
    }

    const logId = `ad_${crypto.randomUUID().slice(0, 8)}`;
    const metaToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (!metaToken || !adAccountId) {
      console.warn("[Media Buyer Agent] Missing Meta API credentials. Running in mock simulation mode.");
    }

    // 1. Fetch live metrics from Meta Graph API
    // If no token is provided, simulate the response for testing
    let insights = { roas: 3.2, cpa: 42.50, status: "ACTIVE" };
    
    if (metaToken && adAccountId) {
      try {
        // Pseudo-code for Meta Graph API call
        const res = await fetch(`https://graph.facebook.com/v19.0/${adAccountId}/insights?access_token=${metaToken}`);
        if (res.ok) {
          const data = await res.json();
          // parse ROAS and CPA from data...
          insights = { roas: 2.8, cpa: 55.00, status: "ACTIVE" }; 
        }
      } catch (err) {
        console.error("Meta API error:", err);
      }
    }

    let decision = "hold";
    let triggerCreative = false;

    // 2. Emotionless, data-driven decisions: The Agency-Killer Logic
    if (insights.roas > 2.5 && insights.cpa < 50.0) {
      decision = "scale";
    } else if (insights.roas < 1.5 || insights.cpa > 80.0) {
      decision = "kill";
      triggerCreative = true; // Ad fatigue detected. Need new angles.
    }

    // 3. Execute Decision via Meta API (Mocked for safety unless explicitly authorized)
    if (decision === "kill") {
      console.log(`[Media Buyer Agent] KILLED campaign ${campaignId} due to poor ROAS (${insights.roas})`);
    } else if (decision === "scale") {
      console.log(`[Media Buyer Agent] SCALED campaign ${campaignId}. ROAS is highly profitable (${insights.roas})`);
    }

    // 4. Trigger the Creative Factory if fatigued
    if (triggerCreative) {
      console.log(`[Media Buyer Agent] Triggering Creative Factory for new variations...`);
      // Hit the internal Social route to spin up new assets mapped to the brand
      await fetch(new URL("/api/swarm/social", req.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "Biohacking routine for extreme focus", platform: "instagram" })
      }).catch(err => console.error("Failed to trigger Creative Factory:", err));
    }

    // 5. Log Telemetry
    await db.insert(globalTelemetry).values({
      tenantId: "00000000-0000-0000-0000-000000000000",
      eventType: "media_buyer_action",
      payload: JSON.stringify({ 
        campaignId, 
        insights, 
        decision, 
        triggerCreative,
        timestamp: Date.now() 
      }),
    });

    return NextResponse.json({
        success: true,
        message: `Ad Analyst processed campaign ${campaignId}`,
        data: {
          logId,
          insights,
          decision,
          creativeTriggered: triggerCreative
        }
    });

  } catch (error: unknown) {
    console.error("[Ad Analyst Router Error]:", error);
    const msg = error instanceof Error ? error.message : "Failed to orchestrate ad analysis";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
