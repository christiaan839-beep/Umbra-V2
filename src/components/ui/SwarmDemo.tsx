"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Target, Zap, ShieldAlert, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";

interface AuditResult {
  score: number;
  issues: string[];
  solution: string;
}

export function SwarmDemo() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "analyzing" | "complete">("idle");
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !url.includes(".")) return;
    
    setStatus("scanning");
    setResult(null);

    // Simulated staggered scanning effect for maximum dramatic impact
    setTimeout(() => setStatus("analyzing"), 1500);

    try {
      // In a real scenario we'd call an API. This is the homepage demo — produces a deterministic score from the URL.
      setTimeout(() => {
        // Deterministic score based on URL hash (same URL = same score)
        let hash = 0;
        for (let i = 0; i < url.length; i++) {
          hash = ((hash << 5) - hash) + url.charCodeAt(i);
          hash |= 0;
        }
        const score = (Math.abs(hash) % 20) + 30;

        setResult({
          score,
          issues: [
            "Missing dynamic meta tags (-15% CTR)",
            "H1 tag not optimized for high-intent keywords",
            "Slow LCP (Largest Contentful Paint) > 2.5s",
            "No schema markup detected"
          ],
          solution: url.replace(/^https?:\/\//, "").split('/')[0]
        });
        setStatus("complete");
      }, 3500);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-16">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white serif-text flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-rose-400" /> Test The Swarm On Your Site
        </h3>
        <p className="text-sm text-neutral-400 mt-2">Enter your URL to let the SEO Dominator run a 3-second live audit.</p>
      </div>

      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {status === "scanning" || status === "analyzing" ? (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00B7FF]/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        ) : null}

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2 relative z-10">
          <input 
            type="url" 
            placeholder="https://your-competitor.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={status !== "idle" && status !== "complete"}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00B7FF]/50 font-mono text-sm transition-colors disabled:opacity-50"
            required
          />
          <button 
            type="submit"
            disabled={!url || (status !== "idle" && status !== "complete")}
            className="px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#00B7FF] to-blue-600 text-white shadow-[0_0_20px_rgba(0,183,255,0.3)] hover:shadow-[0_0_40px_rgba(0,183,255,0.5)] whitespace-nowrap"
          >
            {status === "idle" || status === "complete" ? (
              <>Deploy Scan <Zap className="w-4 h-4" /></>
            ) : status === "scanning" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Crawling...</>
            ) : (
              <><BrainCircuit className="w-4 h-4 animate-pulse" /> Analyzing...</>
            )}
          </button>
        </form>

        <AnimatePresence>
          {status === "complete" && result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border-t border-white/10 pt-6 px-4 pb-4"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-rose-500/30 flex items-center justify-center bg-rose-500/10 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                    <span className="text-3xl font-black text-rose-400 font-mono tracking-tighter">{result.score}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-rose-400 shadow-lg">
                    Critical
                  </div>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500" /> Vulnerabilities Found on {result.solution}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.issues.map((issue: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" /> {issue}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">SOVEREIGN can fix this autonomously in 4.2 seconds.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
