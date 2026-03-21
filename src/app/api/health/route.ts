import { NextResponse } from "next/server";

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
    webhook_gateway: process.env.WEBHOOK_API_KEY ? "secured" : "open",
  };

  const configuredCount = Object.values(services).filter(s => s !== "not_configured" && s !== "unreachable").length;

  return NextResponse.json({
    status: configuredCount >= 3 ? "healthy" : configuredCount >= 1 ? "degraded" : "critical",
    platform: "Sovereign Matrix",
    version: "1.7.0",
    uptime_check_ms: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    services,
    capabilities: {
      agent_apis: 62,
      dashboard_pages: 42,
      nim_models: 41,
      industry_verticals: 6,
      marketplace_templates: 5,
      multi_modal_pipelines: 3,
    },
    protection: {
      rate_limiting: "100 req/min per client (Edge Middleware)",
      cors: "enabled for external integrations",
      circuit_breaker: "available via reliableNimCall()",
      auth: "Clerk session + plan-based (agent-auth.ts)",
    },
  });
}
