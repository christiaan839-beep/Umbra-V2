"use client";

import { motion } from "framer-motion";
import { CreditCard, FileText, ArrowUpRight, Shield, Crown, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const PLAN_FEATURES = [
  "29 AI Marketing Agents",
  "Unlimited AI Generations",
  "Competitor Intelligence",
  "Programmatic SEO Factory",
  "Content Hub & Designer",
  "Lead Prospector & Outbound",
  "Client Report Generator",
  "Priority Support",
];

export default function BillingPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <CreditCard className="w-3 h-3" /> Billing
        </div>
        <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Subscription &amp; Billing</h1>
        <p className="text-sm text-[#8A95A5] mt-2 font-mono uppercase tracking-widest">
          Manage your plan and payment details
        </p>
      </div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border border-glass-border p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Current Plan</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-mono mb-1">UMBRA Starter</h3>
            <p className="text-sm text-[#8A95A5]">Full access to all AI marketing tools</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-3xl font-bold text-white font-mono">R2,750<span className="text-sm text-[#5C667A]">/mo</span></p>
            <p className="text-xs text-emerald-400 mt-1">Active — Paystack / PayFast</p>
          </div>
        </div>
      </motion.div>

      {/* Plan Features */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card border border-glass-border p-6 mb-6"
      >
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" /> What&apos;s Included
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PLAN_FEATURES.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-neutral-300">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Upgrade Plan", icon: ArrowUpRight, href: "/pricing" },
          { label: "View Pricing", icon: FileText, href: "/pricing" },
          { label: "Contact Support", icon: CreditCard, href: "mailto:support@umbra.co.za" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={item.href}
              className="glass-card p-5 border border-glass-border hover:border-emerald-500/30 transition-all text-left group block"
            >
              <item.icon className="w-5 h-5 text-emerald-400 mb-3" />
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{item.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Payment Status */}
      <div className="glass-card border border-glass-border overflow-hidden">
        <div className="px-6 py-4 border-b border-glass-border bg-black/40 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> Payment History
          </h3>
          <span className="text-[10px] text-[#5C667A] font-bold uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" /> Secured by Paystack
          </span>
        </div>

        <div className="p-8 text-center">
          <FileText className="w-10 h-10 text-[#2A2D35] mx-auto mb-3" />
          <p className="text-sm text-[#5C667A]">No invoices yet. Your payment history will appear here once your subscription is active via Paystack or PayFast.</p>
        </div>
      </div>
    </div>
  );
}
