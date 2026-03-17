"use client";

import { useState, useEffect, useCallback } from "react";

interface UsageData {
  today: number;
  total: number;
  limit: number;
  remaining: number;
}

/**
 * Hook to check generation usage and enforce daily limits.
 * Returns usage data + canGenerate boolean + a refresh function.
 */
export function useUsage() {
  const [usage, setUsage] = useState<UsageData>({ today: 0, total: 0, limit: 20, remaining: 20 });
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "usage" }),
      });
      const data = await res.json();
      if (data.success) {
        setUsage({
          today: data.today || 0,
          total: data.total || 0,
          limit: data.limit || 20,
          remaining: data.remaining ?? 20,
        });
      }
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
    canGenerate: usage.remaining > 0,
    refresh,
  };
}
