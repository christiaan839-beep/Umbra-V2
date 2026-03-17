"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X as XIcon, ArrowRight, Zap, Shield, HelpCircle, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fadeIn = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d, duration: 0.6 } });

const TIERS = [
  {
    name: "Starter", price: "Free", period: "forever", plan: "starter", featured: false,
    tagline: "Explore UMBRA with 20 AI generations per day",
    cta: "Start Free",
    features: [
      { name: "20 AI generations / day", included: true },
      { name: "SEO X-Ray Analysis", included: true },
      { name: "Content Factory", included: true },
      { name: "Design Studio", included: true },
      { name: "Lead Prospector", included: true },
      { name: "My Library (result history)", included: true },
      { name: "Bring Your Own API Key", included: true },
      { name: "Unlimited generations", included: false },
      { name: "White-label dashboard", included: false },
      { name: "Client portal", included: false },
    ],
  },
  {
    name: "Pro", price: "R997", period: "/mo", plan: "pro", featured: true,
    tagline: "Unlimited AI power for growing businesses",
    cta: "Upgrade to Pro",
    features: [
      { name: "Everything in Starter", included: true },
      { name: "Unlimited AI generations", included: true },
      { name: "All AI tools unlocked", included: true },
      { name: "Priority API processing", included: true },
      { name: "Export to PDF & WordPress", included: true },
      { name: "Competitor monitoring", included: true },
      { name: "Email support (24h)", included: true },
      { name: "White-label dashboard", included: false },
      { name: "Client portal", included: false },
      { name: "API access", included: false },
    ],
  },
  {
    name: "Agency", price: "R2,750", period: "/mo", plan: "agency", featured: false,
    tagline: "White-label platform for agencies & teams",
    cta: "Go Agency",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "White-label dashboard", included: true },
      { name: "Client portal access", included: true },
      { name: "Bulk page generation (1000+/mo)", included: true },
      { name: "API access for integrations", included: true },
      { name: "Dedicated support & onboarding", included: true },
      { name: "Custom branding", included: true },
      { name: "Priority feature requests", included: true },
      { name: "Team seats (5 included)", included: true },
      { name: "SLA guarantee", included: true },
    ],
  },
];

