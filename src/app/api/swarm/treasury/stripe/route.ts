import { NextResponse } from "next/server";
import { remember } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const { productName, priceCents, customerEmail } = await req.json();

    if (!productName || !priceCents) {
      return NextResponse.json({ error: "Missing product or price" }, { status: 400 });
    }

    // SIMULATED STRIPE CHECKOUT SESSION GENERATION
    // In production, this uses the `stripe` npm SDK:
    // const session = await stripe.checkout.sessions.create({...})

    console.log(`[Treasury Swarm] Generating checkout link for ${productName} ($${(priceCents/100).toFixed(2)})`);
    
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockCheckoutUrl = `https://checkout.stripe.com/c/pay/cs_test_${Math.random().toString(36).slice(2, 16)}`;
    const mockSessionId = `cs_test_${Date.now()}`;

    // Log the generated link to the God-Brain
    await remember(`TREASURY INTENT: Generated checkout link for ${productName} for ${customerEmail || 'anonymous'}. Link: ${mockCheckoutUrl}`, {
      type: "treasury-intent",
      productName,
      priceCents: priceCents.toString(),
      sessionId: mockSessionId
    });

    return NextResponse.json({
        success: true,
        data: {
            url: mockCheckoutUrl,
            id: mockSessionId,
            product: productName,
            amount: priceCents
        }
    });

  } catch (error: any) {
    console.error("[Treasury Agent Error]:", error);
    return NextResponse.json({ error: "Failed to generate Stripe checkout" }, { status: 500 });
  }
}
