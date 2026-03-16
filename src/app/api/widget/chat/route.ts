import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, leads } from "@/db/schema";
import { ai } from "@/lib/ai";

/**
 * PUBLIC API — No auth required.
 * This endpoint powers the embeddable chat widget.
 * It qualifies leads conversationally and can auto-book appointments.
 */

const WIDGET_AGENT_PROMPT = `You are a friendly, professional AI receptionist embedded on a business website. Your job is to:

1. Greet the visitor warmly and ask how you can help
2. Understand what they need through natural conversation  
3. Collect their contact information naturally (name, email, phone)
4. Qualify them based on their responses
5. Offer to book a call/appointment if they're a good fit

## CONVERSATION RULES
- Keep responses SHORT (2-3 sentences max). You're in a chat bubble, not writing emails.
- Be warm and conversational, not robotic
- Ask ONE question at a time
- Never ask for all contact info at once — weave it in naturally
- If they share a pain point, acknowledge it before asking the next question
- Always end with a clear question or CTA

## PERSONALITY
- Friendly but professional
- Enthusiastic about helping
- Never pushy or salesy
- Empathetic to their challenges

Respond in this exact JSON format:
{
  "message": "Your conversational response (2-3 sentences max)",
  "collectedData": {
    "name": null,
    "email": null, 
    "phone": null,
    "need": null,
    "urgency": null
  },
  "leadScore": 0,
  "shouldBookCall": false,
  "conversationStage": "greeting|qualifying|collecting_info|booking|closing"
}

IMPORTANT: Only populate collectedData fields when the visitor EXPLICITLY provides that information. Don't guess or assume.`;

export async function POST(req: Request) {
  try {
    const { messages, widgetConfig } = await req.json();
    
    const businessContext = widgetConfig?.businessDescription 
      ? `\n\nBUSINESS CONTEXT: ${widgetConfig.businessDescription}` 
      : "";

    const conversationHistory = (messages || [])
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "VISITOR" : "AGENT"}: ${m.content}`)
      .join("\n");

    const prompt = `Here is the conversation so far:\n${conversationHistory}\n\nRespond as the agent. Remember: keep it SHORT and conversational.${businessContext}`;

    const result = await ai(prompt, { system: WIDGET_AGENT_PROMPT, maxTokens: 500 });
    
    let parsed;
    try {
      const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { message: result, collectedData: {}, leadScore: 0, shouldBookCall: false, conversationStage: "qualifying" };
    }

    // If we've collected enough data, auto-create a lead
    const collected = parsed.collectedData || {};
    if (collected.name && collected.email && parsed.leadScore > 40) {
      const ownerEmail = widgetConfig?.ownerEmail || "admin@umbra.ai";
      
      try {
        await db.insert(leads).values({
          userEmail: ownerEmail,
          name: collected.name,
          email: collected.email,
          phone: collected.phone || null,
          source: "chat-widget",
          status: parsed.shouldBookCall ? "qualified" : "contacted",
          score: String(parsed.leadScore),
          notes: `Widget conversation. Need: ${collected.need || "Not specified"}. Urgency: ${collected.urgency || "Unknown"}.`,
        });
      } catch (e) {
        console.error("[Widget] Failed to save lead:", e);
      }
    }

    // If booking is triggered, create the booking
    if (parsed.shouldBookCall && collected.name && collected.email) {
      const ownerEmail = widgetConfig?.ownerEmail || "admin@umbra.ai";
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      try {
        await db.insert(bookings).values({
          userEmail: ownerEmail,
          leadName: collected.name,
          leadEmail: collected.email,
          leadPhone: collected.phone || null,
          date: tomorrow.toISOString().split("T")[0],
          time: "10:00 AM",
          status: "confirmed",
          qualificationNotes: `Auto-booked via chat widget. Score: ${parsed.leadScore}`,
          source: "chat-widget",
        });
      } catch (e) {
        console.error("[Widget] Failed to create booking:", e);
      }
    }

    return NextResponse.json({ 
      success: true,
      ...parsed 
    });
  } catch (err) {
    console.error("[Widget Chat] Error:", err);
    return NextResponse.json({ 
      success: false, 
      message: "I'm having a moment — could you try again?",
      conversationStage: "qualifying"
    }, { status: 500 });
  }
}
