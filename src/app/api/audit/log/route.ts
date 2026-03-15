import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { tenantId, action, actorType, actorId, details } = await req.json();

    if (!tenantId || !action) {
      return NextResponse.json({ error: "Missing tenantId or action" }, { status: 400 });
    }

    // Log the audit event to global telemetry
    await db.insert(globalTelemetry).values({
      tenantId,
      eventType: `audit:${action}`,
      payload: JSON.stringify({
        action,
        actorType: actorType || "system", // "system", "user", "ai_agent"
        actorId: actorId || "umbra-core",
        details: details || {},
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
        timestamp: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ success: true, message: "Audit event logged." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Audit Log Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
