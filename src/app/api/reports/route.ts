import { NextResponse } from "next/server";
import { generateReport } from "@/lib/reports";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const html = await generateReport(body);
    return NextResponse.json({ success: true, html });
  } catch (error) {
    console.error("[Reports API]:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
