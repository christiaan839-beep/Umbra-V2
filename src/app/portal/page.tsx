"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientPortalLogin() {
  const [clientId, setClientId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      // In a real app, validate the ID against the DB. Here we just route to the dynamic page.
      router.push(`/portal/${clientId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center shadow-[0_0_30px_rgba(45,110,255,0.3)] mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Client Portal</h1>
          <p className="text-text-secondary text-sm mt-2 text-center">Secure access to your live AI Marketing ecosystem.</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-8 border border-glass-border">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Client Access ID
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter your secure ID"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-electric transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !clientId}
              className="w-full py-4 rounded-xl bg-white text-midnight font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-midnight" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                </span>
              ) : (
                <>Access Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </form>
        
        <p className="text-center text-xs text-text-secondary mt-8 uppercase tracking-widest">
           Powered by SOVEREIGN Autonomous Systems
        </p>
      </motion.div>
    </div>
  );
}
