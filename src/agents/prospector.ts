import { ai } from "@/lib/ai";
import { remember } from "@/lib/memory";
import type { AgentResult, Lead } from "@/types";

/** Apollo-style lead prospector that finds and qualifies leads */
export async function prospectLeads(
  industry: string,
  idealClient: string
): Promise<AgentResult & { leads: Lead[] }> {
  const output = await ai(
    `Generate 5 realistic B2B leads for an AI marketing platform.
INDUSTRY: ${industry}
IDEAL CLIENT: ${idealClient}

For each lead return JSON: {"name": string, "company": string, "email": string, "stage": "cold"|"warm"|"hot", "score": 1-100}

Return ONLY a JSON array. No explanation.`,
    {
      model: "gemini",
      system: "You are a B2B lead generation expert. Generate realistic but fictional lead data for prospecting.",
      maxTokens: 1000,
    }
  );

  let leads: Lead[] = [];
  try {
    const match = output.match(/\[[\s\S]*\]/);
    leads = JSON.parse(match ? match[0] : output);
  } catch {
    leads = [];
  }

  // Store hot leads in memory for other agents
  for (const lead of leads) {
    if (lead.stage === "hot") {
      await remember(`Hot lead: ${lead.name} at ${lead.company} (${industry})`, { type: "lead", stage: "hot" });
    }
  }

  return { success: true, agent: "prospector", output, leads, timestamp: new Date().toISOString() };
}
