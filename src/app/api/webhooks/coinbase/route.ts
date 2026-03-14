import { NextResponse } from 'next/server';
import { Webhook } from 'coinbase-commerce-node';
import { db } from "@/db";
import { tenants, globalTelemetry } from "@/db/schema";

const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET || 'shared_secret';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-cc-webhook-signature') as string;

    let event;
    try {
      event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error(`[Coinbase Webhook Error] Signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
    }

    if (event.type === 'charge:confirmed') {
      const charge = event.data as any;
      const email = charge.metadata.email || `guest_${charge.code}@crypto.local`;
      
      console.log(`[Coinbase Webhook] 🪙 Crypto Secured! Charge Code: ${charge.code}`);
      
      // Provision the multi-tenant node in Neon DB
      try {
        const [newTenant] = await db.insert(tenants).values({
          clerkUserId: `crypto_${charge.code}`, // Placeholder ID until user registers/claims
          nodeId: `UMB-NX-${Math.floor(Math.random() * 90000) + 10000}`,
          plan: charge.metadata.tier || "sovereign",
        }).returning();

        // Log the MRR event to Global Telemetry
        await db.insert(globalTelemetry).values({
          tenantId: newTenant.id,
          eventType: "revenue_secured_crypto",
          payload: JSON.stringify({ amount: charge.pricing.local.amount, currency: charge.pricing.local.currency }),
        });

        console.log(`[Coinbase Webhook] Node Provisioned: ${newTenant.nodeId}. Crypto Telemetry routed.`);
        
        // Notify Telegram Commander
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_OWNER_CHAT_ID) {
          const msg = `🪙 CRYPTO SECURED: $${charge.pricing.local.amount} from ${email}\nNode initialized: ${newTenant.nodeId}`;
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: process.env.TELEGRAM_OWNER_CHAT_ID, text: msg }),
          });
        }
      } catch (dbErr) {
        console.error(`[Coinbase Webhook / DB Error] Could not provision tenant:`, dbErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Coinbase Webhook Internal Error] ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
