"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, Ghost, Brain, Zap, ArrowUpRight } from "lucide-react";

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } },
});

const STATS = [
  { label: "Monthly Revenue", value: "$12,400", change: "+24%", icon: DollarSign, color: "text-gold" },
  { label: "Active Campaigns", value: "6", change: "+2", icon: TrendingUp, color: "text-electric" },
  { label: "Qualified Leads", value: "44", change: "+18", icon: Users, color: "text-emerald-glow" },
  { label: "God-Brain Entries", value: "127", change: "+31", icon: Brain, color: "text-electric-light" },
];

const RECENT_ACTIONS = [
  { agent: "Ghost Mode", action: "Killed campaign 'SaaS-FOMO-v3' — ROAS 0.7x", time: "2m ago", icon: Ghost },
  { agent: "Swarm Critic", action: "Approved ad copy after 3 rounds (Score: 9/10)", time: "14m ago", icon: Zap },
  { agent: "God-Brain", action: "Stored winning pattern: 'transformation hook + urgency'", time: "1h ago", icon: Brain },
];

export default function DashboardOverview() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold serif-text text-white mb-1">Command Center</h1>
        <p className="text-sm text-text-secondary">Your autonomous AI marketing system at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((s, i) => (
          <motion.div key={i} {...fadeUp(i)} className="glass-card p-5">
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

      {/* Recent Activity */}
      <div className="glass-card">
        <div className="px-6 py-4 border-b border-glass-border">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Recent AI Activity</h2>
        </div>
        <div className="divide-y divide-glass-border">
          {RECENT_ACTIONS.map((a, i) => (
            <motion.div key={i} {...fadeUp(i + 4)} className="flex items-center gap-4 px-6 py-4">
              <div className="p-2 rounded-lg bg-onyx border border-glass-border">
                <a.icon className="w-4 h-4 text-electric" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{a.action}</p>
                <p className="text-xs text-text-secondary">{a.agent}</p>
              </div>
              <span className="text-xs text-text-secondary whitespace-nowrap">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
