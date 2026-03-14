import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'UMBRA Sovereign Node (Active)',
              description: 'Military-Grade AI Marketing Terminal ($5,000/mo Retainer)',
            },
            unit_amount: 500000, // $5,000 in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout`,
      customer_email: email, // Pre-fill
      metadata: {
        firstName,
        lastName,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[STRIPE ERROR] Session creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
