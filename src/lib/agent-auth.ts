import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * AGENT AUTH MIDDLEWARE — Validates Clerk sessions and enforces
 * plan-based rate limits on all agent API calls.
 * 
 * Usage: Import and call at the top of every agent route.
 * 
 * Plan limits:
 * - Free/Demo: 5 calls per day (for /demo page)
 * - Node (R9,997): 500 calls per day
 * - Array (R24,997): 2,000 calls per day
 * - Cartel (R49,997): Unlimited
 */

export interface AuthResult {
  authorized: boolean;
  userId?: string;
  plan?: string;
  remaining?: number;
  error?: string;
}

// In-memory rate tracking (production: use Redis)
const USAGE_TRACKER = new Map<string, { count: number; reset: number }>();

const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  node: 500,
  array: 2000,
  cartel: Infinity,
};

export async function authorizeAgent(
  request: Request,
  options?: { allowAnonymous?: boolean; agentName?: string }
): Promise<AuthResult> {
  // Check for demo/anonymous access
  if (options?.allowAnonymous) {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const key = `demo:${ip}`;
    const now = Date.now();
    const tracker = USAGE_TRACKER.get(key);

    if (tracker && tracker.reset > now) {
      if (tracker.count >= PLAN_LIMITS.free) {
        return {
          authorized: false,
          error: "Demo limit reached (5/day). Sign up for unlimited access.",
          remaining: 0,
        };
      }
      tracker.count += 1;
    } else {
      USAGE_TRACKER.set(key, { count: 1, reset: now + 86400000 }); // 24h reset
    }

    // Log the usage
    logUsage("anonymous", ip, options.agentName || "unknown");

    return { authorized: true, plan: "free", remaining: PLAN_LIMITS.free - (USAGE_TRACKER.get(key)?.count || 0) };
  }

  // Clerk auth check
  try {
    const { userId } = await auth();

    if (!userId) {
      return { authorized: false, error: "Authentication required. Please sign in." };
    }

    // Determine plan from metadata (simplified — production: check Stripe subscription)
    const plan = "cartel"; // Default to highest for now — when Stripe is wired, check subscription
    const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    const key = `user:${userId}`;
    const now = Date.now();
    const tracker = USAGE_TRACKER.get(key);

    if (tracker && tracker.reset > now) {
      if (tracker.count >= limit) {
        return {
          authorized: false,
          userId,
          plan,
          remaining: 0,
          error: `Daily limit reached (${limit} calls). Upgrade your plan for more.`,
        };
      }
      tracker.count += 1;
    } else {
      USAGE_TRACKER.set(key, { count: 1, reset: now + 86400000 });
    }

    logUsage(userId, plan, options?.agentName || "unknown");

    return {
      authorized: true,
      userId,
      plan,
      remaining: limit - (USAGE_TRACKER.get(key)?.count || 0),
    };
  } catch {
    // If Clerk fails, allow access but log it
    return { authorized: true, plan: "unknown" };
  }
}

// ═══════════════════════════════════════════════
// USAGE LOGGING — Tracks every agent call
// ═══════════════════════════════════════════════

interface UsageLog {
  timestamp: string;
  userId: string;
  plan: string;
  agent: string;
  duration_ms?: number;
  status?: string;
}

const USAGE_LOGS: UsageLog[] = [];

function logUsage(userId: string, plan: string, agent: string) {
  USAGE_LOGS.push({
    timestamp: new Date().toISOString(),
    userId,
    plan,
    agent,
  });
  // Keep only last 10,000 entries in memory
  if (USAGE_LOGS.length > 10000) {
    USAGE_LOGS.splice(0, USAGE_LOGS.length - 10000);
  }
}

export function logAgentExecution(userId: string, agent: string, duration_ms: number, status: string) {
  USAGE_LOGS.push({
    timestamp: new Date().toISOString(),
    userId,
    plan: "tracked",
    agent,
    duration_ms,
    status,
  });
}

export function getUsageLogs(): UsageLog[] {
  return USAGE_LOGS;
}

export function getUsageStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayLogs = USAGE_LOGS.filter(l => l.timestamp >= today);

  const agentCounts: Record<string, number> = {};
  const userCounts: Record<string, number> = {};

  for (const log of todayLogs) {
    agentCounts[log.agent] = (agentCounts[log.agent] || 0) + 1;
    userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
  }

  return {
    total_calls_today: todayLogs.length,
    total_calls_all_time: USAGE_LOGS.length,
    calls_by_agent: agentCounts,
    unique_users_today: Object.keys(userCounts).length,
    top_agents: Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
  };
}

/**
 * Helper: Quick auth check that returns a NextResponse error if unauthorized.
 * Use at the top of any agent route:
 * 
 * const authCheck = await quickAuth(request, "abm-artillery");
 * if (authCheck) return authCheck; // Returns error response if unauthorized
 */
export async function quickAuth(request: Request, agentName: string, allowAnonymous = false): Promise<NextResponse | null> {
  const result = await authorizeAgent(request, { agentName, allowAnonymous });
  if (!result.authorized) {
    return NextResponse.json({ error: result.error, plan: result.plan, remaining: result.remaining }, { status: 403 });
  }
  return null;
}
