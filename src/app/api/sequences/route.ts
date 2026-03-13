import { NextResponse } from "next/server";
import { getTemplates, generateSequence } from "@/lib/sequences";

export async function GET() {
  return NextResponse.json({ success: true, templates: getTemplates() });
}

export async function POST(req: Request) {
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
