import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { remember, getAllMemories } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const { targetAgent } = await req.json();

    if (!targetAgent) {
      return NextResponse.json({ error: "Target Agent identifier required for optimization cycle" }, { status: 400 });
    }

    // 1. Query God-Brain for recent failures assigned to this agent type
    const logs = getAllMemories();
    const failures = logs.filter(log => 
        (log.metadata?.outcome?.includes("Failed") || log.metadata?.outcome?.includes("Rejected") || log.metadata?.outcome?.includes("Dropped")) &&
        (log.text.toLowerCase().includes(targetAgent.toLowerCase()))
    ).slice(0, 5); // Take last 5 failures

    if (failures.length === 0) {
        // Mock a failure if none exist for demonstration
        failures.push({
            id: 'mock_fail_1',
            text: `[${targetAgent.toUpperCase()}] Attempted execution resulted in sub-optimal conversion. Prospect stated approach was 'too aggressive'.`,
            embedding: [],
            timestamp: new Date().toISOString(),
            metadata: { type: "system", outcome: "Failed Conversion" }
        });
    }

    const failureContext = failures.map(f => f.text).join("\n");

    // 2. Synthesize New System Prompt (The Meta-Cognition Core)
    const prompt = `
      You are UMBRA, a $100M+ autonomous AI system. You are acting as the Meta-Cognition CEO.
      Your task is to review the following failure telemetry from one of your sub-agents: ${targetAgent}.
      
      --- FAILURE LOGS ---
      ${failureContext}
      --- END LOGS ---

      Based on these failures, rewrite the system prompt (Core Instructions) for the ${targetAgent} agent to ensure these errors never happen again. 
      Make the new prompt highly aggressive, highly authoritative, but strictly addressing the flaws found in the logs.
      
      Format your response exactly like this:
      [CRITICAL FLAW IDENTIFIED]: (1 sentence summarizing the core weakness)
      [NEW PROMPT MATRIX]: (The actual paragraph of new instructions for the agent)
    `;

    const { text: optimizationResult } = await generateText({
        model: google("gemini-1.5-pro"),
        prompt,
    });

    // 3. Log the Evolution to the God-Brain memory
    const memoryPayload = `[META-COGNITION] Executed RLHF Optimization Cycle on ${targetAgent}. Resolution: ${optimizationResult}`;
    await remember(memoryPayload, { type: "evolution-cycle", agent: targetAgent });

    // Parse output for UI
    const flawMatch = optimizationResult.match(/\[CRITICAL FLAW IDENTIFIED\]:\s*(.*)/i);
    const promptMatch = optimizationResult.match(/\[NEW PROMPT MATRIX\]:\s*([\s\S]*)/i);

    return NextResponse.json({
        success: true,
        data: {
            evolutionId: `evo_${Date.now()}`,
            agent: targetAgent,
            criticalFlaw: flawMatch ? flawMatch[1].trim() : "System misalignment detected.",
            newPrompt: promptMatch ? promptMatch[1].trim() : optimizationResult
        }
    });

  } catch (error: any) {
    console.error("[Meta-Cognition Optimizer Error]:", error);
    return NextResponse.json({ error: "Failed to establish RLHF optimizer uplink" }, { status: 500 });
  }
}
