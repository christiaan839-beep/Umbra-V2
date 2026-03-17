/**
 * Swarm stub — multi-agent orchestration not active.
 * These are pass-through stubs so agents don't crash.
 */
export async function runSwarm(_options: Record<string, unknown>): Promise<{ finalOutput: string, rounds: number }> {
  // Return mock object to prevent destructuring crashes
  return { finalOutput: "Swarm logic bypassed via configuration.", rounds: 1 };
}

export async function adSwarm(_prompt: string, _tone: string): Promise<{ finalOutput: string, rounds: number }> {
  // Return mock object
  return { finalOutput: "Ad swarm not configured. Bypassed.", rounds: 1 };
}
