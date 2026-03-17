/**
 * Memory stub — Pinecone integration not active.
 * These are no-ops so agents don't crash.
 */
export async function remember(_key: string, _value?: string): Promise<void> {
  // No-op: Pinecone not configured
}

export async function recall(_key: string, _limit?: number): Promise<any[]> {
  // Return empty array instead of null to prevent map() crashes
  return [];
}
