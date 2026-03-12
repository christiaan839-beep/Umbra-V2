import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { tier, successUrl, cancelUrl } = await req.json();
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_KEY) return NextResponse.json({ error: "Stripe not configured." }, { status: 500 });

  const TIERS: Record<string, { cents: number; mode: string; name: string }> = {
    sovereign: { cents: 49700, mode: "subscription", name: "Sovereign Node — $497/mo" },
    ghost: { cents: 99700, mode: "subscription", name: "Ghost Mode — $997/mo" },
    franchise: { cents: 249700, mode: "payment", name: "Franchise License — $2,497" },
  };

  const t = TIERS[tier || "sovereign"];
  if (!t) return NextResponse.json({ error: "Invalid tier." }, { status: 400 });

  const params: Record<string, string> = {
    mode: t.mode,
    success_url: successUrl || `${process.env.NEXT_PUBLIC_URL || "https://sovereign-v2.vercel.app"}/portal?welcome=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL || "https://sovereign-v2.vercel.app"}`,
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": t.name,
    "line_items[0][price_data][unit_amount]": String(t.cents),
    "line_items[0][quantity]": "1",
  };
  if (t.mode === "subscription") params["line_items[0][price_data][recurring][interval]"] = "month";

  const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const data = await session.json();

  if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 });
  return NextResponse.json({ success: true, url: data.url, id: data.id });
}
