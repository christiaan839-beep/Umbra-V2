import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  latencyMs: number;
  message?: string;
}

export async function GET() {
  const startTime = Date.now();
  const services: ServiceStatus[] = [];

  // 1. Database (Neon Postgres)
  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    services.push({ name: "database", status: "operational", latencyMs: Date.now() - dbStart });
  } catch (e) {
    services.push({ name: "database", status: "down", latencyMs: 0, message: e instanceof Error ? e.message : "Connection failed" });
  }

  // 2. Stripe API
  try {
    const stripeStart = Date.now();
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    const res = await fetch("https://api.stripe.com/v1/balance", {
      headers: { Authorization: `Bearer ${stripeKey}` },
    });
    services.push({
      name: "stripe",
      status: res.ok ? "operational" : "degraded",
      latencyMs: Date.now() - stripeStart,
      message: res.ok ? undefined : `HTTP ${res.status}`,
    });
  } catch (e) {
    services.push({ name: "stripe", status: "down", latencyMs: 0, message: e instanceof Error ? e.message : "Connection failed" });
  }

  // 3. Clerk Auth
  try {
    const clerkStart = Date.now();
    const clerkKey = process.env.CLERK_SECRET_KEY;
    if (!clerkKey) throw new Error("CLERK_SECRET_KEY not configured");
    services.push({ name: "clerk", status: "operational", latencyMs: Date.now() - clerkStart });
  } catch (e) {
    services.push({ name: "clerk", status: "down", latencyMs: 0, message: e instanceof Error ? e.message : "Not configured" });
  }

  // 4. Google AI (Gemini)
  try {
    const geminiStart = Date.now();
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!geminiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY not configured");
    services.push({ name: "gemini", status: "operational", latencyMs: Date.now() - geminiStart });
  } catch (e) {
    services.push({ name: "gemini", status: "down", latencyMs: 0, message: e instanceof Error ? e.message : "Not configured" });
  }

  // 5. Pusher (Real-time)
  try {
    const pusherStart = Date.now();
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    if (!pusherKey) throw new Error("PUSHER_KEY not configured");
    services.push({ name: "pusher", status: "operational", latencyMs: Date.now() - pusherStart });
  } catch (e) {
    services.push({ name: "pusher", status: "down", latencyMs: 0, message: e instanceof Error ? e.message : "Not configured" });
  }

  const overallStatus = services.every((s) => s.status === "operational")
    ? "operational"
    : services.some((s) => s.status === "down")
    ? "degraded"
    : "operational";

  const operationalCount = services.filter((s) => s.status === "operational").length;

  return NextResponse.json({
    status: overallStatus,
    version: "2.0.0",
    phases: 98,
    uptime: process.uptime ? `${Math.floor(process.uptime())}s` : "unknown",
    timestamp: new Date().toISOString(),
    totalLatencyMs: Date.now() - startTime,
    summary: `${operationalCount}/${services.length} services operational`,
    services,
  });
}
