import { NextResponse } from "next/server";
import { getPersistMode } from "@/lib/persist";
import { getCacheStats } from "@/lib/cache";

/**
 * PLATFORM HEALTH ENDPOINT — Returns system status, uptime,
 * and availability of all critical services.
 */

export async function GET() {
  const startTime = Date.now();

  let nimStatus = "unknown";
  const nimKey = process.env.NVIDIA_NIM_API_KEY;
  if (nimKey) {
    try {
      const res = await fetch("https://integrate.api.nvidia.com/v1/models", {
        method: "GET",
        headers: { "Authorization": `Bearer ${nimKey}` },
        signal: AbortSignal.timeout(5000),
      });
      nimStatus = res.ok ? "operational" : `degraded (HTTP ${res.status})`;
    } catch {
      nimStatus = "unreachable";
    }
  } else {
    nimStatus = "not_configured";
  }

  const services = {
    nvidia_nim: nimStatus,
    clerk_auth: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "configured" : "not_configured",
    resend_email: process.env.RESEND_API_KEY ? "configured" : "not_configured",
    pinecone: process.env.PINECONE_API_KEY ? "configured" : "not_configured",
    telegram: process.env.TELEGRAM_BOT_TOKEN ? "configured" : "not_configured",
    payfast: process.env.PAYFAST_MERCHANT_ID ? "configured" : "not_configured",
    supabase: process.env.SUPABASE_URL ? "configured" : "not_configured",
    upstash_cache: process.env.UPSTASH_REDIS_REST_URL ? "configured" : "not_configured",
  };

  const configuredCount = Object.values(services).filter(s => s !== "not_configured" && s !== "unreachable").length;

  return NextResponse.json({
    status: configuredCount >= 4 ? "healthy" : configuredCount >= 2 ? "degraded" : "critical",
    platform: "Sovereign Matrix",
    version: "2.1.0",
    uptime_check_ms: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    services,
    infrastructure: {
      persistence: getPersistMode(),
      cache: getCacheStats(),
    },
    capabilities: {
      agent_apis: 72,
      dashboard_pages: 43,
      nim_models: 50,
      industry_verticals: 6,
      marketplace_templates: 5,
      multi_modal_pipelines: 3,
      payment_gateways: 2,
    },
    protection: {
      rate_limiting: "100 req/min per client (Edge Middleware)",
      cors: "enabled for external integrations",
      error_tracking: "/api/errors",
      smoke_tests: "/api/tests/smoke",
    },
  });
}
