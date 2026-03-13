import { ai } from "@/lib/ai";
import { recall, remember } from "@/lib/memory";

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  reasoning: string;
  predictedImprovement: string;
  timestamp: string;
}

const history: OptimizationResult[] = [];

/**
 * DSPy-Inspired Prompt Optimizer
 * 
 * Takes any agent prompt, retrieves winning patterns from the God-Brain,
 * and generates a self-optimized version. Based on Stanford's DSPy concept:
 * "Compile declarative LM calls into self-improving pipelines."
 */
export async function optimizePrompt(
  originalPrompt: string,
  objective: string = "Maximize conversion rate and engagement"
): Promise<OptimizationResult> {
  // 1. Pull historical wins from God-Brain
  const pastWins = await recall("successful prompts and ad copy that converted well");
  const winContext = pastWins.length > 0
    ? `\n\nHISTORICAL WINS (use these patterns):\n${pastWins.map(w => `- ${w.entry.text}`).join("\n")}`
    : "";

  // 2. Meta-optimize the prompt
  const metaPrompt = `You are a world-class prompt engineer. Rewrite this prompt to be dramatically more effective.

OBJECTIVE: ${objective}

ORIGINAL PROMPT:
---
${originalPrompt}
---
${winContext}

OPTIMIZATION RULES:
1. Add psychological triggers (loss aversion, social proof, authority bias)
2. Include explicit output format instructions
3. Add chain-of-thought reasoning steps
4. Include few-shot examples from past wins if available
5. Replace vague language with concrete metrics
6. Add guardrails to prevent hallucination

Return JSON:
{
  "optimizedPrompt": "the fully rewritten prompt",
  "reasoning": "2-sentence explanation of changes and why",
  "predictedImprovement": "estimated improvement (e.g. '+35% conversion potential')"
}`;

  try {
    const text = await ai(metaPrompt, {
      system: "You are a senior AI prompt engineer. Always return valid JSON.",
      taskType: "analysis",
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in optimizer response");

    const parsed = JSON.parse(jsonMatch[0]);

    const result: OptimizationResult = {
      originalPrompt,
      optimizedPrompt: parsed.optimizedPrompt || originalPrompt,
      reasoning: parsed.reasoning || "Optimization applied.",
      predictedImprovement: parsed.predictedImprovement || "+15%",
      timestamp: new Date().toISOString(),
    };

    history.push(result);

    // Store optimized prompt in God-Brain for future reference
    await remember(`OPTIMIZED PROMPT (${result.predictedImprovement}): ${result.optimizedPrompt}`);

    return result;
  } catch (error) {
    console.error("[DSPy Optimizer] Failed:", error);
    return {
      originalPrompt,
      optimizedPrompt: originalPrompt,
      reasoning: "Optimization failed. Using original prompt.",
      predictedImprovement: "+0%",
      timestamp: new Date().toISOString(),
    };
  }
}

export function getOptimizationHistory(): OptimizationResult[] {
  return [...history].reverse();
}
