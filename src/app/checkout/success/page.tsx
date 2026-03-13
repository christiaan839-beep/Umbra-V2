"use client";

import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-6">
      <div className="glass-card p-10 md:p-16 text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold serif-text mb-4 text-white">Welcome to UMBRA</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          Your intelligence node is being provisioned. You&apos;ll receive setup instructions via email within 24 hours.
        </p>
        <div className="space-y-3">
          <Link href="/dashboard"
            className="w-full py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/"
            className="w-full py-3 border border-glass-border text-white font-bold rounded-xl hover:bg-glass-bg transition-all flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
