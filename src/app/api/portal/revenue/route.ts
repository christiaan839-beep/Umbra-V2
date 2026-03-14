import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Portal Revenue & Attribution API
 * 
 * Returns live ROI and pipeline data for a specific tenant 
 * by aggregating revenue and conversion events from telemetry.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId parameter" }, { status: 400 });
    }

    // Fetch all events for this tenant
    const allEvents = await db
      .select()
      .from(globalTelemetry)
      .where(eq(globalTelemetry.tenantId, tenantId))
      .orderBy(desc(globalTelemetry.timestamp));

    // Calculate core metrics
    const revenueEvents = allEvents.filter(e => e.eventType === "revenue_secured");
    const totalRevenueCents = revenueEvents.reduce((acc, current) => {
      try {
        const payload = JSON.parse(current.payload);
        return acc + (payload.amount || 0);
      } catch {
        return acc;
      }
    }, 0);
    const totalRevenue = `$${(totalRevenueCents / 100).toLocaleString()}`; // Simplified USD formatting

    const leadsGenerated = allEvents.filter(e => e.eventType.includes("lead_captured")).length;
    const leadsQualified = allEvents.filter(e => e.eventType.includes("lead_qualified")).length;
    const proposalsSent = allEvents.filter(e => e.eventType.includes("proposal_sent")).length;
    const dealsClosed = revenueEvents.length;

    const conversionRate = leadsGenerated > 0 
      ? `${((dealsClosed / leadsGenerated) * 100).toFixed(1)}%` 
      : "0%";

    // Dummy logic for cost calculation based on ad spend payload if available
    const adSpendEvents = allEvents.filter(e => e.eventType === "ad_spend");
    const totalAdSpend = adSpendEvents.reduce((acc, current) => {
        try {
          const payload = JSON.parse(current.payload);
          return acc + (payload.amount || 0);
        } catch {
          return acc;
        }
    }, 0);
    
    const costPerLead = leadsGenerated > 0 && totalAdSpend > 0
      ? `$${(totalAdSpend / leadsGenerated).toFixed(2)}`
      : "$0.00";

    // Format pipeline data with standard percentages based on highest pool (Leads Captured)
    const pipeline = [
      { stage: "Leads Captured", count: leadsGenerated, color: "bg-blue-500", width: "100%" },
      { stage: "Qualified", count: leadsQualified, color: "bg-indigo-500", width: leadsGenerated ? `${(leadsQualified / leadsGenerated) * 100}%` : "0%" },
      { stage: "Proposal Sent", count: proposalsSent, color: "bg-violet-500", width: leadsGenerated ? `${(proposalsSent / leadsGenerated) * 100}%` : "0%" },
      { stage: "Closed Won", count: dealsClosed, color: "bg-emerald-500", width: leadsGenerated ? `${(dealsClosed / leadsGenerated) * 100}%` : "0%" },
    ];

    // Format recent deals directly from revenue_secured events
    const recentDeals = revenueEvents.slice(0, 5).map(event => {
      let parsed;
      try { parsed = JSON.parse(event.payload); } catch { parsed = { amount: 0, ccy: 'usd' }; }
      
      return {
        name: parsed.customerName || "Anonymous Conversion",
        value: `$${((parsed.amount || 0) / 100).toLocaleString()}`,
        date: event.timestamp ? new Date(event.timestamp).toLocaleDateString() : "Just Now",
        source: parsed.source || "Autonomous Closing System",
      };
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue: totalRevenueCents > 0 ? totalRevenue : "$0",
        leadsGenerated,
        leadsQualified,
        dealsClosed,
        conversionRate,
        costPerLead,
      },
      pipeline,
      recentDeals,
    });
  } catch (error) {
    console.error("[Portal Revenue API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch portal revenue data" }, { status: 500 });
  }
}
