import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { sendWhatsAppMessage } from "@/lib/whatsapp-agent";

export async function POST(req: Request) {
  try {
    const { name, phone, planId } = await req.json();
    
    // Default user Email to system if we don't have an auth'd user (this is a public checkout)
    const userEmail = "sysadmin@sovereign.local";

    const newLead = await db.insert(leads).values({
      userEmail,
      name: name || "Sovereign Target",
      phone: phone,
      source: `checkout_${planId}`,
      status: "new",
      notes: `Initiated deployment parameter for: ${planId}`,
    }).returning();

    // 15 seconds after they enter their number, the God-Brain sends a WhatsApp to confirm uplink
    // (In a true prod environment, we'd use a background queue. Next.js Edge allows promises to resolve post-return conditionally if using Vercel functions, but we'll try a fast immediate ping or just save for now)
    
    const introMsgs = {
       "node": "Sovereign Node deployment initialized. Complete your Paystack authorization to bind the hardware.",
       "array": "Sovereign Array deployment initialized. Complete your Paystack authorization to bind the hardware.",
       "cartel": "Cartel License deployment initialized. Complete your Paystack authorization to bind the hardware."
    };
    
    const planKey = (planId as keyof typeof introMsgs) || "node";
    
    // We fire and forget the WhatsApp message so it doesn't block the checkout redirect
    sendWhatsAppMessage(phone, introMsgs[planKey]).catch(e => console.error("[WHATSAPP FAIL]:", e));

    return NextResponse.json({ success: true, leadId: newLead[0].id });
  } catch (error) {
    console.error("[LEAD CAPTURE FAULT]:", error);
    return new NextResponse("Internal System Fault", { status: 500 });
  }
}
