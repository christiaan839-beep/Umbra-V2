import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { customSkills } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ai } from "@/lib/ai";
import { fireUserWebhook } from "@/lib/webhooks";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { skillId, prompt } = await req.json();
    
    const skill = await db.query.customSkills.findFirst({
      where: and(
        eq(customSkills.id, skillId),
        eq(customSkills.userEmail, user.primaryEmailAddress.emailAddress)
      )
    });

    if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

    const resultText = await ai(prompt, { system: skill.systemPrompt });
    
    await fireUserWebhook("CustomSkill", `Executed: ${skill.name}`, { prompt, result: resultText });

    return NextResponse.json({ result: resultText });
  } catch (err) {
    console.error("Execute Custom Skill Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
