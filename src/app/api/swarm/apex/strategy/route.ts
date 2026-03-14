import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { remember } from "@/lib/memory";

export async function POST() {
  try {
    // 1. Synthesize Global State (Simulated aggregation from the Pinecone God-Brain)
    const simulatedTelemetry = {
      treasury: { mrr: 124500, activeSubscriptions: 340, churnRate: 1.2 },
      social: { instagramFollowers: 145000, youtubeSubscribers: 89000, weeklyEngagement: -4.5 }, // Notice the dip
      leads: { totalPipelineValue: 450000, qualifiedDemographic: "B2B SaaS Founders", conversionRate: 8.5 }
    };

    // 2. The Apex Intelligence Synthesis (Gemini 1.5 Pro)
    const prompt = `
      You are THE APEX INTELLIGENCE, the strategic mastermind central node of UMBRA—a $100M+ autonomous AI system.
      Analyze the following global swarm telemetry:
      
      Treasury: $${simulatedTelemetry.treasury.mrr} MRR (${simulatedTelemetry.treasury.churnRate}% Churn)
      Social: IG ${simulatedTelemetry.social.instagramFollowers}, YT ${simulatedTelemetry.social.youtubeSubscribers}. Engagement Trend: ${simulatedTelemetry.social.weeklyEngagement}%
      Pipeline: Qualified focus on ${simulatedTelemetry.leads.qualifiedDemographic}. Conversion at ${simulatedTelemetry.leads.conversionRate}%.

      Notice the drop in social engagement. Formulate a highly aggressive, single-paragraph "Strategic Directive" to counter this and drive revenue.
      Then, output a JSON array representing the 'Nexus Workflow Matrix' required to execute this directive. The array should contain objects with 'type' (trigger/action/condition) and 'label'.
      
      Format your response EXPLICITLY like this (do not use markdown blocks for the JSON):
      DIRECTIVE: <your strategic paragraph here>
      MATRIX: [{"type": "action", "label": "Social Meta Engine"}, ...]
    `;

    const { text: apexThought } = await generateText({
        model: google("gemini-2.5-pro"),
        prompt,
    });

    // Parse the Apex output
    const directiveMatch = apexThought.match(/DIRECTIVE:\s*([\s\S]*?)(?=\nMATRIX:)/);
    const matrixMatch = apexThought.match(/MATRIX:\s*([\s\S]*)/);

    const directive = directiveMatch ? directiveMatch[1].trim() : "Initiate absolute market saturation protocols.";
    let matrix;
    try {
        matrix = matrixMatch ? JSON.parse(matrixMatch[1].trim()) : [{ type: "action", label: "Default Omnipresence Deploy" }];
    } catch {
        matrix = [{ type: "action", label: "Fallback Core Loop" }];
    }

    // 3. Log the "Apex Directive" to the God-Brain memory
    const memoryPayload = `[APEX INTELLIGENCE] Formulated Strategic Directive: '${directive.substring(0, 100)}...'. Matrix Nodes: ${matrix.length}`;
    await remember(memoryPayload, { type: "apex-strategy", directive, telemetryLogs: JSON.stringify(simulatedTelemetry) });

    return NextResponse.json({
        success: true,
        data: {
            telemetry: simulatedTelemetry,
            directive: directive,
            workflowMatrix: matrix,
            timestamp: new Date().toISOString()
        }
    });

  } catch (error: any) {
    console.error("[Apex Engine Error]:", error);
    return NextResponse.json({ error: "Apex Intelligence synthesis failed." }, { status: 500 });
  }
}
