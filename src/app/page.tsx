"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap, Target, BrainCircuit, Globe, CheckCircle2, XCircle, ShieldAlert, Cpu, TrendingUp, Clock, DollarSign, Users, Megaphone, CalendarCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";

import { UmbraLogo } from "@/components/ui/UmbraLogo";
import { ROICalculator } from "@/components/ui/ROICalculator";
import { Pricing } from "@/components/ui/Pricing";
import { SplashIntro } from "@/components/ui/SplashIntro";
import { ParticleGrid } from "@/components/ui/ParticleGrid";
import { ToolShowcase } from "@/components/ui/SocialProof";
import { AnimatedVSL } from "@/components/ui/AnimatedVSL";

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);
  
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [showSite, setShowSite] = useState(false);

  return (
    <>
      {!showSite && <SplashIntro onComplete={() => setShowSite(true)} />}
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-electric/30 font-sans transition-opacity duration-500 ${showSite ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UmbraLogo size="md" />
            <span className="text-xl font-bold tracking-[0.2em] uppercase text-white font-serif">UMBRA</span>
          </div>
          <div className="flex items-center gap-6">
             <Link href="/showcase" className="text-sm font-semibold text-text-secondary hover:text-white transition-colors">Proof of Work</Link>
             <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
               <button className="text-sm font-semibold text-text-secondary hover:text-white transition-colors">Client Login</button>
             </SignInButton>
             <Link href="/sovereign" className="px-5 py-2 rounded-full border border-glass-border bg-glass-bg text-sm font-bold text-white hover:bg-white/5 transition-colors">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00B7FF]/10 rounded-full blur-[150px] animate-float" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-float-delay" />
        </div>

        {/* Interactive Particle Grid */}
        <div className="absolute inset-0 pointer-events-auto">
          <ParticleGrid />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 w-full max-w-5xl mx-auto text-center">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium uppercase tracking-[0.15em] mb-8">
            AI-Powered Marketing Platform
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 serif-text leading-[1.1] tracking-tight">
            Replace Your Agency.<br/>
            <span className="animated-gradient-text">Keep The Results.</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-12">
            29 AI agents that handle your content, ads, SEO, outreach, and lead qualification — running 24/7 at a fraction of what you pay a traditional agency.
          </p>

          <div className="flex flex-col items-center gap-4 mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button 
                onClick={() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }} 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#00B7FF] to-[#a855f7] text-white font-bold text-lg cta-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                 onClick={() => {
                   document.getElementById("vsl")?.scrollIntoView({ behavior: "smooth" });
                 }}
                 className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Globe className="w-5 h-5 text-[#00B7FF]" /> See How It Works
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-20">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-500 trust-badge">
                <ShieldAlert className="w-4 h-4" /> 256-bit Encryption
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-500 trust-badge" style={{ animationDelay: '1s' }}>
                <CheckCircle2 className="w-4 h-4" /> Powered by Google Gemini
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-neutral-500 trust-badge" style={{ animationDelay: '2s' }}>
                <Target className="w-4 h-4" /> Secure ZAR Payments
              </div>
           </div>
          

          {/* Animated Product Walkthrough */}
          <AnimatedVSL />

        </motion.div>

        {/* The 2026 Stack Architecture Grid */}
        <div className="w-full max-w-7xl mx-auto relative z-10 mt-10">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white serif-text mb-4">How It Works</h2>
              <p className="text-neutral-400 text-sm">Four core systems working together to grow your business</p>
            </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: BrainCircuit,
                  title: "Strategy Engine",
                  desc: "AI-powered marketing strategy that analyzes your market, competitors, and audience to create data-driven campaigns.",
                  color: "text-rose-glow", bg: "bg-rose-glow/10", border: "border-rose-glow/20"
                },
                {
                  icon: Target,
                  title: "Lead Generation",
                  desc: "Automated prospecting and outreach. Find potential clients, score them, and generate personalized cold outreach sequences.",
                  color: "text-electric", bg: "bg-electric/10", border: "border-electric/20"
                },
                {
                  icon: Globe,
                  title: "Content Automation",
                  desc: "Blog posts, social media content, ad creatives, email sequences, and landing pages — all generated in your brand voice.",
                  color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20"
                },
                {
                  icon: Zap,
                  title: "Competitive Intel",
                  desc: "Analyze competitor landing pages, ad copy, and SEO strategy. Get actionable insights to gain an edge in your market.",
                  color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20"
                }
              ].map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="gradient-border-card p-8 shimmer-effect group">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Animated Live Stats Banner */}
        <div className="w-full max-w-6xl mx-auto relative z-10 mt-10 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { end: 29, suffix: "", label: "AI Tools", icon: BrainCircuit, color: "text-electric" },
              { end: 24, suffix: "/7", label: "Always Running", icon: Clock, color: "text-emerald-400" },
              { end: 30, suffix: "s", label: "Content Generation", icon: TrendingUp, color: "text-amber-400" },
              { end: 90, suffix: "%", prefix: "", label: "Cost Savings vs Agency", icon: DollarSign, color: "text-rose-400" },
            ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-6 border border-glass-border text-center group hover:border-white/15 transition-all">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <div className={`text-3xl font-bold ${stat.color} font-mono`}>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-text-secondary mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What You Get — Revenue Engine Showcase */}
        <div className="w-full max-w-7xl mx-auto relative z-10 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white serif-text mb-4">Everything You Need.<br/><span className="bg-gradient-to-r from-emerald-400 to-electric bg-clip-text text-transparent">Nothing You Don&apos;t.</span></h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Every tool your marketing team needs — automated and available around the clock.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CalendarCheck, title: "AI Booking Agent", desc: "Qualifies leads with AI scoring, handles objections, and books calls automatically. Responds in minutes, runs 24/7.", tag: "LEAD QUALIFICATION", color: "from-emerald-500 to-teal-500" },
              { icon: Megaphone, title: "Ad Creative Generator", desc: "Generates 5 ad variations using proven copywriting frameworks. Each one tailored to your audience and ready to deploy.", tag: "AD CREATIVES", color: "from-rose-500 to-pink-500" },
              { icon: Target, title: "SEO & Search", desc: "Competitor analysis, schema audits, keyword research, and programmatic page generation to dominate local search.", tag: "SEARCH RANKING", color: "from-blue-500 to-sky-500" },
              { icon: Globe, title: "Content Engine", desc: "Blog posts, social captions, email sequences, and landing pages — all generated in your brand voice.", tag: "CONTENT CREATION", color: "from-violet-500 to-fuchsia-500" },
              { icon: Sparkles, title: "Custom AI Agents", desc: "Create your own specialized agents with a simple text prompt. No coding required.", tag: "EXTENSIBLE", color: "from-amber-500 to-orange-500" },
              { icon: Users, title: "Lead Prospecting", desc: "Find local businesses, analyze their marketing gaps, and generate personalized outreach sequences.", tag: "PROSPECTING", color: "from-cyan-500 to-blue-500" },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative glass-card p-8 border border-glass-border hover:border-white/20 transition-all duration-500 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-text-secondary font-bold bg-white/5 px-2 py-0.5 rounded">{feature.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
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
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                Why pay R15,000+ per month for slow, inconsistent work?
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
                <p className="text-rose-400 font-mono font-bold text-xl mb-8">R15,000 – R50,000 / month</p>
                
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
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" /> UMBRA Platform
                </h3>
                <p className="text-emerald-400 font-mono font-bold text-xl mb-8">From R2,750 / month</p>
                
                <ul className="space-y-4">
                  {[
                    "Content generated in under 30 seconds",
                    "Programmatic SEO pages for local search",
                    "Competitor landing page analysis on demand",
                    "AI booking agent qualifies leads for you",
                    "Runs 24/7 — no holidays, no sick days"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ROI Calculator */}
            <ROICalculator />

         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#050505] relative border-t border-glass-border">
         <ToolShowcase />
         <Pricing />
      </section>

      {/* Tech Stack Bar — Animated Marquee */}
      <div className="section-divider" />
      <section className="py-12 bg-black/40 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto overflow-hidden">
          <div className="marquee-track gap-12">
            {[...Array(2)].map((_, repeat) => (
              <div key={repeat} className="flex gap-12 items-center px-6">
                {["Google Gemini 2.5", "Neon Postgres", "Clerk Auth", "PayFast", "Paystack", "Vercel Edge", "Pinecone", "Tavily", "Resend"].map(tech => (
                  <span key={`${tech}-${repeat}`} className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold font-mono whitespace-nowrap">{tech}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" />

      {/* Footer CTA */}
      <footer className="py-32 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,183,255,0.08),transparent_60%)]" />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 serif-text">Your Competitors Are<br/>Already Using AI.</h2>
            <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-12">The question isn&apos;t whether to automate. It&apos;s whether you&apos;ll do it before they do.</p>
            <Link href="/sovereign" className="inline-flex px-12 py-5 bg-white text-black font-bold rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all items-center gap-3 hover:-translate-y-1 group">
              Start Your Free Trial <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-6 text-xs text-neutral-500 uppercase tracking-[0.2em]">No credit card required • Cancel anytime</p>
          </motion.div>
        </div>

        <div className="mt-24 pt-12 border-t border-glass-border max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UmbraLogo size="sm" />
              <span className="text-sm font-bold tracking-[0.15em] uppercase text-neutral-500">UMBRA</span>
            </div>
            <div className="flex gap-6">
              <Link href="/showcase" className="text-xs text-neutral-500 hover:text-white transition-colors">Proof of Work</Link>
              <Link href="/dashboard" className="text-xs text-neutral-500 hover:text-white transition-colors">Dashboard</Link>
              <a href="mailto:support@umbra.ai" className="text-xs text-neutral-500 hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-xs text-neutral-600">&copy; 2026 UMBRA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
