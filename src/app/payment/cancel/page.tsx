"use client";

import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-[0.15em]">Payment Cancelled</h1>
        <p className="text-neutral-500 text-sm leading-relaxed">
          No charges were made. Your session has been safely terminated. You can retry anytime.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/pricing" className="w-full py-4 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all text-center">
            Return to Pricing
          </Link>
          <Link href="/" className="w-full py-4 border border-neutral-800 text-neutral-500 font-bold text-sm uppercase tracking-widest hover:border-neutral-600 transition-all text-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
