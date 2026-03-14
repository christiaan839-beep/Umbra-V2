import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const INDEX_NAME = process.env.PINECONE_INDEX || "umbra-memory";

/**
 * AI Memory Learning Loop
 * 
 * Stores deal outcomes, client interactions, and campaign results
 * in Pinecone with rich metadata. The Closer Agent and Social Media
 * Agent reference these memories to improve future performance.
 * 
 * POST: Store a new learning (win/loss/insight)
 * GET: Retrieve relevant learnings for a given context
 */
export async function POST(req: Request) {
  try {
    const { type, outcome, context, clientId, metadata } = await req.json();

    if (!type || !context) {
      return NextResponse.json({ error: "Missing type or context" }, { status: 400 });
    }

    // Generate an embedding for this learning
    const embeddingRes = await fetch("https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
      },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text: `${type}: ${context}. Outcome: ${outcome || "pending"}` }] },
      }),
    });
    const embeddingData = await embeddingRes.json();
    const vector = embeddingData.embedding?.values;

    if (!vector) {
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
    }

    // Store in Pinecone with rich metadata
    const index = pinecone.Index(INDEX_NAME);
    const id = `learn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // @ts-expect-error Pinecone SDK version compatibility
    await index.upsert([{
      id,
      values: vector,
      metadata: {
        type,              // "deal_won", "deal_lost", "campaign_insight", "client_feedback"
        outcome: outcome || "pending",
        context,
        clientId: clientId || "system",
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    }]);

    return NextResponse.json({
      success: true,
      id,
      message: `Learning stored: ${type} — ${outcome || "recorded"}`,
    });
  } catch (error) {
    console.error("[Memory Learn Error]:", error);
    return NextResponse.json({ error: "Failed to store learning" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const type = url.searchParams.get("type");
    const limit = parseInt(url.searchParams.get("limit") || "5");

    if (!query) {
      return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    // Generate embedding for the query
    const embeddingRes = await fetch("https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
      },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text: query }] },
      }),
    });
    const embeddingData = await embeddingRes.json();
    const vector = embeddingData.embedding?.values;

    if (!vector) {
      return NextResponse.json({ error: "Failed to generate query embedding" }, { status: 500 });
    }

    const index = pinecone.Index(INDEX_NAME);

    const filter = type ? { type: { $eq: type } } : undefined;

    const results = await index.query({
      vector,
      topK: limit,
      includeMetadata: true,
      filter,
    });

    const learnings = (results.matches || []).map(m => ({
      id: m.id,
      score: m.score,
      ...m.metadata,
    }));

    return NextResponse.json({ success: true, learnings });
  } catch (error) {
    console.error("[Memory Learn Query Error]:", error);
    return NextResponse.json({ error: "Failed to query learnings" }, { status: 500 });
  }
}
