"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, Users, ArrowRight } from "lucide-react";

export function ROICalculator() {
  const [adSpend, setAdSpend] = useState(100000);
  const [agencyFee, setAgencyFee] = useState(40000);
  
  const UMBRA_COST = 2750;
  const currentTotal = adSpend + agencyFee;
  const umbraTotal = adSpend + UMBRA_COST;
  const monthlySavings = currentTotal - umbraTotal;
  const yearlySavings = monthlySavings * 12;

  const formatCurrency = (val: number) => 
    `R${val.toLocaleString('en-ZA')}`;

  return (
    <div className="w-full max-w-4xl mx-auto my-24">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white serif-text mb-4">Calculate Your Unfair Advantage</h3>
        <p className="text-neutral-400">See exactly how much capital UMBRA frees up for actual growth.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Sliders */}
        <div className="space-y-8 pr-0 md:pr-8 md:border-r border-white/10">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Ad Spend
              </label>
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(adSpend)}</span>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="1000000" 
              step="10000"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-white/10 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-4">
              <label className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" /> Current Agency Retainer
              </label>
              <span className="text-rose-400 font-mono font-bold">{formatCurrency(agencyFee)}</span>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="200000" 
              step="5000"
              value={agencyFee}
              onChange={(e) => setAgencyFee(Number(e.target.value))}
              className="w-full accent-rose-500 bg-white/10 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
              <span className="text-sm text-rose-100 font-medium">Your Current Monthly Cost:</span>
              <span className="text-2xl font-bold text-rose-400 font-mono tracking-tighter">{formatCurrency(currentTotal)}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-24 h-24 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">UMBRA Monthly Cost</h4>
            <div className="text-4xl font-black text-white font-mono tracking-tighter mb-1">{formatCurrency(UMBRA_COST)}</div>
            <p className="text-xs text-emerald-100/70">Flat rate. Infinite compute. Zero complaints.</p>
          </div>

          <div className="bg-gradient-to-br from-[#00B7FF]/20 to-blue-600/20 border border-[#00B7FF]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,183,255,0.2)]">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Capital Freed For Growth</h4>
            <div className="flex items-end gap-4 mb-2">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00B7FF] font-mono tracking-tighter">
                {formatCurrency(yearlySavings)}
              </span>
              <span className="text-sm text-[#00B7FF] font-bold uppercase tracking-widest pb-2">/ Year</span>
            </div>
            <p className="text-sm text-blue-100/80">
              That&apos;s {formatCurrency(monthlySavings)} every single month redirected straight into your ad-spend or bottom line.
            </p>
          </div>

          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group">
            Deploy UMBRA Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
