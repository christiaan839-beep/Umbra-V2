import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from "@/db";
import { tenants, globalTelemetry } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_123';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`[Stripe Webhook Error] Signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkId = session.client_reference_id || `GUEST_${session.id.substring(0, 8)}`;
      
      console.log(`[Stripe Webhook] 💰 Checkout Complete! Session ID: ${session.id}`);
      
      // Provision the multi-tenant node in Neon DB
      try {
        const [newTenant] = await db.insert(tenants).values({
          clerkUserId: clerkId,
          nodeId: `UMB-NX-${Math.floor(Math.random() * 90000) + 10000}`,
          plan: "sovereign",
        }).returning();

        // Log the MRR event to Global Telemetry
        await db.insert(globalTelemetry).values({
          tenantId: newTenant.id,
          eventType: "revenue_secured",
          payload: JSON.stringify({ amount: session.amount_total, ccy: session.currency }),
        });

        console.log(`[Stripe Webhook] Node Provisioned: ${newTenant.nodeId}. Telemetry routed.`);
      } catch (dbErr) {
        console.error(`[Stripe Webhook / DB Error] Could not provision tenant:`, dbErr);
        // We still return 200 so Stripe doesn't retry infinitely just because our DB had a hiccup
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Stripe Webhook Internal Error] ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
