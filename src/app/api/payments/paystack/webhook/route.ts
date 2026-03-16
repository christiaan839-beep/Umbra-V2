import { NextResponse } from "next/server";
import { verifyPaystackWebhook } from "@/lib/payments";

/**
 * Paystack Webhook Handler
 * 
 * Paystack sends events here for successful charges, failed charges, etc.
 * Verifies the SHA512 HMAC signature before processing.
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    // Verify webhook signature
    if (!verifyPaystackWebhook(body, signature)) {
      console.error("[Paystack Webhook] Invalid signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("[Paystack Webhook] Event:", event.event);

    switch (event.event) {
      case "charge.success": {
        const { customer, amount, metadata } = event.data;
        console.log(`[Paystack] ✅ Charge SUCCESS: ${customer.email} paid R${(amount / 100).toFixed(2)}`);
        console.log(`[Paystack] Plan: ${metadata?.plan || "unknown"}`);
        // TODO: Activate subscription in database
        break;
      }
      case "subscription.create": {
        console.log(`[Paystack] 🔄 Subscription created: ${event.data.customer?.email}`);
        break;
      }
      case "subscription.disable": {
        console.log(`[Paystack] 🚫 Subscription disabled: ${event.data.customer?.email}`);
        // TODO: Deactivate subscription
        break;
      }
      case "charge.failed": {
        console.log(`[Paystack] ❌ Charge FAILED: ${event.data.customer?.email}`);
        break;
      }
      default:
        console.log(`[Paystack] Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Paystack Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
