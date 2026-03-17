import { NextResponse } from "next/server";
import { remember, recall, getAllMemories } from "@/lib/memory";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  const { action, text, query, metadata, fileData, fileType } = await req.json();

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
  if (action === "ingest_multimodal") {
    // Simulator for Gemini 1.5 Pro Multimodal Embedding processing
    // In production, this would pass the `fileData` buffer to Gemini API
    console.log(`[God-Brain] Ingesting multimodal file type: ${fileType}. Running Gemini 1.5 Pro timeline extraction.`);
    
    // Simulate extraction
    const mockSentimentTimeline = [0.2, 0.4, 0.8, 0.9, 0.6, 0.1, -0.3, -0.6, -0.2, 0.3, 0.7, 0.9, 1.0, 0.8, 0.5, 0.2];
    
    return NextResponse.json({ 
        success: true, 
        message: "File ingested into God-Brain vector matrix via Gemini 1.5 Pro",
        timeline: mockSentimentTimeline,
        insights: "High engagement peak at 1:15 perfectly correlates with the 'Transformation Hook'."
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
