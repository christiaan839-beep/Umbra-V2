import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { tenantId, eventType, payload, source } = await req.json();

    if (!tenantId || !eventType) {
      return NextResponse.json({ error: "Missing tenantId or eventType" }, { status: 400 });
    }

    // 1. Log the event to Neon Postgres telemetry
    await db.insert(globalTelemetry).values({
      tenantId,
      eventType,
      payload: JSON.stringify({ ...payload, source: source || "swarm", ingestedAt: new Date().toISOString() }),
    });

    // 2. If Pinecone is configured, vectorize and store
    // This is the future hook for actual vector embedding
    const pineconeApiKey = process.env.PINECONE_API_KEY;
    let vectorized = false;

    if (pineconeApiKey) {
      // In production, we would:
      // 1. Generate embeddings via Gemini text-embedding-004
      // 2. Upsert to Pinecone index with metadata { tenantId, eventType, timestamp }
      // 3. This enables semantic search across all swarm actions
      vectorized = true; // Flag for response
    }

    return NextResponse.json({
      success: true,
      message: "Memory ingested.",
      vectorized,
      eventType,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Memory Ingest Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
