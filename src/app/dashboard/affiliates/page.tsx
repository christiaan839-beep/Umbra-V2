"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Link as LinkIcon, DollarSign, ExternalLink, ShieldCheck, Activity } from 'lucide-react';

export default function AffiliateEngine() {
  const [provisioning, setProvisioning] = useState(false);

  const simulateProvisioning = () => {
    setProvisioning(true);
    setTimeout(() => {
      setProvisioning(false);
    }, 2500);
  };

  const affiliates = [
    { name: "Apex Alpha", revenue: "R142,500", referrals: 24, status: "Active", utm: "utm_campaign=apex_alpha" },
    { name: "Growth OS Build", revenue: "R85,000", referrals: 12, status: "Active", utm: "utm_campaign=growth_build" },
    { name: "UMBRA Partners", revenue: "R41,000", referrals: 7, status: "Active", utm: "utm_campaign=partners" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12 font-sans text-neutral-200">
      
      {/* Header */}
      <div className="mb-12 border-b border-neutral-800/50 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-sm border border-emerald-500/30 flex items-center justify-center bg-emerald-500/10"
          >
            <Users className="w-4 h-4 text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-light tracking-tight text-white">Affiliate Protocol</h1>
        </div>
        <p className="text-neutral-500 max-w-2xl tracking-wide">
          Decentralized sales force architecture. Autonomously routes Stripe rev-shares, generates secure UTMs, and provisions affiliate dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Total Rev-Share Paid</h3>
            <p className="text-3xl font-light text-emerald-400">R384,500.00</p>
            <div className="mt-4 pt-4 border-t border-neutral-800">
               <p className="text-xs text-neutral-400">Next Payout: <span className="text-white">Mar 15, 2026</span></p>
            </div>
          </div>
          
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-6 backdrop-blur-md">
             <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Active Nodes</h3>
             <p className="text-3xl font-light text-white">142</p>
             <p className="text-xs text-emerald-500 mt-2">+12 this week</p>
          </div>

          <button 
            onClick={simulateProvisioning}
            disabled={provisioning}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium tracking-wide transition-all ${
              provisioning 
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                : "bg-emerald-500 hover:bg-emerald-400 text-black"
            }`}
          >
            {provisioning ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                   <Activity className="w-4 h-4" />
                </motion.div>
                Provisioning Node...
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                Generate New Affiliate Link
              </>
            )}
          </button>
        </div>

        {/* Right Table */}
        <div className="lg:col-span-3">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-8 backdrop-blur-md h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Live Affiliate Ledger
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="pb-4 font-medium">Entity / Node</th>
                    <th className="pb-4 font-medium">Tracking UTM</th>
                    <th className="pb-4 font-medium">Referrals</th>
                    <th className="pb-4 font-medium">Generated Revenue</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {affiliates.map((aff, i) => (
                    <tr key={i} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                      <td className="py-4">
                        <div className="font-medium text-white">{aff.name}</div>
                      </td>
                      <td className="py-4 font-mono text-xs text-neutral-400 bg-neutral-900/50 rounded px-2 mr-4 inline-block mt-2">
                        {aff.utm}
                      </td>
                      <td className="py-4 text-neutral-300">{aff.referrals}</td>
                      <td className="py-4 text-emerald-400 font-medium">{aff.revenue}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {aff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {provisioning && (
                     <motion.tr 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="border-b border-neutral-800/50 bg-indigo-500/5"
                     >
                        <td className="py-4 text-indigo-300 animate-pulse">Initializing...</td>
                        <td className="py-4 text-neutral-500 font-mono text-xs">utm_campaign=pending</td>
                        <td className="py-4 text-neutral-500">0</td>
                        <td className="py-4 text-neutral-500">R0.00</td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-400">Deploying</span>
                        </td>
                     </motion.tr>
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
