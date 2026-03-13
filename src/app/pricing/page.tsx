"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X as XIcon, ArrowRight, Zap, Star } from "lucide-react";
import Link from "next/link";

const fadeIn = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d, duration: 0.6 } });

const TIERS = [
  {
    name: "UMBRA Core", price: "$497", period: "/mo", tier: "sovereign", featured: false,
    features: [
      { name: "All 15 AI engines", included: true },
      { name: "Swarm Intelligence", included: true },
      { name: "God-Brain Memory", included: true },
      { name: "AI Playground", included: true },
      { name: "Pipeline Builder", included: true },
      { name: "Skills A/B Testing", included: true },
      { name: "Client Portal", included: true },
      { name: "Unlimited campaigns", included: true },
      { name: "Ghost Mode autopilot", included: false },
      { name: "Claude Coder", included: false },
      { name: "White-label license", included: false },
      { name: "Source code access", included: false },
    ],
  },
  {
    name: "Ghost Mode", price: "$997", period: "/mo", tier: "ghost", featured: true,
    features: [
      { name: "All 15 AI engines", included: true },
      { name: "Swarm Intelligence", included: true },
      { name: "God-Brain Memory", included: true },
      { name: "AI Playground", included: true },
      { name: "Pipeline Builder", included: true },
      { name: "Skills A/B Testing", included: true },
      { name: "Client Portal", included: true },
      { name: "Unlimited campaigns", included: true },
      { name: "Ghost Mode autopilot", included: true },
      { name: "Claude Coder", included: true },
      { name: "White-label license", included: false },
      { name: "Source code access", included: false },
    ],
  },
  {
    name: "Franchise", price: "$2,497", period: " once", tier: "franchise", featured: false,
    features: [
      { name: "All 15 AI engines", included: true },
      { name: "Swarm Intelligence", included: true },
      { name: "God-Brain Memory", included: true },
      { name: "AI Playground", included: true },
      { name: "Pipeline Builder", included: true },
      { name: "Skills A/B Testing", included: true },
      { name: "Client Portal", included: true },
      { name: "Unlimited campaigns", included: true },
      { name: "Ghost Mode autopilot", included: true },
      { name: "Claude Coder", included: true },
      { name: "White-label license", included: true },
      { name: "Source code access", included: true },
    ],
  },
];

export default function PricingPage() {
  const checkout = async (tier: string) => {
    const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-midnight text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-electric/6 via-transparent to-transparent blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-xs font-bold">U</div>
          <span className="text-sm font-medium tracking-[0.15em] uppercase">UMBRA</span>
        </Link>
        <div className="flex items-center gap-6 text-xs text-text-secondary">
          <Link href="/sovereign" className="hover:text-white transition-colors">Features</Link>
          <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
        </div>
      </nav>

      <section className="relative z-10 text-center px-8 pt-12 pb-16 max-w-4xl mx-auto">
        <motion.div {...fadeIn(0)}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-8">
            <Zap className="w-3 h-3" /> Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl serif-text font-light mb-4">One System. Three Tiers.</h1>
          <p className="text-text-secondary max-w-lg mx-auto">No hidden fees. No contracts. Cancel anytime. Every tier includes all 15 engines.</p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-8 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t, i) => (
            <motion.div key={i} {...fadeIn(i * 0.1)}
              className={`glass-card p-7 flex flex-col ${t.featured ? "border-electric/40 relative overflow-hidden" : ""}`}>
              {t.featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric via-rose-glow to-gold" />}
              {t.featured && <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-[10px] font-bold uppercase mb-3">Most Popular</span>}
              <p className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-1">{t.name}</p>
              <p className="text-4xl font-light text-white mb-6">{t.price}<span className="text-base text-text-secondary">{t.period}</span></p>
              <ul className="space-y-2 mb-6 flex-1">
                {t.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm ${f.included ? "text-gray-300" : "text-text-secondary/40"}`}>
                    {f.included ? <CheckCircle2 className="w-4 h-4 text-emerald-glow shrink-0" /> : <XIcon className="w-4 h-4 text-text-secondary/20 shrink-0" />}
                    {f.name}
                  </li>
                ))}
              </ul>
              <button onClick={() => checkout(t.tier)}
                className={`w-full py-3 font-bold rounded-xl transition-all ${t.featured ? "bg-white text-midnight hover:bg-gray-200" : "border border-glass-border text-white hover:bg-glass-bg"}`}>
                Get {t.name}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="relative z-10 px-8 pb-20 text-center max-w-lg mx-auto">
        <motion.div {...fadeIn(0)} className="glass-card p-8 border-emerald-500/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
          </div>
          <h3 className="text-lg font-bold mb-2">No Risk. No Contracts.</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Try UMBRA for 30 days. If your campaigns don&apos;t improve, we&apos;ll refund you — no questions asked. We can afford to make this guarantee because nobody has ever asked for one.
          </p>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-glass-border/30 px-8 py-10 text-center">
        <p className="text-[10px] text-text-secondary/40 uppercase tracking-[0.4em]">UMBRA — Shadow Intelligence Platform</p>
      </footer>
    </div>
  );
}
