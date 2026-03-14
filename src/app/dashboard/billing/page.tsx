"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, FileText, ExternalLink, ArrowUpRight, Shield, Download, Crown } from "lucide-react";

type Invoice = {
  id: string;
  amount: string;
  date: string;
  status: string;
  pdfUrl: string | null;
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("/api/stripe/billing?customerId=current");
        const data = await res.json();
        if (data.invoices) setInvoices(data.invoices);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: "current", returnUrl: window.location.href }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Failed to open billing portal:", err);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <CreditCard className="w-3 h-3" /> Billing
        </div>
        <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Subscription & Billing</h1>
        <p className="text-sm text-[#8A95A5] mt-2 font-mono uppercase tracking-widest">
          Manage your plan, invoices, and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border border-glass-border p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Current Plan</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-mono mb-1">UMBRA Black Card</h3>
            <p className="text-sm text-[#8A95A5]">15 AI engines • Unlimited actions • Priority support</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white font-mono">$2,497<span className="text-sm text-[#5C667A]">/mo</span></p>
            <button
              onClick={openBillingPortal}
              disabled={portalLoading}
              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {portalLoading ? "Opening..." : <><ExternalLink className="w-3 h-3" /> Manage Plan</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Update Payment Method", icon: CreditCard, action: openBillingPortal },
          { label: "View All Invoices", icon: FileText, action: openBillingPortal },
          { label: "Upgrade Plan", icon: ArrowUpRight, action: openBillingPortal },
        ].map((item, i) => (
          <motion.button
            key={i}
            onClick={item.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 border border-glass-border hover:border-emerald-500/30 transition-all text-left group"
          >
            <item.icon className="w-5 h-5 text-emerald-400 mb-3" />
            <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{item.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="glass-card border border-glass-border overflow-hidden">
        <div className="px-6 py-4 border-b border-glass-border bg-black/40 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> Recent Invoices
          </h3>
          <span className="text-[10px] text-[#5C667A] font-bold uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" /> Secured by Stripe
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#5C667A] animate-pulse">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-10 h-10 text-[#2A2D35] mx-auto mb-3" />
            <p className="text-sm text-[#5C667A]">No invoices yet. Your first invoice will appear after your subscription starts.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border bg-black/20">
                {["Invoice", "Amount", "Date", "Status", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[10px] font-bold text-[#5C667A] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {invoices.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-4 text-xs font-mono text-white">{inv.id.slice(0, 20)}...</td>
                  <td className="px-4 py-4 text-sm font-bold text-emerald-400 font-mono">{inv.amount}</td>
                  <td className="px-4 py-4 text-xs text-[#8A95A5]">{inv.date}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                      inv.status === "paid" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {inv.pdfUrl && (
                      <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Download className="w-3 h-3" /> PDF
                      </a>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
