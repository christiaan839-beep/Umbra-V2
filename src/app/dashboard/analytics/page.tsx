"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, MousePointer, Target, Eye } from "lucide-react";

const FUNNEL = [
  { label: "Impressions", value: 24500, color: "rgb(108, 99, 255)", width: "100%" },
  { label: "Clicks", value: 3200, color: "rgb(0, 212, 255)", width: "65%" },
  { label: "Leads", value: 890, color: "rgb(0, 255, 136)", width: "36%" },
  { label: "Conversions", value: 134, color: "rgb(255, 215, 0)", width: "18%" },
  { label: "Revenue", value: 128470, color: "rgb(255, 51, 102)", width: "8%", prefix: "R" },
];

const METRICS = [
  { label: "CTR", value: "13.1%", icon: MousePointer, color: "text-cyan-400" },
  { label: "Conv Rate", value: "15.1%", icon: Target, color: "text-emerald-400" },
  { label: "CPA", value: "R76.20", icon: DollarSign, color: "text-amber-400" },
  { label: "ROAS", value: "4.2x", icon: TrendingUp, color: "text-rose-400" },
];

const CAMPAIGNS = [
  { name: "AI Suite — Pain Point Ads", spend: 3400, revenue: 21000, status: "active" },
  { name: "ROI Calculator — Logic Hook", spend: 1500, revenue: 8900, status: "active" },
  { name: "Transformation Stories", spend: 950, revenue: 6200, status: "active" },
  { name: "Exclusivity Angle", spend: 2100, revenue: 14500, status: "scaling" },
  { name: "Brand Awareness — CPM", spend: 2800, revenue: 1900, status: "paused" },
];

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B7FF]/10 border border-[#00B7FF]/20 text-[#00B7FF] text-xs font-bold uppercase tracking-wider mb-3">
          <BarChart3 className="w-3 h-3" /> Intelligence
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Analytics</h1>
        <p className="text-sm text-neutral-400 mt-1">Full funnel visibility across all campaigns.</p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-black/40 backdrop-blur-xl border border-[#00B7FF]/10 rounded-2xl p-4 text-center">
            <m.icon className={`w-4 h-4 mx-auto mb-2 ${m.color}`} />
            <p className="text-xl font-bold text-white font-mono">{m.value}</p>
            <p className="text-[10px] uppercase text-neutral-500 tracking-widest">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-black/40 backdrop-blur-xl border border-[#00B7FF]/10 rounded-2xl p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Conversion Funnel
        </h2>
        <div className="space-y-3">
          {FUNNEL.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-4">
              <div className="w-24 text-xs text-neutral-500">{stage.label}</div>
              <div className="flex-1 h-7 bg-neutral-900 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stage.width }}
                  transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                  className="h-full rounded-lg"
                  style={{ background: stage.color }}
                />
              </div>
              <div className="w-24 text-right font-mono font-bold text-sm text-white">
                {stage.prefix || ""}{stage.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Campaign Performance Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-black/40 backdrop-blur-xl border border-[#00B7FF]/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#00B7FF]/10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#00B7FF]" /> Campaign Performance
          </h2>
        </div>
        <div className="divide-y divide-[#00B7FF]/5">
          {/* Header */}
          <div className="flex items-center gap-4 px-5 py-2.5 text-[9px] uppercase tracking-widest text-neutral-600 font-bold">
            <div className="flex-1">Campaign</div>
            <div className="w-20 text-right">Spend</div>
            <div className="w-20 text-right">Revenue</div>
            <div className="w-14 text-right">ROAS</div>
            <div className="w-16 text-right">Status</div>
          </div>
          {CAMPAIGNS.map((c, i) => {
            const roas = c.spend > 0 ? (c.revenue / c.spend).toFixed(1) : "0.0";
            const roasNum = parseFloat(roas);
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{c.name}</p>
                </div>
                <div className="text-xs text-neutral-500 font-mono text-right w-20">R{c.spend.toLocaleString()}</div>
                <div className="text-xs text-white font-mono text-right w-20">R{c.revenue.toLocaleString()}</div>
                <div className={`text-xs font-mono font-bold text-right w-14 ${roasNum >= 3 ? "text-emerald-400" : roasNum >= 1 ? "text-amber-400" : "text-red-400"}`}>{roas}x</div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border w-16 text-center ${
                  c.status === "active" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
                  : c.status === "scaling" ? "text-[#00B7FF] border-[#00B7FF]/20 bg-[#00B7FF]/5"
                  : "text-neutral-500 border-neutral-500/20 bg-neutral-500/5"
                }`}>{c.status}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-[10px] text-neutral-600 text-center tracking-widest uppercase">
        Sample data shown. Connect your ad accounts to see live performance metrics.
      </p>
    </div>
  );
}
