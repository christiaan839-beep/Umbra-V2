"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Search, Plus, Loader2, Database } from "lucide-react";

export default function MemoryPage() {
  const [mode, setMode] = useState<"store" | "search">("search");
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stored, setStored] = useState(false);

  const run = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setStored(false); setResults([]);
    try {
      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "store" ? { action: "remember", text: input } : { action: "recall", query: input }),
      });
      const data = await res.json();
      if (mode === "store" && data.success) { setStored(true); setInput(""); }
      if (mode === "search" && data.results) setResults(data.results);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Brain className="w-3 h-3" /> Vector RAG
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">God-Brain</h1>
        <p className="text-sm text-text-secondary mt-1">Store knowledge. Search semantically. Every agent draws from this memory.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["search", "store"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setResults([]); setStored(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${mode === m ? "bg-electric/20 border-electric/50 text-white" : "bg-onyx border-glass-border text-text-secondary"}`}>
            {m === "search" ? <><Search className="w-3.5 h-3.5 inline mr-1.5" />Search</> : <><Plus className="w-3.5 h-3.5 inline mr-1.5" />Store</>}
          </button>
        ))}
      </div>

      <div className="glass-card p-5 mb-6">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3}
          placeholder={mode === "search" ? "Search the God-Brain... e.g. 'best performing ad hooks'" : "Store a new memory... e.g. 'Transformation hooks convert 3x better than FOMO'"}
          className="w-full bg-onyx border border-glass-border rounded-xl p-3 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50 resize-none" />
        <button onClick={run} disabled={!input.trim() || loading}
          className="mt-3 w-full py-2.5 bg-white text-midnight font-bold rounded-xl text-sm hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "search" ? <Search className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {loading ? "Processing..." : mode === "search" ? "Search Memory" : "Store Memory"}
        </button>
      </div>

      {stored && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6 border-emerald-500/20 bg-emerald-500/5 text-center text-sm text-emerald-400">✅ Memory stored successfully</motion.div>}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card p-4 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-onyx border border-glass-border shrink-0"><Database className="w-4 h-4 text-electric" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{r.entry?.text || r.text}</p>
                <p className="text-xs text-text-secondary mt-1">Similarity: {(r.score * 100).toFixed(1)}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
