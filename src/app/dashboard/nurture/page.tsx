"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Zap, Clock, Activity, Target, Workflow, Play, CheckCircle2 } from 'lucide-react';

export default function NurtureMatrix() {
  const [pipelineActive, setPipelineActive] = useState(false);
  const [activeNode, setActiveNode] = useState(0);

  const simulatePipeline = async () => {
    setPipelineActive(true);
    setActiveNode(1);

    try {
      const res = await fetch("/api/agents/email-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "nurture", topic: "High-Ticket Agency Service", audience: "B2B decision makers", steps: 4 }),
      });
      const data = await res.json();
      if (data.success) {
        // Animate through the pipeline steps
        for (let i = 2; i <= 4; i++) {
          await new Promise(r => setTimeout(r, 1500));
          setActiveNode(i);
        }
        await new Promise(r => setTimeout(r, 1500));
        setPipelineActive(false);
      }
    } catch (err) {
      console.error("[Nurture Matrix] Pipeline error:", err);
      setPipelineActive(false);
    }
  };

  const sequenceSteps = [
    { day: 1, type: "Email", icon: Mail, title: "The Sovereign Value Bomb", desc: "Inject absolute conviction via High-Ticket Closer skill.", status: activeNode >= 1 ? "Sent" : "Queued" },
    { day: 2, type: "WhatsApp", icon: MessageSquare, title: "Direct Intervention", desc: "God-Brain custom check-in via Twilio API.", status: activeNode >= 2 ? "Sent" : "Queued" },
    { day: 4, type: "Email", icon: Mail, title: "The Agency Decimation Case Study", desc: "ROI mathematical proof + Video Testimonials.", status: activeNode >= 3 ? "Sent" : "Queued" },
    { day: 7, type: "WhatsApp", icon: MessageSquare, title: "The Ultimatum", desc: "Final scarcity trigger and checkout injection.", status: activeNode >= 4 ? "Sent" : "Queued" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12 font-sans text-neutral-200">
      
      {/* Header */}
      <div className="mb-12 border-b border-neutral-800/50 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-sm border border-rose-500/30 flex items-center justify-center bg-rose-500/10"
          >
            <Workflow className="w-4 h-4 text-rose-400" />
          </motion.div>
          <h1 className="text-3xl font-light tracking-tight text-white">Nurture Matrix</h1>
        </div>
        <p className="text-neutral-500 max-w-2xl tracking-wide">
          Omnichannel Sequencing Swarm. Autonomously routes unconverted God-Brain leads through a 7-day high-ticket email and WhatsApp extraction cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Command */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              Pipeline Telemetry
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-neutral-800 pb-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Active Leads</p>
                  <p className="text-3xl font-light text-white">1,492</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-500 mb-1">+14% (24h)</p>
                  <div className="h-1 w-16 bg-emerald-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[78%]"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-neutral-800 pb-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Drip Conversion Rate</p>
                  <p className="text-3xl font-light text-white">18.4%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-rose-400 mb-1">Target: 20%</p>
                  <div className="h-1 w-16 bg-rose-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[92%]"></div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  onClick={simulatePipeline}
                  disabled={pipelineActive}
                  className={`w-full py-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium tracking-wide transition-all ${
                    pipelineActive 
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-not-allowed" 
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  {pipelineActive ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                         <Activity className="w-4 h-4" />
                      </motion.div>
                      Executing Matrix...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Inject Test Lead
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Sequence */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-8 backdrop-blur-md relative overflow-hidden h-full">
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              7-Day Autonomous Architecture
            </h3>

            <div className="relative pl-6 space-y-10 border-l border-neutral-800">
              {sequenceSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Node Connector */}
                  <div className="absolute -left-[33px] top-1">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: activeNode > idx ? 1.2 : 0.8, 
                        opacity: activeNode > idx ? 1 : 0.5,
                        borderColor: activeNode > idx ? '#10b981' : (activeNode === idx + 1 && pipelineActive ? '#f43f5e' : '#3f3f46'),
                        backgroundColor: activeNode > idx ? '#052e16' : (activeNode === idx + 1 && pipelineActive ? '#4c0519' : '#18181b')
                      }}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center z-10`}
                    >
                      {activeNode > idx && <CheckCircle2 className="w-2 h-2 text-emerald-500" />}
                    </motion.div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                       <step.icon className={`w-5 h-5 ${step.type === 'Email' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">DAY {step.day}</span>
                          <h4 className="text-white text-lg font-medium">{step.title}</h4>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${activeNode > idx ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400">{step.desc}</p>
                      
                      {/* Active Animation */}
                      {pipelineActive && activeNode === idx + 1 && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 p-3 bg-rose-500/5 border border-rose-500/20 rounded text-xs font-mono text-rose-300"
                        >
                          <span className="text-rose-500 mr-2">&gt;</span>
                          Synthesizing personalized {step.type} payload via Gemini 1.5...
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
