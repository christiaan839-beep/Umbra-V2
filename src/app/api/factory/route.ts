import { NextResponse } from "next/server";
import { createAndRunTool } from "@/lib/factory";

export async function POST(req: Request) {
  const { objective } = await req.json();
  if (!objective?.trim()) {
    return NextResponse.json({ error: "Objective required" }, { status: 400 });
  }
  try {
    const result = await createAndRunTool(objective);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[Factory API]:", error);
    return NextResponse.json({ error: "Tool creation failed" }, { status: 500 });
  }
}
