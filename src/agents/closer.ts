import { ai } from "@/lib/ai";
import { recall } from "@/lib/memory";
import type { AgentResult } from "@/types";

/** High-ticket sales closer with God-Brain context */
export async function generateCloseSequence(
  leadName: string,
  company: string,
  objections: string = ""
): Promise<AgentResult> {
  const memories = await recall(`close deal ${company} sales objection handling`);
  const context = memories.map(m => m.entry.text).join("\n") || "No prior sales data.";

  const output = await ai(
    `Generate a 3-step closing sequence for:
LEAD: ${leadName}
COMPANY: ${company}
OBJECTIONS: ${objections || "None specified"}
INTELLIGENCE: ${context}

For each step provide: the channel (email/DM/call), the message, and the psychology principle used.`,
    {
      model: "claude",
      system: "You are an elite high-ticket closer who has sold $50M+ in consulting services. You use subtle psychology, not pressure. Your tone is confident, warm, and direct.",
      maxTokens: 1500,
    }
  );

  return { success: true, agent: "closer", output, timestamp: new Date().toISOString() };
}
