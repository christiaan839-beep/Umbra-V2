"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, Target, Mail, Building2, Copy, CheckCircle2 } from "lucide-react";

interface GeneratedEmail {
  subject: string;
  body: string;
  prospect: string;
}

export default function OutboundEngine() {
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [count, setCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emails, setEmails] = useState<GeneratedEmail[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!niche.trim()) return;
    setIsGenerating(true);
    setEmails([]);
    setStatus(null);

    try {
      const res = await fetch("/api/agents/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectIndustry: niche, yourOffer: `AI-powered marketing for ${niche} in ${location}`, channels: ["email"], sequenceLength: count }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const mapped = (data.sequence || []).map((step: { message: string; subject: string; channel: string }, i: number) => ({
        prospect: `${niche} Prospect ${i + 1}`,
        subject: step.subject || `Step ${i + 1}`,
        body: step.message || "",
      }));
      setEmails(mapped);
      setStatus(`${mapped.length} hyper-personalized outreach steps synthesized.`);
    } catch (err: any) {
      setStatus("Generation failed: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyEmail = (email: GeneratedEmail) => {
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    setStatus("Email copied to clipboard.");
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col gap-6 p-4 lg:p-8 z-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-widest font-mono flex items-center gap-3">
            <Send className="w-6 h-6 text-orange-400" />
            OUTBOUND ENGINE
          </h1>
          <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-[10px] font-bold mt-1">
            Autonomous Cold Email Synthesis
          </p>
        </div>
      </div>

      {/* Config Panel */}
      <div className="bg-black/40 backdrop-blur-2xl border border-orange-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(249,115,22,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 flex items-center gap-2 block">
              <Target className="w-3 h-3 text-orange-400" /> Target Niche
            </label>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. MedSpas, Dental Clinics, Real Estate..."
              className="w-full bg-black/60 border border-orange-500/20 rounded-xl p-3 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 flex items-center gap-2 block">
              <Building2 className="w-3 h-3 text-orange-400" /> Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Miami, FL or nationwide"
              className="w-full bg-black/60 border border-orange-500/20 rounded-xl p-3 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 flex items-center gap-2 block">
              <Mail className="w-3 h-3 text-orange-400" /> Prospect Count
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-black/60 border border-orange-500/20 rounded-xl p-3 text-sm text-neutral-300 focus:outline-none focus:border-orange-500/50 font-mono"
            >
              <option value={3}>3 Prospects</option>
              <option value={5}>5 Prospects</option>
              <option value={10}>10 Prospects</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 relative z-10">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !niche.trim()}
            className="px-8 py-4 bg-gradient-to-r from-orange-500/10 to-orange-500/5 hover:from-orange-500/20 hover:to-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl flex items-center gap-3 transition-all group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-bold font-mono text-xs"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            {isGenerating ? "Synthesizing Outreach..." : "Launch Outbound Swarm"}
          </button>
          <AnimatePresence>
            {status && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-mono text-orange-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {status}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Generated Emails Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {emails.map((email, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-colors shadow-xl"
          >
            <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">Prospect {i + 1}</span>
              <button onClick={() => copyEmail(email)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">To</p>
              <p className="text-sm text-white font-medium mb-4">{email.prospect}</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Subject</p>
              <p className="text-sm text-orange-300 font-mono mb-4">{email.subject}</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Body</p>
              <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-wrap line-clamp-[12]">{email.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
