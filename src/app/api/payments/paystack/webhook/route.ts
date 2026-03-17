import { NextResponse } from "next/server";
import { verifyPaystackWebhook } from "@/lib/payments";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Paystack Webhook Handler
 * 
 * Verifies SHA512 HMAC signature, then activates/deactivates plans.
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    // Verify webhook signature
    if (!verifyPaystackWebhook(body, signature)) {
      console.error("[Paystack Webhook] Invalid signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("[Paystack Webhook] Event:", event.event);

    switch (event.event) {
      case "charge.success": {
        const { customer, amount, metadata } = event.data;
        const email = customer?.email;
        const plan = metadata?.plan || "pro";

        console.log(`[Paystack] ✅ Charge SUCCESS: ${email} paid R${(amount / 100).toFixed(2)} for plan: ${plan}`);

        if (email) {
          // Update the tenant's plan in the database
          const [existing] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.clerkUserId, email))
            .limit(1);

          if (existing) {
            await db
              .update(tenants)
              .set({ plan })
              .where(eq(tenants.clerkUserId, email));
            console.log(`[Paystack] ✅ Plan upgraded to ${plan} for ${email}`);
          } else {
            // Create tenant record if doesn't exist
            await db.insert(tenants).values({
              clerkUserId: email,
              nodeId: `UMB-${Date.now().toString(36).toUpperCase()}`,
              plan,
            });
            console.log(`[Paystack] ✅ Created tenant with plan ${plan} for ${email}`);
          }
        }
        break;
      }

      case "subscription.create": {
        const email = event.data.customer?.email;
        const plan = event.data.plan?.plan_code?.includes("agency") ? "agency" : "pro";
        console.log(`[Paystack] 🔄 Subscription created: ${email} → ${plan}`);

        if (email) {
          await db
            .update(tenants)
            .set({ plan })
            .where(eq(tenants.clerkUserId, email));
        }
        break;
      }

      case "subscription.disable": {
        const email = event.data.customer?.email;
        console.log(`[Paystack] 🚫 Subscription disabled: ${email}`);

        if (email) {
          await db
            .update(tenants)
            .set({ plan: "starter" }) // Downgrade to free
            .where(eq(tenants.clerkUserId, email));
        }
        break;
      }

      case "charge.failed": {
        console.log(`[Paystack] ❌ Charge FAILED: ${event.data.customer?.email}`);
        break;
      }

      default:
        console.log(`[Paystack] Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Paystack Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
