import { nimChat, getNimKey } from "@/lib/nvidia";
import { NextResponse } from "next/server";

/**
 * DOCUMENT INTELLIGENCE API — Full RAG pipeline:
 * 1. Accept text/document content
 * 2. Generate embeddings via NV-Embed
 * 3. Store in Pinecone (if configured)
 * 4. Query with semantic search + reranking
 * 
 * Powers: Omni-Search, Flywheel, and all knowledge retrieval modules.
 */

export async function POST(request: Request) {
  try {
    const { action, text, query, documents } = await request.json();
    }

    // ═══════════════════════════════════════════════
    // ACTION: EMBED — Generate vector embeddings
    // ═══════════════════════════════════════════════
    if (action === "embed") {
      if (!text) {
        return NextResponse.json({ error: "text is required for embedding." }, { status: 400 });
      }

      const embedRes = await fetch("https://integrate.api.nvidia.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getNimKey()}`,
        },
        body: JSON.stringify({
          model: "nvidia/nv-embed-v1",
          input: Array.isArray(text) ? text : [text],
          encoding_format: "float",
        }),
      });

      const embedData = await embedRes.json();

      // Optional: Store in Pinecone
      const pineconeKey = process.env.PINECONE_API_KEY;
      const pineconeIndex = process.env.PINECONE_INDEX;
      let pineconeStored = false;

      if (pineconeKey && pineconeIndex && embedData.data) {
        try {
          const vectors = embedData.data.map((d: { embedding: number[] }, i: number) => ({
            id: `doc-${Date.now()}-${i}`,
            values: d.embedding,
            metadata: { text: Array.isArray(text) ? text[i] : text, timestamp: new Date().toISOString() },
          }));

          await fetch(`https://${pineconeIndex}/vectors/upsert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Api-Key": pineconeKey,
            },
            body: JSON.stringify({ vectors, namespace: "sovereign-docs" }),
          });
          pineconeStored = true;
        } catch (e) {
          console.error("[PINECONE_ERROR]", e);
        }
      }

      return NextResponse.json({
        success: true,
        action: "embed",
        model: "nv-embed-v1",
        dimensions: embedData.data?.[0]?.embedding?.length || 0,
        vectors_generated: embedData.data?.length || 0,
        pinecone_stored: pineconeStored,
      });
    }

    // ═══════════════════════════════════════════════
    // ACTION: RERANK — Score document relevance
    // ═══════════════════════════════════════════════
    if (action === "rerank") {
      if (!query || !documents || !Array.isArray(documents)) {
        return NextResponse.json({ error: "query and documents[] are required." }, { status: 400 });
      }

      const rerankRes = await fetch("https://integrate.api.nvidia.com/v1/ranking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getNimKey()}`,
        },
        body: JSON.stringify({
          model: "nvidia/rerank-qa-mistral-4b",
          query: { text: query },
          passages: documents.map((doc: string) => ({ text: doc })),
        }),
      });

      const rerankData = await rerankRes.json();

      return NextResponse.json({
        success: true,
        action: "rerank",
        model: "rerank-qa-mistral-4b",
        query,
        rankings: rerankData.rankings || [],
        top_result: rerankData.rankings?.[0] || null,
      });
    }

    // ═══════════════════════════════════════════════
    // ACTION: SEARCH — Embed query + Rerank results
    // ═══════════════════════════════════════════════
    if (action === "search") {
      if (!query) {
        return NextResponse.json({ error: "query is required for search." }, { status: 400 });
      }

      // Generate query embedding
      const queryEmbedRes = await fetch("https://integrate.api.nvidia.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await getNimKey()}`,
        },
        body: JSON.stringify({
          model: "nvidia/nv-embed-v1",
          input: [query],
          encoding_format: "float",
        }),
      });

      const queryEmbedData = await queryEmbedRes.json();
      const queryVector = queryEmbedData.data?.[0]?.embedding;

      // Search Pinecone if configured
      const pineconeKey = process.env.PINECONE_API_KEY;
      const pineconeIndex = process.env.PINECONE_INDEX;
      let searchResults: Array<{ text: string; score: number }> = [];

      if (pineconeKey && pineconeIndex && queryVector) {
        try {
          const searchRes = await fetch(`https://${pineconeIndex}/query`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Api-Key": pineconeKey,
            },
            body: JSON.stringify({
              vector: queryVector,
              topK: 10,
              namespace: "sovereign-docs",
              includeMetadata: true,
            }),
          });
          const searchData = await searchRes.json();
          searchResults = searchData.matches?.map((m: { metadata?: { text?: string }; score: number }) => ({
            text: m.metadata?.text || "",
            score: m.score,
          })) || [];
        } catch (e) {
          console.error("[PINECONE_SEARCH_ERROR]", e);
        }
      }

      return NextResponse.json({
        success: true,
        action: "search",
        query,
        results: searchResults,
        total_results: searchResults.length,
        embedding_model: "nv-embed-v1",
      });
    }

    return NextResponse.json({ error: "action must be 'embed', 'rerank', or 'search'." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Document Intelligence error", details: String(error) }, { status: 500 });
  }
}
