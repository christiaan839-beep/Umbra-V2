"use client";

import { useState, useEffect, useCallback } from "react";

interface UsageData {
  today: number;
  total: number;
  limit: number;
  remaining: number;
  plan: string;
  isPaid: boolean;
}

/**
 * Hook to check generation usage and enforce daily limits.
 * Paid users (pro/agency) get unlimited generations.
 * Free users get 20/day.
 */
export function useUsage() {
  const [usage, setUsage] = useState<UsageData>({
    today: 0, total: 0, limit: 20, remaining: 20, plan: "starter", isPaid: false,
  });
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      // Fetch plan tier and usage in parallel
      const [planRes, usageRes] = await Promise.all([
        fetch("/api/user/plan").then(r => r.json()).catch(() => ({ plan: "starter", isPaid: false, limit: 20 })),
        fetch("/api/generations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "usage" }),
        }).then(r => r.json()).catch(() => ({ today: 0, total: 0, limit: 20, remaining: 20 })),
      ]);

      const isPaid = planRes.isPaid || false;
      const limit = isPaid ? 999999 : 20;
      const today = usageRes.today || 0;

      setUsage({
        today,
        total: usageRes.total || 0,
        limit,
        remaining: isPaid ? 999999 : Math.max(0, limit - today),
        plan: planRes.plan || "starter",
        isPaid,
      });
    } catch {
      // Silently fail — don't block users if metering is down
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...usage,
    loaded,
    canGenerate: usage.isPaid || usage.remaining > 0,
    refresh,
  };
}
