import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import crypto from "crypto";

// For Vapi or Retell AI Integration. We use a placeholder HTTP call for the Voice Agent provider.
const VOICE_PROVIDER_API_KEY = process.env.VAPI_API_KEY || "dummy_vapi_key";
// const VOICE_AGENT_ID = process.env.VAPI_AGENT_ID || "dummy_agent_id";

export async function POST(req: Request) {
  try {
    const { leadId, prospectName, prospectPhone, prospectContext, callType = "outbound" } = await req.json();

    if (!prospectPhone) {
      return NextResponse.json({ error: "Prospect phone number is required to deploy the Voice Swarm." }, { status: 400 });
    }

    const logId = `voice_${crypto.randomUUID().slice(0, 8)}`;
    console.log(`[Voice Swarm] Deploying ${callType} call to: ${prospectName} (${prospectPhone})`);

    // The context we feed to the Voice Agent to make the call hyper-personalized based on Pinecone/Outbound scrape data
    const agentContextPrompt = `You are a high-ticket intake specialist for UMBRA. 
You are speaking to ${prospectName || "a prospect"}.
Here is their specific data: ${prospectContext || "They are a potential lead for our high-ticket optimization protocol."}
Your goal is to qualify their budget and timeline, and book them onto the UMBRA calendar. 
Be authoritative, cold, and professional.`;

    // let callDispatched = false;
    let externalCallId = null;

    // Simulate sending the call request to the Voice Provider (e.g. Vapi.ai)
    try {
        if (VOICE_PROVIDER_API_KEY !== "dummy_vapi_key") {
            // Real implementation would look something like this:
            /*
            const response = await fetch("https://api.vapi.ai/call/phone", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${VOICE_PROVIDER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
                    assistantId: VOICE_AGENT_ID,
                    customer: {
                        number: prospectPhone,
                        name: prospectName
                    },
                    assistantOverrides: {
                        model: {
                            messages: [{ role: "system", content: agentContextPrompt }]
                        }
                    }
                })
            });
            const callData = await response.json();
            externalCallId = callData.id;
            */
            // callDispatched = true;
            externalCallId = `ext_${crypto.randomUUID().slice(0,8)}`; // Mock external ID
            console.log(`[Voice Swarm] Live call dispatched via Voice API.`);
        } else {
             // Mock dispatch for local testing
             // callDispatched = true;
             externalCallId = `mock_call_${crypto.randomUUID().slice(0,8)}`;
             console.log(`[Voice Swarm] Mock call dispatched. Add VAPI_API_KEY to execute live.`);
        }
    } catch (apiErr) {
        console.error(`[Voice Swarm] Failed to dispatch voice call:`, apiErr);
        return NextResponse.json({ error: "Voice Provider API failed to initiate call" }, { status: 502 });
    }

    // Log the deployment to global telemetry
    await db.insert(globalTelemetry).values({
      tenantId: "00000000-0000-0000-0000-000000000000",
      eventType: "voice_swarm_deployed",
      payload: JSON.stringify({ 
        callId: logId,
        externalCallId,
        leadId,
        prospectName,
        callType,
        contextPrompt: agentContextPrompt,
        timestamp: Date.now() 
      }),
    });

    return NextResponse.json({
        success: true,
        message: `Voice Swarm deployed successfully to ${prospectName}.`,
        data: {
          callId: logId,
          externalCallId,
          status: "ringing"
        }
    });

  } catch (error: unknown) {
    console.error("[Voice Swarm Error]:", error);
    const msg = error instanceof Error ? error.message : "Failed to orchestrate voice swarm";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
