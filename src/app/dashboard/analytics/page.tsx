"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, MousePointer, Target, Eye } from "lucide-react";

const FUNNEL = [
  { label: "Impressions", value: 24500, color: "rgb(108, 99, 255)", width: "100%" },
  { label: "Clicks", value: 3200, color: "rgb(0, 212, 255)", width: "65%" },
  { label: "Leads", value: 890, color: "rgb(0, 255, 136)", width: "36%" },
  { label: "Conversions", value: 134, color: "rgb(255, 215, 0)", width: "18%" },
  { label: "Revenue", value: 12847, color: "rgb(255, 51, 102)", width: "8%", prefix: "$" },
];

const METRICS = [
  { label: "CTR", value: "13.1%", icon: MousePointer, color: "text-cyan-400" },
  { label: "Conv Rate", value: "15.1%", icon: Target, color: "text-emerald-400" },
  { label: "CPA", value: "$7.62", icon: DollarSign, color: "text-amber-400" },
  { label: "ROAS", value: "4.2x", icon: TrendingUp, color: "text-rose-400" },
];

const CAMPAIGNS = [
  { name: "AI Suite - Pain Point", spend: 340, revenue: 2100, status: "active" },
  { name: "Ghost Mode - FOMO", spend: 280, revenue: 190, status: "killed" },
  { name: "ROI Calculator - Logic", spend: 150, revenue: 890, status: "active" },
  { name: "Transformation Hook", spend: 95, revenue: 620, status: "active" },
  { name: "Exclusivity Angle", spend: 210, revenue: 1450, status: "scaling" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <BarChart3 className="w-3 h-3" /> Intelligence
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Analytics</h1>
        <p className="text-sm text-text-secondary mt-1">Full funnel visibility across all campaigns.</p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-4 text-center">
            <m.icon className={`w-4 h-4 mx-auto mb-2 ${m.color}`} />
            <p className="text-xl font-bold text-white font-mono">{m.value}</p>
            <p className="text-[10px] uppercase text-text-secondary tracking-widest">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-5 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Conversion Funnel
        </h2>
        <div className="space-y-3">
          {FUNNEL.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-4">
              <div className="w-24 text-xs text-text-secondary">{stage.label}</div>
              <div className="flex-1 h-7 bg-onyx rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stage.width }}
                  transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                  className="h-full rounded-lg"
                  style={{ background: stage.color }}
                />
              </div>
              <div className="w-20 text-right font-mono font-bold text-sm text-white">
                {stage.prefix || ""}{stage.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Campaign Performance Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-glass-border">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-electric" /> Campaign Performance
          </h2>
        </div>
        <div className="divide-y divide-glass-border">
          {CAMPAIGNS.map((c, i) => {
            const roas = c.spend > 0 ? (c.revenue / c.spend).toFixed(1) : "0.0";
            const roasNum = parseFloat(roas);
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{c.name}</p>
                </div>
                <div className="text-xs text-text-secondary font-mono text-right w-16">${c.spend}</div>
                <div className="text-xs text-white font-mono text-right w-16">${c.revenue.toLocaleString()}</div>
                <div className={`text-xs font-mono font-bold text-right w-14 ${roasNum >= 3 ? "text-emerald-400" : roasNum >= 1 ? "text-amber-400" : "text-red-400"}`}>{roas}x</div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                  c.status === "active" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
                  : c.status === "scaling" ? "text-electric border-electric/20 bg-electric/5"
                  : "text-red-400 border-red-400/20 bg-red-400/5"
                }`}>{c.status}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
