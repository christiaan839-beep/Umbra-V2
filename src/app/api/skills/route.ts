import { NextResponse } from "next/server";
import { getSkills, getPromptForSkill, logSkillSuccess, autoGenerateVariant } from "@/lib/skills";

export async function GET() {
  return NextResponse.json({ skills: getSkills() });
}

export async function POST(req: Request) {
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
