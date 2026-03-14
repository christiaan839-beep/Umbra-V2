import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * PayFast Checkout API — South African Payment Gateway
 * 
 * PayFast is the #1 payment gateway in South Africa.
 * Supports EFT, credit card, SnapScan, Zapper, and Capitec Pay.
 * 
 * This creates a payment form redirect URL for PayFast hosted checkout.
 */

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "";
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "";
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";
const IS_SANDBOX = process.env.PAYFAST_SANDBOX === "true";

const PAYFAST_URL = IS_SANDBOX
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

const TIERS: Record<string, { amount: string; item: string; subscription?: boolean }> = {
  sovereign: { amount: "8997.00", item: "UMBRA Sovereign — R8,997/mo", subscription: true },
  ghost: { amount: "17997.00", item: "UMBRA Ghost Mode — R17,997/mo", subscription: true },
  franchise: { amount: "44997.00", item: "UMBRA Franchise License — R44,997", subscription: false },
};

function generateSignature(data: Record<string, string>, passphrase: string): string {
  const orderedKeys = Object.keys(data).sort();
  const queryString = orderedKeys
    .filter(key => data[key] !== "")
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
    .join("&");
  
  const withPassphrase = passphrase ? `${queryString}&passphrase=${encodeURIComponent(passphrase)}` : queryString;
  return crypto.createHash("md5").update(withPassphrase).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();
    const t = TIERS[tier || "sovereign"];
    if (!t) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

    if (!PAYFAST_MERCHANT_ID || !PAYFAST_MERCHANT_KEY) {
      return NextResponse.json({ error: "PayFast not configured." }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://omnia-os.vercel.app";

    const paymentData: Record<string, string> = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${baseUrl}/portal?welcome=true`,
      cancel_url: baseUrl,
      notify_url: `${baseUrl}/api/webhooks/payfast`,
      name_first: "",
      name_last: "",
      email_address: "",
      m_payment_id: `umbra_${Date.now()}`,
      amount: t.amount,
      item_name: t.item,
      item_description: `UMBRA V2 — ${tier} tier access`,
    };

    // Add subscription fields if applicable
    if (t.subscription) {
      paymentData.subscription_type = "1"; // Monthly subscription
      paymentData.recurring_amount = t.amount;
      paymentData.frequency = "3"; // Monthly
      paymentData.cycles = "0"; // Infinite
    }

    // Generate security signature
    const signature = generateSignature(paymentData, PAYFAST_PASSPHRASE);
    paymentData.signature = signature;

    // Build the redirect URL with all params
    const params = new URLSearchParams(paymentData);
    const redirectUrl = `${PAYFAST_URL}?${params.toString()}`;

    return NextResponse.json({ 
      success: true, 
      url: redirectUrl,
      gateway: "payfast",
      tier,
      amount: t.amount,
      currency: "ZAR"
    });

  } catch (error) {
    console.error("[PayFast Checkout] Error:", error);
    return NextResponse.json({ error: "PayFast checkout failed" }, { status: 500 });
  }
}
