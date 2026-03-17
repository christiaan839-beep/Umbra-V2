"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Zap, Target, ShieldCheck, Activity } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: delay * 0.1, ease: [0.16, 1, 0.3, 1] as const }
});

export default function TreasuryHub() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Link Generator State
  const [productName, setProductName] = useState("");
  const [priceCents, setPriceCents] = useState<number>(4700);
  const [customerEmail, setCustomerEmail] = useState("");
  const [linkStatus, setLinkStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payments/paystack/checkout")
      .then(res => res.json())
      .then(d => {
        setData(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerateLink = async () => {
    if (!productName || !priceCents) return;
    setLinkStatus("loading");
    setGeneratedLink(null);
    try {
      const res = await fetch("/api/payments/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, priceCents, customerEmail })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error("Failed");
      setGeneratedLink(resData.data.url);
      setLinkStatus("success");
    } catch {
      setLinkStatus("error");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fade(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-widest flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            <span className="font-bold">TREASURY</span> SWARM
          </h1>
          <p className="text-text-secondary mt-2">Autonomous Billing, Webhooks, and MRR Telemetry.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
           Paystack Ready
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: `$${data?.metrics?.mrr_dollars || "0.00"}`, icon: TrendingUp, trend: "+12.4%", color: "text-electric" },
          { label: "Gross Revenue", value: `$${data?.metrics?.gross_revenue_dollars || "0.00"}`, icon: DollarSign, trend: "+8.1%", color: "text-emerald-400" },
          { label: "Net Revenue", value: `$${data?.metrics?.net_revenue_dollars || "0.00"}`, sub: "(After 2.9% + 30c)", icon: ShieldCheck, color: "text-white" },
          { label: "Refunds", value: `$${data?.metrics?.refund_dollars || "0.00"}`, icon: Activity, trend: "-2.1%", trendDown: true, color: "text-rose-500" },
        ].map((kpi, i) => (
          <motion.div key={i} {...fade(i + 1)} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">{kpi.label}</h3>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <div className="flex items-end justify-between">
               <div>
                  <p className="text-2xl font-bold text-white">{loading ? "—" : kpi.value}</p>
                  {kpi.sub && <p className="text-[10px] text-text-secondary mt-1">{kpi.sub}</p>}
               </div>
              {kpi.trend && (
                <span className={`flex items-center text-xs font-medium ${kpi.trendDown ? 'text-emerald-400' : 'text-emerald-400'}`}>
                  {kpi.trendDown ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1" />}
                  {kpi.trend}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Link Generator */}
        <div className="lg:col-span-1">
          <motion.div {...fade(5)} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-white" /> Checkout Generator
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary mb-2 block uppercase tracking-wider">Product / Service</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. 'UMBRA Retainer'"
                  className="w-full bg-onyx border border-glass-border/50 text-white p-3 rounded-lg outline-none focus:border-electric/50 transition-colors placeholder:text-text-secondary/50"
                  disabled={linkStatus === "loading"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-secondary mb-2 block uppercase tracking-wider">Price (Cents ZAR)</label>
                    <input 
                      type="number" 
                      value={priceCents}
                      onChange={(e) => setPriceCents(parseInt(e.target.value))}
                      className="w-full bg-onyx border border-glass-border/50 text-white p-3 rounded-lg outline-none focus:border-electric/50 transition-colors"
                      disabled={linkStatus === "loading"}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary mb-2 block uppercase tracking-wider">ZAR Total</label>
                    <div className="w-full bg-onyx/50 border border-glass-border/50 text-white p-3 rounded-lg text-emerald-400 font-bold">
                       R{(priceCents / 100).toFixed(2)}
                    </div>
                  </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-2 block uppercase tracking-wider">Client Email (Optional)</label>
                <input 
                  type="email" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full bg-onyx border border-glass-border/50 text-white p-3 rounded-lg outline-none focus:border-electric/50 transition-colors placeholder:text-text-secondary/50"
                  disabled={linkStatus === "loading"}
                />
              </div>

              <button
                onClick={handleGenerateLink}
                disabled={linkStatus === "loading" || !productName || !priceCents}
                className="w-full bg-white text-onyx font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 mt-2"
              >
                {linkStatus === "loading" ? "Generating..." : "Generate Payment Link"}
              </button>

              {generatedLink && (
                 <div className="mt-4 p-4 rounded-lg bg-emerald-400/10 border border-emerald-400/20 break-all">
                    <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">Link Ready</p>
                    <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:underline">
                        {generatedLink}
                    </a>
                 </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Col: Ledger */}
        <div className="lg:col-span-2">
           <motion.div {...fade(6)} className="glass-card">
              <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">AI Memory Ledger (Last 24h)</h2>
                <Target className="w-4 h-4 text-text-secondary" />
              </div>
              
              <div className="divide-y divide-glass-border">
                {loading ? (
                    <div className="p-8 text-center text-text-secondary animate-pulse">Syncing with Pinecone...</div>
                ) : data?.recent_transactions?.length > 0 ? (
                    data.recent_transactions.map((tx: any, i: number) => (
                        <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-glass-bg/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg bg-onyx border border-glass-border shrink-0 ${tx.status === 'refunded' ? 'text-rose-500' : 'text-emerald-400'}`}>
                                    {tx.status === 'refunded' ? <Activity className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-white font-medium truncate">{tx.productName || "Refund Processed"}</p>
                                    <p className="text-[10px] text-text-secondary">{tx.customerEmail || "anonymous"} • {new Date(tx.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className={`text-right ${tx.status === 'refunded' ? 'text-rose-500' : 'text-white font-bold'}`}>
                                {tx.status === 'refunded' ? '-' : '+'}${tx.amount_dollars}
                                <p className="text-[10px] text-text-secondary uppercase tracking-widest">{tx.status}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-text-secondary">No transactions recorded in current simulation window.</div>
                )}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
