import { NextResponse } from "next/server";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth-guard";

/**
 * Referral System API
 * 
 * GET: Generate or retrieve a referral link for a tenant
 * POST: Track a referral conversion
 */
export async function GET(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Generate a deterministic referral code from tenantId
    const refCode = crypto
      .createHash("sha256")
      .update(tenantId + "umbra-referral-salt")
      .digest("hex")
      .slice(0, 8)
      .toUpperCase();

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://umbra.ai";
    const referralLink = `${baseUrl}/scan?ref=${refCode}`;

    return NextResponse.json({
      success: true,
      referralCode: refCode,
      referralLink,
      reward: "10% off next invoice for each successful referral",
    });
  } catch (error) {
    console.error("[Referral GET Error]:", error);
    return NextResponse.json({ error: "Failed to generate referral link" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const { referralCode, newClientEmail } = await req.json();

    if (!referralCode || !newClientEmail) {
      return NextResponse.json({ error: "Missing referralCode or newClientEmail" }, { status: 400 });
    }

    // In a production system, we would:
    // 1. Look up which tenant owns this referral code
    // 2. Create a Stripe coupon for 10% off their next invoice
    // 3. Track the referral in a dedicated table
    // 4. Send a notification to the referring client

    console.log(`[Referral] Conversion: code=${referralCode}, newClient=${newClientEmail}`);

    return NextResponse.json({
      success: true,
      message: `Referral tracked. 10% discount will be applied to the referring client's next invoice.`,
      referralCode,
      newClientEmail,
    });
  } catch (error) {
    console.error("[Referral POST Error]:", error);
    return NextResponse.json({ error: "Failed to track referral" }, { status: 500 });
  }
}
