import { NextResponse } from "next/server";
import { ai, embed } from "@/lib/ai";
import { index, isPineconeReady } from "@/lib/pinecone";
import { remember } from "@/lib/memory";

/**
 * THE DSPy NIGHTLY OPTIMIZER (Simulated)
 * 
 * This is the brain that improves the brain. 
 * 1. Pulls all RLHF reward signals from the last 24 hours.
 * 2. Uses Gemini to analyze *why* the Commander approved or rejected specific actions.
 * 3. Compiles a new, optimized "V1.1" system prompt.
 * 4. Saves the new prompt back to Pinecone for the agents to use tomorrow.
 */
export async function POST(req: Request) {
  try {
    // Basic API Key protection for cron jobs
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isPineconeReady()) {
      return NextResponse.json({ error: "Pinecone not configured for optimization." }, { status: 500 });
    }

    // 1. Fetch the last 24h of rewards
    // Pinecone query requires a vector. We'll use a dummy vector for this prototype 
    // to fetch recent records from the 'rlhf-rewards' namespace
    const dummyVector = await embed("optimizer query");
    const queryRes = await index!.namespace("rlhf-rewards").query({
      vector: dummyVector,
      topK: 50,
      includeMetadata: true
    });

    const rewards = queryRes.matches.map(m => m.metadata);
    if (rewards.length === 0) {
      return NextResponse.json({ message: "No RLHF data found in the last 24 hours. Optimization skipped." });
    }

    // Prepare data for the Optimizer LLM
    const trainingData = rewards.map((r: any) => `Agent: ${r.agentId} | Output Hash: ${r.outputHash} | Score: ${r.rewardScore} | Context: ${r.context}`).join("\n");

    // 2. DSPy Compilation Simulation
    const prompt = `You are the UMBRA DSPy Optimizer (BootstrapFewShotWithRandomSearch).
Your job is to rewrite the baseline system prompts for UMBRA's agents to make them smarter, based on Reinforcement Learning from Human Feedback (RLHF).

Here is the reward data from the Commander for the last 24 hours:
"""
${trainingData}
"""

Analyze the patterns. What did the Commander approve (+1.0)? What did they reject (-1.0) or ask to revise (-0.5)?
Based on this, write a highly optimized, updated "V1.1" system prompt for the most active agent.

Return ONLY a valid JSON object with:
{
  "target_agent": "The agent you are optimizing",
  "old_version": "v1.0",
  "new_version": "v1.1",
  "insights": "What you learned from the RLHF data (e.g. 'Commander prefers shorter hooks, rejected emojis')",
  "optimized_prompt": "The new, robust system prompt instructing the agent on exactly how to behave to score +1.0 tomorrow."
}`;

    const rawOptimized = await ai(prompt, {
      model: "gemini",
      system: "You are the Intelligence Flywheel. You turn human feedback into mathematical certainty. Output only valid JSON.",
      maxTokens: 1500,
    });

    const parsedOptimized = JSON.parse(rawOptimized.replace(/```json/g, "").replace(/```/g, "").trim());

    // 3. Save the new optimized prompt to Pinecone
    const newPromptId = `prompt_${parsedOptimized.target_agent}_${parsedOptimized.new_version}`;
    const newPromptVector = await embed(parsedOptimized.optimized_prompt);

    await index!.namespace("optimized-prompts").upsert([{
      id: newPromptId,
      values: newPromptVector,
      metadata: {
        agentId: parsedOptimized.target_agent,
        version: parsedOptimized.new_version,
        prompt: parsedOptimized.optimized_prompt,
        insights: parsedOptimized.insights,
        timestamp: new Date().toISOString()
      }
    }] as any);

    // 4. Log the optimization to the God-Brain
    await remember(`INTELLIGENCE FLYWHEEL ACTIVE: Nightly optimizer compiled ${parsedOptimized.target_agent} to ${parsedOptimized.new_version}. Insight: "${parsedOptimized.insights}"`, {
      type: "dspy-optimization",
      optimized_agent: parsedOptimized.target_agent,
      new_version: parsedOptimized.new_version
    });

    return NextResponse.json({
      success: true,
      message: "Nightly Optimization Complete. Intelligence Flywheel spun.",
      optimization_report: parsedOptimized,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("[Optimizer Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to execute optimizer" }, { status: 500 });
  }
}
