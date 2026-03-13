"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, BrainCircuit, Globe, CheckCircle2, XCircle, ShieldAlert, Cpu } from "lucide-react";
import Link from "next/link";

import { UmbraLogo } from "@/components/ui/UmbraLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-electric/30 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UmbraLogo size="md" />
            <span className="text-xl font-bold tracking-[0.2em] uppercase text-white font-serif">UMBRA</span>
          </div>
          <div className="flex items-center gap-6">
             <Link href="/login" className="text-sm font-semibold text-text-secondary hover:text-white transition-colors">Client Login</Link>
             <Link href="/sovereign" className="px-5 py-2 rounded-full border border-glass-border bg-glass-bg text-sm font-bold text-white hover:bg-white/5 transition-colors">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-electric/10 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-rose-glow/10 rounded-full blur-[120px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 w-full max-w-5xl mx-auto text-center">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-glow/10 border border-rose-glow/20 text-rose-glow text-xs font-bold uppercase tracking-[0.2em] mb-8">
            <ShieldAlert className="w-4 h-4" /> The Traditional Agency is Obsolete
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 serif-text leading-[1.1] tracking-tight drop-shadow-2xl">
            15 AI Engines.<br/>
            <span className="bg-gradient-to-r from-electric via-white to-rose-glow bg-clip-text text-transparent">Zero Employees.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-12">
            The 2026 AI Dominance Stack is here. Replace your $5,000/mo marketing agency with an autonomous ecosystem that scales your traffic, steals competitor keywords, and closes leads on WhatsApp 24/7.
          </p>

          <div className="flex flex-col items-center gap-4 mb-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button onClick={async () => {
                const res = await fetch("/api/stripe/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tier: "sovereign" }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }} className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-electric to-rose-glow text-white font-bold text-lg shadow-[0_0_30px_rgba(45,110,255,0.4)] hover:shadow-[0_0_50px_rgba(45,110,255,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer">
                Deploy UMBRA — $497/mo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={async () => {
                const res = await fetch("/api/payfast/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tier: "sovereign" }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }} className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-emerald-400/30 bg-emerald-400/5 text-emerald-400 font-bold text-lg hover:bg-emerald-400/10 transition-all flex items-center justify-center gap-2 group cursor-pointer">
                🇿🇦 Pay with PayFast — R8,997/mo
              </button>
            </div>
            <Link href="/demo" className="px-8 py-3 text-text-secondary hover:text-white font-medium text-base transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-electric" /> Watch Live Demo
            </Link>
          </div>

        </motion.div>

        {/* The 2026 Stack Architecture Grid */}
        <div className="w-full max-w-7xl mx-auto relative z-10 mt-10">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white serif-text mb-4">The 2026 AI Dominance Stack</h2>
             <p className="text-text-secondary">How we permanently replace your marketing department.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "Agentic Skills Hub",
                  desc: "1-Click playbooks. UMBRA scans competitors, finds missing SEO gaps, and automatically generates exactly what you need to steal their map pack rankings.",
                  color: "text-rose-glow", bg: "bg-rose-glow/10", border: "border-rose-glow/20"
                },
                {
                  icon: Globe,
                  title: "Programmatic SEO Factory",
                  desc: "Stop writing blogs manually. UMBRA generates hundreds of hyper-localized, visually stunning, highly converting service pages instantly to blanket search results.",
                  color: "text-electric", bg: "bg-electric/10", border: "border-electric/20"
                },
                {
                  icon: BrainCircuit,
                  title: "Autonomous WhatsApp Closer",
                  desc: "When leads inbound, UMBRA parses the text, recalls your business context from the God-Brain vector database, and uses Claude 3.5 to flawlessly close them.",
                  color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20"
                }
              ].map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i * 0.1) }}
                  className="glass-card p-8 border border-glass-border hover:border-electric/30 transition-all duration-500 group">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </main>

      {/* The Brutal Comparison Section */}
      <section className="py-32 bg-black/40 border-y border-glass-border px-6 relative">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white serif-text mb-6">Stop Paying Retainers.</h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Human agencies are slow, expensive, and inconsistent. UMBRA is a mathematical certainty.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Human Agency */}
              <div className="glass-card p-8 border border-rose-500/20 bg-rose-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Target className="w-32 h-32 text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-rose-500" /> Traditional Agency
                </h3>
                <p className="text-rose-500 font-mono font-bold text-xl mb-8">$3,000 - $10,000 / month</p>
                
                <ul className="space-y-4">
                  {[
                    "Takes 4 weeks to launch campaigns",
                    "Writes 4 generic blog posts a month",
                    "Manually audits 1 competitor occasionally",
                    "Expects YOU to close the leads",
                    "Takes weekends and holidays off"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <XCircle className="w-5 h-5 text-rose-500/50 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* UMBRA System */}
              <div className="glass-card p-8 border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Cpu className="w-32 h-32 text-emerald-500" />
                </div>
                <div className="absolute -top-[1px] -left-[1px] w-[20%] h-[2px] bg-gradient-to-r from-emerald-400 to-transparent" />
                
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" /> UMBRA V2 Architecture
                </h3>
                <p className="text-emerald-400 font-mono font-bold text-xl mb-8">$497 / month (Infinite Scale)</p>
                
                <ul className="space-y-4">
                  {[
                    "Deploys full campaigns in 3.4 seconds",
                    "Generates 50+ programmatic local SEO pages instantly",
                    "Constantly scans 200+ competitors autonomously",
                    "Autonomously texts and closes leads via WhatsApp",
                    "Executes perfectly 24/7/365 without sleep"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-24 text-center px-6">
        <h2 className="text-4xl font-bold text-white mb-8 serif-text">Ready to weaponize your marketing?</h2>
        <Link href="/sovereign" className="inline-flex px-10 py-5 bg-white text-midnight font-bold rounded-full text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all items-center gap-3 hover:-translate-y-1">
          Access UMBRA Now <ArrowRight className="w-6 h-6" />
        </Link>
        <p className="mt-8 text-sm text-text-secondary uppercase tracking-[0.2em]">The last marketing hire you will ever make.</p>
      </footer>
    </div>
  );
}
