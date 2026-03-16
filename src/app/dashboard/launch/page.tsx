"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Send, Copy, CheckCircle2, Sparkles, Target, Users, Mail } from "lucide-react";

export default function LaunchPage() {
  const [prospectName, setProspectName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [generating, setGenerating] = useState(false);
  const [email, setEmail] = useState<{ subject: string; body: string; followUp: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generateOutreach = async () => {
    if (!prospectName || !businessName) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/agents/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectName, prospectCompany: businessName, prospectIndustry: industry, yourOffer: "AI-powered marketing automation that replaces your entire agency", channels: ["email"], sequenceLength: 2 }),
      });
      const data = await res.json();
      if (data.success && data.sequence?.length > 0) {
        const first = data.sequence[0];
        const followUp = data.sequence[1];
        setEmail({
          subject: first.subject || "Your growth is stalling",
          body: first.message || "",
          followUp: followUp?.message || "Following up on my previous email...",
        });
      }
    } catch (err) {
      console.error("Outreach generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const copyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Rocket className="w-3 h-3" /> Launch Center
        </div>
        <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Go-To-Market Command</h1>
        <p className="text-sm text-[#8A95A5] mt-2 font-mono uppercase tracking-widest">
          Generate AI-powered outreach and close your first clients
        </p>
      </div>

      {/* Launch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Emails Sent", value: "0", icon: Mail, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Responses", value: "0", icon: Send, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Demos Booked", value: "0", icon: Target, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Clients Won", value: "0", icon: Users, color: "text-rose-400", bg: "bg-rose-400/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 border border-glass-border"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-[#5C667A] uppercase tracking-widest mb-1">{stat.label}</p>
            <span className="text-2xl font-bold font-mono text-white">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outreach Generator */}
        <div className="glass-card border border-glass-border p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#5C667A] mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" /> AI Outreach Generator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Prospect Name *</label>
              <input type="text" value={prospectName} onChange={(e) => setProspectName(e.target.value)}
                placeholder="e.g., Sarah Johnson" className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-rose-500/50 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Business Name *</label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Peak Performance Gym" className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-rose-500/50 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Industry</label>
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Fitness, Real Estate, SaaS" className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-rose-500/50 outline-none transition-all" />
            </div>
            <button onClick={generateOutreach} disabled={!prospectName || !businessName || generating}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg flex justify-center items-center gap-2 transition-all shadow-[0_0_25px_rgba(244,63,94,0.3)]">
              {generating ? <><Sparkles className="w-4 h-4 animate-spin" /> Generating...</> : <><Send className="w-4 h-4" /> Generate Outreach Email</>}
            </button>
          </div>
        </div>

        {/* Email Preview */}
        <div className="glass-card border border-glass-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#5C667A] flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-400" /> Generated Email
            </h3>
            {email && (
              <button onClick={copyEmail} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors">
                {copied ? <><CheckCircle2 className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            )}
          </div>

          {!email && !generating && (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Mail className="w-12 h-12 text-[#2A2D35] mb-4" />
              <p className="text-sm text-[#5C667A]">Fill in prospect details to generate a personalized cold email.</p>
            </div>
          )}

          {generating && (
            <div className="h-64 flex flex-col items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-10 h-10 text-rose-400" />
              </motion.div>
              <p className="text-sm text-rose-400 mt-4 animate-pulse">Gemini is writing your outreach...</p>
            </div>
          )}

          {email && (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-[#5C667A] uppercase tracking-wider font-bold mb-1">Subject Line</p>
                <p className="text-sm text-white font-medium bg-black/40 rounded-lg px-4 py-3 border border-glass-border">{email.subject}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#5C667A] uppercase tracking-wider font-bold mb-1">Email Body</p>
                <p className="text-sm text-[#C0C8D4] leading-relaxed bg-black/40 rounded-lg px-4 py-3 border border-glass-border whitespace-pre-line">{email.body}</p>
              </div>
              <div>
                <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold mb-1">3-Day Follow-Up</p>
                <p className="text-sm text-[#8A95A5] bg-black/40 rounded-lg px-4 py-3 border border-amber-500/20 whitespace-pre-line">{email.followUp}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
