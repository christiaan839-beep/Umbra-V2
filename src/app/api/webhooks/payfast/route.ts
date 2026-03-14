import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from "@/db";
import { tenants, globalTelemetry } from "@/db/schema";

const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";
const IS_SANDBOX = process.env.PAYFAST_SANDBOX === "true";
const PAYFAST_VALIDATION_URL = IS_SANDBOX
  ? "https://sandbox.payfast.co.za/eng/query/validate"
  : "https://www.payfast.co.za/eng/query/validate";

// Verify ITN signature
function verifySignature(data: Record<string, string>, signature: string): boolean {
  let signString = '';
  // PayFast signature generation requires keys to be in exact order as sent, but ITN sends them differently.
  // Actually, for ITN, Payfast says: "Parameters must be in the exact order as they are received."
  // But to be safe we sort them. Wait, standard ITN validation involves stripping the signature and passphrase,
  // hashing the rest.
  const payload = { ...data };
  delete payload.signature;

  let pfString = "";
  for (const key in payload) {
    pfString += `${key}=${encodeURIComponent(payload[key]).replace(/%20/g, "+")}&`;
  }
  pfString = pfString.slice(0, -1);
  if (PAYFAST_PASSPHRASE) {
    pfString += `&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE).replace(/%20/g, "+")}`;
  }

  const generatedSignature = crypto.createHash("md5").update(pfString).digest("hex");
  return generatedSignature === signature;
}

export async function POST(req: Request) {
  try {
    // PayFast ITN sends data as application/x-www-form-urlencoded
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const signature = data.signature;
    if (!signature || !verifySignature(data, signature)) {
      console.error("[PayFast Webhook] Invalid ITN signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Server-to-Server Validation with PayFast
    // This prevents malicious actors from forging ITN requests
    const validationParams = new URLSearchParams(data);
    const validationRes = await fetch(PAYFAST_VALIDATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: validationParams.toString()
    });
    
    const validationText = await validationRes.text();
    if (validationText !== 'VALID') {
      console.error("[PayFast Webhook] ITN Validation Failed. Response:", validationText);
      return NextResponse.json({ error: "ITN Validation Failed" }, { status: 400 });
    }

    if (data.payment_status === "COMPLETE") {
      const email = data.email_address || `guest_${data.m_payment_id}@payfast.local`;
      const tier = data.custom_str1 || "sovereign";
      
      console.log(`[PayFast Webhook] 🇿🇦 ZAR Revenue Secured! ID: ${data.m_payment_id}`);
      
      try {
        const [newTenant] = await db.insert(tenants).values({
          clerkUserId: `pf_${data.m_payment_id}`,
          nodeId: `UMB-NX-${Math.floor(Math.random() * 90000) + 10000}`,
          plan: tier,
        }).returning();

        // Log the ZAR MRR event to Global Telemetry
        await db.insert(globalTelemetry).values({
          tenantId: newTenant.id,
          eventType: "revenue_secured_payfast_zar",
          payload: JSON.stringify({ amount: data.amount_gross, currency: "ZAR" }),
        });

        console.log(`[PayFast Webhook] Node Provisioned: ${newTenant.nodeId}. Telemetry routed.`);
        
        // Notify Telegram Commander
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_OWNER_CHAT_ID) {
          const msg = `🇿🇦 PAYFAST ZAR SECURED: R${data.amount_gross} from ${email}\nNode initialized: ${newTenant.nodeId}`;
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: process.env.TELEGRAM_OWNER_CHAT_ID, text: msg }),
          });
        }
      } catch (dbErr) {
        console.error(`[PayFast Webhook / DB Error] Could not provision tenant:`, dbErr);
      }
    }

    // PayFast expects a 200 OK immediately
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[PayFast Webhook Internal Error] ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
