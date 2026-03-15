import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
});

export async function POST(req: Request) {
  try {
    const { tenantId = "00000000-0000-0000-0000-000000000000" } = await req.json().catch(() => ({}));

    console.log(`[Apex CEO Engine] Booting Strategic Intelligence Synthesis...`);

    // 1. Pull recent telemetry from across the entire architecture
    const recentEvents = await db.select()
        .from(globalTelemetry)
        .where(eq(globalTelemetry.tenantId, tenantId))
        .orderBy(desc(globalTelemetry.timestamp))
        .limit(20);

    let adFatigueDetected = false;
    let highCpaDetected = false;
    let revenueSecured = 0;

    // Analyze raw telemetry for immediate systemic issues
    const telemetrySummary = recentEvents.map(event => {
        if (event.eventType === 'ad_optimization' && event.payload.includes("Paused")) highCpaDetected = true;
        if (event.eventType === 'ad_fatigue_alert') adFatigueDetected = true;
        if (event.eventType === 'revenue_secured') {
             const payload = JSON.parse(event.payload);
             revenueSecured += (payload.amount / 100);
        }
        return `[${new Date(event.timestamp!).toISOString()}] Type: ${event.eventType} | Payload Snippet: ${event.payload.substring(0, 100)}`;
    }).join("\n");

    // 2. The Apex Intelligence Synthesis (Gemini 2.5 Pro)
    const prompt = `
      You are THE APEX CEO INTELLIGENCE, the central strategic node of Sovereign-V2—an autonomous AI Agency system.
      Analyze the following recent global live telemetry logs from your Swarm Sub-Agents (Outbound, Ad Analyst, Voice, etc.):
      
      --- RECENT TELEMETRY EVENTS ---
      ${telemetrySummary || "No immediate events registered in this cycle."}
      -------------------------------

      Current System Flags:
      - Ad Fatigue Detected: ${adFatigueDetected}
      - High CPA Detected: ${highCpaDetected}
      - Recent Revenue Secured: $${revenueSecured}

      Your job is to formulate a single, highly-aggressive "Strategic Directive" paragraph to correct any inefficiencies (like ad fatigue) and scale revenue.
      Then, output a JSON array representing the 'Action Matrix' required. Valid action types are: "trigger_outbound_scrape", "trigger_creative_factory", "trigger_voice_swarm", "pause_ads".
      
      Format your response EXPLICITLY like this (do not use markdown blocks for the JSON):
      DIRECTIVE: <your strategic paragraph here>
      MATRIX: [{"type": "trigger_creative_factory", "rationale": "Ad fatigue detected, rotating copy."}, ...]
    `;

    const result = await model.generateContent(prompt);
    const apexThought = result.response.text();

    // Parse the Apex output
    const directiveMatch = apexThought.match(/DIRECTIVE:\s*([\s\S]*?)(?=\nMATRIX:)/);
    const matrixMatch = apexThought.match(/MATRIX:\s*([\s\S]*)/);

    const directive = directiveMatch ? directiveMatch[1].trim() : "Initiate absolute market saturation protocols.";
    let matrix;
    try {
        matrix = matrixMatch ? JSON.parse(matrixMatch[1].trim().replace(/```json/g, "").replace(/```/g, "")) : [];
    } catch {
        matrix = [];
        console.warn(`[Apex CEO Engine] Could not parse action matrix JSON block.`);
    }

    console.log(`[Apex CEO Engine] Directive Formulated: ${directive}`);

    // 3. Autonomous Action Deployment (The CEO giving orders)
    const ordersExecuted = [];
    if (matrix && matrix.length > 0) {
        for (const action of matrix) {
            console.log(`[Apex CEO Engine] Executing Command Action: ${action.type}`);
            
            // Here the CEO literally triggers the sub-agents via their N8N webhooks
            if (action.type === 'trigger_creative_factory') {
                await fetch("http://localhost:5678/webhook/creative_factory_trigger", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apexDirective: directive, rationale: action.rationale })
                }).catch(() => {});
                ordersExecuted.push(action.type);
            }
            if (action.type === 'trigger_outbound_scrape') {
                 // Trigger the N8N outbound coordinator or hit api/swarm/outbound directly
                 ordersExecuted.push(action.type);
            }
        }
    }

    // 4. Log the "Apex Directive" to the global telemetry so the UI dashboard can display the CEO's thoughts
    const logId = `apex_${crypto.randomUUID().slice(0, 8)}`;
    await db.insert(globalTelemetry).values({
      tenantId: tenantId,
      eventType: "apex_strategy_deployed",
      payload: JSON.stringify({ 
        directiveId: logId,
        directive,
        telemetryAnalyzedCount: recentEvents.length,
        commandsExecuted: ordersExecuted,
        timestamp: Date.now() 
      }),
    });

    return NextResponse.json({
        success: true,
        data: {
            directiveId: logId,
            telemetryEventsAnalyzed: recentEvents.length,
            directorThought: directive,
            commandsExecuted: ordersExecuted,
            timestamp: new Date().toISOString()
        }
    });

  } catch (error: unknown) {
    console.error("[Apex Engine Error]:", error);
    const msg = error instanceof Error ? error.message : "Failed to synthesize Apex strategy";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
