import { ai } from "./ai";
import type { SwarmConfig, SwarmStep, SwarmResult } from "@/types";

/**
 * Swarm Critic Engine
 * 
 * Pits a Creator against a Critic in alternating rounds until
 * the Critic approves or maxRounds is reached.
 */
export async function runSwarm(config: SwarmConfig): Promise<SwarmResult> {
  const { goal, creatorSystem, criticSystem, maxRounds = 3, model = "claude" } = config;
  const steps: SwarmStep[] = [];
  let draft = "";
  let approved = false;
  let rounds = 0;

  while (!approved && rounds < maxRounds) {
    rounds++;

    // Creator writes
    const creatorPrompt = rounds === 1
      ? `Goal: ${goal}\n\nGenerate your first draft.`
      : `Goal: ${goal}\n\nCurrent draft:\n${draft}\n\nCritic feedback:\n${steps[steps.length - 1].output}\n\nRewrite the draft applying all feedback.`;

    draft = await ai(creatorPrompt, { model, system: creatorSystem });
    steps.push({ agent: "Creator", output: draft, timestamp: new Date().toISOString() });

    // Critic evaluates
    const criticPrompt = `Goal: ${goal}\n\nDraft to review:\n${draft}`;
    const criticSystemFull = `${criticSystem}\n\nRespond with ONLY valid JSON:\n{"approved": boolean, "feedback": "your critique", "score": 1-10}`;
    const criticRaw = await ai(criticPrompt, { model, system: criticSystemFull });

    try {
      const match = criticRaw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : criticRaw);
      steps.push({
        agent: "Critic",
        output: parsed.feedback,
        score: parsed.score,
        approved: parsed.approved,
        timestamp: new Date().toISOString(),
      });
      if (parsed.approved || parsed.score >= 9) approved = true;
    } catch {
      steps.push({ agent: "Critic", output: criticRaw, timestamp: new Date().toISOString() });
    }
  }

  return { finalOutput: draft, steps, approved, rounds };
}

/** Preset: Ad Copy Swarm */
export async function adSwarm(product: string, angle: string): Promise<SwarmResult> {
  return runSwarm({
    goal: `Write a 150-word ad for: ${product}.\nAngle: ${angle}`,
    creatorSystem: "You are an elite direct response copywriter. Write punchy, high-converting copy with emotional hooks and clear CTAs.",
    criticSystem: "You are a marketing psychology critic. Ensure the copy grabs attention, handles objections, and doesn't sound scammy. Be ruthless.",
  });
}
