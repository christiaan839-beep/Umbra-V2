"use client";

import React, { useState } from "react";
import { BarChart3, Loader2, Sparkles, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PdfExportButton from "@/components/ui/PdfExportButton";

interface KPI {
  metric: string;
  current: string;
  previous: string;
  change: string;
  status: string;
}

interface Section {
  title: string;
  content: string;
  highlights?: string[];
}

interface Recommendation {
  priority: string;
  action: string;
  expectedImpact: string;
}

interface Report {
  title: string;
  executiveSummary: string;
  kpis: KPI[];
  sections: Section[];
  recommendations: Recommendation[];
  nextMonthFocus: string[];
}

export default function ClientReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const [form, setForm] = useState({
    clientName: "",
    businessType: "",
    reportPeriod: "March 2026",
    focus: "SEO, Content Marketing, Lead Generation, Social Media",
  });

  const generate = async () => {
    if (!form.clientName) return;
    setIsGenerating(true);
    setReport(null);
    try {
      const res = await fetch("/api/agents/client-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setReport(data.report);
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <BarChart3 className="w-3 h-3" /> Agency Reports
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Client Report Generator</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Generate branded, executive-level performance reports that justify your retainer. Agencies charge R5,000-R10,000 just for monthly reporting — this does it in seconds.
        </p>
      </div>

      {/* Generator */}
      <div className="glass-card p-6 border border-glass-border mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Client Name</label>
            <input type="text" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})}
              placeholder="Acme Corp" className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Business Type</label>
            <input type="text" value={form.businessType} onChange={e => setForm({...form, businessType: e.target.value})}
              placeholder="Dental Practice" className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Report Period</label>
            <input type="text" value={form.reportPeriod} onChange={e => setForm({...form, reportPeriod: e.target.value})}
              className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Focus Areas</label>
            <input type="text" value={form.focus} onChange={e => setForm({...form, focus: e.target.value})}
              className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400" />
          </div>
        </div>
        <button onClick={generate} disabled={isGenerating || !form.clientName}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all disabled:opacity-50">
          {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Report...</> : <><Sparkles className="w-4 h-4" /> Generate Performance Report</>}
        </button>
      </div>

      <AnimatePresence>
        {report && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} id="report-content">
            {/* Report Header */}
            <div className="glass-card p-6 border border-amber-500/20 bg-amber-500/5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white serif-text">{report.title}</h2>
                  <p className="text-sm text-text-secondary mt-1">Prepared for {form.clientName}</p>
                </div>
                <PdfExportButton fileName={`${form.clientName}_Report_${form.reportPeriod}`} />
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{report.executiveSummary}</p>
            </div>

            {/* KPI Cards */}
            {report.kpis?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {report.kpis.map((kpi, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 border border-glass-border text-center">
                    <div className="text-[10px] uppercase tracking-widest text-text-secondary mb-2">{kpi.metric}</div>
                    <div className="text-2xl font-bold font-mono text-white mb-1">{kpi.current}</div>
                    <div className={`flex items-center justify-center gap-1 text-xs font-bold ${kpi.status === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                      {kpi.status === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.change}
                    </div>
                    <div className="text-[9px] text-text-secondary mt-1">vs {kpi.previous} prev</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Report Sections */}
            {report.sections?.map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                className="glass-card p-6 border border-glass-border mb-4">
                <h3 className="text-lg font-bold text-white mb-3">{section.title}</h3>
                <p className="text-sm text-neutral-300 leading-relaxed mb-4">{section.content}</p>
                {section.highlights && section.highlights.length > 0 && (
                  <div className="space-y-2">
                    {section.highlights.map((h: string, j: number) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-emerald-400">
                        <ArrowRight className="w-3 h-3 shrink-0" /> {h}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Recommendations */}
            {report.recommendations?.length > 0 && (
              <div className="glass-card p-6 border border-electric/20 bg-electric/5 mb-4">
                <h3 className="text-lg font-bold text-white mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {report.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-onyx/30 rounded-xl">
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded ${rec.priority === "HIGH" ? "bg-rose-500/20 text-rose-400" : rec.priority === "MEDIUM" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                        {rec.priority}
                      </span>
                      <div>
                        <p className="text-sm text-white font-medium">{rec.action}</p>
                        <p className="text-xs text-text-secondary mt-1">{rec.expectedImpact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
