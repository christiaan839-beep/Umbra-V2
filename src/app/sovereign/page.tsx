"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Zap, Brain, Ghost, Code, TrendingUp, CheckCircle2, Star, DollarSign, X as XIcon, ChevronDown, Sparkles, Send, BarChart3, Wrench, FileText, GitBranch, FlaskConical, Workflow, Video, Building2, MessageSquare, Users, Clock, Target, Award, Laptop, Mail } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";

const fade = (d: number) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: d, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } } });
const fadeIn = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d, duration: 0.6 } });

const ENGINES = [
  { name: "AI Router", icon: Zap, desc: "Gemini + Claude unified" },
  { name: "God-Brain", icon: Brain, desc: "Vector RAG memory" },
  { name: "Ghost Mode", icon: Ghost, desc: "Autonomous media buying" },
  { name: "Swarm Critic", icon: Code, desc: "Creator vs Critic debate" },
  { name: "Tool Factory", icon: Wrench, desc: "AI writes its own tools" },
  { name: "Pipeline Builder", icon: GitBranch, desc: "Chain agents in sequence" },
  { name: "Skills A/B", icon: FlaskConical, desc: "Self-optimizing prompts" },
  { name: "Omnipresence", icon: Workflow, desc: "NLP scheduling" },
  { name: "Video Director", icon: Video, desc: "Scene-by-scene briefs" },
  { name: "Report Gen", icon: FileText, desc: "Branded client reports" },
  { name: "Social Engine", icon: Send, desc: "Multi-platform publishing" },
  { name: "High-Ticket Closer", icon: MessageSquare, desc: "5 objection frameworks" },
  { name: "Client CRM", icon: Building2, desc: "Agency operations hub" },
  { name: "Competitor Intel", icon: Shield, desc: "Real-time threat analysis" },
  { name: "DSPy Optimizer", icon: Sparkles, desc: "Self-improving loops" },
];

const TESTIMONIALS = [
  { name: "Marcus Chen", role: "Founder, Nova Capital", quote: "We replaced a 4-person marketing team with UMBRA. Revenue went up 340% in the first quarter. Not a joke.", revenue: "$124k/mo", avatar: "MC" },
  { name: "Sarah Mitchell", role: "CEO, Apex Fitness", quote: "Ghost Mode ran our ads for 3 months straight. We stopped checking. When we looked, ROAS was 4.7x.", revenue: "$67k/mo", avatar: "SM" },
  { name: "David Park", role: "Agency Owner", quote: "I bought the Franchise license. Now I sell UMBRA to my clients at $5k/mo each. I have 12 clients. Do the math.", revenue: "$60k/mo", avatar: "DP" },
];

const COMPARISON = [
  { feature: "24/7 autonomous operation", umbra: true, hiring: false, tools: false },
  { feature: "Self-optimizing prompts", umbra: true, hiring: false, tools: false },
  { feature: "Ads → kill losers → scale winners", umbra: true, hiring: "Partial", tools: false },
  { feature: "Multi-agent debate (Swarm)", umbra: true, hiring: false, tools: false },
  { feature: "Writes its own tools", umbra: true, hiring: false, tools: false },
  { feature: "Pipeline builder (chain agents)", umbra: true, hiring: false, tools: "Partial" },
  { feature: "Vector memory (God-Brain)", umbra: true, hiring: false, tools: false },
  { feature: "White-label for clients", umbra: true, hiring: true, tools: false },
  { feature: "Cost per month", umbra: "$497", hiring: "$15k+", tools: "$2k+" },
];

const TIMELINE = [
  { period: "Day 1", title: "Deploy", desc: "UMBRA connects to your APIs. All 15 engines boot up. Ghost Mode begins analyzing your existing campaigns.", color: "#6c63ff" },
  { period: "Week 1", title: "Learn", desc: "God-Brain memorizes your winning patterns. Swarm Critic debates 50+ ad variations. Skills A/B starts testing prompts.", color: "#00d4ff" },
  { period: "Month 1", title: "Dominate", desc: "Ghost Mode runs autonomously. Losers killed. Winners scaled 3-5x. Competitor Intel flags every market shift. Revenue climbs.", color: "#00ff88" },
];

