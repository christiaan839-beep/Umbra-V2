/**
 * Memory stub — Pinecone integration not active.
 * These are no-ops so agents don't crash.
 */
export async function remember(_key: string, _value: string): Promise<void> {
  // No-op: Pinecone not configured
}

export async function recall(_key: string): Promise<string | null> {
  // No-op: Pinecone not configured
  return null;
}
