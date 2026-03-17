"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Factory, Search, Palette, Send, Users, Shield,
  ArrowRight, Layers, Globe2, CalendarDays, Zap,
  TrendingUp, BarChart3, Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import { QuickStartWizard } from "@/components/dashboard/QuickStartWizard";

const TOOLS = [
  {
    label: "Content Hub",
    description: "Blog posts, email sequences, social packs, and video scripts — all AI-generated.",
    href: "/dashboard/content-factory",
    icon: Factory,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "SEO Tools",
    description: "Competitor X-Ray, content gap analysis, schema audit, and GBP hijack.",
    href: "/dashboard/seo-dominator",
    icon: Search,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    label: "Design Studio",
    description: "Landing page briefs, brand identity systems, and UI/UX specifications.",
    href: "/dashboard/designer",
    icon: Palette,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    label: "Lead Prospector",
    description: "Find local businesses, detect marketing gaps, and generate outreach.",
    href: "/dashboard/leads",
    icon: Users,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Outbound Engine",
    description: "Multi-step cold email sequences personalized to each prospect.",
    href: "/dashboard/outbound",
    icon: Send,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    label: "Competitor Intel",
    description: "AI-powered competitive analysis with threat detection and counter-strategies.",
    href: "/dashboard/competitor",
    icon: Shield,
    color: "text-[#00B7FF]",
    bg: "bg-[#00B7FF]/10",
    border: "border-[#00B7FF]/20",
  },
];

const STATS = [
  { label: "AI Tools", value: "29", icon: Zap, color: "text-[#00B7FF]" },
  { label: "Content Types", value: "4", icon: Factory, color: "text-emerald-400" },
  { label: "SEO Actions", value: "4", icon: Search, color: "text-rose-400" },
  { label: "Always Running", value: "24/7", icon: TrendingUp, color: "text-violet-400" },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: delay * 0.1, ease: [0.16, 1, 0.3, 1] as const },
});

export default function DashboardOverview() {
  const { user } = useUser();
  const firstName = user?.firstName || "there";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 p-4 lg:p-8">
      
      {/* Welcome Header */}
      <motion.div {...fade(0)} className="backdrop-blur-3xl bg-black/40 p-6 lg:p-8 rounded-2xl shadow-[0_0_50px_rgba(0,183,255,0.05)] border border-[#00B7FF]/10">
        <h1 className="text-2xl lg:text-3xl font-light text-white tracking-wide mb-2">
          Welcome back, <span className="font-bold text-[#00B7FF]">{firstName}</span>
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
          Your AI marketing engine is ready. Choose a tool below to generate content, analyze competitors, find leads, or build your next campaign.
        </p>
      </motion.div>

      {/* Quick Start Guide */}
      <QuickStartWizard />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            {...fade(i + 1)}
            className="bg-black/40 backdrop-blur-2xl border border-[#00B7FF]/10 rounded-2xl p-5 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${s.color}`}>
              <s.icon className="w-14 h-14" />
            </div>
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest font-bold">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tools Grid */}
      <div>
        <motion.h2 {...fade(5)} className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-4 flex items-center gap-2">
          <Rocket className="w-3 h-3" /> Your AI Toolkit
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div key={tool.href} {...fade(6 + i)}>
              <Link
                href={tool.href}
                className={`block p-6 rounded-2xl border ${tool.border} ${tool.bg} backdrop-blur-2xl hover:scale-[1.02] transition-all group`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${tool.bg} border ${tool.border} flex items-center justify-center`}>
                    <tool.icon className={`w-4 h-4 ${tool.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase">{tool.label}</h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">{tool.description}</p>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-neutral-500 group-hover:text-white transition-colors">
                  Open tool <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Tools */}
      <motion.div {...fade(12)}>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-3 h-3" /> More Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Social Media", href: "/dashboard/social", icon: Globe2 },
            { label: "Content Calendar", href: "/dashboard/calendar", icon: CalendarDays },
            { label: "Programmatic SEO", href: "/dashboard/programmatic", icon: Layers },
            { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-black/40 backdrop-blur-xl border border-[#00B7FF]/10 rounded-xl p-4 text-center hover:border-[#00B7FF]/30 transition-all group"
            >
              <item.icon className="w-5 h-5 mx-auto mb-2 text-neutral-500 group-hover:text-white transition-colors" />
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors font-bold">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ROI Comparison */}
      <motion.div {...fade(13)} className="bg-black/40 backdrop-blur-3xl border border-[#00B7FF]/10 rounded-2xl p-6">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-3 h-3" /> Your Savings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <p className="text-lg font-mono font-bold text-red-400 line-through">R15,000+</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Traditional Agency</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <p className="text-lg font-mono font-bold text-amber-400 line-through">R25,000+</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">In-House Team</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-lg font-mono font-bold text-emerald-400">From R2,750</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">UMBRA Platform</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
