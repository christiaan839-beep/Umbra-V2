"use client";

import React from "react";
import { CheckCircle2, X as XIcon, Zap, Crown, Server, ArrowRight, Shield } from "lucide-react";

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      description: "Explore all AI tools with 20 free generations per day.",
      price: "Free",
      period: "forever",
      icon: Zap,
      color: "text-[#00B7FF]",
      bg: "bg-[#00B7FF]/5",
      border: "border-[#00B7FF]/20",
      features: [
        { name: "20 AI generations / day", included: true },
        { name: "SEO X-Ray Analysis", included: true },
        { name: "Content Factory", included: true },
        { name: "Design Studio", included: true },
        { name: "Lead Prospector", included: true },
        { name: "My Library (history)", included: true },
        { name: "Bring Your Own API Key", included: true },
        { name: "Unlimited generations", included: false },
        { name: "White-label", included: false },
      ],
      planId: "starter",
      buttonText: "Start Free",
      buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    },
    {
      name: "Pro",
      description: "Unlimited AI power for growing businesses.",
      price: "R997",
      period: "/mo",
      icon: Crown,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      isPopular: true,
      features: [
        { name: "Everything in Starter", included: true },
        { name: "Unlimited AI generations", included: true },
        { name: "All AI tools unlocked", included: true },
        { name: "Priority API processing", included: true },
        { name: "Export to PDF & WordPress", included: true },
        { name: "Competitor monitoring", included: true },
        { name: "Email support (24h)", included: true },
        { name: "White-label", included: false },
        { name: "API access", included: false },
      ],
      planId: "pro",
      buttonText: "Upgrade to Pro",
      buttonStyle: "bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_0_20px_rgba(52,211,153,0.3)]",
    },
    {
      name: "Agency",
      description: "White-label platform for teams & agencies.",
      price: "R2,750",
      period: "/mo",
      icon: Server,
      color: "text-violet-400",
      bg: "bg-violet-500/5",
      border: "border-violet-500/20",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "White-label dashboard", included: true },
        { name: "Client portal access", included: true },
        { name: "Bulk pages (1000+/mo)", included: true },
        { name: "API access", included: true },
        { name: "Dedicated support", included: true },
        { name: "Custom branding", included: true },
        { name: "Team seats (5 included)", included: true },
        { name: "SLA guarantee", included: true },
      ],
      planId: "agency",
      buttonText: "Go Agency",
      buttonStyle: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    },
  ];

  const handleCheckout = async (planId: string) => {
    if (planId === "starter") {
      window.location.assign("/dashboard");
      return;
    }

    try {
      const res = await fetch("/api/payments/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
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
    <div className="w-full max-w-7xl mx-auto py-24 px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white serif-text mb-6">Start Free. Scale When Ready.</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          No credit card required. 20 free AI generations per day. Upgrade when you need unlimited power.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-3xl p-8 backdrop-blur-3xl border ${tier.border} ${tier.bg} transition-all duration-300 hover:-translate-y-2 ${tier.isPopular ? "shadow-[0_0_50px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50" : "hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"}`}
          >
            {tier.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                Most Popular
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border ${tier.border}`}>
                <tier.icon className={`w-5 h-5 ${tier.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">{tier.name}</h3>
            </div>

            <p className="text-sm text-neutral-400 mb-6 h-10">{tier.description}</p>

            <div className="mb-8">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-black text-white font-mono tracking-tighter">
                  {tier.price}
                </span>
                {tier.period !== "forever" && (
                  <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs mb-2">{tier.period}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleCheckout(tier.planId)}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all mb-8 flex items-center justify-center gap-2 ${tier.buttonStyle}`}
            >
              <ArrowRight className="w-4 h-4" /> {tier.buttonText}
            </button>

            <ul className="space-y-3">
              {tier.features.map((feature, i) => (
                <li key={i} className={`flex items-start gap-3 ${feature.included ? "" : "opacity-40"}`}>
                  {feature.included ? (
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.color}`} />
                  ) : (
                    <XIcon className="w-4 h-4 shrink-0 mt-0.5 text-neutral-600" />
                  )}
                  <span className={`text-sm ${feature.included ? "text-neutral-300 font-medium" : "text-neutral-600"}`}>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="mt-12 text-center flex items-center justify-center gap-6">
        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider"><Shield className="w-3 h-3" /> SSL Secured</span>
        <span className="text-xs text-neutral-500 uppercase tracking-widest">Secure payments via Paystack (Cards, Bank Transfer, EFT)</span>
      </div>
    </div>
  );
}
