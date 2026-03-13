import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/** Verify Stripe webhook signature using HMAC-SHA256 */
async function verifyStripeSignature(payload: string, sigHeader: string): Promise<boolean> {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.warn("[Stripe Webhook] No STRIPE_WEBHOOK_SECRET set — skipping verification in dev mode.");
    return true; // Allow in dev, but log warning
  }

  const parts = sigHeader.split(",");
  const timestamp = parts.find(p => p.startsWith("t="))?.slice(2);
  const signature = parts.find(p => p.startsWith("v1="))?.slice(3);

  if (!timestamp || !signature) return false;

  // Reject if timestamp is older than 5 minutes (replay attack protection)
  const timeDiff = Math.abs(Date.now() / 1000 - parseInt(timestamp));
  if (timeDiff > 300) return false;

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(STRIPE_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expected = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return expected === signature;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("stripe-signature") || "";

  // Verify signature
  const isValid = await verifyStripeSignature(rawBody, sigHeader);
  if (!isValid) {
    console.error("[Stripe Webhook] Invalid signature — rejected.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;
      const tier = (session.metadata?.tier || "sovereign") as "sovereign" | "ghost" | "franchise";

      console.log(`[Stripe Webhook] ✅ Checkout Complete: ${email} → ${tier.toUpperCase()}`);

      // Provision the user in the database
      if (email) {
        const existing = db.users.findByEmail(email);
        if (existing) {
          db.users.updateTier(email, tier);
          if (session.customer) db.users.setStripeCustomer(email, session.customer);
        } else {
          // Auto-create account for new Stripe customers
          const newUser = db.users.create(email, crypto.randomUUID().slice(0, 12));
          db.users.updateTier(email, tier);
          if (session.customer) db.users.setStripeCustomer(email, session.customer);
          console.log(`[Stripe Webhook] Auto-created account for ${email}`);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const user = db.users.findByStripeCustomer(subscription.customer);
      if (user) {
        db.users.updateTier(user.email, "sovereign"); // Downgrade to base tier
        console.log(`[Stripe Webhook] ❌ Downgraded ${user.email} to sovereign (cancelled)`);
      }
      break;
    }

    case "invoice.paid": {
      const amount = (event.data.object.amount_paid / 100).toFixed(2);
      console.log(`[Stripe Webhook] 💰 Invoice paid: $${amount}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
