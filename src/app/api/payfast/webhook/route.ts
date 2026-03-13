import { NextResponse } from "next/server";
import crypto from "crypto";
import { remember } from "@/lib/memory";

/**
 * PayFast ITN (Instant Transaction Notification) Webhook
 * 
 * PayFast sends POST requests here when payments complete.
 * We validate the signature, log the sale, and provision access.
 */

const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";
const VALID_HOSTS = ["www.payfast.co.za", "sandbox.payfast.co.za", "w1w.payfast.co.za", "w2w.payfast.co.za"];

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data: Record<string, string> = {};
    params.forEach((value, key) => { data[key] = value; });

    // 1. Verify the signature
    const receivedSignature = data.signature;
    delete data.signature;

    const orderedKeys = Object.keys(data).sort();
    const queryString = orderedKeys
      .filter(key => data[key] !== "")
      .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
      .join("&");
    
    const withPassphrase = PAYFAST_PASSPHRASE ? `${queryString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE)}` : queryString;
    const expectedSignature = crypto.createHash("md5").update(withPassphrase).digest("hex");

    if (receivedSignature !== expectedSignature) {
      console.error("[PayFast Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Process based on payment status
    const paymentStatus = data.payment_status;
    const paymentId = data.m_payment_id;
    const amount = data.amount_gross;
    const email = data.email_address;

    if (paymentStatus === "COMPLETE") {
      console.log(`[PayFast] ✅ Payment COMPLETE: ${paymentId} | R${amount} | ${email}`);

      // Store in God-Brain
      await remember(`PayFast Payment Received: R${amount} from ${email} (ID: ${paymentId})`, {
        type: "payment_received",
        gateway: "payfast",
        amount,
        currency: "ZAR",
        email: email || "unknown",
        paymentId,
        status: "complete",
      });
    } else {
      console.log(`[PayFast] Payment status: ${paymentStatus} for ${paymentId}`);
    }

    // PayFast expects a 200 OK with no body
    return new NextResponse("", { status: 200 });

  } catch (error) {
    console.error("[PayFast Webhook] Error:", error);
    return new NextResponse("", { status: 200 });
  }
}
