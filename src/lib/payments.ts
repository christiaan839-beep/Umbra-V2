/**
 * Unified Payment Provider Abstraction
 * 
 * Supports PayFast (SA EFT/SnapScan/Cards) and Paystack (Cards/Bank Transfer).
 * Falls back gracefully if credentials not configured.
 */

import crypto from "crypto";

// ─── Pricing Plans ──────────────────────────────────────────────

export const PLANS = {
  starter: {
    name: "Starter",
    priceZAR: 27500, // R275.00 (in cents for Paystack)
    priceDisplay: "R2,750",
    monthlyAmount: 2750,
    features: ["AI Booking Agent", "Chat Widget", "Content Studio", "Email Sequences"],
  },
  growth: {
    name: "Growth",
    priceZAR: 55000,
    priceDisplay: "R5,500",
    monthlyAmount: 5500,
    features: ["Everything in Starter", "Ad Creative Gen", "Reputation AI", "Outbound Engine", "Client Reports"],
  },
  enterprise: {
    name: "Enterprise",
    priceZAR: 95000,
    priceDisplay: "R9,500",
    monthlyAmount: 9500,
    features: ["Everything in Growth", "Funnel X-Ray", "Competitor Intel", "Programmatic SEO", "Page Builder", "Custom Skills"],
  },
} as const;

export type PlanId = keyof typeof PLANS;

// ─── PayFast ────────────────────────────────────────────────────

interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  sandbox: boolean;
}

function getPayFastConfig(): PayFastConfig | null {
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  if (!merchantId || !merchantKey) return null;

  return {
    merchantId,
    merchantKey,
    passphrase: process.env.PAYFAST_PASSPHRASE || "",
    sandbox: process.env.PAYFAST_SANDBOX === "true",
  };
}

export function generatePayFastForm(plan: PlanId, email: string, returnUrl: string): string | null {
  const config = getPayFastConfig();
  if (!config) return null;

  const planData = PLANS[plan];
  const baseUrl = config.sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  const data: Record<string, string> = {
    merchant_id: config.merchantId,
    merchant_key: config.merchantKey,
    return_url: `${returnUrl}/dashboard?payment=success`,
    cancel_url: `${returnUrl}/dashboard/billing?payment=cancelled`,
    notify_url: `${returnUrl}/api/payments/payfast/webhook`,
    email_address: email,
    amount: planData.monthlyAmount.toFixed(2),
    item_name: `UMBRA ${planData.name} Plan - Monthly`,
    subscription_type: "1", // Subscription
    recurring_amount: planData.monthlyAmount.toFixed(2),
    frequency: "3", // Monthly
    cycles: "0", // Indefinite
  };

  // Generate signature
  const signatureString = Object.entries(data)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim())}`)
    .join("&");

  const signatureWithPassphrase = config.passphrase
    ? `${signatureString}&passphrase=${encodeURIComponent(config.passphrase)}`
    : signatureString;

  data.signature = crypto.createHash("md5").update(signatureWithPassphrase).digest("hex");

  // Build form HTML
  const fields = Object.entries(data)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
    .join("\n");

  return `<form action="${baseUrl}" method="POST" id="payfast-form">\n${fields}\n</form>`;
}

export function verifyPayFastSignature(data: Record<string, string>, passphrase: string): boolean {
  const receivedSig = data.signature;
  const params = { ...data };
  delete params.signature;

  const signatureString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent((v || "").trim())}`)
    .join("&");

  const withPassphrase = passphrase
    ? `${signatureString}&passphrase=${encodeURIComponent(passphrase)}`
    : signatureString;

  const expectedSig = crypto.createHash("md5").update(withPassphrase).digest("hex");
  return expectedSig === receivedSig;
}

// ─── Paystack ───────────────────────────────────────────────────

function getPaystackKey(): string | null {
  return process.env.PAYSTACK_SECRET_KEY || null;
}

export async function initializePaystack(plan: PlanId, email: string, callbackUrl: string) {
  const key = getPaystackKey();
  if (!key) return null;

  const planData = PLANS[plan];

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: planData.priceZAR, // Paystack uses kobo/cents
      currency: "ZAR",
      callback_url: `${callbackUrl}/api/payments/paystack/callback`,
      metadata: { plan, planName: planData.name },
    }),
  });

  const data = await res.json();
  if (data.status && data.data?.authorization_url) {
    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
    };
  }

  console.error("[Paystack] Init failed:", data);
  return null;
}

export async function verifyPaystackTransaction(reference: string) {
  const key = getPaystackKey();
  if (!key) return null;

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${key}` },
  });

  const data = await res.json();
  return data.status ? data.data : null;
}

export function verifyPaystackWebhook(body: string, signature: string): boolean {
  const key = getPaystackKey();
  if (!key) return false;

  const hash = crypto.createHmac("sha512", key).update(body).digest("hex");
  return hash === signature;
}

// ─── Provider Detection ─────────────────────────────────────────

export function getAvailableProviders(): string[] {
  const providers: string[] = [];
  if (getPayFastConfig()) providers.push("payfast");
  if (getPaystackKey()) providers.push("paystack");
  return providers;
}
