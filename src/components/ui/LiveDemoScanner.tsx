"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Finding {
  category: string;
  score: number;
  finding: string;
  fix: string;
}

interface ScanResult {
  company?: string;
  overallScore?: number;
  findings?: Finding[];
  topOpportunity?: string;
  estimatedMonthlyTraffic?: string;
}

function ScoreBar({ score, label, delay }: { score: number; label: string; delay: number }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  const textColor = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: delay + 0.2 }}
        />
      </div>
      <span className={`text-xs font-bold font-mono ${textColor} w-8 text-right`}>{score}</span>
    </motion.div>
  );
}

export function LiveDemoScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/demo/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();

      if (data.limited) {
        setError("Rate limited — sign up for unlimited scans.");
        return;
      }
      if (data.success && data.scan) {
        setResult(data.scan);
      } else {
        setError(data.error || "Scan failed. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="Enter a competitor URL to scan..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#00B7FF]/40 transition-all font-mono"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleScan}
            disabled={loading || !url.trim()}
            className="px-6 py-4 bg-gradient-to-r from-[#00B7FF] to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 disabled:opacity-40 hover:opacity-90 transition-all shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Scanning..." : "Scan Free"}
          </button>
        </div>
        <p className="text-[10px] text-neutral-600 mt-2 text-center uppercase tracking-widest">
          No signup required • Live AI analysis • 3 free scans
        </p>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <div className="glass-card border border-glass-border p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#00B7FF] animate-spin" />
                <span className="text-xs text-neutral-400 font-mono uppercase tracking-widest">AI agents analyzing...</span>
              </div>
              {["Crawling website", "Analyzing SEO signals", "Checking content quality", "Scoring conversions"].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 1.5 }}
                  className="flex items-center gap-2 text-xs text-neutral-500"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="glass-card border border-glass-border p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">{result.company || url}</h3>
                  <p className="text-xs text-neutral-500 mt-1">AI competitive scan complete</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold font-mono ${
                    (result.overallScore || 0) >= 80 ? "text-emerald-400" :
                    (result.overallScore || 0) >= 60 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {result.overallScore || "—"}<span className="text-sm text-neutral-500">/100</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Overall Score</p>
                </div>
              </div>

              {/* Score Bars */}
              {result.findings && (
                <div className="space-y-3 mb-6">
                  {result.findings.map((f, i) => (
                    <ScoreBar key={i} score={f.score} label={f.category} delay={i * 0.15} />
                  ))}
                </div>
              )}

              {/* Findings */}
              {result.findings && (
                <div className="space-y-3 mb-6">
                  {result.findings.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <p className="text-xs text-white font-semibold mb-1">{f.finding}</p>
                      <p className="text-xs text-emerald-400/80">
                        <ShieldCheck className="w-3 h-3 inline mr-1" />
                        Fix: {f.fix}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Top Opportunity */}
              {result.topOpportunity && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="p-4 rounded-xl bg-[#00B7FF]/5 border border-[#00B7FF]/20 mb-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#00B7FF]" />
                    <span className="text-[10px] font-bold text-[#00B7FF] uppercase tracking-widest">Biggest Opportunity</span>
                  </div>
                  <p className="text-sm text-neutral-300">{result.topOpportunity}</p>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center"
              >
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#00B7FF] to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all"
                >
                  Get Full Analysis — Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[10px] text-neutral-600 mt-2">29 AI tools • No credit card • Cancel anytime</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
