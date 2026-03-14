import { NextResponse } from "next/server";

/**
 * Stripe Billing Portal API
 * 
 * Creates a Stripe Customer Billing Portal session that lets
 * clients manage their subscription, view invoices, and update
 * payment methods — all directly from UMBRA's dashboard.
 */
export async function POST(req: Request) {
  try {
    const { stripeCustomerId, returnUrl } = await req.json();
    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "Missing stripeCustomerId" }, { status: 400 });
    }

    // Create a Stripe Billing Portal session
    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customer: stripeCustomerId,
        return_url: returnUrl || process.env.NEXT_PUBLIC_URL || "https://umbra.ai/dashboard",
      }),
    });

    const session = await portalRes.json();

    if (session.error) {
      return NextResponse.json({ error: session.error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("[Stripe Billing Error]:", error);
    return NextResponse.json({ error: "Failed to create billing session" }, { status: 500 });
  }
}

/**
 * GET: Fetch invoices for a customer
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId");
    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_KEY || !customerId) {
      return NextResponse.json({ invoices: [] });
    }

    const res = await fetch(`https://api.stripe.com/v1/invoices?customer=${customerId}&limit=10`, {
      headers: { Authorization: `Bearer ${STRIPE_KEY}` },
    });
    const data = await res.json();

    const invoices = (data.data || []).map((inv: { id: string; amount_paid: number; created: number; status: string; invoice_pdf?: string }) => ({
      id: inv.id,
      amount: `$${(inv.amount_paid / 100).toFixed(2)}`,
      date: new Date(inv.created * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: inv.status,
      pdfUrl: inv.invoice_pdf || null,
    }));

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error("[Stripe Invoices Error]:", error);
    return NextResponse.json({ invoices: [] });
  }
}
