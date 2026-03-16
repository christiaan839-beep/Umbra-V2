import { NextResponse } from "next/server";
import { verifyPayFastSignature } from "@/lib/payments";

/**
 * PayFast ITN (Instant Transaction Notification) Webhook
 * 
 * PayFast POSTs here when a payment succeeds, fails, or subscription renews.
 * Verifies the signature, then processes the event.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log("[PayFast ITN] Received:", data.payment_status, data.pf_payment_id);

    // Verify signature
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    if (!verifyPayFastSignature(data, passphrase)) {
      console.error("[PayFast ITN] Invalid signature!");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Process based on payment status
    const status = data.payment_status;
    const email = data.email_address;
    const amount = data.amount_gross;

    switch (status) {
      case "COMPLETE":
        console.log(`[PayFast] ✅ Payment COMPLETE: ${email} paid R${amount}`);
        // TODO: Activate subscription in database
        // await db.insert(subscriptions).values({ email, plan: data.item_name, status: 'active', provider: 'payfast' });
        break;
      case "FAILED":
        console.log(`[PayFast] ❌ Payment FAILED: ${email}`);
        break;
      case "PENDING":
        console.log(`[PayFast] ⏳ Payment PENDING: ${email}`);
        break;
      case "CANCELLED":
        console.log(`[PayFast] 🚫 Subscription CANCELLED: ${email}`);
        // TODO: Deactivate subscription
        break;
      default:
        console.log(`[PayFast] Unknown status: ${status}`);
    }

    // PayFast expects a 200 OK response
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("[PayFast ITN] Error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
