import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const event = JSON.parse(await req.text());
  switch (event.type) {
    case "checkout.session.completed":
      console.log(`[Stripe] ✅ New customer: ${event.data.object.customer_email}`);
      break;
    case "invoice.paid":
      console.log(`[Stripe] 💰 Payment: $${(event.data.object.amount_paid / 100).toFixed(2)}`);
      break;
    case "customer.subscription.deleted":
      console.log(`[Stripe] ❌ Cancelled: ${event.data.object.id}`);
      break;
  }
  return NextResponse.json({ received: true });
}
