import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const { tenantId, type, data } = await req.json();

    if (!tenantId || !type) {
      return NextResponse.json({ error: "Missing tenantId or notification type" }, { status: 400 });
    }

    const templates: Record<string, { subject: string; body: (d: Record<string, string>) => string }> = {
      lead_closed: {
        subject: "🎯 New Lead Closed by UMBRA",
        body: (d) => `Your AI marketing engine just closed a new lead.\n\nProspect: ${d.prospectName || "Unknown"}\nChannel: ${d.channel || "Direct"}\nEstimated Value: ${d.value || "$0"}\n\nYour UMBRA node continues to operate autonomously.`,
      },
      content_published: {
        subject: "📤 Content Published Autonomously",
        body: (d) => `UMBRA has published new content.\n\nTitle: ${d.title || "Untitled"}\nPlatform: ${d.platform || "Website"}\nType: ${d.contentType || "Blog Post"}\n\nAll content was generated and published without human intervention.`,
      },
      competitor_alert: {
        subject: "🔴 Competitor Alert Detected",
        body: (d) => `UMBRA's Competitive Warfare Scanner detected a significant change.\n\nCompetitor: ${d.competitorName || "Unknown"}\nThreat Level: ${d.threatLevel || "MEDIUM"}\nAction Required: ${d.action || "Review counter-strategy brief in your dashboard."}\n\nLog in to review the full threat assessment.`,
      },
      revenue_milestone: {
        subject: "💰 Revenue Milestone Reached",
        body: (d) => `Congratulations! Your UMBRA node has hit a new milestone.\n\nMilestone: ${d.milestone || ""}\nTotal Revenue: ${d.totalRevenue || "$0"}\nNext Target: ${d.nextTarget || ""}\n\nYour AI marketing engine is delivering results around the clock.`,
      },
      weekly_digest: {
        subject: "📊 Your Weekly UMBRA Intelligence Digest",
        body: (d) => `Here's your weekly performance summary:\n\n• Leads Generated: ${d.leads || "0"}\n• Content Published: ${d.content || "0"}\n• Emails Sent: ${d.emails || "0"}\n• Revenue: ${d.revenue || "$0"}\n• Competitor Scans: ${d.scans || "0"}\n\nFull analytics available in your dashboard.`,
      },
    };

    const template = templates[type];
    if (!template) {
      return NextResponse.json({ error: `Unknown notification type: ${type}` }, { status: 400 });
    }

    const emailPayload = {
      subject: template.subject,
      body: template.body(data || {}),
      tenantId,
      type,
      timestamp: new Date().toISOString(),
    };

    // In production, send via Gmail API, SendGrid, or Resend
    // For now, we log & return the rendered template
    console.log("[Notification Email]:", JSON.stringify(emailPayload, null, 2));

    return NextResponse.json({ success: true, email: emailPayload });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Email Notification Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
