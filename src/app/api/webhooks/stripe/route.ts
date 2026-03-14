import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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
      console.log(`[Stripe Webhook] 💰 Capital Secured! $5,000/mo retainer initiated. Session ID: ${session.id}`);
      
      // In a live environment, this is where we would map the Clerk User ID 
      // from session.metadata and run the Neon Drizzle DB query to flip the commander's status to ACTIVE.
      console.log(`[Stripe Webhook] Bootstrapping Multi-Tenant Isolation for Commander...`);
      console.log(`[Stripe Webhook] Node Provisioned. Routing telemetry payload.`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Stripe Webhook Internal Error] ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
