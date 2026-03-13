import { NextResponse } from "next/server";

// Using native fetch to avoid heavy SDK dependencies
const base = process.env.PAYPAL_ENVIRONMENT === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

async function generateAccessToken() {
  try {
    const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    if (!response.ok) throw new Error("Failed to authenticate with PayPal");
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    // Determine which product they clicked
    const { productId } = await req.json();
    
    // Default to the Autonomous Agency Suite price
    let amount = "497.00";
    if (productId === "enterprise") amount = "9997.00";

    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json({ id: data.id });
    } else {
      throw new Error(data.message || "Failed to create order");
    }
  } catch (error: any) {
    console.error("[PayPal Create Order Error]:", error);
    return NextResponse.json({ error: error.message || "Could not create PayPal order" }, { status: 500 });
  }
}
