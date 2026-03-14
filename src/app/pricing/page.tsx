"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X as XIcon, ArrowRight, Zap, Star, Shield, Clock, Users, TrendingUp, MessageCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fadeIn = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d, duration: 0.6 } });

const TIERS = [
  {
    name: "UMBRA Core", price: "$497", period: "/mo", tier: "sovereign", featured: false,
    tagline: "For businesses getting started with AI marketing",
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
    tagline: "Full autonomy — your AI team runs 24/7",
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
    tagline: "Own the system. Build your own agency.",
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

const FAQS = [
  { q: "What exactly do the 15 AI engines do?", a: "Each engine handles a specific marketing function: content creation, lead generation, SEO page deployment, email sequences, social media scheduling, competitor analysis, conversion optimization, voice calls, cinematic video scripts, and more. They operate autonomously 24/7." },
  { q: "Do I need technical skills to use UMBRA?", a: "No. UMBRA's dashboard is designed for non-technical users. You set your goals, and the AI swarm executes. Think of it as having a full marketing team that never sleeps — without needing to manage them." },
  { q: "How is this different from HubSpot or GoHighLevel?", a: "Those platforms give you tools and templates. UMBRA gives you autonomous execution. Our AI doesn't just schedule posts — it writes them, generates visuals, optimizes timing, and learns from results. It's the difference between a toolkit and a team." },
  { q: "What's Ghost Mode?", a: "Ghost Mode means fully autonomous operation. Once activated, UMBRA continuously generates content, responds to leads, deploys SEO pages, and optimizes campaigns without any human input. You just check the results." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. We keep it simple because we're confident you'll stay once you see the results." },
  { q: "What's included in the Franchise tier?", a: "Everything in Ghost Mode, plus full source code access and a white-label license. You can rebrand UMBRA as your own platform and sell it to your clients. It's a complete agency-in-a-box." },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <Link href="/scan" className="px-4 py-2 bg-electric/10 border border-electric/20 text-electric rounded-full hover:bg-electric/20 transition-all font-bold tracking-wider uppercase">Free AI Scan</Link>
        </div>
      </nav>

      <section className="relative z-10 text-center px-8 pt-12 pb-8 max-w-4xl mx-auto">
        <motion.div {...fadeIn(0)}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-8">
            <Zap className="w-3 h-3" /> Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl serif-text font-light mb-4">One System. Three Tiers.</h1>
          <p className="text-text-secondary max-w-lg mx-auto">No hidden fees. No contracts. Cancel anytime. Every tier includes all 15 engines.</p>
        </motion.div>
      </section>

      {/* Trust Metrics */}
      <section className="relative z-10 px-8 pb-12 max-w-3xl mx-auto">
        <motion.div {...fadeIn(0.1)} className="flex flex-wrap justify-center gap-8 text-center">
          {[
            { icon: Users, label: "Active Clients", value: "200+" },
            { icon: TrendingUp, label: "Avg ROI", value: "340%" },
            { icon: MessageCircle, label: "Actions/Month", value: "1.2M" },
            { icon: Clock, label: "Uptime", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 text-text-secondary">
              <stat.icon className="w-4 h-4 text-electric/60" />
              <span className="text-white font-bold font-mono">{stat.value}</span>
              <span className="text-xs">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-8 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t, i) => (
            <motion.div key={i} {...fadeIn(i * 0.1)}
              className={`glass-card p-7 flex flex-col ${t.featured ? "border-electric/40 relative overflow-hidden scale-[1.02]" : ""}`}>
              {t.featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric via-rose-glow to-gold" />}
              {t.featured && <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-[10px] font-bold uppercase mb-3">Most Popular</span>}
              <p className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-1">{t.name}</p>
              <p className="text-4xl font-light text-white mb-1">{t.price}<span className="text-base text-text-secondary">{t.period}</span></p>
              <p className="text-xs text-text-secondary/60 mb-6">{t.tagline}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {t.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm ${f.included ? "text-gray-300" : "text-text-secondary/40"}`}>
                    {f.included ? <CheckCircle2 className="w-4 h-4 text-emerald-glow shrink-0" /> : <XIcon className="w-4 h-4 text-text-secondary/20 shrink-0" />}
                    {f.name}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 w-full">
                <button onClick={() => checkout(t.tier)}
                  className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${t.featured ? "bg-white text-midnight hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.1)]" : "border border-glass-border text-white hover:bg-glass-bg"}`}>
                  Get {t.name} <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={async () => {
                  const res = await fetch("/api/checkout/crypto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier: t.tier }) });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                  className="w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-[#0052FF]/30 text-[#0052FF] hover:bg-[#0052FF]/10 text-xs uppercase tracking-widest mt-1">
                  Pay with Crypto
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="relative z-10 px-8 pb-16 text-center max-w-lg mx-auto">
        <motion.div {...fadeIn(0)} className="glass-card p-8 border-emerald-500/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
          </div>
          <h3 className="text-lg font-bold mb-2">30-Day Money-Back Guarantee</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Try UMBRA for 30 days. If your campaigns don&apos;t improve, we&apos;ll refund you — no questions asked. We can afford to make this guarantee because nobody has ever asked for one.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider"><Shield className="w-3 h-3" /> SSL Secured</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider"><Shield className="w-3 h-3" /> Stripe Payments</span>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-8 pb-20 max-w-2xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-10">
          <h2 className="text-2xl serif-text font-light mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-text-secondary">Everything you need to know before you start.</p>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div key={i} {...fadeIn(i * 0.05)} className="glass-card border border-glass-border overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors">
                <span className="text-sm font-medium text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-electric/60 shrink-0" />
                  {faq.q}
                </span>
                <span className={`text-text-secondary transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-6 pb-4">
                  <p className="text-sm text-text-secondary leading-relaxed pl-6">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 pb-20 text-center max-w-lg mx-auto">
        <motion.div {...fadeIn(0)}>
          <h2 className="text-2xl serif-text font-light mb-4">Ready to Replace Your Marketing Team?</h2>
          <p className="text-sm text-text-secondary mb-6">Start your free AI scan and see exactly what UMBRA would do for your business.</p>
          <Link href="/scan" className="inline-flex items-center gap-2 px-8 py-4 bg-electric text-midnight font-bold text-sm uppercase tracking-[0.15em] rounded-full hover:bg-electric/90 transition-all shadow-[0_0_40px_rgba(0,212,255,0.2)]">
            <Zap className="w-4 h-4" /> Get Your Free AI Scan
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-glass-border/30 px-8 py-10 text-center">
        <p className="text-[10px] text-text-secondary/40 uppercase tracking-[0.4em]">UMBRA — Shadow Intelligence Platform</p>
      </footer>
    </div>
  );
}
