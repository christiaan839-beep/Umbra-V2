"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Send, Shield, BarChart3, Globe2, Terminal, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";

const GUIDES = [
  {
    title: "Getting Started",
    icon: Zap,
    color: "#00B7FF",
    steps: [
      "Sign in with your credentials at /dashboard",
      "Your UMBRA node automatically initializes on first login",
      "Navigate the sidebar to access all 100 AI phases",
      "Use the Command Center (main dashboard) for an overview of all systems",
    ],
  },
  {
    title: "Outbound Engine",
    icon: Send,
    color: "#F97316",
    href: "/dashboard/outbound",
    steps: [
      "Navigate to Dashboard → Outbound Engine",
      "Enter your target niche (e.g., 'MedSpa', 'Real Estate')",
      "Set the location and number of prospects to generate",
      "Click 'Generate Emails' — Gemini synthesizes personalized cold emails",
      "Copy the emails and send via your preferred email client",
    ],
  },
  {
    title: "Competitor Scanner",
    icon: Shield,
    color: "#EF4444",
    href: "/dashboard/scan",
    steps: [
      "Navigate to Dashboard → Competitive Scanner",
      "Enter your niche and optionally a competitor URL",
      "The scanner generates a threat assessment with:",
      "• Threat level classification (LOW → CRITICAL)",
      "• Competitor weakness analysis",
      "• Counter-strategies and content angles",
      "Use the counter-strategies to adjust your marketing immediately",
    ],
  },
  {
    title: "AI Architect",
    icon: Terminal,
    color: "#A855F7",
    href: "/dashboard/architect",
    steps: [
      "Navigate to Dashboard → Agentic Architect",
      "Describe the UI component you want in natural language",
      "Example: 'A pricing table with 3 tiers and glassmorphic cards'",
      "The AI generates complete React + Tailwind code",
      "Preview renders live in the right panel",
      "Copy the code directly into your project",
    ],
  },
  {
    title: "Client Reports",
    icon: BarChart3,
    color: "#10B981",
    href: "/dashboard/reports",
    steps: [
      "Reports auto-generate from your telemetry data",
      "Key metrics include: leads generated, content published, emails sent",
      "Share reports with clients to demonstrate ROI",
      "Reports pull from the same data your dashboard uses",
    ],
  },
  {
    title: "System Status",
    icon: Globe2,
    color: "#06B6D4",
    href: "/dashboard/status",
    steps: [
      "Navigate to Dashboard → System Status",
      "View real-time health of all connected services:",
      "• Database (Neon Postgres)",
      "• Stripe (Payments)",
      "• Clerk (Authentication)",
      "• Gemini (AI Engine)",
      "• Pusher (Real-time)",
      "Auto-refreshes every 30 seconds",
      "If a service shows degraded, check /api/monitor/self-heal",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link href="/" className="text-xs font-mono uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors">← Back to UMBRA</Link>
          <h1 className="text-3xl font-light tracking-wider mt-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Documentation
          </h1>
          <p className="text-neutral-400 mt-2">Quick guides for UMBRA&apos;s core features. Each guide takes under 2 minutes to follow.</p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {GUIDES.map((guide, i) => {
          const Icon = guide.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${guide.color}15`, border: `1px solid ${guide.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: guide.color }} />
                  </div>
                  <h2 className="text-lg font-light text-white tracking-wider">{guide.title}</h2>
                </div>
                {guide.href && (
                  <Link href={guide.href} className="text-[10px] uppercase tracking-widest font-mono flex items-center gap-1 hover:text-cyan-400 transition-colors" style={{ color: guide.color }}>
                    Open <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <ol className="space-y-2.5 pl-1">
                {guide.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-neutral-400">
                    {step.startsWith("•") ? (
                      <span className="text-neutral-600 mt-0.5 ml-5">•</span>
                    ) : (
                      <span className="text-[10px] font-mono w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${guide.color}15`, color: guide.color }}>{j + 1}</span>
                    )}
                    <span>{step.startsWith("•") ? step.slice(2) : step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          );
        })}

        {/* Payment Setup Section */}
        <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-light text-white tracking-wider mb-4 flex items-center gap-3">
            <span className="text-2xl">🇿🇦</span> South African Payments (PayFast)
          </h2>
          <div className="space-y-2.5 text-sm text-neutral-400">
            <p>UMBRA supports PayFast for ZAR payments. To activate:</p>
            <ol className="space-y-2 pl-6 list-decimal">
              <li>Register at <a href="https://www.payfast.co.za" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">payfast.co.za</a></li>
              <li>Set these environment variables in your Vercel dashboard:
                <code className="block mt-2 bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-cyan-400">
                  PAYFAST_MERCHANT_ID=your_merchant_id<br />
                  PAYFAST_MERCHANT_KEY=your_merchant_key<br />
                  PAYFAST_PASSPHRASE=your_passphrase<br />
                  PAYFAST_SANDBOX=false
                </code>
              </li>
              <li>Set <code className="text-cyan-400 bg-black/60 px-1.5 py-0.5 rounded text-xs">PAYFAST_SANDBOX=false</code> for live payments</li>
              <li>Your notify URL should be: <code className="text-cyan-400 bg-black/60 px-1.5 py-0.5 rounded text-xs">https://yourdomain.com/api/webhooks/payfast</code></li>
            </ol>
          </div>
        </div>

        {/* Email Setup Section */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-light text-white tracking-wider mb-4 flex items-center gap-3">
            <Send className="w-5 h-5 text-purple-400" /> Email Sending Setup
          </h2>
          <div className="space-y-2.5 text-sm text-neutral-400">
            <p>UMBRA uses Resend for email delivery (100 free emails/day). To activate:</p>
            <ol className="space-y-2 pl-6 list-decimal">
              <li>Sign up at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">resend.com</a></li>
              <li>Add your API key to Vercel:
                <code className="block mt-2 bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-purple-400">
                  RESEND_API_KEY=re_xxxxxxxxxxxxx<br />
                  RESEND_FROM_EMAIL=UMBRA &lt;noreply@yourdomain.com&gt;
                </code>
              </li>
              <li>Verify your domain in Resend for custom sender addresses</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
