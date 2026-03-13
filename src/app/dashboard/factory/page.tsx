"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Play, Loader2, Code, Zap } from "lucide-react";

export default function FactoryPage() {
  const [objective, setObjective] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ generatedCode: string; result: unknown; error?: string; executionTimeMs: number } | null>(null);

  const run = async () => {
    if (!objective.trim() || loading) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective }),
      });
      const data = await res.json();
      setResult(data);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Wrench className="w-3 h-3" /> Autonomous
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Tool Factory</h1>
        <p className="text-sm text-text-secondary mt-1">Describe a problem. UMBRA writes the tool and executes it in real-time.</p>
      </div>

      <div className="glass-card p-5 mb-6">
        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">What tool do you need?</label>
        <div className="flex gap-3">
          <input value={objective} onChange={e => setObjective(e.target.value)} onKeyDown={e => e.key === "Enter" && run()}
            placeholder="e.g. Generate 10 random startup names with .com domain availability check"
            className="flex-1 bg-onyx border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 placeholder-text-secondary/40" />
          <button onClick={run} disabled={!objective.trim() || loading}
            className="px-6 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-400 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Build
          </button>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Generated Code */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-3 flex items-center gap-2">
              <Code className="w-3 h-3" /> Generated Tool
            </h3>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-onyx rounded-xl p-4 max-h-56 overflow-y-auto font-mono">{result.generatedCode}</pre>
          </div>

          {/* Execution Result */}
          <div className={`glass-card p-4 ${result.error ? "border-red-500/20" : "border-emerald-500/20"}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${result.error ? "text-red-400" : "text-emerald-400"}`}>
                {result.error ? "❌ Error" : "✅ Result"}
              </h3>
              <span className="text-[10px] text-text-secondary font-mono">{result.executionTimeMs}ms</span>
            </div>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-onyx rounded-xl p-4 max-h-56 overflow-y-auto font-mono">
              {result.error || JSON.stringify(result.result, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
