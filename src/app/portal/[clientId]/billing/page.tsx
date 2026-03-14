"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, FileText, ArrowUpRight, Clock, CheckCircle2, Shield, Zap } from "lucide-react";

interface Props {
  params: { clientId: string };
}

export default function BillingPortalPage({ params }: Props) {
  const [invoices, setInvoices] = useState<Array<{ id: string; amount: string; date: string; status: string; pdf?: string }>>([]);
  const [currentPlan, setCurrentPlan] = useState("black-card");
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await fetch(`/api/stripe/billing?clientId=${params.clientId}`);
        const data = await res.json();
        if (data.success) {
          setInvoices(data.invoices || []);
          setCurrentPlan(data.currentPlan || "black-card");
        }
      } catch (err) {
        console.error("Failed to fetch billing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, [params.clientId]);

  const handleManageBilling = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: params.clientId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to create billing session:", err);
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    { id: "sovereign", name: "Sovereign", price: "$497/mo", features: ["5 AI Engines", "1,000 Actions/mo", "Email Support"] },
    { id: "black-card", name: "Black Card", price: "$1,497/mo", features: ["10 AI Engines", "Unlimited Actions", "Priority Support", "Client Portal"] },
    { id: "franchise", name: "Franchise", price: "$4,997/mo", features: ["All 15 Engines", "White-Label", "Dedicated Node", "Custom Training", "SLA"] },
  ];

  return (
    <div className="min-h-screen bg-midnight font-sans text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <CreditCard className="w-3 h-3" /> Billing
          </div>
          <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Billing & Subscription</h1>
          <p className="text-sm text-[#8A95A5] mt-2">Manage your plan, view invoices, and update payment methods</p>
        </div>

        {/* Current Plan */}
        <div className="glass-card border border-glass-border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#5C667A] uppercase tracking-widest mb-2">Current Plan</p>
              <h2 className="text-xl font-bold text-white capitalize">{currentPlan.replace("-", " ")}</h2>
            </div>
            <button
              onClick={handleManageBilling}
              disabled={upgrading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all"
            >
              {upgrading ? "Redirecting..." : <><CreditCard className="w-4 h-4" /> Manage Billing</>}
            </button>
          </div>
        </div>

        {/* Plan Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card border p-5 ${
                plan.id === currentPlan ? "border-emerald-500/50 shadow-[0_0_25px_rgba(52,211,153,0.15)]" : "border-glass-border"
              }`}
            >
              {plan.id === currentPlan && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded mb-3 inline-block">
                  Current
                </span>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-2xl font-bold font-mono text-emerald-400 mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-[#8A95A5]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Invoice History */}
        <div className="glass-card border border-glass-border overflow-hidden">
          <div className="px-6 py-4 border-b border-glass-border bg-black/40">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Invoice History
            </h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-[#5C667A] animate-pulse">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#5C667A]">No invoices yet. They&apos;ll appear here after your first billing cycle.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  {["Invoice", "Amount", "Date", "Status", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-[10px] font-bold text-[#5C667A] uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm font-mono text-white">{inv.id}</td>
                    <td className="px-4 py-3 text-sm font-mono text-emerald-400">{inv.amount}</td>
                    <td className="px-4 py-3 text-sm text-[#8A95A5]">{inv.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        inv.status === "paid" ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {inv.pdf && (
                        <a href={inv.pdf} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" /> PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
