import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, globalTelemetry } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Admin Clients API
 * 
 * Returns all tenants with aggregated telemetry metrics
 * for the Multi-Client Admin Dashboard.
 */
export async function GET() {
  try {
    const allTenants = await db.select().from(tenants);

    const clients = await Promise.all(
      allTenants.map(async (tenant) => {
        const events = await db
          .select()
          .from(globalTelemetry)
          .where(eq(globalTelemetry.tenantId, tenant.id))
          .orderBy(desc(globalTelemetry.timestamp));

        const totalActions = events.length;
        const leadEvents = events.filter(e => e.eventType.includes("lead")).length;
        const seoEvents = events.filter(e => e.eventType.includes("seo") || e.eventType.includes("programmatic")).length;
        const socialEvents = events.filter(e => e.eventType.includes("social") || e.eventType.includes("post")).length;

        // Simple churn risk assessment
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentEvents = events.filter(e => e.timestamp && new Date(e.timestamp) >= oneWeekAgo).length;
        let riskLevel: "healthy" | "watch" | "churn" = "healthy";
        if (recentEvents === 0 && totalActions > 0) riskLevel = "churn";
        else if (recentEvents < 5 && totalActions > 10) riskLevel = "watch";

        return {
          tenantId: tenant.id,
          nodeId: tenant.nodeId,
          plan: tenant.plan,
          totalActions,
          leadEvents,
          seoEvents,
          socialEvents,
          riskLevel,
          createdAt: tenant.createdAt?.toISOString() || new Date().toISOString(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      clients: clients.sort((a, b) => b.totalActions - a.totalActions),
    });
  } catch (error) {
    console.error("[Admin Clients Error]:", error);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}
