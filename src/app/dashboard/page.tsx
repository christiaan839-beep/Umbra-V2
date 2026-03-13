"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, Ghost, Brain, Zap, ArrowUpRight, ArrowRight, Sparkles, Play, FileText, Send, Wrench, Code, Shield, Workflow, FlaskConical, GitBranch, Video, Building2, MessageSquare, BarChart3, Laptop, Mail } from "lucide-react";
import Link from "next/link";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } },
});

const STATS = [
  { label: "Monthly Revenue", value: "$42,800", change: "+24%", icon: DollarSign, color: "text-gold" },
  { label: "Active Campaigns", value: "14", change: "+5", icon: TrendingUp, color: "text-electric" },
  { label: "Qualified Leads", value: "127", change: "+38", icon: Users, color: "text-emerald-glow" },
  { label: "God-Brain Entries", value: "342", change: "+89", icon: Brain, color: "text-electric-light" },
];

const ENGINES = [
  { name: "AI Router", icon: Zap, status: "active" },
  { name: "God-Brain", icon: Brain, status: "active" },
  { name: "Ghost Mode", icon: Ghost, status: "active" },
  { name: "Swarm Critic", icon: Code, status: "active" },
  { name: "Tool Factory", icon: Wrench, status: "active" },
  { name: "Pipeline Builder", icon: GitBranch, status: "active" },
  { name: "Skills A/B", icon: FlaskConical, status: "active" },
  { name: "Omnipresence", icon: Workflow, status: "active" },
  { name: "Video Director", icon: Video, status: "idle" },
  { name: "Report Gen", icon: FileText, status: "active" },
  { name: "Social Engine", icon: Send, status: "active" },
  { name: "Closer", icon: MessageSquare, status: "active" },
  { name: "Client CRM", icon: Building2, status: "active" },
  { name: "Competitor Intel", icon: Shield, status: "active" },
  { name: "DSPy Optimizer", icon: Sparkles, status: "idle" },
];

const ACTIVITY = [
  { agent: "Ghost Mode", action: "Killed campaign 'SaaS-FOMO-v3' — ROAS 0.7x → budget reallocated", time: "2m ago", icon: Ghost, color: "#ff3366" },
  { agent: "Swarm Critic", action: "Approved ad copy after 3 debate rounds (Score: 9.2/10)", time: "8m ago", icon: Code, color: "#6c63ff" },
  { agent: "God-Brain", action: "Stored winning pattern: 'transformation hook + urgency CTA'", time: "14m ago", icon: Brain, color: "#00d4ff" },
  { agent: "Pipeline Builder", action: "Executed 'Full Campaign' pipeline for Apex Fitness (3 steps, 12.4s)", time: "23m ago", icon: GitBranch, color: "#00ff88" },
  { agent: "Skills A/B", action: "Variant B locked as winner on 'Ad Copywriting' (19.7% vs 8.3%)", time: "1h ago", icon: FlaskConical, color: "#f59e0b" },
  { agent: "Social Engine", action: "Published 3 posts: Instagram, X, LinkedIn — topic: 'AI tools for SMBs'", time: "2h ago", icon: Send, color: "#E1306C" },
  { agent: "Competitor Intel", action: "Alert: competitor dropped pricing by 20% — counter-strategy generated", time: "3h ago", icon: Shield, color: "#ff6b6b" },
  { agent: "Tool Factory", action: "Created custom scraper tool for trending GitHub repos (executed in 847ms)", time: "5h ago", icon: Wrench, color: "#10b981" },
];

const QUICK_ACTIONS = [
  { label: "Run Pipeline", href: "/dashboard/pipelines", icon: Play, color: "bg-electric" },
  { label: "Generate Report", href: "/dashboard/reports", icon: FileText, color: "bg-violet-500" },
  { label: "Build Tool", href: "/dashboard/factory", icon: Wrench, color: "bg-rose-500" },
  { label: "New Post", href: "/dashboard/social", icon: Send, color: "bg-pink-500" },
];

// Simple bar chart component
function MiniChart() {
  const bars = [32, 45, 38, 52, 48, 61, 55, 72, 65, 84, 78, 92];
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {bars.map((v, i) => (
        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className={`flex-1 rounded-t ${i === bars.length - 1 ? "bg-electric" : i >= bars.length - 3 ? "bg-electric/60" : "bg-electric/25"}`}
        />
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const activeEngines = ENGINES.filter(e => e.status === "active").length;

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold serif-text text-white mb-1">Command Center</h1>
          <p className="text-sm text-text-secondary">Your autonomous AI marketing system at a glance.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400">{activeEngines}/{ENGINES.length} engines active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => (
          <motion.div key={i} {...fade(i)} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-xs text-emerald-glow font-mono flex items-center gap-0.5">
                {s.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
            <p className="text-xs text-text-secondary mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <motion.div {...fade(4)} className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Revenue (12 months)</h2>
            <span className="text-xs font-mono text-emerald-400">+187% YoY</span>
          </div>
          <MiniChart />
          <div className="flex justify-between mt-2 text-[9px] text-text-secondary/50">
            <span>Apr</span><span>Jun</span><span>Aug</span><span>Oct</span><span>Dec</span><span>Mar</span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fade(5)} className="glass-card p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((a, i) => (
              <Link key={i} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-onyx/50 border border-glass-border hover:border-electric/30 transition-all group">
                <div className={`w-8 h-8 ${a.color} rounded-lg flex items-center justify-center`}>
                  <a.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold text-text-secondary group-hover:text-white transition-colors">{a.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Engine Status Grid */}
      <motion.div {...fade(6)} className="glass-card p-5 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">Engine Status</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {ENGINES.map((e, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-onyx/50 border border-glass-border/50">
              <span className={`w-1.5 h-1.5 rounded-full ${e.status === "active" ? "bg-emerald-400" : "bg-amber-400"} ${e.status === "active" ? "animate-pulse" : ""}`} />
              <e.icon className="w-3 h-3 text-text-secondary" />
              <span className="text-[10px] text-text-secondary truncate">{e.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div {...fade(7)} className="glass-card">
        <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Live AI Activity</h2>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live</span>
        </div>
        <div className="divide-y divide-glass-border">
          {ACTIVITY.map((a, i) => (
            <motion.div key={i} {...fade(i + 8)} className="flex items-center gap-4 px-6 py-3.5 hover:bg-glass-bg/30 transition-colors">
              <div className="p-2 rounded-lg bg-onyx border border-glass-border shrink-0">
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{a.action}</p>
                <p className="text-[10px] text-text-secondary">{a.agent}</p>
              </div>
              <span className="text-[10px] text-text-secondary whitespace-nowrap">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
