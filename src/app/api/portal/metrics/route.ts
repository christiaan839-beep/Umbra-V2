import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Portal Metrics API
 * 
 * Returns live KPI data for a specific tenant by aggregating
 * events from the globalTelemetry table.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId parameter" }, { status: 400 });
    }

    // Count events by type for this tenant
    const allEvents = await db
      .select()
      .from(globalTelemetry)
      .where(eq(globalTelemetry.tenantId, tenantId))
      .orderBy(desc(globalTelemetry.timestamp));

    const leadConversations = allEvents.filter(e => e.eventType.includes("lead") || e.eventType.includes("closer")).length;
    const seoPages = allEvents.filter(e => e.eventType.includes("seo") || e.eventType.includes("programmatic")).length;
    const socialPosts = allEvents.filter(e => e.eventType.includes("social") || e.eventType.includes("post")).length;
    const totalActions = allEvents.length;

    // Get recent events for the live feed
    const recentEvents = allEvents.slice(0, 20).map(event => {
      let parsed;
      try { parsed = JSON.parse(event.payload); } catch { parsed = {}; }
      
      return {
        id: event.id,
        eventType: event.eventType,
        payload: parsed,
        timestamp: event.timestamp,
      };
    });

    return NextResponse.json({
      success: true,
      metrics: {
        leadConversations,
        seoPages,
        socialPosts,
        totalActions,
      },
      recentEvents,
    });
  } catch (error) {
    console.error("[Portal Metrics Error]:", error);
    return NextResponse.json({ error: "Failed to fetch portal metrics" }, { status: 500 });
  }
}
