import { NextResponse } from "next/server";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

/**
 * Stripe Billing API
 * 
 * GET: Fetch invoices and current plan for a client
 * POST: Create a Stripe Customer Portal session for self-service billing
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get("clientId");

    if (!STRIPE_KEY || !clientId) {
      return NextResponse.json({
        success: true,
        currentPlan: "black-card",
        invoices: [],
        note: "Stripe keys not configured or clientId missing",
      });
    }

    // In production, you'd look up the Stripe customer ID from your users table
    // For now, fetch recent invoices from Stripe
    const invoicesRes = await fetch("https://api.stripe.com/v1/invoices?limit=20&status=paid", {
      headers: { Authorization: `Bearer ${STRIPE_KEY}` },
    });
    const invoicesData = await invoicesRes.json();

    const invoices = (invoicesData.data || []).map((inv: {
      id: string;
      amount_paid: number;
      created: number;
      status: string;
      invoice_pdf?: string;
    }) => ({
      id: inv.id.slice(-8).toUpperCase(),
      amount: `$${(inv.amount_paid / 100).toFixed(2)}`,
      date: new Date(inv.created * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: inv.status,
      pdf: inv.invoice_pdf || null,
    }));

    return NextResponse.json({ success: true, currentPlan: "black-card", invoices });
  } catch (error) {
    console.error("[Stripe Billing GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch billing data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!STRIPE_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const { clientId } = await req.json();
    const returnUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/portal/${clientId}/billing`;

    // Create a Stripe Customer Portal session
    // In production, you'd look up the customer ID from your database
    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        return_url: returnUrl,
        // customer: stripeCustomerId, // You'd pass the real customer ID here
      }).toString(),
    });

    const portalData = await portalRes.json();

    if (portalData.url) {
      return NextResponse.json({ success: true, url: portalData.url });
    }

    return NextResponse.json({ error: "Failed to create portal session", details: portalData }, { status: 500 });
  } catch (error) {
    console.error("[Stripe Billing POST Error]:", error);
    return NextResponse.json({ error: "Billing portal creation failed" }, { status: 500 });
  }
}
