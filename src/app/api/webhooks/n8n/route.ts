import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

/**
 * n8n Webhook Receiver
 * 
 * Central endpoint that receives events from n8n workflows
 * and logs them as telemetry events. This bridges the gap
 * between n8n automation and the UMBRA dashboard.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { event, tenantId, data } = payload;

    if (!event) {
      return NextResponse.json({ error: "Missing event type" }, { status: 400 });
    }

    // Log the n8n event to telemetry
    await db.insert(globalTelemetry).values({
      tenantId: tenantId || "system",
      eventType: `n8n_${event}`,
      payload: JSON.stringify(data || payload),
    });

    // If it's a Telegram-worthy event, send a notification
    const notifyEvents = ["deal_closed", "lead_qualified", "campaign_completed", "error"];
    if (notifyEvents.includes(event) && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_OWNER_CHAT_ID) {
      const message = `⚡ n8n Event: ${event}\n${JSON.stringify(data || {}, null, 2).slice(0, 200)}`;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_OWNER_CHAT_ID, text: message }),
      });
    }

    return NextResponse.json({ success: true, event, logged: true });
  } catch (error) {
    console.error("[n8n Webhook Error]:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
