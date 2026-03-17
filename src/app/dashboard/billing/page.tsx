"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, Crown, CheckCircle2, Zap, Loader2, ArrowUpRight, Shield,
} from "lucide-react";
import { useUsage } from "@/hooks/useUsage";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    priceNum: 0,
    period: "forever",
    badge: "Current Plan",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    features: [
      "20 AI generations per day",
      "5 AI tools (SEO, Content, Design, Leads, Competitor)",
      "Result history in My Library",
      "Bring Your Own API Key (BYOK)",
      "Community support",
    ],
    cta: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R997",
    priceNum: 997,
    period: "/mo",
    badge: "Most Popular",
    badgeColor: "text-[#00B7FF] bg-[#00B7FF]/10 border-[#00B7FF]/20",
    features: [
      "Unlimited AI generations",
      "All AI tools unlocked",
      "Priority API processing",
      "Export to PDF & WordPress",
      "Advanced competitor monitoring",
      "Email support (24h response)",
    ],
    cta: "pro",
  },
  {
    id: "agency",
    name: "Agency",
    price: "R2,750",
    priceNum: 2750,
    period: "/mo",
    badge: "Enterprise",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    features: [
      "Everything in Pro",
      "White-label dashboard",
      "Client portal access",
      "Bulk page generation (1000+/mo)",
      "API access for integrations",
      "Dedicated support & onboarding",
    ],
    cta: "agency",
  },
];

export default function BillingPage() {
  const { today, limit, remaining, total } = useUsage();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId);
    try {
      const res = await fetch("/api/payments/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        alert(data.error || "Failed to start checkout. Please try again.");
      }
    } catch {
      alert("Connection failed. Please try again.");
    }
    setUpgrading(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <CreditCard className="w-3 h-3" /> Billing & Plans
        </div>
        <h1 className="text-3xl font-bold font-mono text-white tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-sm text-[#8A95A5] mt-2 font-mono uppercase tracking-widest">
          Scale your AI marketing with the right plan
        </p>
      </div>

      {/* Usage Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border border-glass-border p-5 mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Today&apos;s Usage</p>
            <p className="text-2xl font-bold text-white font-mono">
              {today}<span className="text-sm text-neutral-500">/{limit} generations</span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Remaining</p>
              <p className={`text-xl font-bold font-mono ${remaining > 5 ? "text-emerald-400" : remaining > 0 ? "text-amber-400" : "text-rose-400"}`}>
                {remaining}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">All Time</p>
              <p className="text-xl font-bold text-white font-mono">{total}</p>
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${remaining > 5 ? "bg-emerald-500" : remaining > 0 ? "bg-amber-500" : "bg-rose-500"}`}
            style={{ width: `${Math.min(100, (today / limit) * 100)}%` }}
          />
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card border p-6 flex flex-col ${
              plan.id === "pro"
                ? "border-[#00B7FF]/30 shadow-[0_0_30px_rgba(0,183,255,0.1)]"
                : "border-glass-border"
            }`}
          >
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider w-fit mb-4 ${plan.badgeColor}`}>
              {plan.id === "starter" ? <Shield className="w-2.5 h-2.5" /> : plan.id === "pro" ? <Zap className="w-2.5 h-2.5" /> : <Crown className="w-2.5 h-2.5" />}
              {plan.badge}
            </div>

            <h3 className="text-xl font-bold text-white font-mono mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-white font-mono">{plan.price}</span>
              {plan.period !== "forever" && (
                <span className="text-sm text-neutral-500">{plan.period}</span>
              )}
            </div>

            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {plan.cta ? (
              <button
                onClick={() => handleUpgrade(plan.cta!)}
                disabled={!!upgrading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  plan.id === "pro"
                    ? "bg-gradient-to-r from-[#00B7FF] to-purple-500 text-white hover:opacity-90"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {upgrading === plan.cta ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><ArrowUpRight className="w-4 h-4" /> Upgrade Now</>
                )}
              </button>
            ) : (
              <div className="w-full text-center py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 inline mr-1" /> Active
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center"
      >
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
          <Shield className="w-3 h-3 inline mr-1" />
          Secure payments via Paystack. Cancel anytime. ZAR pricing for South African businesses.
        </p>
      </motion.div>
    </div>
  );
}
