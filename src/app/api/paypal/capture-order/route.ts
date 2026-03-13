import { NextResponse } from "next/server";
import { remember } from "@/lib/memory"; // Add to god-brain

const base = process.env.PAYPAL_ENVIRONMENT === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

async function generateAccessToken() {
  const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!response.ok) throw new Error("Failed to authenticate with PayPal");
  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();
    
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.status === "COMPLETED") {
       const payerEmail = data.payer?.email_address || "Unknown";
       const value = data.purchase_units[0]?.payments?.captures[0]?.amount?.value || "0";

       // Log successful payment to God-Brain
       await remember(`PAYPAL_CHECKOUT_COMPLETE for $${value} from ${payerEmail}. License provisioning authorized.`, {
         type: "payment-log",
         amount: value,
         gateway: "paypal",
         payer: payerEmail
       });

       return NextResponse.json({ success: true, data });
    } else {
       throw new Error(data.message || "Failed to capture PayPal order");
    }

  } catch (error: any) {
    console.error("[PayPal Capture Error]:", error);
    return NextResponse.json({ error: error.message || "Could not capture PayPal order" }, { status: 500 });
  }
}
