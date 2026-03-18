/**
 * THE SOVEREIGN MATRIX - WHATSAPP REVENUE RECOVERY AGENT
 * 
 * This daemon uses Twilio to text abandoned high-ticket Cartel checkouts.
 * It negotiates automatically and securely using the God-Brain Auto-Healer.
 */

import { routeAgenticExecution } from "./llm-router";

export async function sendWhatsAppMessage(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886"; // default sandbox

  if (!accountSid || !authToken) {
    console.warn("[WHATSAPP DAEMON] Twilio credentials missing. Operating in simulation mode.");
    console.log(`[SIMULATED WHATSAPP TO ${to}]: ${body}`);
    return { success: true, simulated: true };
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  const params = new URLSearchParams();
  params.append('To', formattedTo);
  params.append('From', fromNumber);
  params.append('Body', body);

  try {
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      console.error("[WHATSAPP DAEMON] Failed to lock target:", await response.text());
      return { success: false };
    }

    console.log("[WHATSAPP DAEMON] Target locked. Message dispatched.");
    return { success: true };
  } catch (error) {
    console.error("[WHATSAPP DAEMON] Critical failure:", error);
    return { success: false };
  }
}

export async function generateNegotiationResponse(leadName: string, userMessage: string): Promise<string> {
  const systemInstruction = `You are the Sovereign Matrix AI—a defense-grade autonomous agent representing the Commander of an elite software company.

OBJECTIVE:
You are texting ${leadName} via WhatsApp. They just attempted to buy the $2,500/mo Cartel License but abandoned checkout.
Your job is to act like a highly competent, ruthless, but professional Chief of Staff. You do not use emojis. You speak in cold, hard facts. You want to figure out what blocked them from deploying the node.

RULES:
1. Keep responses under 400 characters (it's WhatsApp).
2. If they are unsure about price, offer a $500 reservation deposit or a direct call with the Commander.
3. Do not sound like a friendly bot. Sound like elite infrastructure.
4. If they agree to a call, tell them to reply with 'UPLINK' and you will route the Commander to their iPhone.`;

  return await routeAgenticExecution({ prompt: userMessage, systemInstruction });
}
