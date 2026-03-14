import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  // @ts-expect-error Ignoring type mismatch for apiVersion
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName } = await req.json();

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
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
      return_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email, // Pre-fill
      metadata: {
        firstName,
        lastName,
      }
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[STRIPE ERROR] Session creation failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
