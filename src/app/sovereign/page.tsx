"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Brain, Ghost, Code, TrendingUp, CheckCircle2, Star, DollarSign } from "lucide-react";
import { useState } from "react";

const fadeUp = (d: number) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: d, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } } });

const FEATURES = [
  { icon: Brain, title: "God-Brain Memory", desc: "Vector RAG engine that remembers every winning pattern forever." },
  { icon: Ghost, title: "Ghost Mode", desc: "Autonomous ad buying. Kills losers, writes copy, deploys — while you sleep." },
  { icon: Code, title: "Claude Coder", desc: "Need code? The AI writes production-ready features in seconds." },
  { icon: Zap, title: "Swarm Intelligence", desc: "Two AI agents debate until your copy is psychologically perfect." },
  { icon: TrendingUp, title: "Self-Optimizing", desc: "Every agent improves automatically based on what's working." },
  { icon: Shield, title: "White-Label Portal", desc: "Show clients a luxury dashboard. Justify $10k/mo instantly." },
];

export default function SovereignPage() {
  const [clients, setClients] = useState(5);
  const [deal, setDeal] = useState(3000);
  const [rate, setRate] = useState(30);
  const monthlyRev = Math.round(clients * 20 * (rate / 100)) * deal;
  const roi = Math.round((monthlyRev / 997) * 100);

  const checkout = async (tier: string) => {
    const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-midnight text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-rose-glow/8 via-transparent to-transparent blur-3xl" /></div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-xs font-bold">SN</div>
          <span className="text-sm font-medium serif-text">Sovereign Node</span>
        </div>
        <button onClick={() => checkout("sovereign")} className="px-5 py-2 bg-white text-midnight text-sm font-bold rounded-xl hover:bg-gray-200 transition-all">Get Started</button>
      </nav>

      <motion.section {...fadeUp(0)} className="relative z-10 text-center px-8 pt-16 pb-24 max-w-4xl mx-auto">
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-8">
          <Zap className="w-3 h-3" /> AI Marketing Intelligence
        </motion.div>
        <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl serif-text font-light leading-[1.1] mb-6">
          Stop Hiring.<br /><span className="bg-gradient-to-r from-electric via-rose-glow to-gold bg-clip-text text-transparent font-medium">Deploy Intelligence.</span>
        </motion.h1>
        <motion.p {...fadeUp(0.2)} className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
          An autonomous AI system that writes ads, kills losers, buys media, generates code, and remembers everything that works.
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => checkout("sovereign")} className="px-8 py-4 bg-white text-midnight font-bold rounded-xl text-lg flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all">
            Start for $497/mo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="/dashboard" className="px-8 py-4 border border-glass-border text-white font-medium rounded-xl text-lg text-center hover:bg-glass-bg transition-all">View Demo</a>
        </motion.div>
      </motion.section>

      <section className="relative z-10 px-8 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass-card p-6 group hover:border-electric/30">
              <div className="p-2.5 rounded-xl bg-onyx border border-glass-border inline-block mb-4"><f.icon className="w-5 h-5 text-electric-light" /></div>
              <h3 className="text-base font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="relative z-10 px-8 pb-24 max-w-2xl mx-auto">
        <div className="text-center mb-10"><h2 className="text-3xl serif-text font-light">Calculate Your ROI</h2></div>
        <div className="glass-card p-8 space-y-6">
          {[{ label: "Clients", val: clients, set: setClients, min: 1, max: 50, icon: "👥" },
            { label: "Avg Deal", val: deal, set: setDeal, min: 500, max: 25000, icon: "💰", step: 500, fmt: (v: number) => `$${v.toLocaleString()}` },
            { label: "Close Rate", val: rate, set: setRate, min: 5, max: 80, icon: "📈", step: 5, fmt: (v: number) => `${v}%` },
          ].map((s, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2"><span className="text-sm text-text-secondary">{s.icon} {s.label}</span><span className="text-white font-bold font-mono">{s.fmt ? s.fmt(s.val) : s.val}</span></div>
              <input type="range" min={s.min} max={s.max} step={s.step || 1} value={s.val} onChange={(e) => s.set(Number(e.target.value))} className="w-full" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-glass-border">
            <div className="glass-card p-4 text-center bg-onyx/50"><p className="text-[10px] uppercase text-text-secondary mb-1">Monthly</p><p className="text-xl font-bold text-white font-mono">${monthlyRev.toLocaleString()}</p></div>
            <div className="glass-card p-4 text-center border-emerald-500/20 bg-emerald-500/5"><p className="text-[10px] uppercase text-emerald-400 mb-1">ROI</p><p className="text-xl font-bold text-emerald-400 font-mono">{roi.toLocaleString()}%</p></div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-8 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12"><h2 className="text-3xl serif-text font-light">Choose Your Tier</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: "Sovereign", price: "$497", period: "/mo", tier: "sovereign", features: ["All AI agents", "Swarm Intelligence", "God-Brain Memory", "Client Portal", "Unlimited campaigns"], featured: false },
            { name: "Ghost Mode", price: "$997", period: "/mo", tier: "ghost", features: ["Everything in Sovereign", "Ghost Mode autopilot", "Autonomous ad buying", "Claude Coder", "Priority support", "Custom agent training"], featured: true },
            { name: "Franchise", price: "$2,497", period: " once", tier: "franchise", features: ["Everything in Ghost", "White-label license", "Your branding", "Resell to clients", "Source code access", "Lifetime updates"], featured: false },
          ].map((t, i) => (
            <div key={i} className={`glass-card p-7 flex flex-col ${t.featured ? "border-electric/40 relative overflow-hidden" : ""}`}>
              {t.featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric via-rose-glow to-gold" />}
              {t.featured && <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-[10px] font-bold uppercase mb-3">Most Popular</span>}
              <p className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-1">{t.name}</p>
              <p className="text-3xl font-light text-white mb-6">{t.price}<span className="text-base text-text-secondary">{t.period}</span></p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {t.features.map((f, j) => <li key={j} className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-emerald-glow shrink-0" />{f}</li>)}
              </ul>
              <button onClick={() => checkout(t.tier)} className={`w-full py-3 font-bold rounded-xl transition-all ${t.featured ? "bg-white text-midnight hover:bg-gray-200" : "border border-glass-border text-white hover:bg-glass-bg"}`}>
                Get {t.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-glass-border/30 px-8 py-10 text-center">
        <p className="text-[10px] text-text-secondary/40 uppercase tracking-[0.4em]">Sovereign Node — Autonomous AI Marketing Intelligence</p>
      </footer>
    </div>
  );
}
