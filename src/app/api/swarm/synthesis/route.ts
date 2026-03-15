import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini (using Google AI Ultra capability for data synthesis)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  systemInstruction: "You are the UMBRA Data Synthesis Engine. You intake raw client check-in data (text forms, transcriptions, or descriptions of video assessments) and extract physiological, biometric, and behavioral telemetry. Return ONLY a JSON object: { \"stress_level\": \"high\" | \"medium\" | \"low\", \"key_friction_points\": [\"point1\", \"point2\"], \"recommended_protocol_adjustment\": \"brief adjustment rationale\", \"sentiment_score\": 1-10 }."
});

export async function POST(req: Request) {
  try {
    const { clientId, payloadType, content } = await req.json();

    if (!clientId || !content) {
      return NextResponse.json({ error: "Missing required parameters: clientId or content" }, { status: 400 });
    }

    const logId = `synth_${crypto.randomUUID().slice(0, 8)}`;
    console.log(`[Synthesis Swarm] Initiating data extraction for client: ${clientId}`);

    // Data Ingestion & Synthesis via Gemini 2.5 Pro
    let synthesizedData;
    try {
      const prompt = `Analyze this client check-in data.\nType: ${payloadType}\nContent: ${content}`;
      const result = await model.generateContent(prompt);
      let textResult = result.response.text();
      
      // Strip markdown blocks if present
      textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
      synthesizedData = JSON.parse(textResult);
    } catch (err) {
      console.warn(`[Synthesis Swarm] Failed to qualify synthesis for client ${clientId}:`, err);
      return NextResponse.json({ error: "Failed to synthesize check-in data" }, { status: 500 });
    }

    console.log(`[Synthesis Swarm] Successfully synthesized data for client ${clientId}.`);

    // Telemetry Logging
    // We attempt to find the tenantId based on the clientId string (assuming it maps to the node ID or clerk ID).
    // For this simulation, if we can't do a full DB lookup, we use a default ID.
    const defaultTenantId = "00000000-0000-0000-0000-000000000000";

    await db.insert(globalTelemetry).values({
      tenantId: defaultTenantId,
      eventType: "client_synthesis_checkin",
      payload: JSON.stringify({ 
        synthesisId: logId,
        clientId,
        payloadType,
        telemetry: synthesizedData,
        timestamp: Date.now() 
      }),
    });

    // Optionally: Post to Slack/Telegram webhook or N8N to trigger immediate adjustment sequence
    return NextResponse.json({
        success: true,
        message: `Synthesis complete. Client profile updated.`,
        data: {
          synthesisId: logId,
          telemetry: synthesizedData
        }
    });

  } catch (error: unknown) {
    console.error("[Synthesis Swarm Error]:", error);
    const msg = error instanceof Error ? error.message : "Failed to orchestrate data synthesis";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