const FAQS = [
  { q: "What AI tools are included?", a: "UMBRA includes AI-powered tools for SEO analysis, content creation, design briefs, landing page generation, lead prospecting, competitor intelligence, and more. All powered by Google Gemini 2.5 Pro." },
  { q: "Do I need technical skills?", a: "No. The dashboard is designed for founders and operators, not coders. Select a tool, fill in your business name, and the AI generates production-ready marketing assets." },
  { q: "How is UMBRA different from GoHighLevel?", a: "GoHighLevel gives you empty templates and makes you do the work. UMBRA is an autonomous engine that generates the actual content, strategies, and creatives for you. It's the difference between buying a toolkit and hiring a 24/7 marketing team." },
  { q: "What are AI generations?", a: "Each time you use an AI tool (e.g., generate a blog post, analyze a competitor, create a landing page), that counts as one generation. Free users get 20/day, Pro and Agency get unlimited." },
  { q: "What is BYOK (Bring Your Own Key)?", a: "You can plug in your own API keys for Gemini, Anthropic, or Tavily. This means your generations use your own API quota, giving you full control over costs and usage." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. Monthly billing, cancel whenever you want." },
  { q: "What payment methods do you accept?", a: "We accept credit/debit cards, Instant EFT, SnapScan, and bank transfers via Paystack. All payments in South African Rand (ZAR)." },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const checkout = async (plan: string) => {
    if (plan === "starter") {
      window.location.assign("/dashboard");
      return;
    }

    try {
      const res = await fetch("/api/payments/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (data.success && data.authorizationUrl) {
        window.location.assign(data.authorizationUrl);
        return;
      }

      alert(data.error || "Payment is being set up. Please try again.");
    } catch {
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,183,255,0.06),transparent)] blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00B7FF] to-blue-600 flex items-center justify-center text-xs font-bold">U</div>
          <span className="text-sm font-medium tracking-[0.15em] uppercase">UMBRA</span>
        </Link>
        <div className="flex items-center gap-6 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/dashboard" className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all font-bold tracking-wider uppercase">Dashboard</Link>
        </div>
      </nav>

      <section className="relative z-10 text-center px-8 pt-12 pb-8 max-w-4xl mx-auto">
        <motion.div {...fadeIn(0)}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium uppercase tracking-wider mb-8">
            <Zap className="w-3 h-3" /> Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Replace Your R15,000/mo Agency.</h1>
          <p className="text-neutral-400 max-w-xl mx-auto">Hire a 24/7 team of 29 elite AI marketing agents for less than your daily coffee. 20 free generations per day to prove the ROI.</p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-8 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t, i) => (
            <motion.div key={i} {...fadeIn(i * 0.1)}
              className={`rounded-2xl bg-white/[0.02] backdrop-blur-sm border p-7 flex flex-col ${t.featured ? "border-[#00B7FF]/40 relative overflow-hidden scale-[1.02] shadow-[0_0_40px_rgba(0,183,255,0.1)]" : "border-white/10"}`}>
              {t.featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00B7FF] to-purple-500" />}
              {t.featured && <span className="inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full bg-[#00B7FF]/10 border border-[#00B7FF]/20 text-[#00B7FF] text-[10px] font-bold uppercase mb-3"><Crown className="w-2.5 h-2.5" /> Most Popular</span>}
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">{t.name}</p>
              <p className="text-4xl font-bold text-white mb-1">
                {t.price}
                {t.period !== "forever" && <span className="text-base text-neutral-500 font-normal">{t.period}</span>}
              </p>
              <p className="text-xs text-neutral-500 mb-6">{t.tagline}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {t.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm ${f.included ? "text-neutral-300" : "text-neutral-600"}`}>
                    {f.included ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XIcon className="w-4 h-4 text-neutral-700 shrink-0" />}
                    {f.name}
                  </li>
                ))}
              </ul>
              <button onClick={() => checkout(t.plan)}
                className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  t.featured
                    ? "bg-gradient-to-r from-[#00B7FF] to-purple-500 text-white hover:opacity-90"
                    : t.plan === "starter"
                    ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}>
                {t.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="relative z-10 px-8 pb-16 text-center max-w-lg mx-auto">
        <motion.div {...fadeIn(0)} className="rounded-2xl bg-white/[0.02] border border-white/10 p-8">
          <h3 className="text-lg font-bold mb-2">30-Day Money-Back Guarantee</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Try UMBRA for 30 days. If it doesn&apos;t work for you, we&apos;ll refund you — no questions asked.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider"><Shield className="w-3 h-3" /> SSL Secured</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider"><Shield className="w-3 h-3" /> Paystack Verified</span>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-8 pb-20 max-w-2xl mx-auto">
        <motion.div {...fadeIn(0)} className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-neutral-400">Everything you need to know.</p>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div key={i} {...fadeIn(i * 0.05)} className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors">
                <span className="text-sm font-medium text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                  {faq.q}
                </span>
                <span className={`text-neutral-500 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-6 pb-4">
                  <p className="text-sm text-neutral-400 leading-relaxed pl-6">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-8 pb-20 text-center max-w-lg mx-auto">
        <motion.div {...fadeIn(0)}>
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-sm text-neutral-400 mb-6">AI-powered marketing tools. Free to start. No credit card required.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-[0.15em] rounded-full hover:bg-neutral-200 transition-all">
            <Zap className="w-4 h-4" /> Start Free — 20 Generations/Day
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-8 py-10 text-center">
        <p className="text-[10px] text-neutral-600 uppercase tracking-[0.4em]">UMBRA — AI Marketing Platform</p>
      </footer>
    </div>
  );
}
