import { NextRequest, NextResponse } from "next/server";
import { research_ai } from "@/lib/ai";

/**
 * Demo Scan API — Public, no auth required.
 * Runs a real mini competitor analysis for landing page visitors.
 * Rate-limited to prevent abuse (simple in-memory counter).
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 3; // 3 scans per IP per hour
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limited. Sign up for unlimited access.", limited: true },
        { status: 429 }
      );
    }

    const { url } = await req.json();
    
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Clean the URL
    const cleanUrl = url.trim().replace(/^(?!https?:\/\/)/, "https://");

    const result = await research_ai(
      `${cleanUrl} marketing strategy SEO website analysis`,
      `You are UMBRA, an elite AI marketing analyst. Analyze this website in 30 seconds.

WEBSITE: ${cleanUrl}

Provide a concise competitive scan in this EXACT JSON format:
{
  "company": "Company name",
  "url": "${cleanUrl}",
  "overallScore": 72,
  "findings": [
    {
      "category": "SEO",
      "score": 65,
      "finding": "One-sentence finding",
      "fix": "One-sentence recommendation"
    },
    {
      "category": "Content",
      "score": 70,
      "finding": "One-sentence finding",
      "fix": "One-sentence recommendation"
    },
    {
      "category": "Conversion",
      "score": 55,
      "finding": "One-sentence finding",
      "fix": "One-sentence recommendation"
    },
    {
      "category": "Competitive Edge",
      "score": 80,
      "finding": "One-sentence finding",
      "fix": "One-sentence recommendation"
    }
  ],
  "topOpportunity": "The single biggest opportunity they're missing",
  "estimatedMonthlyTraffic": "Estimated range based on search data"
}

Keep findings SHORT and ACTIONABLE. Return ONLY valid JSON.`,
      {
        model: "gemini",
        system: "You are a marketing analyst. Be specific, data-driven, and concise. Return only JSON.",
        maxTokens: 1000,
      }
    );

    // Parse the JSON from the AI response
    let parsed;
    try {
      const match = result.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match ? match[0] : result);
    } catch {
      parsed = { raw: result, error: "Could not parse structured response" };
    }

    return NextResponse.json({ success: true, scan: parsed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Demo Scan Error]:", message);
    return NextResponse.json(
      { error: "Scan failed. Try again.", details: message },
      { status: 500 }
    );
  }
}
