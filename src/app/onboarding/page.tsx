"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Zap, Key, Target, Rocket, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { id: 1, title: "Connect APIs", icon: Key, desc: "Link your AI and payment keys to activate all 15 engines." },
  { id: 2, title: "Choose Niche", icon: Target, desc: "Tell UMBRA your market so it can optimize every campaign." },
  { id: 3, title: "Set Budget", icon: Zap, desc: "Define your monthly ad spend and ROAS threshold for Ghost Mode." },
  { id: 4, title: "Launch", icon: Rocket, desc: "Deploy your system. All engines boot up and start working." },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ geminiKey: "", stripeKey: "", niche: "", product: "", budget: "1000", roas: "3" });
  const [complete, setComplete] = useState(false);

  const next = () => { if (step < 4) setStep(s => s + 1); else setComplete(true); };
  const prev = () => { if (step > 1) setStep(s => s - 1); };
  const update = (key: string, val: string) => setData(d => ({ ...d, [key]: val }));

  if (complete) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-lg">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-bold serif-text mb-3 text-white">Your System is Live</h1>
          <p className="text-text-secondary mb-2">All 15 engines are booting up. Ghost Mode will start analyzing your market within minutes.</p>
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 15 engines initializing
          </div>
          <Link href="/dashboard" className="w-full py-4 bg-white text-midnight font-bold rounded-xl flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all text-lg">
            Enter Command Center <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" /> Setup Wizard
          </div>
          <h1 className="text-2xl font-bold serif-text text-white">Deploy Your UMBRA System</h1>
          <p className="text-sm text-text-secondary mt-1">4 steps to full autonomy.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-10 px-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${step >= s.id ? "bg-white text-midnight" : "bg-onyx border border-glass-border text-text-secondary"}`}>
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-px mx-2 transition-all ${step > s.id ? "bg-white" : "bg-glass-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              {(() => { const StepIcon = STEPS[step - 1].icon; return <StepIcon className="w-5 h-5 text-electric" />; })()}
              <div>
                <h2 className="text-sm font-bold text-white">{STEPS[step - 1].title}</h2>
                <p className="text-xs text-text-secondary">{STEPS[step - 1].desc}</p>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1 block">Gemini API Key</label>
                  <input value={data.geminiKey} onChange={e => update("geminiKey", e.target.value)} placeholder="AIza..." type="password"
                    className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/30 focus:outline-none focus:border-electric/50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1 block">Stripe Secret Key (optional)</label>
                  <input value={data.stripeKey} onChange={e => update("stripeKey", e.target.value)} placeholder="sk_live_..." type="password"
                    className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/30 focus:outline-none focus:border-electric/50" />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1 block">Your Niche</label>
                  <input value={data.niche} onChange={e => update("niche", e.target.value)} placeholder="e.g. Fitness coaching, SaaS, E-commerce"
                    className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/30 focus:outline-none focus:border-electric/50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1 block">Your Product / Service</label>
                  <input value={data.product} onChange={e => update("product", e.target.value)} placeholder="e.g. 12-week transformation program"
                    className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/30 focus:outline-none focus:border-electric/50" />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1 block">Monthly Ad Budget ($)</label>
                  <input value={data.budget} onChange={e => update("budget", e.target.value)} type="number"
                    className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1 block">Minimum ROAS (Ghost Mode kill threshold)</label>
                  <input value={data.roas} onChange={e => update("roas", e.target.value)} type="number" step="0.5"
                    className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
                  <p className="text-[10px] text-text-secondary mt-1">Ghost Mode will kill any campaign below {data.roas}x ROAS automatically.</p>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-3">
                <div className="glass-card p-4 bg-onyx/50">
                  <h3 className="text-xs font-bold text-white mb-3">Review Your Configuration</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-text-secondary">API Keys</span><span className="text-emerald-400">{data.geminiKey ? "✓ Connected" : "⚠ Not set"}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Niche</span><span className="text-white">{data.niche || "Not set"}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Product</span><span className="text-white">{data.product || "Not set"}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Budget</span><span className="text-white">${data.budget}/mo</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">ROAS Threshold</span><span className="text-white">{data.roas}x</span></div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={prev} className="px-6 py-3 border border-glass-border text-white font-bold rounded-xl hover:bg-glass-bg transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button onClick={next} className="flex-1 py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group">
            {step === 4 ? "Deploy System" : "Continue"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
