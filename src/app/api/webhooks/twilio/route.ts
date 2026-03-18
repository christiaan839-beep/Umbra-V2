import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendWhatsAppMessage, generateNegotiationResponse } from "@/lib/whatsapp-agent";

// Twilio sends data as form-urlencoded
export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const from = params.get("From"); // whatsapp:+27xxxxxxxxx
    const body = params.get("Body");

    if (!from || !body) {
      return new NextResponse("Missing vital target telemetry", { status: 400 });
    }

    console.log(`[TWILIO WEBHOOK] Incoming uplink from ${from}: ${body}`);

    // 1. Identify the lead in the database by phone number
    // Twilio formats numbers like: whatsapp:+27123456789. We need to strip the prefix for search if needed.
    const rawPhone = from.replace("whatsapp:", "");
    
    // Let's assume the lead is in the 'leads' table with this phone number
    const matchedLeads = await db.select().from(leads).where(eq(leads.phone, rawPhone));
    const lead = matchedLeads[0];

    const leadName = lead ? lead.name : "Commander Candidate";

    // 2. If the user says "UPLINK", we notify the Commander directly via Telegram
    if (body.toUpperCase().includes("UPLINK")) {
       const tgToken = process.env.TELEGRAM_BOT_TOKEN;
       const tgChatId = process.env.COMMANDER_TELEGRAM_ID;
       if (tgToken && tgChatId) {
           await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                   chat_id: tgChatId,
                   text: `🚨 UPLINK REQUEST: ${leadName} (${rawPhone}) is ready to negotiate the Cartel License. Drop Operations and call them immediately.`
               })
           });
       }
       
       const responseText = "Uplink confirmed. The Commander is retrieving your coordinates. Standby for direct contact.";
       await sendWhatsAppMessage(from, responseText);
       return new NextResponse("OK", { status: 200 });
    }

    // 3. Otherwise, engage the Neural Negotiation Agent
    const agentResponse = await generateNegotiationResponse(leadName, body);
    await sendWhatsAppMessage(from, agentResponse);
    
    // Mark lead as contacted
    if (lead) {
        await db.update(leads).set({ status: "contacted" }).where(eq(leads.id, lead.id));
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("[TWILIO WEBHOOK] Fault line breakdown:", err);
    return new NextResponse("Internal System Fault", { status: 500 });
  }
}
