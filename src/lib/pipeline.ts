import { ai } from "@/lib/ai";

interface PipelineStep {
  agent: string;
  prompt: string;
  system?: string;
}

interface PipelineStepResult {
  agent: string;
  output: string;
  duration: number;
}

export interface PipelineResult {
  steps: PipelineStepResult[];
  totalDuration: number;
}

export const PIPELINE_TEMPLATES: Record<string, { name: string; description: string; steps: PipelineStep[] }> = {
  "full-campaign": {
    name: "Full Campaign",
    description: "Research → Content → Video brief",
    steps: [
      { agent: "research", prompt: "Analyze the market and identify top opportunities for: {TOPIC}", system: "Provide concise market analysis with 3 key insights and 3 actionable recommendations." },
      { agent: "content", prompt: "Based on this research:\n{PREV_OUTPUT}\n\nCreate 3 viral social media posts that leverage the top opportunity.", system: "Create scroll-stopping social content. Use hooks, emojis, and clear CTAs." },
      { agent: "video", prompt: "Based on this content strategy:\n{PREV_OUTPUT}\n\nCreate a 30-second video brief for the most impactful post.", system: "Create a detailed video production brief with scene-by-scene breakdown." },
    ],
  },
  "lead-nurture": {
    name: "Lead Nurture",
    description: "Research → Email sequence",
    steps: [
      { agent: "research", prompt: "Identify the top pain points and desires of the target audience for: {TOPIC}", system: "Focus on emotional triggers and buying motivations." },
      { agent: "content", prompt: "Based on these pain points:\n{PREV_OUTPUT}\n\nCreate a 5-email nurture sequence. For each email provide: subject line, preview text, and body.", system: "Write emails that build trust, deliver value, and guide toward purchase. Use AIDA framework." },
    ],
  },
  "competitor-intel": {
    name: "Competitor Intel",
    description: "Deep research → Strategic recommendations",
    steps: [
      { agent: "research", prompt: "Conduct a thorough competitive analysis for: {TOPIC}. Identify gaps and opportunities.", system: "Be specific about competitor weaknesses and untapped opportunities." },
      { agent: "content", prompt: "Based on this intelligence:\n{PREV_OUTPUT}\n\nCreate a strategic positioning document. Include: unique value proposition, messaging framework, and 3 content pillars.", system: "Think like a CMO. Create a framework that differentiates from every competitor." },
    ],
  },
};

/** Execute a multi-step agent pipeline */
export async function runPipeline(templateId: string, topic: string): Promise<PipelineResult> {
  const template = PIPELINE_TEMPLATES[templateId];
  if (!template) throw new Error(`Unknown pipeline: ${templateId}`);

  const results: PipelineStepResult[] = [];
  let prevOutput = "";
  const start = Date.now();

  for (const step of template.steps) {
    const stepStart = Date.now();
    const prompt = step.prompt.replace("{TOPIC}", topic).replace("{PREV_OUTPUT}", prevOutput);

    const output = await ai(prompt, {
      system: step.system,
      taskType: step.agent === "content" ? "content" : "analysis",
    });

    prevOutput = output;
    results.push({ agent: step.agent, output, duration: Date.now() - stepStart });
  }

  return { steps: results, totalDuration: Date.now() - start };
}
