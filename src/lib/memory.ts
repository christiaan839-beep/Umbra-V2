import { embed } from "./ai";
import { index, isPineconeReady } from "./pinecone";
import type { MemoryEntry, MemorySearchResult } from "@/types";

/** In-memory vector store. Replace with Pinecone for production scale. */
const store: MemoryEntry[] = [];

function cosine(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

export async function remember(text: string, metadata: Record<string, string> = {}): Promise<MemoryEntry> {
  const embedding = await embed(text);
  const entry: MemoryEntry = {
    id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    text,
    embedding,
    metadata,
    timestamp: new Date().toISOString(),
  };
  
  // Store permanently in Pinecone if configured
  if (isPineconeReady()) {
    try {
      await index!.upsert([{
        id: entry.id,
        values: embedding,
        metadata: { text, ...metadata, timestamp: entry.timestamp }
      }] as any);
    } catch (e) {
      console.error("[God-Brain] Pinecone Upsert Failed", e);
    }
  }
  
  // Always store locally for the current session UI
  store.push(entry);
  return entry;
}

export async function recall(query: string, topK: number = 3): Promise<MemorySearchResult[]> {
  const queryEmbedding = await embed(query);

  if (isPineconeReady()) {
    try {
      const response = await index!.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true
      });

      return response.matches.map(m => ({
        entry: {
          id: m.id,
          text: (m.metadata?.text as string) || "Unknown",
          embedding: [],
          metadata: m.metadata as Record<string, string>,
          timestamp: (m.metadata?.timestamp as string) || new Date().toISOString()
        },
        score: m.score || 0
      }));
    } catch (e) {
      console.error("[God-Brain] Pinecone Query Failed", e);
    }
  }

  // Fallback to local memory
  if (store.length === 0) return [];
  return store
    .map((entry) => ({ entry, score: cosine(queryEmbedding, entry.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** Get all stored memories (for the dashboard UI). */
export function getAllMemories(): MemoryEntry[] {
  return [...store].reverse();
}

/** Get total memory count. */
export function getMemoryCount(): number {
  return store.length;
}
