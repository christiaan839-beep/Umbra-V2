"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ghost, Play, Loader2, TrendingUp, TrendingDown, Rocket, Skull, Scale } from "lucide-react";

export default function GhostModePage() {
  const [running, setRunning] = useState(false);
  const [actions, setActions] = useState<any[]>([]);

  const triggerCycle = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "ghost" }),
      });
      const data = await res.json();
      if (data.actions) setActions(data.actions);
    } catch (err) {} finally { setRunning(false); }
  };

  const iconMap: Record<string, typeof Rocket> = {
    LAUNCH: Rocket, KILL: Skull, SCALE: Scale, WAIT: Ghost,
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
            <Ghost className="w-3 h-3" /> Autonomous
          </div>
          <h1 className="text-2xl font-bold serif-text text-white">Ghost Mode</h1>
          <p className="text-sm text-text-secondary mt-1">Autonomous ad buying — AI evaluates, kills, and launches campaigns.</p>
        </div>
        <button onClick={triggerCycle} disabled={running}
          className="px-6 py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Running..." : "Execute Cycle"}
        </button>
      </div>

      {/* Campaign Table */}
      <div className="glass-card mb-8">
        <div className="px-6 py-4 border-b border-glass-border">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Active Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-glass-border text-xs text-text-secondary uppercase tracking-widest">
              <th className="text-left px-6 py-3">Campaign</th>
              <th className="text-right px-6 py-3">Spend</th>
              <th className="text-right px-6 py-3">Revenue</th>
              <th className="text-right px-6 py-3">ROAS</th>
            </tr></thead>
            <tbody>
              {[{ name: "AI Suite - Pain Point", spend: 340, rev: 2100 }, { name: "Ghost Mode - FOMO", spend: 280, rev: 190 }, { name: "ROI Calculator - Logic", spend: 150, rev: 890 }].map((c, i) => {
                const roas = c.rev / c.spend;
                return (
                  <tr key={i} className="border-b border-glass-border/50 hover:bg-glass-bg transition-colors">
                    <td className="px-6 py-3 text-white">{c.name}</td>
                    <td className="px-6 py-3 text-right font-mono text-text-secondary">${c.spend}</td>
                    <td className="px-6 py-3 text-right font-mono text-white">${c.rev}</td>
                    <td className={`px-6 py-3 text-right font-mono font-bold ${roas >= 2 ? "text-emerald-glow" : "text-red-400"}`}>
                      {roas.toFixed(1)}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ghost Actions Log */}
      {actions.length > 0 && (
        <div className="glass-card">
          <div className="px-6 py-4 border-b border-glass-border">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Cycle Results</h2>
          </div>
          <div className="divide-y divide-glass-border">
            {actions.map((a: any, i: number) => {
              const Icon = iconMap[a.type] || Ghost;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 px-6 py-4">
                  <div className={`p-2 rounded-lg ${a.type === "KILL" ? "bg-red-500/10 border-red-500/20" : a.type === "LAUNCH" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-electric/10 border-electric/20"} border`}>
                    <Icon className={`w-4 h-4 ${a.type === "KILL" ? "text-red-400" : a.type === "LAUNCH" ? "text-emerald-400" : "text-electric"}`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{a.type}</span>
                    <p className="text-sm text-white mt-1">{a.reasoning}</p>
                    {a.adCopy && <pre className="mt-2 text-xs text-text-secondary bg-onyx p-3 rounded-lg overflow-x-auto">{a.adCopy.substring(0, 300)}...</pre>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
