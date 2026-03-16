import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { customSkills } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.query.customSkills.findMany({
      where: eq(customSkills.userEmail, user.primaryEmailAddress.emailAddress),
      orderBy: (skills, { desc }) => [desc(skills.createdAt)]
    });
    return NextResponse.json({ skills: list });
  } catch (err) {
    console.error("GET /api/skills/custom error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, systemPrompt } = await req.json();
    const result = await db.insert(customSkills).values({
      userEmail: user.primaryEmailAddress.emailAddress,
      name,
      description,
      systemPrompt,
    }).returning();
    return NextResponse.json({ success: true, skill: result[0] });
  } catch (err) {
    console.error("POST /api/skills/custom error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.delete(customSkills).where(
      and(
        eq(customSkills.id, id),
        eq(customSkills.userEmail, user.primaryEmailAddress.emailAddress)
      )
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/skills/custom error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
