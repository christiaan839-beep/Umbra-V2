import { NextResponse } from "next/server";
import { getSkills, getPromptForSkill, logSkillSuccess, autoGenerateVariant } from "@/lib/skills";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  return NextResponse.json({ skills: getSkills() });
}

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  const { action, skillId, variantId, prompt } = await req.json();
  try {
    switch (action) {
      case "get-prompt":
        return NextResponse.json({ success: true, ...getPromptForSkill(skillId) });
      case "log-success":
        return NextResponse.json({ success: logSkillSuccess(skillId, variantId) });
      case "generate-variant":
        const newPrompt = await autoGenerateVariant(prompt);
        return NextResponse.json({ success: true, prompt: newPrompt });
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("[Skills API]:", error);
    return NextResponse.json({ error: "Skills operation failed" }, { status: 500 });
  }
}
