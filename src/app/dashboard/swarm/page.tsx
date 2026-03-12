"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Play, Loader2, MessageSquare } from "lucide-react";

export default function SwarmPage() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const [final, setFinal] = useState("");

  const run = async () => {
    if (!goal.trim() || loading) return;
    setLoading(true); setSteps([]); setFinal("");
    try {
      const res = await fetch("/api/swarm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, preset: "ad", angle: "Transformation" }),
      });
      const data = await res.json();
      if (data.success) { setSteps(data.steps || []); setFinal(data.finalOutput || ""); }
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Code className="w-3 h-3" /> Adversarial Debate
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Swarm Critic</h1>
        <p className="text-sm text-text-secondary mt-1">Creator writes. Critic tears it apart. Repeat until perfect.</p>
      </div>

      <div className="glass-card p-5 mb-6">
        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Product / Goal</label>
        <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={2}
          placeholder="e.g., AI marketing platform that runs ads autonomously"
          className="w-full bg-onyx border border-glass-border rounded-xl p-3 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50 resize-none" />
        <button onClick={run} disabled={!goal.trim() || loading}
          className="mt-3 w-full py-2.5 bg-white text-midnight font-bold rounded-xl text-sm hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? "Debating..." : "Start Swarm Debate"}
        </button>
      </div>

      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((s: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: s.agent === "Creator" ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 ${s.agent === "Critic" ? "border-l-2 border-l-rose-glow" : "border-l-2 border-l-electric"}`}>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className={`w-3.5 h-3.5 ${s.agent === "Creator" ? "text-electric" : "text-rose-glow"}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">{s.agent}</span>
                {s.score && <span className="text-xs font-mono text-text-secondary ml-auto">Score: {s.score}/10</span>}
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{s.output?.substring(0, 500)}{s.output?.length > 500 ? "..." : ""}</p>
            </motion.div>
          ))}

          {final && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">✅ Final Approved Output</p>
              <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{final}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
