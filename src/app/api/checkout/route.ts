import { NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(req: Request) {
    try {
        const { email, lead_id } = await req.json();

        if (!STRIPE_SECRET_KEY) {
            console.error("[STRIPE API] Missing STRIPE_SECRET_KEY.");
            return NextResponse.json({ error: "Stripe API Offline" }, { status: 500 });
        }

        console.log(`[STRIPE PIPELINE] Generating $5k Autonomous Invoice for ${email}...`);

        // Direct REST API fetch to Stripe (Bypasses NPM/Node dependency caches for extreme speed on Vercel Edge)
        const params = new URLSearchParams();
        params.append('success_url', 'https://sovereign-matrix.com/dashboard/onboarding?session_id={CHECKOUT_SESSION_ID}');
        params.append('cancel_url', 'https://sovereign-matrix.com');
        params.append('mode', 'payment');
        params.append('customer_email', email || 'commander-lead@example.com');
        params.append('line_items[0][price_data][currency]', 'usd');
        params.append('line_items[0][price_data][product_data][name]', 'Sovereign Matrix Elite Node License (Phase 1 Retainer)');
        params.append('line_items[0][price_data][unit_amount]', '500000'); // $5,000.00
        params.append('line_items[0][quantity]', '1');

        const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });

        const stripeData = await stripeResponse.json();

        if (!stripeResponse.ok) {
            console.error("[STRIPE API ERROR]", stripeData);
            return NextResponse.json({ error: stripeData.error.message }, { status: stripeResponse.status });
        }

        // Return the secure checkout URL directly to the Closer Agent or N8N Webhook
        return NextResponse.json({ 
            status: 'checkout_generated', 
            checkout_url: stripeData.url 
        });

    } catch (error) {
        console.error("[STRIPE FATAL ERROR]", error);
        return NextResponse.json({ error: 'Internal Exec Error' }, { status: 500 });
    }
}
