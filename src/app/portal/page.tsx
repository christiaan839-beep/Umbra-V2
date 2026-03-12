"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, Eye, BarChart3, Zap, Shield } from "lucide-react";

const fadeUp = (d: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: d } } });

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-midnight">
      <header className="px-8 py-6 border-b border-glass-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-xs font-bold text-white">U</div>
            <span className="text-sm font-medium tracking-[0.15em] uppercase text-white">UMBRA</span>
          </div>
          <span className="text-xs text-text-secondary">Apex Growth Partners</span>
        </div>
      </header>

      <main className="px-8 py-10 max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-10">
          <h1 className="text-2xl serif-text font-light text-white mb-1">Performance Dashboard</h1>
          <p className="text-sm text-text-secondary">Real-time results from your AI marketing system.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Revenue Generated", value: "$47,320", icon: DollarSign, color: "text-gold" },
            { label: "Qualified Leads", value: "312", icon: Users, color: "text-electric" },
            { label: "ROAS", value: "5.6x", icon: TrendingUp, color: "text-emerald-glow" },
            { label: "Impressions", value: "2.1M", icon: Eye, color: "text-electric-light" },
          ].map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="glass-card p-5">
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.4)} className="glass-card">
            <div className="px-6 py-4 border-b border-glass-border"><h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Active Campaigns</h2></div>
            <div className="divide-y divide-glass-border">
              {[
                { name: "Q1 Lead Gen — Facebook", status: "Active", roas: "6.2x" },
                { name: "Retargeting — Instagram", status: "Active", roas: "4.8x" },
                { name: "YouTube Discovery", status: "Optimizing", roas: "3.1x" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3">
                  <div><p className="text-sm text-white">{c.name}</p><p className="text-xs text-text-secondary">{c.status}</p></div>
                  <span className="text-sm font-mono font-bold text-emerald-glow">{c.roas}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="glass-card">
            <div className="px-6 py-4 border-b border-glass-border"><h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">AI Activity</h2></div>
            <div className="divide-y divide-glass-border">
              {[
                { action: "Ghost Mode killed underperforming campaign", time: "2h ago", icon: Shield },
                { action: "Swarm Critic approved new ad copy (9/10)", time: "5h ago", icon: Zap },
                { action: "God-Brain stored new winning pattern", time: "12h ago", icon: BarChart3 },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3">
                  <a.icon className="w-4 h-4 text-electric shrink-0" />
                  <div className="flex-1"><p className="text-sm text-white">{a.action}</p></div>
                  <span className="text-xs text-text-secondary">{a.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
