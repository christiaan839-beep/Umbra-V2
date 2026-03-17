/**
 * Simple in-memory rate limiter for API routes.
 * 
 * Usage in any API route:
 *   import { rateLimit } from "@/lib/rate-limit";
 *   const limiter = rateLimit({ interval: 60, limit: 20 });
 *   
 *   export async function POST(req: Request) {
 *     const limited = limiter.check(req);
 *     if (limited) return limited;
 *     // ... handle request
 *   }
 */

import { NextResponse } from "next/server";

interface RateLimitConfig {
  interval: number; // seconds
  limit: number;    // max requests per interval
}

const stores = new Map<string, Map<string, number[]>>();

export function rateLimit(config: RateLimitConfig) {
  const { interval, limit } = config;
  const storeKey = `${interval}-${limit}`;

  if (!stores.has(storeKey)) {
    stores.set(storeKey, new Map());
  }
  const store = stores.get(storeKey)!;

  return {
    check(req: Request): NextResponse | null {
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0]?.trim() || "unknown";
      const now = Date.now();
      const cutoff = now - interval * 1000;

      const timestamps = (store.get(ip) || []).filter(t => t > cutoff);

      if (timestamps.length >= limit) {
        const retryAfter = Math.ceil(interval - (now - timestamps[0]) / 1000);
        return NextResponse.json(
          { error: "Rate limit exceeded. Please slow down.", retryAfter },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }

      timestamps.push(now);
      store.set(ip, timestamps);
      return null;
    },
  };
}
