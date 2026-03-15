import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { tenantId, action } = await req.json();

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (action === "usage-summary") {
      // Count total actions per event type
      const usageCounts = await db
        .select({
          eventType: globalTelemetry.eventType,
          count: sql<number>`count(*)`,
        })
        .from(globalTelemetry)
        .where(eq(globalTelemetry.tenantId, tenantId))
        .groupBy(globalTelemetry.eventType);

      const totalActions = usageCounts.reduce((sum, row) => sum + Number(row.count), 0);

      // Determine current tier based on usage
      let currentTier = "starter";
      let monthlyPrice = 497;
      if (totalActions > 500) { currentTier = "sovereign"; monthlyPrice = 2497; }
      if (totalActions > 2000) { currentTier = "god-mode"; monthlyPrice = 4997; }

      return NextResponse.json({
        success: true,
        usage: {
          totalActions,
          breakdown: usageCounts,
          currentTier,
          monthlyPrice,
          nextTier: currentTier === "god-mode" ? null : (currentTier === "sovereign" ? "god-mode" : "sovereign"),
        },
      });
    }

    if (action === "upgrade-request") {
      await db.insert(globalTelemetry).values({
        tenantId,
        eventType: "upgrade_requested",
        payload: JSON.stringify({ timestamp: new Date().toISOString(), source: "billing-manage" }),
      });

      return NextResponse.json({ success: true, message: "Upgrade request logged. Account manager notified." });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Billing Manage Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
