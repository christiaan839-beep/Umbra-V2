import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const { tenantId, period } = await req.json();

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Fetch aggregated telemetry for the reporting period
    const eventCounts = await db
      .select({
        eventType: globalTelemetry.eventType,
        count: sql<number>`count(*)`,
      })
      .from(globalTelemetry)
      .where(eq(globalTelemetry.tenantId, tenantId))
      .groupBy(globalTelemetry.eventType);

    // Fetch recent events
    const recentEvents = await db
      .select()
      .from(globalTelemetry)
      .where(eq(globalTelemetry.tenantId, tenantId))
      .orderBy(desc(globalTelemetry.timestamp))
      .limit(20);

    // Build report data structure
    const totalActions = eventCounts.reduce((sum, row) => sum + Number(row.count), 0);
    const eventBreakdown = eventCounts.reduce((acc, row) => {
      acc[row.eventType] = Number(row.count);
      return acc;
    }, {} as Record<string, number>);

    const report = {
      generatedAt: new Date().toISOString(),
      period: period || "monthly",
      tenantId,
      summary: {
        totalActions,
        eventBreakdown,
        topEvents: eventCounts
          .sort((a, b) => Number(b.count) - Number(a.count))
          .slice(0, 5)
          .map((e) => ({ type: e.eventType, count: Number(e.count) })),
      },
      recentActivity: recentEvents.map((e) => ({
        type: e.eventType,
        timestamp: e.timestamp,
        payload: e.payload,
      })),
      // Performance metrics (calculated from telemetry)
      kpis: {
        leadsGenerated: eventBreakdown["lead_generated"] || 0,
        contentPublished: eventBreakdown["content_published"] || 0,
        emailsSent: eventBreakdown["outbound_sent"] || 0,
        competitorScans: eventBreakdown["competitor_scan"] || 0,
        pagesDeployed: eventBreakdown["page_deployed"] || 0,
        videosSynthesized: eventBreakdown["video_synthesized"] || 0,
      },
    };

    return NextResponse.json({ success: true, report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Report Generation Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
