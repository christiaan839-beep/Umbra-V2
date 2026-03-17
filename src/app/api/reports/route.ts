import { NextResponse } from "next/server";
import { generateReport } from "@/lib/reports";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  const body = await req.json();
  try {
    const html = await generateReport(body);
    return NextResponse.json({ success: true, html });
  } catch (error) {
    console.error("[Reports API]:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
