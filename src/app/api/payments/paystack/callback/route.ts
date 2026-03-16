import { NextResponse } from "next/server";
import { verifyPaystackTransaction } from "@/lib/payments";

/**
 * Paystack Callback — handles redirect after payment
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/dashboard/billing?payment=failed", req.url));
  }

  try {
    const transaction = await verifyPaystackTransaction(reference);

    if (transaction?.status === "success") {
      console.log(`[Paystack Callback] ✅ Verified: ${transaction.customer.email} paid R${(transaction.amount / 100).toFixed(2)}`);
      return NextResponse.redirect(new URL("/dashboard?payment=success", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard/billing?payment=failed", req.url));
  } catch (err) {
    console.error("[Paystack Callback] Error:", err);
    return NextResponse.redirect(new URL("/dashboard/billing?payment=error", req.url));
  }
}
