import { NextResponse } from "next/server";
import { getUsageStats, getUsageLogs } from "@/lib/agent-auth";

/**
 * AGENT ANALYTICS API — Returns usage statistics for the analytics dashboard.
 */

export async function GET() {
  const stats = getUsageStats();
  const recentLogs = getUsageLogs().slice(-50).reverse();

  return NextResponse.json({
    status: "Analytics Engine — Active",
    ...stats,
    recent_activity: recentLogs,
  });
}
