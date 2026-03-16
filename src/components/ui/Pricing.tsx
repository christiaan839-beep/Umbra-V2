"use client";

import React, { useState } from "react";
import { CheckCircle2, Zap, BrainCircuit, Server, Globe } from "lucide-react";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: "Starter",
      description: "For solo marketers & consultants.",
      priceMonthly: 2750,
      priceAnnual: 2200,
      icon: Zap,
      color: "text-[#00B7FF]",
      bg: "bg-[#00B7FF]/5",
      border: "border-[#00B7FF]/20",
      features: [
        "AI Booking Agent",
        "Chat Widget",
        "Content Studio",
        "Email Sequences",
        "100 AI Generations/mo"
      ],
      planId: "starter",
      buttonText: "Deploy Starter"
    },
    {
      name: "Growth",
      description: "For agencies & fast-scaling startups.",
      priceMonthly: 5500,
      priceAnnual: 4400,
      icon: BrainCircuit,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      isPopular: true,
      features: [
        "Everything in Starter",
        "Ad Creative Gen",
        "Outbound Engine",
        "Client Reports",
        "Reputation AI",
        "Unlimited Generations"
      ],
      planId: "growth",
      buttonText: "Deploy Growth"
    },
    {
      name: "Enterprise",
      description: "For high-volume operations.",
      priceMonthly: 9500,
      priceAnnual: 7600,
      icon: Server,
      color: "text-rose-400",
      bg: "bg-rose-500/5",
      border: "border-rose-500/20",
      features: [
        "Everything in Growth",
        "Funnel X-Ray",
        "Competitor Intel",
        "Programmatic SEO",
        "Page Builder",
        "Custom Skills",
        "Priority Support"
      ],
      planId: "enterprise",
      buttonText: "Deploy Enterprise"
    }
  ];

  const handleCheckout = async (planId: string) => {
    // Try PayFast first, fallback to Paystack
    try {
      const res = await fetch("/api/payments/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (data.success && data.formHtml) {
        // PayFast: inject form and auto-submit
        const container = document.createElement("div");
        container.innerHTML = data.formHtml;
        document.body.appendChild(container);
        const form = container.querySelector("form");
        if (form) form.submit();
        return;
      }

      // Fallback to Paystack
      const psRes = await fetch("/api/payments/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const psData = await psRes.json();

      if (psData.success && psData.authorizationUrl) {
        window.location.assign(psData.authorizationUrl);
        return;
      }

      alert("Payment providers are being configured. Please contact us to subscribe.");
    } catch (e) {
      console.error(e);
      alert("Checkout failed to initialize. Please try again.");
    }
  };

  const formatZAR = (amount: number) => {
    return `R${amount.toLocaleString()}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-24 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white serif-text mb-6">Choose Your Plan</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto mb-8">
          Stop paying R50,000/mo for a human agency. Deploy an autonomous AI swarm for a fraction of the cost.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-bold tracking-widest uppercase transition-colors ${!isAnnual ? 'text-white' : 'text-neutral-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 rounded-full bg-white/10 border border-white/20 relative flex items-center px-1 transition-colors hover:bg-white/20"
          >
            <div className={`w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold tracking-widest uppercase flex items-center gap-2 transition-colors ${isAnnual ? 'text-white' : 'text-neutral-500'}`}>
            Annually <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`relative rounded-3xl p-8 backdrop-blur-3xl border ${tier.border} ${tier.bg} transition-all duration-300 hover:-translate-y-2 ${tier.isPopular ? 'shadow-[0_0_50px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50' : 'hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]'}`}
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
                  {formatZAR(isAnnual ? tier.priceAnnual : tier.priceMonthly)}
                </span>
                <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs mb-2">/ mo</span>
              </div>
              {isAnnual && (
                <p className="text-xs text-emerald-400 font-medium">Billed {formatZAR(tier.priceAnnual * 12)}/year</p>
              )}
            </div>

            <button 
              onClick={() => handleCheckout(tier.planId)}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all mb-8 flex items-center justify-center gap-2 ${
                tier.isPopular 
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-[0_0_20px_rgba(52,211,153,0.3)]' 
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Globe className="w-4 h-4" /> {tier.buttonText}
            </button>

            <ul className="space-y-4">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.color}`} />
                  <span className="text-sm text-neutral-300 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="mt-12 text-center">
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Secure payments via PayFast (EFT, SnapScan, Cards) & Paystack (Cards, Bank Transfer)
        </p>
      </div>
    </div>
  );
}