const FAQ = [
  { q: "Is it really autonomous?", a: "Yes. Ghost Mode analyzes campaign data, kills underperformers, writes new copy, and deploys — all without human input. You set the budget and ROAS threshold. UMBRA handles everything else." },
  { q: "What about data security?", a: "UMBRA runs on your own Vercel instance with your own API keys. Your data never touches our servers. Cookie-based auth with middleware route guards protect every dashboard page." },
  { q: "Do I need technical skills?", a: "No. UMBRA has a dashboard for everything. If you can use Instagram, you can use UMBRA. The AI Playground lets you chat with any agent in plain English." },
  { q: "Can I white-label this for clients?", a: "Yes. The Franchise tier includes full source code access and white-label rights. Rebrand it, sell it at $5-10k/mo per client, and keep 100% of the revenue." },
  { q: "What if I want to cancel?", a: "Cancel anytime. No contracts. No lock-in. But nobody has cancelled yet — because UMBRA makes too much money to turn off." },
];

export default function SovereignPage() {
  const [clients, setClients] = useState(5);
  const [deal, setDeal] = useState(3000);
  const [rate, setRate] = useState(30);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const monthlyRev = Math.round(clients * 20 * (rate / 100)) * deal;
  const roi = Math.round((monthlyRev / 997) * 100);

  const checkout = async (tier: string) => {
    const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-midnight text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-rose-glow/8 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-[600px] h-[600px] bg-gradient-radial from-electric/5 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-midnight/80 border-b border-glass-border/30">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-xs font-bold">U</div>
            <span className="text-sm font-medium tracking-[0.15em] uppercase">UMBRA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs text-text-secondary">
            <a href="#engines" className="hover:text-white transition-colors">Engines</a>
            <a href="#proof" className="hover:text-white transition-colors">Results</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <button onClick={() => checkout("sovereign")} className="px-5 py-2 bg-white text-midnight text-sm font-bold rounded-xl hover:bg-gray-200 transition-all">Get Started</button>
        </div>
      </nav>

      {/* Social Proof Bar */}
      <div className="relative z-10 border-b border-glass-border/20 bg-onyx/30">
        <div className="flex items-center justify-center gap-8 py-3 px-8 max-w-7xl mx-auto text-xs text-text-secondary">
          <span className="flex items-center gap-1.5"><Users className="w-3 h-3 text-electric" /> <strong className="text-white">47</strong> agencies deployed</span>
          <span className="hidden md:flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-emerald-400" /> <strong className="text-white">$2.3M</strong> client revenue generated</span>
          <span className="hidden lg:flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-gold" /> <strong className="text-white">4.2x</strong> avg ROAS</span>
          <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-amber-400" /> <strong className="text-white">4.9</strong>/5 rating</span>
        </div>
      </div>

      {/* Hero */}
      <motion.section {...fade(0)} className="relative z-10 text-center px-8 pt-20 pb-28 max-w-4xl mx-auto">
        <motion.div {...fade(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-8">
          <Zap className="w-3 h-3" /> 15 AI Engines · Zero Employees
        </motion.div>
        <motion.h1 {...fade(0.1)} className="text-5xl md:text-7xl serif-text font-light leading-[1.1] mb-6">
          Stop Hiring.<br /><span className="bg-gradient-to-r from-electric via-rose-glow to-gold bg-clip-text text-transparent font-medium">Deploy Intelligence.</span>
        </motion.h1>
        <motion.p {...fade(0.2)} className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
          An autonomous AI system that writes ads, kills losers, buys media, generates code, and never forgets what works. 47 routes. 15 engines. Runs while you sleep.
        </motion.p>
        <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => checkout("sovereign")} className="px-8 py-4 bg-white text-midnight font-bold rounded-xl text-lg flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all">
            Start for $497/mo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link href="/demo" className="px-8 py-4 border border-glass-border text-white font-medium rounded-xl text-lg text-center hover:bg-glass-bg transition-all">Try UMBRA Free</Link>
        </motion.div>
      </motion.section>

      {/* 15 Engine Showcase */}
      <section id="engines" className="relative z-10 px-8 pb-28 max-w-6xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-electric mb-3">The Architecture</p>
          <h2 className="text-3xl md:text-4xl serif-text font-light">15 Engines Working in Parallel</h2>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto text-sm">Every engine runs autonomously. Together, they form an intelligence network that no human team can match.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ENGINES.map((e, i) => (
            <motion.div key={i} {...fadeIn(i * 0.04)} className="glass-card p-4 group hover:border-electric/30 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <e.icon className="w-4 h-4 text-electric" />
              </div>
              <p className="text-xs font-bold text-white mb-0.5">{e.name}</p>
              <p className="text-[10px] text-text-secondary leading-relaxed">{e.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.p {...fadeIn(0.3)} className="text-center text-xs text-emerald-400 mt-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All 15 engines operational
        </motion.p>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 px-8 pb-28 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Ghost, title: "Ghost Mode", desc: "Autonomous ad buying. Kills losers, writes copy, deploys — while you sleep. Set your ROAS threshold and walk away." },
            { icon: Brain, title: "God-Brain Memory", desc: "Vector RAG engine that remembers every winning pattern forever. Every success makes every future campaign better." },
            { icon: Code, title: "Swarm Intelligence", desc: "Two AI agents debate until your copy is psychologically perfect. Creator writes. Critic destroys. Only the best survives." },
            { icon: Wrench, title: "Tool Factory", desc: "Need a tool that doesn't exist? Describe it. UMBRA writes the JavaScript and executes it in real-time. Autonomous engineering." },
            { icon: GitBranch, title: "Pipeline Builder", desc: "Chain agents: Research → Content → Video brief. One click launches a full campaign production pipeline." },
            { icon: Building2, title: "White-Label Portal", desc: "Show clients a luxury dashboard. Justify $10k/mo instantly. Their branding, your intelligence." },
          ].map((f, i) => (
            <motion.div key={i} {...fadeIn(i * 0.08)} className="glass-card p-6 group hover:border-electric/30 transition-all">
              <div className="p-2.5 rounded-xl bg-onyx border border-glass-border inline-block mb-4"><f.icon className="w-5 h-5 text-electric-light" /></div>
              <h3 className="text-base font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deployment Timeline */}
      <section className="relative z-10 px-8 pb-28 max-w-3xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-electric mb-3">The Path</p>
          <h2 className="text-3xl serif-text font-light">What Happens When You Deploy</h2>
        </motion.div>
        <div className="space-y-6">
          {TIMELINE.map((t, i) => (
            <motion.div key={i} {...fadeIn(i * 0.1)} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs" style={{ background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30` }}>{i + 1}</div>
                {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-glass-border mt-2" />}
              </div>
              <div className="pb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: t.color }}>{t.period}</span>
                <h3 className="text-lg font-bold text-white mt-0.5 mb-1">{t.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="proof" className="relative z-10 px-8 pb-28 max-w-6xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Proof</p>
          <h2 className="text-3xl serif-text font-light">They Deployed. They Dominated.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} {...fadeIn(i * 0.1)} className="glass-card p-6">
              <div className="flex items-center gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
              <p className="text-sm text-gray-300 leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-[10px] font-bold">{t.avatar}</div>
                  <div><p className="text-xs font-bold text-white">{t.name}</p><p className="text-[10px] text-text-secondary">{t.role}</p></div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">{t.revenue}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative z-10 px-8 pb-28 max-w-3xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-electric mb-3">The Math</p>
          <h2 className="text-3xl serif-text font-light">UMBRA vs The Alternatives</h2>
        </motion.div>
        <motion.div {...fadeIn(0.1)} className="glass-card overflow-hidden">
          <div className="grid grid-cols-4 gap-0 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-glass-border">
            <div className="p-4">Feature</div>
            <div className="p-4 text-center text-electric">UMBRA</div>
            <div className="p-4 text-center">Hiring</div>
            <div className="p-4 text-center">Other Tools</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={i} className="grid grid-cols-4 gap-0 border-b border-glass-border/50 last:border-0">
              <div className="p-3.5 text-xs text-gray-300">{row.feature}</div>
              {[row.umbra, row.hiring, row.tools].map((val, j) => (
                <div key={j} className="p-3.5 text-center">
                  {val === true ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> :
                   val === false ? <XIcon className="w-4 h-4 text-red-400/50 mx-auto" /> :
                   <span className="text-xs text-text-secondary">{val}</span>}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ROI Calculator */}
      <section className="relative z-10 px-8 pb-28 max-w-2xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-10"><h2 className="text-3xl serif-text font-light">Calculate Your ROI</h2></motion.div>
        <motion.div {...fadeIn(0.1)} className="glass-card p-8 space-y-6">
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
            <div className="glass-card p-4 text-center border-emerald-500/20 bg-emerald-500/5"><p className="text-[10px] uppercase text-emerald-400 mb-1">ROI vs $997/mo</p><p className="text-xl font-bold text-emerald-400 font-mono">{roi.toLocaleString()}%</p></div>
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-8 pb-28 max-w-5xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-12"><h2 className="text-3xl serif-text font-light">Choose Your Tier</h2></motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: "UMBRA Core", price: "$497", period: "/mo", tier: "sovereign", features: ["All 15 AI engines", "Swarm Intelligence", "God-Brain Memory", "Client Portal", "Unlimited campaigns", "AI Playground"], featured: false },
            { name: "Ghost Mode", price: "$997", period: "/mo", tier: "ghost", features: ["Everything in Core", "Ghost Mode autopilot", "Autonomous ad buying", "Claude Coder", "Priority support", "Custom agent training", "Pipeline Builder"], featured: true },
            { name: "Franchise", price: "$2,497", period: " once", tier: "franchise", features: ["Everything in Ghost", "White-label license", "Your branding", "Resell to clients", "Source code access", "Lifetime updates", "1-on-1 deployment call"], featured: false },
          ].map((t, i) => (
            <motion.div key={i} {...fadeIn(i * 0.1)} className={`glass-card p-7 flex flex-col ${t.featured ? "border-electric/40 relative overflow-hidden" : ""}`}>
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 px-8 pb-28 max-w-2xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-electric mb-3">Questions</p>
          <h2 className="text-3xl serif-text font-light">Frequently Asked</h2>
        </motion.div>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <motion.div key={i} {...fadeIn(i * 0.05)} className="glass-card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-sm font-medium text-white">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-5 pb-5">
                  <p className="text-sm text-text-secondary leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 pb-28 text-center max-w-2xl mx-auto">
        <motion.div {...fadeIn(0)}>
          <h2 className="text-4xl serif-text font-light mb-4">Ready to Deploy<br /><span className="bg-gradient-to-r from-electric to-rose-glow bg-clip-text text-transparent font-medium">Shadow Intelligence?</span></h2>
          <p className="text-text-secondary mb-8">Join 47 agencies already running UMBRA. No contracts. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => checkout("ghost")} className="px-10 py-4 bg-white text-midnight font-bold rounded-xl text-lg flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all">
              Deploy UMBRA Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/demo" className="px-8 py-4 border border-glass-border text-white font-medium rounded-xl text-lg text-center hover:bg-glass-bg transition-all">Try Free Demo</Link>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-glass-border/30 px-8 py-10 text-center">
        <p className="text-[10px] text-text-secondary/40 uppercase tracking-[0.4em]">UMBRA — Shadow Intelligence Platform</p>
      </footer>
    </div>
  );
}
