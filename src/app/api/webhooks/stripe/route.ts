import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from "@/db";
import { tenants, globalTelemetry, settings, leads } from "@/db/schema";
import { pusherServer } from "@/lib/pusher";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  // @ts-expect-error Ignoring type mismatch for apiVersion
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_123';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const e = err as Error;
      console.error(`[Stripe Webhook Error] Signature verification failed: ${e.message}`);
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

        // Trigger real-time pulse across global dashboards
        await pusherServer.trigger('umbra-global', 'telemetry_update', {
          id: Math.random().toString(36).substr(2, 9),
          location: "Stripe Payment Gateway",
          action: `+ $${((session.amount_total || 500000) / 100).toLocaleString()} SOVEREIGN CAPITAL SECURED`,
          isCapital: true
        });

        console.log(`[Stripe Webhook] Node Provisioned: ${newTenant.nodeId}. Telemetry routed.`);

        // Phase 7: The Fulfillment Layer Handoff (N8N)
        console.log(`[Stripe Webhook] Triggering Fulfillment Layer in N8N...`);
        try {
            await fetch("http://localhost:5678/webhook/stripe-onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tenantId: newTenant.id,
                    nodeId: newTenant.nodeId,
                    amount: session.amount_total,
                    customerEmail: session.customer_details?.email,
                    customerName: session.customer_details?.name,
                    timestamp: Date.now()
                }),
            });
            console.log(`[Stripe Webhook] N8N Fulfillment sequence triggered successfully.`);
        } catch (n8nErr) {
            console.error(`[Stripe Webhook] Failed to trigger N8N fulfillment sequence:`, n8nErr);
        }

        // Auto-provision user settings (BYOK, webhooks, etc.)
        const customerEmail = session.customer_details?.email;
        if (customerEmail) {
          const existingSettings = await db.query.settings.findFirst({
            where: eq(settings.userEmail, customerEmail)
          });
          if (!existingSettings) {
            await db.insert(settings).values({
              userEmail: customerEmail,
              config: JSON.stringify({ plan: "sovereign", nodeId: newTenant.nodeId, onboardedAt: new Date().toISOString() }),
              apiKeys: "{}",
              webhooks: "{}",
            });
            console.log(`[Stripe Webhook] Auto-provisioned settings for ${customerEmail}`);
          }

          // Log as closed lead
          await db.insert(leads).values({
            userEmail: customerEmail,
            name: session.customer_details?.name || "New Client",
            email: customerEmail,
            source: "stripe",
            status: "closed",
            score: "100",
            notes: `Paid $${((session.amount_total || 0) / 100).toFixed(2)} — Node: ${newTenant.nodeId}`,
          });
          console.log(`[Stripe Webhook] Lead logged as closed: ${customerEmail}`);
        }
      } catch (dbErr) {
        console.error(`[Stripe Webhook / DB Error] Could not provision tenant:`, dbErr);
        // We still return 200 so Stripe doesn't retry infinitely just because our DB had a hiccup
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const e = err as Error;
    console.error(`[Stripe Webhook Internal Error] ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
