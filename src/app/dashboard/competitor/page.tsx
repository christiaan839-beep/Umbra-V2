"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Search, Loader2, AlertTriangle, Target, Swords } from "lucide-react";

export default function CompetitorPage() {
  const [competitor, setCompetitor] = useState("");
  const [business, setBusiness] = useState("AI Marketing Automation Platform");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyze = async () => {
    if (!competitor.trim() || loading) return;
    setLoading(true); setAnalysis(null);
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "competitor", competitor, business }),
      });
      const data = await res.json();
      if (data.analysis) setAnalysis(data.analysis);
    } catch {} finally { setLoading(false); }
  };

  const threatColor: Record<string, string> = {
    low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    high: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Shield className="w-3 h-3" /> War Room
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Competitor Intelligence</h1>
        <p className="text-sm text-text-secondary mt-1">AI-powered competitive analysis with threat detection and counter-strategies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Competitor Name</label>
          <input value={competitor} onChange={(e) => setCompetitor(e.target.value)} placeholder="e.g. Jasper AI, Copy.ai"
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
        </div>
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Your Business</label>
          <input value={business} onChange={(e) => setBusiness(e.target.value)}
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
        </div>
      </div>

      <button onClick={analyze} disabled={!competitor.trim() || loading}
        className="w-full py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-8">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? "Analyzing..." : "Run Intelligence"}
      </button>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{analysis.competitor}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${threatColor[analysis.threatLevel] || threatColor.low}`}>
              {analysis.threatLevel} threat
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2"><Target className="w-3 h-3" /> Strengths</h3>
              <ul className="space-y-1.5">{analysis.strengths?.map((s: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {s}</li>)}</ul>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Weaknesses</h3>
              <ul className="space-y-1.5">{analysis.weaknesses?.map((s: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {s}</li>)}</ul>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Recent Moves</h3>
              <ul className="space-y-1.5">{analysis.recentMoves?.map((s: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {s}</li>)}</ul>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-electric mb-3">Opportunities</h3>
              <ul className="space-y-1.5">{analysis.opportunities?.map((s: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {s}</li>)}</ul>
            </div>
          </div>

          <div className="glass-card p-4 border-electric/20 bg-electric/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-electric mb-2 flex items-center gap-2"><Swords className="w-3 h-3" /> Recommended Action</h3>
            <p className="text-sm text-white">{analysis.recommendation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
