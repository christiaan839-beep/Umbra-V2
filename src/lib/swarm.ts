import { ai } from "./ai";
import { pushSwarmEvent } from "./events";
import type { AIModel } from "@/types";

export interface SwarmOptions {
  goal: string;
  creatorSystem: string;
  criticSystem?: string;
  maxRounds?: number;
  model?: AIModel;
}

/**
 * True Multi-Agent Swarm Orchestration
 * Uses BYOK keys via ai.ts to run a Creator/Critic loop.
 */
export async function runSwarm(options: SwarmOptions): Promise<{ finalOutput: string, rounds: number }> {
  const { goal, creatorSystem, criticSystem, maxRounds = 2, model = "gemini" } = options;

  // 1. Initial Generation (Creator)
  pushSwarmEvent("Swarm Orchestrator", `Dispatching objective to Creator node [${model}]`, "info");
  let currentOutput = await ai(goal, { system: creatorSystem, model, maxTokens: 4000 });
  let rounds = 1;

  // 2. Iteration Loop (Critic -> Creator)
  if (criticSystem && maxRounds > 1) {
    while (rounds < maxRounds) {
      // Critic reviews the output
      pushSwarmEvent("Morpheus Critic", `Auditing draft against anti-slop directives (Round ${rounds})`, "warn");
      const critiquePrompt = `REVIEW THIS DRAFT AGAINST YOUR SYSTEM DIRECTIVES:\n\n${currentOutput}\n\nProvide specific, actionable feedback to improve this. If it is already perfect, reply with exactly "FINAL_APPROVED".`;
      const critique = await ai(critiquePrompt, { system: criticSystem, model });

      if (critique.includes("FINAL_APPROVED")) {
        pushSwarmEvent("Morpheus Critic", `Draft approved. Guardrails verified.`, "success");
        break;
      }

      // Creator revises based on critique
      pushSwarmEvent("Creator Node", `Refining draft based on Morpheus critique.`, "info");
      const revisionPrompt = `REVISE THIS DRAFT BASED ON THE CRITIQUE.\n\nCRITIQUE:\n${critique}\n\nDRAFT:\n${currentOutput}\n\nReturn ONLY the fully revised content.`;
      currentOutput = await ai(revisionPrompt, { system: creatorSystem, model, maxTokens: 4000 });
      rounds++;
    }
  }

  pushSwarmEvent("Swarm Orchestrator", `Final synthesis complete in ${rounds} rounds.`, "success");
  return { finalOutput: currentOutput, rounds };
}

export async function adSwarm(prompt: string, tone: string): Promise<{ finalOutput: string, rounds: number }> {
  return runSwarm({
    goal: `Write high-converting ad copy for: ${prompt}. Tone: ${tone}. Layout: Primary Text, Headline, Description.`,
    creatorSystem: "You are a top 1% direct response copywriter.",
    criticSystem: "You are an ad buyer. Critique for click-through rate, curiosity, and offer clarity. If it's perfect, output FINAL_APPROVED.",
    maxRounds: 2
  });
}
