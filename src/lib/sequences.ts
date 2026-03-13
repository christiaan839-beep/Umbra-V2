import { ai } from "@/lib/ai";

export interface EmailSequence {
  id: string;
  name: string;
  type: "welcome" | "value" | "upsell" | "winback";
  emails: Email[];
  createdAt: string;
}

export interface Email {
  subject: string;
  body: string;
  delay: string;
  goal: string;
}

const SEQUENCE_TEMPLATES = {
  welcome: { name: "Welcome Sequence", prompt: "Create a 5-email welcome/onboarding sequence", goal: "Build trust and deliver immediate value" },
  value: { name: "Value Delivery", prompt: "Create a 5-email value delivery sequence with tips and insights", goal: "Establish authority and create desire" },
  upsell: { name: "Upsell Sequence", prompt: "Create a 5-email upsell sequence that introduces a premium offer", goal: "Convert free/low-tier users to high-ticket" },
  winback: { name: "Win-Back Sequence", prompt: "Create a 5-email win-back sequence for inactive users", goal: "Re-engage churned or inactive subscribers" },
};

export function getTemplates() {
  return Object.entries(SEQUENCE_TEMPLATES).map(([id, t]) => ({ id, ...t }));
}

export async function generateSequence(type: keyof typeof SEQUENCE_TEMPLATES, product: string, audience: string): Promise<EmailSequence> {
  const template = SEQUENCE_TEMPLATES[type];

  const output = await ai(
    `${template.prompt} for a product: "${product}" targeting: "${audience}".

For each email return:
- Subject line (compelling, high open-rate)
- Body (200-300 words, conversational, includes CTA)
- Delay from previous email (e.g. "Immediately", "2 days", "4 days")
- Goal of this specific email

Format each email clearly with headers: EMAIL 1, EMAIL 2, etc.
Include Subject:, Body:, Delay:, Goal: labels.`,
    {
      system: `You are an elite email copywriter specializing in automated drip sequences. Write emails that feel personal, build trust progressively, and drive action. Goal: ${template.goal}. Use proven frameworks: storytelling, social proof, urgency, and value-first selling.`,
    }
  );

  // Parse into structured format
  const emails: Email[] = [];
  const emailBlocks = output.split(/EMAIL \d+/i).filter(b => b.trim());
  
  for (const block of emailBlocks) {
    const subjectMatch = block.match(/Subject:\s*(.+)/i);
    const delayMatch = block.match(/Delay:\s*(.+)/i);
    const goalMatch = block.match(/Goal:\s*(.+)/i);
    const bodyMatch = block.match(/Body:\s*([\s\S]*?)(?=Delay:|Goal:|EMAIL|\s*$)/i);
    
    emails.push({
      subject: subjectMatch?.[1]?.trim() || "Email",
      body: bodyMatch?.[1]?.trim() || block.trim(),
      delay: delayMatch?.[1]?.trim() || "2 days",
      goal: goalMatch?.[1]?.trim() || template.goal,
    });
  }

  return {
    id: `seq_${Date.now()}`,
    name: `${template.name} — ${product}`,
    type,
    emails: emails.length > 0 ? emails.slice(0, 5) : [{ subject: "Welcome", body: output, delay: "Immediately", goal: template.goal }],
    createdAt: new Date().toISOString(),
  };
}
