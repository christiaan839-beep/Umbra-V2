import { NextResponse } from "next/server";
import { db } from "@/db";
import { scheduledContent } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const url = new URL(req.url);
    const tenantId = url.searchParams.get("tenantId");

    const items = await db
      .select()
      .from(scheduledContent)
      .where(tenantId ? eq(scheduledContent.tenantId, tenantId) : undefined)
      .orderBy(desc(scheduledContent.scheduledAt))
      .limit(50);

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("[Content Schedule GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch scheduled content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const body = await req.json();
    const { topic, caption, platform = "instagram", scheduledAt, imagePrompt, tenantId } = body;

    if (!topic || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields: topic, scheduledAt" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(scheduledContent)
      .values({
        tenantId: tenantId || null,
        topic,
        caption: caption || null,
        platform,
        scheduledAt: new Date(scheduledAt),
        status: "scheduled",
        imagePrompt: imagePrompt || null,
      })
      .returning();

    return NextResponse.json({ success: true, item: inserted });
  } catch (error) {
    console.error("[Content Schedule POST Error]:", error);
    return NextResponse.json({ error: "Failed to schedule content" }, { status: 500 });
  }
}
