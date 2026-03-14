import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

/**
 * DM Closer (Social Swarm)
 * 
 * Receives incoming messages from Instagram DMs, Facebook, or WhatsApp
 * (usually routed via n8n). Acts as an elite, high-ticket closer.
 * Evaluates the lead, handles objections, and drops Stripe checkout links.
 */
export async function POST(req: Request) {
  try {
    const { tenantId, platform, senderId, message, conversationHistory } = await req.json();

    if (!message || !senderId) {
      return NextResponse.json({ error: "Missing message or senderId" }, { status: 400 });
    }

    // 1. Gemini Closer Agent
    const { text: replyText } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `Act as an elite high-ticket sales closer for UMBRA (an AI marketing automation agency).
You are currently chatting with a prospect on ${platform || 'a social platform'}.

PROSPECT MESSAGE: "${message}"
PREVIOUS CONVERSATION: ${conversationHistory || 'None'}

CRITICAL PLAYBOOK RULES:
1. "ANTI-SLOP" TONE: Be sharp, slightly dry, confident, and incredibly brief. No corporate jargon. No exclamation points unless absolutely necessary.
2. If they ask about pricing, do NOT give a generic answer. State the price directly ($997/mo) and map it instantly to ROI (e.g., "It's $997/mo. That replaces a $5k/mo agency and runs 24/7. Worth it?").
3. If they show buying intent, output a [STRIPE_LINK_PLACEHOLDER] tag in your response.
4. Keep your response under 50 words. Mirror their language but remain the authority.
5. If they throw an objection, break it down logically. Never be defensive.

Output ONLY your direct reply string.`,
    });

    // 2. Telemetry Logging
    await db.insert(globalTelemetry).values({
      tenantId: tenantId || "system",
      eventType: "dm_closer_response",
      payload: JSON.stringify({ platform, senderId, prompt: message, reply: replyText }),
    });

    // 3. Optional: Alert Telegram if it's a high-intent closing scenario
    if (replyText.includes("[STRIPE_LINK_PLACEHOLDER]") && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_OWNER_CHAT_ID) {
      const msg = `💰 HOT LEAD ALERT: Closer dropped checkout link on ${platform}\n\nLead: ${senderId}\nIntent Msg: "${message}"`;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_OWNER_CHAT_ID, text: msg }),
      });
    }

    return NextResponse.json({ 
      success: true, 
      reply: replyText.replace("[STRIPE_LINK_PLACEHOLDER]", "https://umbra-v2.vercel.app/pricing")
    });
  } catch (error) {
    console.error("[DM Closer Error]:", error);
    return NextResponse.json({ error: "Closer execution failed" }, { status: 500 });
  }
}
