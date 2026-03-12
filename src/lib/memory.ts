import { embed } from "./ai";
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

/** Store a piece of knowledge in the God-Brain. */
export async function remember(text: string, metadata: Record<string, string> = {}): Promise<MemoryEntry> {
  const embedding = await embed(text);
  const entry: MemoryEntry = {
    id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    text,
    embedding,
    metadata,
    timestamp: new Date().toISOString(),
  };
  store.push(entry);
  return entry;
}

/** Search the God-Brain for semantically similar memories. */
export async function recall(query: string, topK: number = 3): Promise<MemorySearchResult[]> {
  if (store.length === 0) return [];
  const queryEmbedding = await embed(query);
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
