"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X as XIcon, ArrowRight, Zap, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fadeIn = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d, duration: 0.6 } });

const TIERS = [
  {
    name: "Starter", price: "R2,750", period: "/mo", plan: "starter", featured: false,
    tagline: "For businesses getting started with AI marketing",
    features: [
      { name: "AI Booking Agent", included: true },
      { name: "Chat Widget", included: true },
      { name: "Content Studio", included: true },
      { name: "Email Sequences", included: true },
      { name: "100 AI generations/mo", included: true },
      { name: "Ad Creative Generator", included: false },
      { name: "Outbound Engine", included: false },
      { name: "Funnel X-Ray", included: false },
      { name: "Programmatic SEO", included: false },
      { name: "Custom AI Agents", included: false },
    ],
  },
  {
    name: "Growth", price: "R5,500", period: "/mo", plan: "growth", featured: true,
    tagline: "For agencies and fast-scaling startups",
    features: [
      { name: "Everything in Starter", included: true },
      { name: "Ad Creative Generator", included: true },
      { name: "Outbound Engine", included: true },
      { name: "Client Reports", included: true },
      { name: "Reputation AI", included: true },
      { name: "Unlimited generations", included: true },
      { name: "Funnel X-Ray", included: false },
      { name: "Competitor Intel", included: false },
      { name: "Programmatic SEO", included: false },
      { name: "Custom AI Agents", included: false },
    ],
  },
  {
    name: "Enterprise", price: "R9,500", period: "/mo", plan: "enterprise", featured: false,
    tagline: "Full access to every tool on the platform",
    features: [
      { name: "Everything in Growth", included: true },
      { name: "Funnel X-Ray", included: true },
      { name: "Competitor Intel", included: true },
      { name: "Programmatic SEO", included: true },
      { name: "Page Builder", included: true },
      { name: "Custom AI Agents", included: true },
      { name: "Priority Support", included: true },
      { name: "Social Router", included: true },
      { name: "Content Calendar", included: true },
      { name: "Client Portal", included: true },
    ],
  },
];

const FAQS = [
  { q: "What AI tools are included?", a: "UMBRA includes 29 AI marketing tools covering content creation, lead generation, SEO, email sequences, ad creatives, social media, competitor analysis, client reporting, and more. All powered by Google Gemini 2.5." },
  { q: "Do I need technical skills?", a: "No. The dashboard is designed for non-technical users. Select what you need, fill in a brief, and the AI generates results in seconds." },
  { q: "How is this different from GoHighLevel or HubSpot?", a: "Those platforms give you tools and templates. UMBRA generates the actual content, strategies, and creatives for you using AI. It's the difference between a toolkit and a team." },
  { q: "What payment methods do you accept?", a: "We accept credit/debit cards, Instant EFT, SnapScan, and bank transfers via PayFast and Paystack. All payments are in South African Rand (ZAR)." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no cancellation fees. Monthly billing, cancel whenever you want." },
  { q: "Is there a free trial?", a: "Yes. You can explore the platform with limited generations before subscribing. No credit card required to sign up." },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const checkout = async (plan: string) => {
    try {
      // Try PayFast first
      const pfRes = await fetch("/api/payments/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const pfData = await pfRes.json();

      if (pfData.success && pfData.formHtml) {
        const container = document.createElement("div");
        container.innerHTML = pfData.formHtml;
        document.body.appendChild(container);
        const form = container.querySelector("form");
        if (form) { form.submit(); return; }
      }

      // Fallback to Paystack
      const psRes = await fetch("/api/payments/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const psData = await psRes.json();

      if (psData.success && psData.authorizationUrl) {
        window.location.href = psData.authorizationUrl;
        return;
      }

      alert("Payment is being set up. Please contact us to subscribe.");
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
            <Zap className="w-3 h-3" /> Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Three Plans. No Hidden Fees.</h1>
          <p className="text-neutral-400 max-w-lg mx-auto">Monthly billing, cancel anytime. All prices in ZAR.</p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-8 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t, i) => (
            <motion.div key={i} {...fadeIn(i * 0.1)}
              className={`rounded-2xl bg-white/[0.02] backdrop-blur-sm border p-7 flex flex-col ${t.featured ? "border-emerald-500/40 relative overflow-hidden scale-[1.02]" : "border-white/10"}`}>
              {t.featured && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300" />}
              {t.featured && <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase mb-3">Most Popular</span>}
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">{t.name}</p>
              <p className="text-4xl font-bold text-white mb-1">{t.price}<span className="text-base text-neutral-500 font-normal">{t.period}</span></p>
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
                className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${t.featured ? "bg-emerald-400 text-black hover:bg-emerald-300" : "border border-white/10 text-white hover:bg-white/5"}`}>
                Get Started <ArrowRight className="w-4 h-4" />
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
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider"><Shield className="w-3 h-3" /> PayFast + Paystack</span>
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
          <p className="text-sm text-neutral-400 mb-6">29 AI marketing tools, one dashboard, one monthly price.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-[0.15em] rounded-full hover:bg-neutral-200 transition-all">
            <Zap className="w-4 h-4" /> Start Free Trial
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-8 py-10 text-center">
        <p className="text-[10px] text-neutral-600 uppercase tracking-[0.4em]">UMBRA — AI Marketing Platform</p>
      </footer>
    </div>
  );
}
