"use client";

import { useState } from "react";
import { Copy, RefreshCw, Zap, Target, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdBuyerDashboard() {
  const [targetCpa, setTargetCpa] = useState("100");
  const [spend, setSpend] = useState("1250");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const runAdBuyer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/swarm/apex/ad-buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetCpa: parseFloat(targetCpa), 
          spendTarget: parseFloat(spend) 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.data);
      } else {
        alert("Ad Buyer failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-rose-500" />
          Apex Ad Buyer Engine
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Autonomous Media Buying Swarm. UMBRA continuously monitors Plausible and Stripe conversions. If your CPA exceeds the target, it instantly neutralizes losing ads mathematically logic and drafts new lethal hooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            
            <label className="block text-xs font-bold tracking-widest text-text-secondary uppercase mb-2">Target CPA (USD)</label>
            <input 
              type="number"
              value={targetCpa}
              onChange={(e) => setTargetCpa(e.target.value)}
              className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-rose-500 transition-colors mb-4 font-mono"
            />

            <label className="block text-xs font-bold tracking-widest text-text-secondary uppercase mb-2">Simulated Spend (24H)</label>
            <input 
              type="number"
              value={spend}
              onChange={(e) => setSpend(e.target.value)}
              className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-rose-500 transition-colors mb-6 font-mono"
            />
            
            <button 
              onClick={runAdBuyer}
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold py-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Ingesting Data...</>
                ) : (
                  <><TrendingUp className="w-4 h-4" /> Run Autonomous Audit</>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* OUTPUT COLUMN */}
        <div className="lg:col-span-2">
          {!analysis && !loading && (
            <div className="h-full min-h-[300px] border border-dashed border-glass-border rounded-xl flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-onyx/10">
              <Zap className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm max-w-sm">
                Awaiting audit trigger. UMBRA will compare your Target CPA against real-time pipeline velocity and authorize budget shifts if necessary.
              </p>
            </div>
          )}

          {analysis && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Status Header */}
              <div className={`glass-card p-6 border-l-4 ${analysis.status === "CRITICAL_CPA_SPIKE" ? "border-l-rose-500" : "border-l-emerald-500"} border-y-glass-border border-r-glass-border flex items-center justify-between`}>
                 <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">System Status</h3>
                   <div className="flex items-center gap-2">
                     {analysis.status === "CRITICAL_CPA_SPIKE" ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                     <span className={`text-lg font-bold ${analysis.status === "CRITICAL_CPA_SPIKE" ? "text-rose-500" : "text-emerald-500"}`}>
                       {analysis.status === "CRITICAL_CPA_SPIKE" ? "CRITICAL CPA SPIKE DETECTED" : "NOMINAL PERFORMANCE"}
                     </span>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Actual / Target</p>
                    <p className="text-2xl font-mono text-white">${analysis.actualCpa} <span className="text-text-secondary text-base">/ ${analysis.targetCpa}</span></p>
                 </div>
              </div>

              {/* Recommendation */}
              <div className="glass-card p-6 bg-onyx/40 border border-glass-border">
                <h4 className="text-sm font-bold text-white mb-2">Apex AI Recommendation</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{analysis.recommendation}</p>
              </div>

              {/* Generated Hooks (If Spike) */}
              {analysis.generatedHooks && analysis.generatedHooks.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4">Emergency Ad Variants Authored</h4>
                  {analysis.generatedHooks.map((hook: string, idx: number) => (
                    <div key={idx} className="group relative bg-[#0f0f0f] border border-glass-border rounded-lg p-5 transition-colors hover:border-rose-500/50">
                      <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-rose-500 uppercase">Variant {idx + 1}</span>
                      <p className="text-sm text-gray-200 mt-2 pr-24 font-medium">{hook}</p>
                      <button onClick={() => copyToClipboard(hook)} className="mt-4 text-xs text-text-secondary hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-3 h-3" /> Push to Meta Ads Manager
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
