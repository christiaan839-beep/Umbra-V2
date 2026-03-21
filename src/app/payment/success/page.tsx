"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-[#00ff66]" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-[0.15em]">Payment Received</h1>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Your Sovereign Matrix deployment is being activated. Your AI agent fleet is being configured for your account.
        </p>
        <div className="bg-neutral-950 border border-neutral-800 p-6 text-left space-y-3">
          <p className="text-xs text-neutral-500 uppercase tracking-widest">What happens next:</p>
          <ul className="text-sm text-neutral-400 space-y-2">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" /> Agents deploying to your account</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" /> Welcome email with portal access</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" /> Industry vertical auto-configured</li>
          </ul>
        </div>
        <Link href="/dashboard" className="inline-block w-full py-4 bg-[#00ff66] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#00dd55] transition-all">
          Enter Dashboard →
        </Link>
      </div>
    </div>
  );
}
