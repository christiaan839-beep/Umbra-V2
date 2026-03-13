import { NextResponse } from "next/server";
import { remember } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const eventType = payload.type || "payment_intent.succeeded";
    
    // SIMULATED STRIPE WEBHOOK INGESTION
    // In production, MUST verify HMAC signature:
    // const sig = request.headers.get('stripe-signature');
    // const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);

    console.log(`[Treasury Webhook] Processing event: ${eventType}`);

    if (eventType === "payment_intent.succeeded") {
       const amount = payload.data?.object?.amount || Math.floor(Math.random() * 500000) + 10000; // Simulated $100 to $5000
       const customerEmail = payload.data?.object?.receipt_email || "dynamic.lead@umbra.sys";
       const productName = payload.data?.object?.metadata?.productName || "UMBRA Advanced Retainer";

       // Log successful revenue event to God-Brain
       await remember(`TREASURY WEBHOOK (SUCCESS): Received $${(amount/100).toFixed(2)} from ${customerEmail} for ${productName}.`, {
           type: "revenue-event",
           status: "succeeded",
           amount: amount.toString(),
           customerEmail,
           productName,
           timestamp: new Date().toISOString()
       });

       return NextResponse.json({ received: true, status: "logged to god-brain" });
    }

    if (eventType === "charge.refunded") {
       const amount = payload.data?.object?.amount || 50000;
       
       await remember(`TREASURY WEBHOOK (REFUND): Refunded $${(amount/100).toFixed(2)}.`, {
           type: "refund-event",
           status: "refunded",
           amount: amount.toString(),
           timestamp: new Date().toISOString()
       });
       
       return NextResponse.json({ received: true, status: "refund logged" });
    }

    // Unhandled event type
    return NextResponse.json({ received: true, status: "ignored" });

  } catch (error: any) {
    console.error("[Treasury Webhook Error]:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
