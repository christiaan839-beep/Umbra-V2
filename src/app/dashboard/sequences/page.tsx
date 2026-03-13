"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Play, Clock, Target, ChevronRight, Copy, Check, Sparkles } from "lucide-react";

const TEMPLATES = [
  { id: "welcome", name: "Welcome", desc: "Onboard new users with trust-building emails", color: "#6c63ff", emoji: "👋" },
  { id: "value", name: "Value Delivery", desc: "Establish authority with tips and insights", color: "#00d4ff", emoji: "💎" },
  { id: "upsell", name: "Upsell", desc: "Convert free users to high-ticket buyers", color: "#ff3366", emoji: "🚀" },
  { id: "winback", name: "Win-Back", desc: "Re-engage churned subscribers", color: "#f59e0b", emoji: "🔄" },
];

interface Email { subject: string; body: string; delay: string; goal: string }
interface Sequence { name: string; emails: Email[] }

export default function SequencesPage() {
  const [selectedType, setSelectedType] = useState("welcome");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [activeEmail, setActiveEmail] = useState(0);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!product.trim() || generating) return;
    setGenerating(true); setSequence(null);
    try {
      const res = await fetch("/api/sequences", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, product, audience }),
      });
      const data = await res.json();
      if (data.sequence) { setSequence(data.sequence); setActiveEmail(0); }
    } catch {} finally { setGenerating(false); }
  };

  const copyEmail = () => {
    if (sequence) {
      const e = sequence.emails[activeEmail];
      navigator.clipboard.writeText(`Subject: ${e.subject}\n\n${e.body}`);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Mail className="w-3 h-3" /> Automated Drip
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Email Sequences</h1>
        <p className="text-sm text-text-secondary mt-1">Generate complete 5-email drip sequences with AI copywriting.</p>
      </div>

      {/* Template Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => setSelectedType(t.id)}
            className={`glass-card p-4 text-left transition-all ${selectedType === t.id ? "border-electric/40" : ""}`}>
            <span className="text-lg mb-1 block">{t.emoji}</span>
            <p className="text-xs font-bold text-white">{t.name}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="glass-card p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1.5 block">Product / Service</label>
            <input value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. 12-week fitness transformation"
              className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1.5 block">Target Audience</label>
            <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. busy professionals aged 30-45"
              className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50" />
          </div>
        </div>
        <button onClick={generate} disabled={!product.trim() || generating}
          className="w-full py-3 bg-white text-midnight font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50">
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating 5 emails...</> : <><Sparkles className="w-4 h-4" /> Generate Sequence</>}
        </button>
      </div>

      {/* Sequence Result */}
      <AnimatePresence>
        {sequence && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
            {/* Email Timeline */}
            <div className="w-56 shrink-0 space-y-2">
              {sequence.emails.map((e, i) => (
                <button key={i} onClick={() => setActiveEmail(i)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${activeEmail === i ? "glass-card border-electric/40" : "hover:bg-glass-bg/30"}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${activeEmail === i ? "bg-electric text-white" : "bg-onyx text-text-secondary"}`}>{i + 1}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{e.subject}</p>
                    <p className="text-[10px] text-text-secondary flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{e.delay}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Email Content */}
            <div className="flex-1 glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-electric">Email {activeEmail + 1} of {sequence.emails.length}</span>
                    <span className="text-[10px] text-text-secondary flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{sequence.emails[activeEmail].delay}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{sequence.emails[activeEmail].subject}</h3>
                </div>
                <button onClick={copyEmail} className="p-2 rounded-lg hover:bg-glass-bg transition-colors">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-text-secondary" />}
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-onyx/50 border border-glass-border mb-4">
                <Target className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-text-secondary">Goal: {sequence.emails[activeEmail].goal}</span>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {sequence.emails[activeEmail].body}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
