import { NextResponse } from "next/server";
import { vertex as google } from "@ai-sdk/google-vertex";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry, scheduledContent, tenants } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Weekly Report Generator (Cron)
 * 
 * Runs every Monday at 6 AM UTC via Vercel Cron.
 * Generates a Gemini-powered week-in-review for each active tenant.
 * Reports: posts published, leads generated, revenue attributed, next week's plan.
 */
export async function GET() {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get all active tenants
    const allTenants = await db.select().from(tenants);

    if (allTenants.length === 0) {
      return NextResponse.json({ success: true, message: "No tenants to report on", reports: 0 });
    }

    const reports: Array<{ tenantId: string; nodeId: string; report: string }> = [];

    for (const tenant of allTenants) {
      // Get this tenant's events from the past week
      const weekEvents = await db
        .select()
        .from(globalTelemetry)
        .where(eq(globalTelemetry.tenantId, tenant.id))
        .orderBy(desc(globalTelemetry.timestamp));

      const recentEvents = weekEvents.filter(e => e.timestamp && new Date(e.timestamp) >= oneWeekAgo);

      // Get scheduled content published this week
      const publishedContent = await db
        .select()
        .from(scheduledContent)
        .where(eq(scheduledContent.status, "published"));

      // Summarize activity
      const leadEvents = recentEvents.filter(e => e.eventType.includes("lead")).length;
      const seoEvents = recentEvents.filter(e => e.eventType.includes("seo") || e.eventType.includes("programmatic")).length;
      const socialEvents = recentEvents.filter(e => e.eventType.includes("social") || e.eventType.includes("post")).length;
      const totalActions = recentEvents.length;

      // Generate the report with Gemini
      const { text: report } = await generateText({
        model: google("gemini-2.5-pro"),
        prompt: `You are the UMBRA AI Operations Director generating a weekly performance report.

CLIENT NODE: ${tenant.nodeId}
PLAN: ${tenant.plan}
WEEK: ${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}

ACTIVITY SUMMARY:
- Total Autonomous Actions: ${totalActions}
- Leads Generated/Processed: ${leadEvents}
- SEO Pages Rendered: ${seoEvents}
- Social Media Posts: ${socialEvents}
- Content Calendar Items Published: ${publishedContent.length}

Generate a concise, professional weekly report in this EXACT format:

📊 WEEK-IN-REVIEW — ${tenant.nodeId}
═══════════════════════════════════

🎯 KEY METRICS
• [List the top 3 headline metrics]

📈 HIGHLIGHTS
• [3-4 bullet points about notable achievements]

⚡ AUTONOMOUS OPERATIONS
• [Summary of what the AI swarm did autonomously]

🔮 NEXT WEEK PRIORITIES  
• [3 recommended focus areas for next week]

Keep it under 300 words. Make it feel premium and data-driven.`,
      });

      reports.push({
        tenantId: tenant.id,
        nodeId: tenant.nodeId,
        report,
      });

      // Log the report as a telemetry event
      await db.insert(globalTelemetry).values({
        tenantId: tenant.id,
        eventType: "weekly_report_generated",
        payload: JSON.stringify({ report, generatedAt: new Date().toISOString() }),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${reports.length} weekly reports`,
      reports: reports.length,
    });
  } catch (error) {
    console.error("[Weekly Report Error]:", error);
    return NextResponse.json({ error: "Weekly report generation failed" }, { status: 500 });
  }
}
