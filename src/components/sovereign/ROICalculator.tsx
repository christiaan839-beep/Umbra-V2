"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, TrendingDown, DollarSign, XCircle, CheckCircle2 } from "lucide-react";

export function ROICalculator() {
  const [agencyRetainer, setAgencyRetainer] = useState<number>(5000);
  const [adSpend, setAdSpend] = useState<number>(3000);

  const agencyTotal = agencyRetainer + adSpend;
  const umbraTotal = 497 + adSpend; // SOVEREIGN SaaS fee + spend
  const monthlySavings = agencyRetainer - 497;
  const yearlySavings = monthlySavings * 12;

  // Removed unused agency/umbra effective spend variables natively here

  return (
    <div className="w-full max-w-5xl mx-auto glass-card p-1 border border-glass-border overflow-hidden">
      <div className="bg-onyx/80 p-8 md:p-12 rounded-[22px]">
        
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8 text-rose-glow" />
            The Mathematical Reality
          </h3>
          <p className="text-text-secondary mt-2">What happens when you fire your agency and deploy SOVEREIGN.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold tracking-widest text-text-secondary uppercase mb-4">
                Current Agency Retainer (Monthly)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input 
                  type="number"
                  value={agencyRetainer}
                  onChange={(e) => setAgencyRetainer(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-glass-border rounded-xl pl-12 pr-4 py-4 text-white text-xl font-mono focus:outline-none focus:border-rose-glow transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold tracking-widest text-text-secondary uppercase mb-4">
                Monthly Ad Spend
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input 
                  type="number"
                  value={adSpend}
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-glass-border rounded-xl pl-12 pr-4 py-4 text-white text-xl font-mono focus:outline-none focus:border-rose-glow transition-colors"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-sm text-rose-200 flex items-start gap-2">
                <TrendingDown className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                Agencies typically consume 20% of your Ad Spend in &quot;unseen management fees&quot; or markups. <strong>SOVEREIGN puts 100% of your budget directly into the algorithm.</strong>
              </p>
            </div>
          </div>

          {/* Outputs */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-[#0a0a0a] border border-glass-border">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-text-secondary uppercase">Agency Cost</span>
                </div>
                <div className="text-2xl font-mono font-bold text-rose-500">${agencyTotal.toLocaleString()}</div>
              </div>
              
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400/80 uppercase">SOVEREIGN Cost</span>
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-400">${umbraTotal.toLocaleString()}</div>
              </div>
            </div>

            <motion.div 
              className="p-8 rounded-xl bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-glass-border text-center"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">Yearly Cash Recovered</p>
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-electric to-rose-glow tracking-tighter">
                ${yearlySavings.toLocaleString()}
              </div>
              <p className="text-sm text-text-secondary mt-4">
                Added directly back to your bottom line, or available for pure ad spend scaling.
              </p>
            </motion.div>

            <button className="w-full py-5 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group">
              Deploy SOVEREIGN Ecosystem
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
