import { NextResponse } from "next/server";
import { persistAppend } from "@/lib/persist";

/**
 * PayFast ITN (Instant Transaction Notification) Webhook — Legacy route.
 * Redirects to the main ITN handler at /api/payments/payfast/itn.
 * 
 * Kept for backwards compatibility with any existing PayFast configs
 * that may point to /api/payments/payfast/webhook.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const status = data.payment_status;
    const email = data.email_address || "";
    const amount = data.amount_gross || "0";

    // Log every ITN for audit
    persistAppend("payfast-itn-log", {
      id: data.m_payment_id || `pf-${Date.now()}`,
      status,
      amount,
      email,
      timestamp: new Date().toISOString(),
      source: "webhook-legacy",
    }, 500);

    if (status === "COMPLETE") {
      // Trigger auto-onboard
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

      try {
        await fetch(`${baseUrl}/api/agents/auto-onboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: `${data.name_first || ""} ${data.name_last || ""}`.trim() || "New Client",
            email,
            plan: data.item_name || "node",
          }),
        });
      } catch {
        // Auto-onboard is best-effort
      }

      persistAppend("payfast-payments", {
        id: data.m_payment_id || `pf-${Date.now()}`,
        plan: data.item_name || "node",
        amount,
        email,
        timestamp: new Date().toISOString(),
      }, 1000);
    }

    return new NextResponse("OK", { status: 200 });
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }
}
