"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe2, Search, Activity, ArrowRight, CheckCircle2, XCircle, Zap, Target } from 'lucide-react';

interface FunnelAnalysis {
  domain: string;
  competitor: {
    headline: string;
    subheadline: string;
    cta: string;
    pricing: string;
    weaknesses: string[];
    conversionScore: number;
  };
  umbra: {
    headline: string;
    subheadline: string;
    cta: string;
    pricing: string;
    advantages: string[];
    conversionScore: number;
  };
}

export default function FunnelHijacker() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysis, setAnalysis] = useState<FunnelAnalysis | null>(null);

  const SCAN_PHASES = [
    "Resolving DNS...",
    "Extracting page structure...",
    "Analyzing pricing architecture...",
    "Scanning CTA patterns...",
    "Evaluating conversion mechanics...",
    "Generating superior variant...",
  ];
  const [currentPhase, setCurrentPhase] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isScanning) return;
    
    setIsScanning(true);
    setAnalysis(null);
    setScanProgress(0);

    // Simulate progressive scan phases
    for (let i = 0; i < SCAN_PHASES.length; i++) {
      setCurrentPhase(SCAN_PHASES[i]);
      setScanProgress(((i + 1) / SCAN_PHASES.length) * 100);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    }

    try {
      const res = await fetch('/api/swarm/funnel-hijack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.data);
      }
    } catch (err) {
      console.error('Funnel scan failed:', err);
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="backdrop-blur-3xl bg-black/40 border border-rose-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.05)]">
        <h1 className="text-2xl font-light text-white tracking-widest flex items-center gap-3 font-mono">
          <Shield className="w-7 h-7 text-rose-400" />
          [ FUNNEL HIJACKER ]
        </h1>
        <p className="text-neutral-400 text-xs tracking-widest uppercase mt-1">
          Competitive Intelligence Extraction & Superior Variant Generation Engine
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleScan} className="relative">
        <div className="backdrop-blur-3xl bg-black/60 border border-rose-500/20 rounded-2xl p-2 flex items-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.05)]">
          <div className="pl-4">
            <Globe2 className="w-5 h-5 text-rose-400/50" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter competitor URL to extract and destroy (e.g. competitor.com)"
            disabled={isScanning}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-neutral-600 outline-none font-mono disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isScanning || !url.trim()}
            className="px-6 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isScanning ? (
              <Activity className="w-4 h-4 text-rose-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              {isScanning ? 'Scanning...' : 'Extract'}
            </span>
          </button>
        </div>
      </form>

      {/* Scanning Progress */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="backdrop-blur-3xl bg-black/40 border border-rose-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-widest animate-pulse">{currentPhase}</span>
              <span className="text-xs font-mono text-neutral-500">{Math.round(scanProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                initial={{ width: '0%' }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results: Side-by-side comparison */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Comparison Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Their Score */}
              <div className="backdrop-blur-3xl bg-black/40 border border-rose-500/30 rounded-2xl p-6 text-center">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Their Conversion Score</p>
                <p className="text-5xl font-bold text-rose-400 font-mono drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">{analysis.competitor.conversionScore}</p>
                <p className="text-[10px] text-rose-400/60 uppercase tracking-widest mt-2">/ 100</p>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
              </div>

              {/* UMBRA Score */}
              <div className="backdrop-blur-3xl bg-black/40 border border-emerald-500/30 rounded-2xl p-6 text-center">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">UMBRA Variant Score</p>
                <p className="text-5xl font-bold text-emerald-400 font-mono drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">{analysis.umbra.conversionScore}</p>
                <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest mt-2">/ 100</p>
              </div>
            </div>

            {/* Detailed Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Competitor Column */}
              <div className="backdrop-blur-3xl bg-black/40 border border-rose-500/20 rounded-2xl overflow-hidden">
                <div className="bg-rose-500/10 border-b border-rose-500/20 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> {analysis.domain} — Their Funnel
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  {[
                    { label: 'Headline', value: analysis.competitor.headline },
                    { label: 'Subheadline', value: analysis.competitor.subheadline },
                    { label: 'CTA', value: analysis.competitor.cta },
                    { label: 'Pricing', value: analysis.competitor.pricing },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1 font-bold">{item.label}</p>
                      <p className="text-sm text-neutral-300 font-sans">{item.value}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-rose-500/10">
                    <p className="text-[9px] uppercase tracking-widest text-rose-400 mb-3 font-bold">Identified Weaknesses</p>
                    {analysis.competitor.weaknesses.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <XCircle className="w-3 h-3 text-rose-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-neutral-400">{w}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* UMBRA Column */}
              <div className="backdrop-blur-3xl bg-black/40 border border-emerald-500/20 rounded-2xl overflow-hidden">
                <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> UMBRA — Superior Variant
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  {[
                    { label: 'Headline', value: analysis.umbra.headline },
                    { label: 'Subheadline', value: analysis.umbra.subheadline },
                    { label: 'CTA', value: analysis.umbra.cta },
                    { label: 'Pricing', value: analysis.umbra.pricing },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1 font-bold">{item.label}</p>
                      <p className="text-sm text-white font-sans font-medium">{item.value}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-emerald-500/10">
                    <p className="text-[9px] uppercase tracking-widest text-emerald-400 mb-3 font-bold">Strategic Advantages</p>
                    {analysis.umbra.advantages.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-neutral-300">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deploy CTA */}
            <div className="backdrop-blur-3xl bg-black/40 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white font-mono uppercase tracking-widest">Variant Ready for Deployment</p>
                <p className="text-xs text-neutral-500 mt-1">The superior funnel has been synthesized and is pending authorization.</p>
              </div>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Target className="w-4 h-4" />
                Deploy to Production
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!analysis && !isScanning && (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
          <Shield className="w-16 h-16 mb-6 opacity-20" />
          <p className="text-sm uppercase tracking-widest font-mono mb-2">Extraction Engine Standing By</p>
          <p className="text-xs text-neutral-700 max-w-md text-center">
            Enter any competitor URL above. The system will deep-scan their entire funnel architecture, identify weaknesses, and generate a mathematically superior variant.
          </p>
        </div>
      )}
    </div>
  );
}
