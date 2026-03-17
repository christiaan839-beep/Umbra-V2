"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, TrendingUp, PhoneCall, CheckCircle2, 
  AlertCircle, BrainCircuit, GripVertical, 
  Network, Flame, FileText, ArrowRight, Zap 
} from "lucide-react";

type PipeStatus = "pipeline" | "negotiating" | "contract" | "won";

type Lead = {
  id: string;
  name: string;
  company: string;
  score: number;
  objection: "Pricing" | "Timing" | "Trust" | "None";
  objectionDetail: string;
  value: string;
  status: PipeStatus;
  avatar: string;
  lastTouch: string;
};

const INITIAL_LEADS: Lead[] = [
  {
    id: "1", name: "Sarah Jenkins", company: "Apex Dental Group", score: 87,
    objection: "Pricing", objectionDetail: "Thinks R15k/mo is high without guaranteed ROI.",
    value: "R180,000/yr", status: "pipeline", avatar: "SJ", lastTouch: "Called 2 hrs ago"
  },
  {
    id: "2", name: "Marcus Reed", company: "Elite Roofing & Solar", score: 94,
    objection: "Trust", objectionDetail: "Burned by previous agency. Needs case studies.",
    value: "R240,000/yr", status: "negotiating", avatar: "MR", lastTouch: "Follow-up email sent"
  },
  {
    id: "3", name: "David Chen", company: "Urban Law Partners", score: 99,
    objection: "None", objectionDetail: "Ready to sign. Waiting on senior partner approval.",
    value: "R400,000/yr", status: "contract", avatar: "DC", lastTouch: "Contract viewed"
  },
  {
    id: "4", name: "Elena Rostova", company: "Glow Aesthetics Clinic", score: 72,
    objection: "Timing", objectionDetail: "Wants to wait until Q3 budget opens up.",
    value: "R120,000/yr", status: "pipeline", avatar: "ER", lastTouch: "Voice Mail"
  }
];

export default function WarRoomPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const COLUMNS: { id: PipeStatus; title: string; color: string; icon: React.ElementType }[] = [
    { id: "pipeline", title: "God-Brain Call Pipeline", color: "text-blue-400 border-blue-400/20", icon: Network },
    { id: "negotiating", title: "In Negotiation", color: "text-amber-400 border-amber-400/20", icon: Flame },
    { id: "contract", title: "Contract Sent", color: "text-purple-400 border-purple-400/20", icon: FileText },
    { id: "won", title: "Closed Won", color: "text-emerald-400 border-emerald-400/20", icon: Target },
  ];

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: PipeStatus) => {
    e.preventDefault();
    if (!draggedLead) return;

    if (draggedLead.status !== status) {
      setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, status } : l));
    }
    setDraggedLead(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (score >= 75) return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  };

  const getObjectionBadge = (objection: Lead["objection"]) => {
    switch (objection) {
      case "Pricing": return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">💰 Pricing</span>;
      case "Trust": return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">🛡️ Trust</span>;
      case "Timing": return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">⏱️ Timing</span>;
      case "None": return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✅ Clear</span>;
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B7FF]/10 border border-[#00B7FF]/20 text-[#00B7FF] text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3 h-3" /> Closer Dynamics
          </div>
          <h1 className="text-3xl font-bold serif-text text-white">The War Room</h1>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Autonomous leads generated and dialed by the UMBRA God-Brain pipeline. The AI analyzes the call transcripts, calculates close probability, and extracts human objections.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-5 py-3 bg-black/50 border border-white/10 rounded-xl flex flex-col items-end shadow-xl">
             <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Pipeline Value</span>
             <span className="text-xl font-mono text-emerald-400 font-bold">R940,000</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-8 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {COLUMNS.map((col) => {
            const columnLeads = leads.filter(l => l.status === col.id);
            return (
              <div 
                key={col.id} 
                className="w-80 flex flex-col h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between p-3 mb-4 rounded-xl border bg-black/40 backdrop-blur-md ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <col.icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{col.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold">{columnLeads.length}</span>
                </div>

                {/* Column Body / Drop Zone */}
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-3 overflow-y-auto custom-scrollbar space-y-3">
                  <AnimatePresence>
                    {columnLeads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        draggable
                        onDragStart={() => handleDragStart(lead)}
                        className="glass-card p-4 border border-white/10 hover:border-[#00B7FF]/30 cursor-grab active:cursor-grabbing group relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00B7FF] to-purple-500 opacity-50"></div>
                         
                         {/* Card Header */}
                         <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                 {lead.avatar}
                               </div>
                               <div>
                                 <h4 className="text-sm font-bold text-white leading-tight block">{lead.name}</h4>
                                 <span className="text-[10px] text-stone-400 font-mono block">{lead.company}</span>
                               </div>
                            </div>
                            <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-4 h-4 text-stone-500" />
                            </div>
                         </div>

                         {/* AI Analytics Block */}
                         <div className="bg-black/40 rounded-lg p-2.5 border border-white/5 mb-3">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-[9px] uppercase tracking-widest text-[#00B7FF] font-bold flex items-center gap-1">
                                 <BrainCircuit className="w-3 h-3" /> AI Win Probability
                               </span>
                               <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${getScoreColor(lead.score)}`}>
                                 {lead.score}%
                               </span>
                            </div>
                            <div className="flex items-start gap-1.5 mt-2">
                               <AlertCircle className="w-3 h-3 text-stone-500 mt-0.5 shrink-0" />
                               <p className="text-[10px] text-stone-400 leading-snug font-medium italic">
                                 "{lead.objectionDetail}"
                               </p>
                            </div>
                         </div>

                         {/* Footer */}
                         <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                            <div className="flex gap-1">
                               {getObjectionBadge(lead.objection)}
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-400">{lead.value}</span>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {columnLeads.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-stone-600 opacity-50 border-2 border-dashed border-white/5 rounded-xl p-6 text-center">
                       <Target className="w-6 h-6 mb-2" />
                       <span className="text-xs font-bold uppercase tracking-widest">Drop Leads Here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
