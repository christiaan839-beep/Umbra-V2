"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Zap,
  Search,
  Palette,
  FileText,
  Target,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
  Rocket,
} from "lucide-react";
import Link from "next/link";

interface Pipeline {
  id: string;
  name: string;
  description: string;
  agents: string[];
  color: string;
}

interface StepResult {
  agent: string;
  status: string;
  output: string;
  durationMs: number;
}

const AGENT_STATUS = [
  { name: "SEO Dominator", icon: Search, status: "ready", color: "text-rose-400", href: "/dashboard/seo-dominator" },
  { name: "Design Agency", icon: Palette, status: "ready", color: "text-violet-400", href: "/dashboard/designer" },
  { name: "Content Factory", icon: FileText, status: "ready", color: "text-emerald-400", href: "/dashboard/content-factory" },
  { name: "Ghost Mode (Ads)", icon: Zap, status: "ready", color: "text-amber-400", href: "/dashboard/ghost-mode" },
  { name: "High-Ticket Closer", icon: Target, status: "ready", color: "text-pink-400", href: "/dashboard/leads" },
  { name: "Competitor Intel", icon: Activity, status: "ready", color: "text-[#00B7FF]", href: "/dashboard/competitor" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", glow: "shadow-[0_0_30px_rgba(244,63,94,0.2)]" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-[0_0_30px_rgba(139,92,246,0.2)]" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]" },
};

export default function AgencyHubPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [activePipeline, setActivePipeline] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<StepResult[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/agents/orchestrate")
      .then((r) => r.json())
      .then((d) => setPipelines(d.pipelines || []))
      .catch(() => {});
  }, []);

  const executePipeline = async (id: string) => {
    setLoading(true);
    setActivePipeline(id);
    setSteps([]);
    setTotalTime(0);

    const parsedParams: Record<string, any> = {};
    for (const [k, v] of Object.entries(params)) {
      if (k === "competitors") {
        parsedParams[k] = v.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        parsedParams[k] = v;
      }
    }

    try {
      const res = await fetch("/api/agents/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipelineId: id, params: parsedParams }),
      });
      const data = await res.json();
      setSteps(data.steps || []);
      setTotalTime(data.totalDurationMs || 0);
    } catch (e: any) {
      setSteps([{ agent: "orchestrator", status: "failed", output: e.message, durationMs: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative z-10 p-4 lg:p-8">
      {/* Header */}
      <div className="border-b border-[#00B7FF]/20 pb-6 backdrop-blur-3xl bg-black/40 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,183,255,0.05)] border-t border-[#00B7FF]/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#00B7FF]/10 border border-[#00B7FF]/30 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-[#00B7FF]" />
          </div>
          <div>
            <h2 className="text-2xl font-light text-white tracking-widest font-mono">
              AGENCY HUB
            </h2>
            <p className="text-neutral-400 text-xs tracking-widest uppercase">
              Unified command center — orchestrate every agent from one screen
            </p>
          </div>
        </div>
      </div>

      {/* Agent Status Grid */}
      <div>
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-4 flex items-center gap-2">
          <Cpu className="w-3 h-3" /> Agent Fleet Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {AGENT_STATUS.map((agent) => (
            <Link
              key={agent.name}
              href={agent.href}
              className="bg-black/40 backdrop-blur-xl border border-[#00B7FF]/10 rounded-xl p-4 text-center hover:border-[#00B7FF]/30 transition-all group"
            >
              <agent.icon className={`w-5 h-5 mx-auto mb-2 ${agent.color}`} />
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors font-bold">
                {agent.name}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 8px #34d399" }} />
                <span className="text-[8px] text-emerald-400/80 uppercase tracking-widest">Ready</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pipeline Parameters */}
      <div className="bg-black/40 backdrop-blur-xl border border-[#00B7FF]/10 rounded-2xl p-6">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> Pipeline Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "topic", label: "Topic / Niche", placeholder: "biohacking, cold plunge therapy" },
            { name: "business", label: "Business Name", placeholder: "The Clarity Protocol" },
            { name: "competitors", label: "Competitors (comma-separated)", placeholder: "competitor1.com, competitor2.com" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5 block">
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={params[field.name] || ""}
                onChange={(e) => setParams((p) => ({ ...p, [field.name]: e.target.value }))}
                className="w-full bg-black/60 border border-[#00B7FF]/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#00B7FF]/40 transition-colors font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Cards */}
      <div>
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-4 flex items-center gap-2">
          <Zap className="w-3 h-3" /> One-Click Pipelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pipelines.map((pipeline) => {
            const colors = COLOR_MAP[pipeline.color] || COLOR_MAP.emerald;
            const isActive = activePipeline === pipeline.id;

            return (
              <motion.div
                key={pipeline.id}
                whileHover={{ scale: 1.01 }}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-6 backdrop-blur-xl ${isActive ? colors.glow : ""}`}
              >
                <h4 className={`text-sm font-bold tracking-wider uppercase ${colors.text} mb-2`}>
                  {pipeline.name}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  {pipeline.description}
                </p>
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  {pipeline.agents.map((agent, i) => (
                    <React.Fragment key={i}>
                      <span className="text-[8px] bg-black/40 px-2 py-1 rounded-full text-neutral-400 border border-[#00B7FF]/10">
                        {agent}
                      </span>
                      {i < pipeline.agents.length - 1 && (
                        <ArrowRight className="w-2.5 h-2.5 text-neutral-600" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <button
                  onClick={() => executePipeline(pipeline.id)}
                  disabled={loading}
                  className={`w-full py-2.5 rounded-xl border ${colors.border} ${colors.text} font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading && isActive ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Executing Pipeline...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-3 h-3" /> Launch Pipeline
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pipeline Results */}
      <AnimatePresence>
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="bg-[#0a0a0a]/80 border-b border-[#00B7FF]/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-[#00B7FF]" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#00B7FF] font-mono">
                  Pipeline Execution Log
                </span>
              </div>
              {totalTime > 0 && (
                <div className="flex items-center gap-1 text-[9px] text-neutral-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {(totalTime / 1000).toFixed(1)}s total
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    {step.status === "complete" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                    {i < steps.length - 1 && (
                      <div className="w-px h-full bg-[#00B7FF]/10 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {step.agent}
                      </span>
                      <span className="text-[9px] text-neutral-500 font-mono">
                        {(step.durationMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <pre className="text-[10px] text-neutral-400 font-mono whitespace-pre-wrap leading-relaxed bg-black/30 rounded-lg p-3 border border-[#00B7FF]/5">
                      {step.output}
                    </pre>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
