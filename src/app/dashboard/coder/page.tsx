"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Play, Copy, CheckCircle2, Loader2, FileCode2, Terminal } from "lucide-react";

export default function CoderPage() {
  const [objective, setObjective] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!objective.trim() || loading) return;
    setLoading(true); setCode(""); setExplanation("");
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "coder", objective, language }),
      });
      const d = await res.json();
      if (d.success) { setCode(d.code); setExplanation(d.explanation); }
    } catch {} finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const LANGS = ["TypeScript", "Python", "React", "SQL", "Shell", "Go"];

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Laptop className="w-3 h-3" /> Claude Sonnet 4
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Claude Coder</h1>
        <p className="text-sm text-text-secondary mt-1">Describe what you need. Claude writes it instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-card p-5">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Objective</label>
            <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={4}
              placeholder="e.g., Build a Next.js API route that processes Stripe webhooks..."
              className="w-full bg-onyx border border-glass-border rounded-xl p-3 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50 resize-none" />
          </div>
          <div className="glass-card p-5">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Language</label>
            <div className="flex flex-wrap gap-2">
              {LANGS.map(l => (
                <button key={l} onClick={() => setLanguage(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${language === l ? "bg-electric/20 border-electric/50 text-white" : "bg-onyx border-glass-border text-text-secondary hover:border-electric/30"}`}>{l}</button>
              ))}
            </div>
          </div>
          <button onClick={run} disabled={!objective.trim() || loading}
            className="w-full py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Code"}
          </button>
        </div>

        <div className="glass-card flex flex-col overflow-hidden min-h-[400px]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-glass-border bg-onyx/50">
            <div className="flex items-center gap-2"><Terminal className="w-4 h-4 text-electric" /><span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Output</span></div>
            {code && <button onClick={copy} className="flex items-center gap-1 text-xs text-text-secondary hover:text-white transition-colors">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Copy"}
            </button>}
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {!code && !loading && <div className="h-full flex items-center justify-center opacity-30"><FileCode2 className="w-10 h-10" /></div>}
            {loading && <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 text-electric animate-spin" /></div>}
            {code && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{code}</pre>
              {explanation && <div className="mt-4 pt-4 border-t border-glass-border text-sm text-gray-400 whitespace-pre-wrap">{explanation}</div>}
            </motion.div>}
          </div>
        </div>
      </div>
    </div>
  );
}
