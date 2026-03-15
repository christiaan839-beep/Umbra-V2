import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry, tenants } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { tenantId, action } = await req.json();

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (action === "check-milestones") {
      // Count revenue events for this tenant
      const revenueEvents = await db
        .select({ count: sql<number>`count(*)` })
        .from(globalTelemetry)
        .where(eq(globalTelemetry.tenantId, tenantId));

      const totalRevenue = Number(revenueEvents[0]?.count || 0);

      const milestones = [
        { threshold: 5, label: "5 Revenue Events", upsell: "Upgrade to God-Mode for 3x lead volume" },
        { threshold: 25, label: "25 Revenue Events", upsell: "Unlock State-Wide Territory Expansion" },
        { threshold: 100, label: "100 Revenue Events", upsell: "Enterprise Multi-Location Deployment" },
      ];

      const reached = milestones.filter((m) => totalRevenue >= m.threshold);
      const next = milestones.find((m) => totalRevenue < m.threshold);

      return NextResponse.json({
        success: true,
        totalRevenue,
        milestonesReached: reached,
        nextMilestone: next || null,
      });
    }

    if (action === "generate-invoice-reminder") {
      // Log the reminder event
      await db.insert(globalTelemetry).values({
        tenantId,
        eventType: "billing_reminder_sent",
        payload: JSON.stringify({ action: "invoice_reminder", timestamp: new Date().toISOString() }),
      });

      return NextResponse.json({ success: true, message: "Invoice reminder logged." });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Billing Autopilot Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
