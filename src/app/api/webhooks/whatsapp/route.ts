import { NextResponse } from "next/server";
import { adaptive_ai } from "@/lib/ai";
import { remember, recall } from "@/lib/memory";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

/** Helper to send WhatsApp messages back via Twilio REST API */
async function sendWhatsAppMessage(to: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    console.warn("[WhatsApp] Keys missing. Simulating send to:", to, "Body:", body);
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const params = new URLSearchParams();
  params.append("To", to);
  params.append("From", TWILIO_WHATSAPP_NUMBER);
  params.append("Body", body);

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
}

/** Trigger email drip sequence for qualified leads */
async function triggerEmailDrip(contact: string, context: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://omnia-os.vercel.app";
    await fetch(`${baseUrl}/api/sequences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "trigger",
        sequence: "whatsapp_qualified_lead",
        contact,
        context,
      }),
    });
    console.log(`[Email Drip] Triggered for ${contact}`);
  } catch (e) {
    console.error("[Email Drip] Failed:", e);
  }
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    
    const body = params.get("Body");
    const from = params.get("From");

    if (!body || !from) {
      return NextResponse.json({ success: false, error: "Invalid Twilio payload" }, { status: 400 });
    }

    console.log(`[WhatsApp Inbound] From: ${from} | Msg: ${body}`);

    // 1. Log the incoming message to God-Brain Memory
    await remember(`WhatsApp Inbound from ${from}: ${body}`, {
      type: "whatsapp_inbound",
      contact: from,
      body: body
    });

    // 2. Recall previous context with this specific contact
    const previousContext = await recall(`WhatsApp conversation with ${from}`, 5);
    const history = previousContext
      .filter(m => m.entry.metadata.contact === from)
      .map(m => m.entry.text)
      .join("\n");

    // 3. Autonomous AI Responder (Self-Improving via adaptive_ai)
    const systemPrompt = `You are UMBRA, an elite, highly professional AI closer for an automated marketing agency.
    You are responding to a prospect via WhatsApp. 
    Keep responses SHORT, conversational, and persuasive (1-2 sentences max). Do not sound like a bot.
    Your goal is to qualify the lead and push them to book a demo call.
    
    Context of previous messages with this lead:
    ${history || "No previous history."}`;

    const aiResponse = await adaptive_ai(`Lead says: "${body}"\n\nDraft the WhatsApp reply:`, {
      system: systemPrompt,
      model: "claude"
    });

    // 4. Log the outgoing message
    await remember(`WhatsApp Outbound to ${from}: ${aiResponse}`, {
      type: "whatsapp_outbound",
      contact: from,
      body: aiResponse
    });

    // 5. Dispatch via Twilio
    await sendWhatsAppMessage(from, aiResponse);

    // 6. Auto-trigger email drip if lead shows buying intent
    const buyingSignals = ["pricing", "cost", "demo", "call", "book", "interested", "how much", "sign up", "start"];
    const lowerBody = body.toLowerCase();
    if (buyingSignals.some(signal => lowerBody.includes(signal))) {
      triggerEmailDrip(from, `Lead expressed buying intent via WhatsApp: "${body}"`);
    }

    return new NextResponse("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" }
    });

  } catch (error) {
    console.error("[WhatsApp Webhook] Error:", error);
    return new NextResponse("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" }
    });
  }
}
