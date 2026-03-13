import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const event = JSON.parse(await req.text());
  
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;
      const tier = session.metadata?.tier || "sovereign"; // Passed from checkout API
      
      console.log(`[Stripe Webhook] ✅ Checkout Complete: ${email}`);
      console.log(`[Stripe Webhook] ⬆️ PROVISIONING TIER: ${tier.toUpperCase()}`);
      
      // TODO (Production): Update User DB
      // await db.users.update({ where: { email }, data: { tier, stripeCustomerId: session.customer } });
      
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.log(`[Stripe Webhook] ❌ Cancelled Sub: ${subscription.id}`);
      
      // TODO (Production): Downgrade User DB
      // await db.users.update({ where: { stripeCustomerId: subscription.customer }, data: { tier: 'free' } });
      
      break;
    }
    case "invoice.paid": {
      console.log(`[Stripe Webhook] 💰 Payment Processed: $${(event.data.object.amount_paid / 100).toFixed(2)}`);
      break;
    }
  }
  
  return NextResponse.json({ received: true });
}
