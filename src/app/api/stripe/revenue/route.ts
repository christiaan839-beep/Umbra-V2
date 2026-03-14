import { NextResponse } from "next/server";

/**
 * Stripe Revenue API
 * 
 * Fetches live revenue data directly from the Stripe API.
 * Returns payment totals, recent charges, and subscription metrics.
 * Requires STRIPE_SECRET_KEY in environment variables.
 */
export async function GET(req: Request) {
  try {
    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
    
    if (!STRIPE_KEY) {
      return NextResponse.json({
        success: true,
        note: "Stripe keys not configured — showing demo data",
        revenue: {
          totalRevenue: "$0",
          monthlyRecurring: "$0",
          recentCharges: [],
          activeSubscriptions: 0,
        },
      });
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Fetch recent charges from Stripe
    const chargesRes = await fetch(`https://api.stripe.com/v1/charges?limit=${limit}&status=succeeded`, {
      headers: { Authorization: `Bearer ${STRIPE_KEY}` },
    });
    const chargesData = await chargesRes.json();

    // Fetch active subscriptions
    const subsRes = await fetch("https://api.stripe.com/v1/subscriptions?status=active&limit=100", {
      headers: { Authorization: `Bearer ${STRIPE_KEY}` },
    });
    const subsData = await subsRes.json();

    // Calculate totals
    const charges = chargesData.data || [];
    const subscriptions = subsData.data || [];

    const totalRevenue = charges.reduce((sum: number, c: { amount: number }) => sum + c.amount, 0) / 100;
    const monthlyRecurring = subscriptions.reduce((sum: number, s: { plan?: { amount?: number } }) => {
      return sum + (s.plan?.amount || 0);
    }, 0) / 100;

    const recentCharges = charges.slice(0, 10).map((c: { id: string; amount: number; created: number; description?: string; billing_details?: { name?: string } }) => ({
      id: c.id,
      amount: `$${(c.amount / 100).toFixed(2)}`,
      date: new Date(c.created * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      description: c.description || "Payment",
      customer: c.billing_details?.name || "Client",
    }));

    return NextResponse.json({
      success: true,
      revenue: {
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        monthlyRecurring: `$${monthlyRecurring.toLocaleString()}/mo`,
        recentCharges,
        activeSubscriptions: subscriptions.length,
      },
    });
  } catch (error) {
    console.error("[Stripe Revenue Error]:", error);
    return NextResponse.json({ error: "Failed to fetch Stripe revenue data" }, { status: 500 });
  }
}
