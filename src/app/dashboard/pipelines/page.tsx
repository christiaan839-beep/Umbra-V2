"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Play, Loader2, CheckCircle2, Clock } from "lucide-react";

const TEMPLATES = [
  { id: "full-campaign", name: "Full Campaign", desc: "Research → Content → Video brief", steps: 3 },
  { id: "lead-nurture", name: "Lead Nurture", desc: "Research → Email sequence", steps: 2 },
  { id: "competitor-intel", name: "Competitor Intel", desc: "Deep research → Strategic positioning", steps: 2 },
];

interface StepResult { agent: string; output: string; duration: number }

export default function PipelinesPage() {
  const [selected, setSelected] = useState("full-campaign");
  const [topic, setTopic] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<StepResult[] | null>(null);
  const [activeStep, setActiveStep] = useState(-1);

  const run = async () => {
    if (!topic.trim() || running) return;
    setRunning(true); setResults(null); setActiveStep(0);
    try {
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selected, topic }),
      });
      const data = await res.json();
      if (data.result?.steps) {
        setResults(data.result.steps);
        setActiveStep(data.result.steps.length);
      }
    } catch {} finally { setRunning(false); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          <GitBranch className="w-3 h-3" /> Automation
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Pipeline Builder</h1>
        <p className="text-sm text-text-secondary mt-1">Chain agents in sequence. One click launches a full production pipeline.</p>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)}
            className={`glass-card p-4 text-left transition-all ${selected === t.id ? "border-electric/40 bg-electric/5" : "hover:bg-glass-bg"}`}>
            <p className="text-sm font-bold text-white mb-0.5">{t.name}</p>
            <p className="text-[10px] text-text-secondary">{t.desc}</p>
            <p className="text-[10px] text-electric mt-2">{t.steps} agents</p>
          </button>
        ))}
      </div>

      {/* Input + Run */}
      <div className="flex gap-3 mb-6">
        <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && run()}
          placeholder="e.g. AI-powered fitness coaching app"
          className="flex-1 bg-onyx border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-electric/50 placeholder-text-secondary/40" />
        <button onClick={run} disabled={!topic.trim() || running}
          className="px-6 py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run
        </button>
      </div>

      {/* Results */}
      {(running || results) && (
        <div className="space-y-3">
          {(results || TEMPLATES.find(t => t.id === selected)?.desc.split(" → ").map((s, i) => ({ agent: s.toLowerCase(), output: "", duration: 0 })) || []).map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 ${i < activeStep ? "" : "opacity-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                {i < activeStep && results ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : i === activeStep && running ? (
                  <Loader2 className="w-4 h-4 text-electric animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-text-secondary" />
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Step {i + 1} — {step.agent}</span>
                {step.duration > 0 && <span className="text-[10px] text-text-secondary ml-auto font-mono">{(step.duration / 1000).toFixed(1)}s</span>}
              </div>
              {step.output && (
                <pre className="text-xs text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">{step.output}</pre>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
