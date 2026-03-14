import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Portal Revenue API
 * 
 * Aggregates revenue-related telemetry events for a specific tenant.
 * Returns total revenue, lead counts, deal counts, and recent deal data.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId parameter" }, { status: 400 });
    }

    const events = await db
      .select()
      .from(globalTelemetry)
      .where(eq(globalTelemetry.tenantId, tenantId))
      .orderBy(desc(globalTelemetry.timestamp));

    // Parse revenue events
    let totalRevenue = 0;
    let leadsGenerated = 0;
    let leadsQualified = 0;
    let dealsClosed = 0;
    const recentDeals: Array<{ name: string; value: string; date: string; source: string }> = [];

    for (const event of events) {
      let payload;
      try { payload = JSON.parse(event.payload); } catch { continue; }

      if (event.eventType.includes("lead_scraped") || event.eventType.includes("lead_generated")) {
        leadsGenerated++;
      }
      if (event.eventType.includes("lead_qualified")) {
        leadsQualified++;
      }
      if (event.eventType.includes("deal_closed") || event.eventType.includes("invoice_paid")) {
        dealsClosed++;
        const amount = payload.amount || payload.value || 0;
        totalRevenue += Number(amount);
        recentDeals.push({
          name: payload.clientName || payload.leadId || "Client",
          value: `$${Number(amount).toLocaleString()}`,
          date: event.timestamp ? new Date(event.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recent",
          source: payload.source || payload.platform || "Direct",
        });
      }
    }

    const conversionRate = leadsGenerated > 0 ? ((dealsClosed / leadsGenerated) * 100).toFixed(1) : "0.0";
    const costPerLead = leadsGenerated > 0 ? (totalRevenue * 0.1 / leadsGenerated).toFixed(2) : "0.00";

    return NextResponse.json({
      success: true,
      revenue: {
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        leadsGenerated,
        leadsQualified,
        dealsClosed,
        conversionRate: `${conversionRate}%`,
        costPerLead: `$${costPerLead}`,
        recentDeals: recentDeals.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("[Portal Revenue Error]:", error);
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 });
  }
}
