"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap, Target, BrainCircuit, Globe, CheckCircle2, XCircle, ShieldAlert, Cpu, TrendingUp, Clock, DollarSign, Users, Megaphone, CalendarCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { useRef, useEffect, useState } from "react";

import { UmbraLogo } from "@/components/ui/UmbraLogo";
import { DynamicCopy } from "@/components/ui/DynamicCopy";
import { SwarmDemo } from "@/components/ui/SwarmDemo";
import { ROICalculator } from "@/components/ui/ROICalculator";
import { Pricing } from "@/components/ui/Pricing";

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
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-electric/10 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-rose-glow/10 rounded-full blur-[120px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 w-full max-w-5xl mx-auto text-center">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(45,110,255,0.2)]">
            <BrainCircuit className="w-4 h-4" /> UMBRA V2: Autonomous AGI
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 serif-text leading-[1.1] tracking-tight drop-shadow-2xl">
            <DynamicCopy 
               copyKey="hero_headline" 
               fallbackText="The Agency is Dead."
            /><br/>
            <span className="bg-gradient-to-r from-electric via-white to-rose-glow bg-clip-text text-transparent">The Swarm is Here.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-12">
             <DynamicCopy 
               copyKey="hero_sub" 
               fallbackText="Meet the world's first Autonomous AGI Acquisition Swarm. A self-directed, self-improving ecosystem that controls text, voice, video, strategy, and execution—without human intervention."
             />
          </p>

          <div className="flex flex-col items-center gap-4 mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button 
                onClick={() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }} 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-electric to-rose-glow text-white font-bold text-lg shadow-[0_0_30px_rgba(45,110,255,0.4)] hover:shadow-[0_0_50px_rgba(45,110,255,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Deploy the Swarm
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                 onClick={() => {
                   document.getElementById("vsl")?.scrollIntoView({ behavior: "smooth" });
                 }}
                 className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Globe className="w-5 h-5 text-[#00B7FF]" /> Watch Video Demo
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
               <Target className="w-5 h-5" /> Secured by Stripe
             </div>
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
               <BrainCircuit className="w-5 h-5" /> Powered by Google AI
             </div>
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
               <ShieldAlert className="w-5 h-5" /> 256-bit Encryption
             </div>
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
               <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 99.9% Uptime
             </div>
          </div>

          {/* Glassmorphic VSL Placeholder */}
          <div id="vsl" className="w-full max-w-4xl mx-auto aspect-video rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,183,255,0.15)] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer mb-24">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
             <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md z-10">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
             </div>
             <p className="mt-6 text-sm font-bold tracking-widest uppercase text-white z-10">Watch The Swarm Eradicate Humans</p>
          </div>

          {/* Interactive Swarm Demo */}
          <SwarmDemo />

        </motion.div>

        {/* The 2026 Stack Architecture Grid */}
        <div className="w-full max-w-7xl mx-auto relative z-10 mt-10">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white serif-text mb-4">The AGI Swarm Matrix</h2>
             <p className="text-text-secondary uppercase tracking-[0.2em] text-xs">A comprehensive intelligence network</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: BrainCircuit,
                  title: "Apex Intelligence",
                  desc: "The CEO node. Continuously aggregates global God-Brain telemetry to autonomously formulate cross-channel marketing strategies.",
                  color: "text-rose-glow", bg: "bg-rose-glow/10", border: "border-rose-glow/20"
                },
                {
                  icon: Target,
                  title: "The Nexus",
                  desc: "Visual workflow orchestrator. Drag-and-drop agent pipelines to construct multi-step acquisition funnels that run automatically.",
                  color: "text-electric", bg: "bg-electric/10", border: "border-electric/20"
                },
                {
                  icon: Globe,
                  title: "Cinematic Studio",
                  desc: "Autonomous video synthesis. Creates scripts, generates AI voiceovers, and maps avatar lip-syncs to launch high-converting VSLs.",
                  color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20"
                },
                {
                  icon: Zap,
                  title: "Ghost & Voice",
                  desc: "Undetectable text prospecting on LinkedIn and conversational AI calling to automatically pre-qualify and close leads 24/7.",
                  color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20"
                }
              ].map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i * 0.1) }}
                  className="glass-card p-8 border border-glass-border hover:border-electric/30 transition-all duration-500 group">
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
              { end: 15, suffix: "+", label: "AI Agents", icon: BrainCircuit, color: "text-electric" },
              { end: 847, suffix: "%", label: "Avg. ROI Increase", icon: TrendingUp, color: "text-emerald-400" },
              { end: 3, suffix: ".4s", label: "Avg. Deploy Time", icon: Clock, color: "text-amber-400" },
              { end: 0, suffix: "", prefix: "$", label: "Marginal Cost", icon: DollarSign, color: "text-rose-400" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + (i * 0.1) }}
                className="glass-card p-6 border border-glass-border text-center group hover:border-electric/30 transition-all">
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
            <p className="text-text-secondary max-w-2xl mx-auto">Every tool a $10,000/month agency uses — automated, autonomous, and available 24/7.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CalendarCheck, title: "AI Booking Agent", desc: "Qualifies leads with AI scoring (0-100), handles objections, and books appointments automatically. 5-minute response time, 24/7.", tag: "SPEED-TO-LEAD", color: "from-emerald-500 to-teal-500" },
              { icon: Megaphone, title: "Ad Creative Generator", desc: "Generates 5 scroll-stopping ad variations using proven psychological frameworks. Pain→Solution, Social Proof, Urgency, Curiosity, and Direct Benefit.", tag: "INFINITE CREATIVES", color: "from-rose-500 to-pink-500" },
              { icon: Target, title: "SEO Dominator", desc: "Full Schema Audit, Competition Gap Killer, and GBP Hijack. Reverse-engineer competitors and outrank them algorithmically.", tag: "RANK #1", color: "from-blue-500 to-electric" },
              { icon: Globe, title: "Content Factory", desc: "Blog posts, social captions, email sequences, and ad copy — all generated with your brand voice and published automatically.", tag: "AUTOPILOT CONTENT", color: "from-violet-500 to-fuchsia-500" },
              { icon: Sparkles, title: "Custom Skill Packs", desc: "Upload a .txt system prompt and instantly deploy a specialized AI agent. No coding required. Infinite extensibility.", tag: "BUILD YOUR OWN", color: "from-amber-500 to-orange-500" },
              { icon: Users, title: "Prospector Outbound", desc: "Scrape local businesses via Google Maps, detect marketing gaps with AI, and auto-generate hyper-personalized cold outreach.", tag: "LEAD GEN ON AUTOPILOT", color: "from-cyan-500 to-blue-500" },
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

            {/* ROI Calculator */}
            <ROICalculator />

         </div>
      </section>




      {/* Client Results / Social Proof */}
      <section className="py-24 bg-black/60 border-y border-glass-border px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,183,255,0.03),transparent_60%)]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white serif-text mb-4">Built Different. Proven Results.</h2>
            <p className="text-text-secondary">What happens when you replace human bottlenecks with autonomous intelligence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { metric: "847%", label: "ROI Increase", detail: "Average return across all active campaigns running on the UMBRA Swarm.", color: "text-emerald-400" },
              { metric: "3.4s", label: "Campaign Deploy", detail: "From strategy to live execution. Traditional agencies take 4-6 weeks.",  color: "text-electric" },
              { metric: "$0", label: "Marginal Cost", detail: "BYOK + Ollama means your AI workforce costs exactly nothing to run.", color: "text-amber-400" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-8 glass-card border border-glass-border">
                <div className={`text-5xl font-bold ${item.color} font-mono mb-2`}>{item.metric}</div>
                <div className="text-sm font-bold text-white uppercase tracking-widest mb-3">{item.label}</div>
                <p className="text-xs text-text-secondary leading-relaxed">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#050505] relative border-t border-glass-border">
         <Pricing />
      </section>

      {/* Tech Stack Bar */}
      <section className="py-12 bg-black/40 border-y border-glass-border px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 opacity-40 hover:opacity-80 transition-opacity duration-1000">
          {["Google Gemini 2.0", "Anthropic Claude", "Neon Postgres", "Clerk Auth", "Stripe", "Vercel Edge", "Pinecone", "Ollama", "Pusher", "Tavily"].map(tech => (
            <span key={tech} className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold font-mono">{tech}</span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-32 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,183,255,0.08),transparent_60%)]" />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 serif-text">Your Competitors Are Already<br/><span className="bg-gradient-to-r from-electric to-rose-glow bg-clip-text text-transparent">Using AI Against You.</span></h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-12">The question isn&apos;t whether to automate. It&apos;s whether you&apos;ll be the one who does it first.</p>
            <Link href="/sovereign" className="inline-flex px-12 py-5 bg-white text-midnight font-bold rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all items-center gap-3 hover:-translate-y-1 group">
              Deploy the Swarm Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-6 text-xs text-text-secondary uppercase tracking-[0.2em]">No credit card required • 7-day free trial • Cancel anytime</p>
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
  );
}
