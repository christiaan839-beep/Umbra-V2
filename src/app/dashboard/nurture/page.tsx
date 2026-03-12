"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Play, Loader2, Send } from "lucide-react";

export default function NurturePage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [stage, setStage] = useState<"cold" | "warm" | "hot">("warm");
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!name.trim() || loading) return;
    setLoading(true); setEmails([]);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "nurture", lead: { name, company, stage } }),
      });
      const data = await res.json();
      if (data.emails) setEmails(data.emails);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Mail className="w-3 h-3" /> AI Drip
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Nurture Sequences</h1>
        <p className="text-sm text-text-secondary mt-1">Generate AI-written email sequences for any lead stage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Lead Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah K."
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
        </div>
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Apex Growth"
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
        </div>
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Stage</label>
          <div className="flex gap-2">
            {(["cold", "warm", "hot"] as const).map(s => (
              <button key={s} onClick={() => setStage(s)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${stage === s ? "bg-electric/20 border-electric/50 text-white" : "bg-onyx border-glass-border text-text-secondary"}`}>
                {s === "hot" ? "🔴" : s === "warm" ? "🟡" : "⚪"} {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={generate} disabled={!name.trim() || loading}
        className="w-full py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-8">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
        {loading ? "Writing emails..." : "Generate Sequence"}
      </button>

      {emails.length > 0 && (
        <div className="space-y-4">
          {emails.map((email, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
              className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-3.5 h-3.5 text-electric" />
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Email {i + 1}</span>
                <span className="text-xs text-text-secondary/50 ml-auto">Send: Day {(i + 1) * 2}</span>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{email}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
