import { NextResponse } from 'next/server';
import { Client, resources } from 'coinbase-commerce-node';
import { db } from "@/db";
import { tenants } from "@/db/schema";

Client.init(process.env.COINBASE_API_KEY || 'test_key');

export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, tier } = await req.json();

    // Mapping tiers to pricing
    const pricingMap: Record<string, { amount: string, name: string }> = {
      'sovereign': { amount: '497.00', name: 'UMBRA Sovereign Tier' },
      'god-mode': { amount: '4997.00', name: 'UMBRA God-Mode (Annual)' },
    };

    const selectedTier = pricingMap[tier] || pricingMap['sovereign'];

    const chargeData = {
      name: selectedTier.name,
      description: 'Autonomous AI Marketing Swarm Access',
      local_price: {
        amount: selectedTier.amount,
        currency: 'USD'
      },
      pricing_type: 'fixed_price',
      metadata: {
        email,
        firstName,
        lastName,
        tier
      },
      redirect_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?crypto=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout`
    };

    const charge = await resources.Charge.create(chargeData as any);

    return NextResponse.json({ url: charge.hosted_url });
  } catch (error: any) {
    console.error('[COINBASE ERROR] Charge creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
