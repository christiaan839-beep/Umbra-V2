import { NextResponse } from "next/server";
import { remember, recall, getAllMemories } from "@/lib/memory";

export async function POST(req: Request) {
  const { action, text, query, metadata } = await req.json();

  if (action === "remember") {
    const entry = await remember(text, metadata || {});
    return NextResponse.json({ success: true, entry });
  }
  if (action === "recall") {
    const results = await recall(query);
    return NextResponse.json({ success: true, results });
  }
  if (action === "list") {
    return NextResponse.json({ success: true, memories: getAllMemories() });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
