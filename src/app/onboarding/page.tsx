"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Globe2, Rocket, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Zap } from "lucide-react";

const STEPS = [
  { id: "business", title: "Business Profile", icon: Building2 },
  { id: "channels", title: "Connect Channels", icon: Globe2 },
  { id: "launch", title: "Launch Campaign", icon: Rocket },
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    location: "",
    website: "",
    instagram: "",
    googleBusiness: "",
    facebook: "",
    campaignGoal: "lead-generation",
    targetAudience: "",
    monthlyBudget: "1000",
  });

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (currentStep === 0) return formData.businessName.trim() && formData.industry.trim();
    if (currentStep === 1) return true;
    if (currentStep === 2) return formData.targetAudience.trim();
    return false;
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      // Try PayFast checkout first
      const pfRes = await fetch("/api/payments/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter", businessName: formData.businessName }),
      });
      const pfData = await pfRes.json();

      if (pfData.success && pfData.formHtml) {
        const container = document.createElement("div");
        container.innerHTML = pfData.formHtml;
        document.body.appendChild(container);
        const form = container.querySelector("form");
        if (form) { form.submit(); return; }
      }

      // Fallback to Paystack
      const psRes = await fetch("/api/payments/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter", businessName: formData.businessName }),
      });
      const psData = await psRes.json();

      if (psData.success && psData.authorizationUrl) {
        window.location.assign(psData.authorizationUrl);
        return;
      }

      // If no payment gateway configured yet, complete onboarding anyway
      setIsLaunching(false);
      setIsComplete(true);
    } catch {
      // Payment gateway not ready — complete onboarding gracefully
      setIsLaunching(false);
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-light text-white tracking-wider mb-3">UMBRA Node Activated</h1>
          <p className="text-neutral-400 mb-8">Your AI marketing engine is now configured and initializing its first autonomous cycle for <strong className="text-white">{formData.businessName}</strong>.</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 text-cyan-400 rounded-xl uppercase tracking-widest font-bold font-mono text-xs hover:from-cyan-500/20 transition-all"
          >
            <Zap className="w-4 h-4" /> Enter Command Center
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-xl font-light text-white tracking-[0.3em] font-mono">UMBRA</h1>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Deploy Your AI Marketing Engine</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${i <= currentStep ? "bg-cyan-500/10 border border-cyan-500/30" : "bg-white/5 border border-white/10"}`}>
                    <Icon className={`w-4 h-4 ${i <= currentStep ? "text-cyan-400" : "text-neutral-600"}`} />
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold hidden sm:block ${i <= currentStep ? "text-cyan-400" : "text-neutral-600"}`}>{step.title}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-10 h-px ${i < currentStep ? "bg-cyan-500/30" : "bg-white/10"}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div key="business" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-light text-white tracking-wider mb-6">Tell us about your business</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Business Name *</label>
                    <input value={formData.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="e.g. Apex Dental Group" className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Industry *</label>
                    <select value={formData.industry} onChange={(e) => update("industry", e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 focus:outline-none focus:border-cyan-500/50 font-mono">
                      <option value="">Select Industry</option>
                      <option value="medspa">MedSpa / Aesthetics</option>
                      <option value="dental">Dental</option>
                      <option value="realestate">Real Estate</option>
                      <option value="fitness">Fitness / Gym</option>
                      <option value="saas">SaaS / Tech</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="agency">Marketing Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Location</label>
                    <input value={formData.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Miami, FL" className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 font-mono" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Website</label>
                    <input value={formData.website} onChange={(e) => update("website", e.target.value)} placeholder="e.g. https://apexdental.com" className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 font-mono" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div key="channels" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-light text-white tracking-wider mb-2">Connect your channels</h2>
                <p className="text-xs text-neutral-500 mb-6">Optional — UMBRA can operate without these, but connected channels enable full automation.</p>
                <div className="space-y-4">
                  {[
                    { key: "instagram", label: "Instagram Handle", placeholder: "@yourbusiness" },
                    { key: "googleBusiness", label: "Google Business Profile URL", placeholder: "https://g.co/..." },
                    { key: "facebook", label: "Facebook Page URL", placeholder: "https://facebook.com/..." },
                  ].map((ch) => (
                    <div key={ch.key}>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">{ch.label}</label>
                      <input value={(formData as Record<string, string>)[ch.key]} onChange={(e) => update(ch.key, e.target.value)} placeholder={ch.placeholder} className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 font-mono" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="launch" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-light text-white tracking-wider mb-6">Configure your first campaign</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Campaign Goal</label>
                    <select value={formData.campaignGoal} onChange={(e) => update("campaignGoal", e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 focus:outline-none focus:border-cyan-500/50 font-mono">
                      <option value="lead-generation">Lead Generation</option>
                      <option value="brand-awareness">Brand Awareness</option>
                      <option value="competitor-domination">Competitor Domination</option>
                      <option value="content-scale">Content at Scale</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Target Audience *</label>
                    <input value={formData.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} placeholder="e.g. Women 25-45 interested in Botox and facial treatments" className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2 block">Monthly Budget</label>
                    <select value={formData.monthlyBudget} onChange={(e) => update("monthlyBudget", e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-neutral-300 focus:outline-none focus:border-cyan-500/50 font-mono">
                      <option value="500">R5,000/mo</option>
                      <option value="1000">R10,000/mo</option>
                      <option value="2500">R25,000/mo</option>
                      <option value="5000">R50,000/mo</option>
                      <option value="10000">R100,000+/mo</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button onClick={() => setCurrentStep((p) => Math.max(0, p - 1))} disabled={currentStep === 0} className="px-5 py-2.5 text-neutral-500 flex items-center gap-2 disabled:opacity-30 uppercase tracking-widest font-bold font-mono text-[10px]">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {currentStep < 2 ? (
              <button onClick={() => setCurrentStep((p) => p + 1)} disabled={!canProceed()} className="px-6 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center gap-2 uppercase tracking-widest font-bold font-mono text-[10px] disabled:opacity-30 hover:from-cyan-500/20 transition-all">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleLaunch} disabled={!canProceed() || isLaunching} className="px-8 py-3 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2 uppercase tracking-widest font-bold font-mono text-[10px] disabled:opacity-30 hover:from-emerald-500/20 transition-all">
                {isLaunching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                {isLaunching ? "Deploying Node..." : "Launch UMBRA Node"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
