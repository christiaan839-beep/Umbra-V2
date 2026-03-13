import { NextResponse } from "next/server";
import { runPipeline, PIPELINE_TEMPLATES } from "@/lib/pipeline";

export async function GET() {
  const templates = Object.entries(PIPELINE_TEMPLATES).map(([id, t]) => ({
    id,
    name: t.name,
    description: t.description,
    steps: t.steps.length,
  }));
  return NextResponse.json({ templates });
}

export async function POST(req: Request) {
  const { templateId, topic } = await req.json();
  if (!templateId || !topic?.trim()) {
    return NextResponse.json({ error: "templateId and topic required" }, { status: 400 });
  }
  try {
    const result = await runPipeline(templateId, topic);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[Pipeline API]:", error);
    return NextResponse.json({ error: "Pipeline execution failed" }, { status: 500 });
  }
}
