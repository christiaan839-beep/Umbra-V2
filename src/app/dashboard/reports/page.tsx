"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Eye, Download } from "lucide-react";

export default function ReportsPage() {
  const [clientName, setClientName] = useState("Acme Corp");
  const [period, setPeriod] = useState("March 2026");
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState("");

  const generate = async () => {
    setLoading(true); setHtml("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName, period,
          metrics: { revenue: 12847, leads: 890, conversions: 134, contentPieces: 42, engagement: 15.1 },
          highlights: [
            "Ghost Mode scaled winning ad set 3x — ROAS hit 4.2x",
            "Swarm-optimized email subject lines drove 38% open rate",
            "Competitor Intel flagged pricing drop — we countered in 24h",
          ],
          agentActivity: [
            { agent: "Ghost Mode", tasks: 47, results: "Launched 12 campaigns, killed 8 losers, scaled 4 winners" },
            { agent: "Swarm Critic", tasks: 23, results: "Debated 23 ad variations, selected top 5" },
            { agent: "Content Engine", tasks: 42, results: "Generated 42 posts across 3 platforms" },
            { agent: "Lead Prospector", tasks: 890, results: "Scraped and qualified 890 leads" },
          ],
        }),
      });
      const data = await res.json();
      if (data.html) setHtml(data.html);
    } catch {} finally { setLoading(false); }
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${clientName.replace(/\s/g, "_")}_Report_${period.replace(/\s/g, "_")}.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
          <FileText className="w-3 h-3" /> Client-Ready
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Report Generator</h1>
        <p className="text-sm text-text-secondary mt-1">Branded performance reports with AI insights. Justify the retainer.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Client Name</label>
          <input value={clientName} onChange={e => setClientName(e.target.value)}
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50" />
        </div>
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Period</label>
          <input value={period} onChange={e => setPeriod(e.target.value)}
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50" />
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={generate} disabled={loading}
          className="flex-1 py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          Generate Report
        </button>
        {html && (
          <button onClick={downloadHtml}
            className="px-6 py-3 border border-glass-border text-white font-bold rounded-xl hover:bg-glass-bg transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Download
          </button>
        )}
      </div>

      {html && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden rounded-2xl">
          <iframe srcDoc={html} className="w-full h-[600px] border-0" title="Report Preview" />
        </motion.div>
      )}
    </div>
  );
}
