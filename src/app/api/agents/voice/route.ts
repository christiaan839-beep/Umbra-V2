import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/db";
import { voiceCalls } from "@/db/schema";

/**
 * UMBRA Voice API (V3 NVIDIA NIM Pipeline)
 * 
 * This endpoint will orchestrate the connection between the Next.js frontend
 * and the external NVIDIA NIM / Pipecat Voice container.
 */
export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;

  try {
    const { action, phone, context } = await req.json();

    if (action === "dispatch_caller") {
      // In the final V3 architecture, this will send a WebSocket payload or 
      // REST trigger to the local GPU-backed NemoClaw/Pipecat Docker container.
      
      console.log(`[UMBRA VOICE] Dispatching Pipecat Agent to call: ${phone}`);
      
      // Log traceability to Private DB
      const result = await db.insert(voiceCalls).values({
        userEmail: auth.email,
        targetPhone: phone || "Unknown",
        context: context || "",
        status: "connecting",
      }).returning();

      // Simulated response for UI testing
      return NextResponse.json({
        success: true,
        callId: result[0].id,
        status: "connecting",
        message: "Siren protocol initiated. Voice agent is dialing."
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[Voice API Error]:", error);
    return NextResponse.json({ error: "Voice dispatch failed" }, { status: 500 });
  }
}
