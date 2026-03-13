import { ai } from "@/lib/ai";

export interface SkillVariant {
  id: string;
  prompt: string;
  usageCount: number;
  successes: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  agent: string;
  status: "testing" | "optimized";
  variants: SkillVariant[];
  winningVariantId: string | null;
  createdAt: string;
  updatedAt: string;
}

const SKILL_STORE = new Map<string, Skill>();

// Seed demo data
[
  {
    id: "skill_ads_copy", name: "Ad Copywriting", description: "Generates Facebook ad copy", agent: "ads", status: "testing" as const,
    variants: [
      { id: "A", prompt: "You are an aggressive direct response copywriter. Use urgency, emojis, and short sentences.", usageCount: 145, successes: 12 },
      { id: "B", prompt: "You are a consultative, educational copywriter. Focus on value, long-form storytelling, and trust.", usageCount: 142, successes: 28 },
    ],
    winningVariantId: null, createdAt: new Date(Date.now() - 7 * 864e5).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "skill_social_hook", name: "Twitter Thread Hook", description: "Writes the first tweet of a viral thread", agent: "social", status: "optimized" as const,
    variants: [
      { id: "A", prompt: "Write a controversial hot take to start the thread.", usageCount: 500, successes: 150 },
      { id: "B", prompt: "Start with a hard statistic or unexpected fact.", usageCount: 500, successes: 340 },
    ],
    winningVariantId: "B", createdAt: new Date(Date.now() - 30 * 864e5).toISOString(), updatedAt: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
].forEach(s => SKILL_STORE.set(s.id, s));

export function getSkills(): Skill[] {
  return Array.from(SKILL_STORE.values());
}

/** A/B split — returns the prompt variant to use right now */
export function getPromptForSkill(skillId: string): { variantId: string; prompt: string } {
  const skill = SKILL_STORE.get(skillId);
  if (!skill) return { variantId: "default", prompt: "You are a helpful AI assistant." };

  // If optimized, use the winner
  if (skill.status === "optimized" && skill.winningVariantId) {
    const winner = skill.variants.find(v => v.id === skill.winningVariantId);
    if (winner) { winner.usageCount++; return { variantId: winner.id, prompt: winner.prompt }; }
  }

  // 50/50 split (multi-armed bandit in production)
  const idx = Math.random() < 0.5 ? 0 : 1;
  skill.variants[idx].usageCount++;
  return { variantId: skill.variants[idx].id, prompt: skill.variants[idx].prompt };
}

/** Track a success event for a variant */
export function logSkillSuccess(skillId: string, variantId: string): boolean {
  const skill = SKILL_STORE.get(skillId);
  if (!skill) return false;

  const variant = skill.variants.find(v => v.id === variantId);
  if (!variant) return false;

  variant.successes++;

  // Auto-optimize: if both variants have 100+ uses and >5% difference, lock winner
  if (skill.status === "testing") {
    const [a, b] = skill.variants;
    if (a.usageCount > 100 && b.usageCount > 100) {
      const rateA = a.successes / a.usageCount;
      const rateB = b.successes / b.usageCount;
      if (Math.abs(rateA - rateB) > 0.05) {
        skill.status = "optimized";
        skill.winningVariantId = rateA > rateB ? "A" : "B";
        skill.updatedAt = new Date().toISOString();
      }
    }
  }

  return true;
}

/** AI-generate a Variant B from a Variant A prompt */
export async function autoGenerateVariant(variantAPrompt: string): Promise<string> {
  return ai(
    `I am A/B testing a system prompt for an AI marketing agent.
Variant A is: "${variantAPrompt}"

Write a Variant B system prompt that takes a completely different psychological angle or structural approach to achieve the same goal.
Return ONLY the prompt string, nothing else.`,
    { taskType: "code" }
  );
}
