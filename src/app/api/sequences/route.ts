import { NextResponse } from "next/server";
import { getTemplates, generateSequence } from "@/lib/sequences";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  return NextResponse.json({ success: true, templates: getTemplates() });
}

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const { type, product, audience } = await req.json();
    if (!type || !product) return NextResponse.json({ error: "Type and product required" }, { status: 400 });
    const sequence = await generateSequence(type, product, audience || "general audience");
    return NextResponse.json({ success: true, sequence });
  } catch (error) {
    console.error("[Sequences API]:", error);
    return NextResponse.json({ error: "Sequence generation failed" }, { status: 500 });
  }
}
