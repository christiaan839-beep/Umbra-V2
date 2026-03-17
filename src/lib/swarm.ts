/**
 * Swarm stub — multi-agent orchestration not active.
 * These are pass-through stubs so agents don't crash.
 */
export async function runSwarm(prompt: string, _options?: Record<string, unknown>): Promise<string> {
  // No-op: just return the prompt (agents will use their own AI call)
  return prompt;
}

export async function adSwarm(_config: Record<string, unknown>): Promise<string> {
  // No-op
  return "Ad swarm not configured";
}
