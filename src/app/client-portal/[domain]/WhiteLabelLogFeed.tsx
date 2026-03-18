"use client";

import { motion } from "framer-motion";
import { CheckSquare, MessageSquare, Briefcase } from "lucide-react";

export default function WhiteLabelLogFeed() {
  const logs = [
    { time: "10:41 AM", text: "Ghost Fleet deployed 15 LinkedIn threads targeting Enterprise CMOs.", icon: MessageSquare, color: "blue" },
    { time: "09:22 AM", text: "Nemotron Voice successfully booked consultation with 'Acme Corp'.", icon: Briefcase, color: "emerald" },
    { time: "08:05 AM", text: "Scraped 400 Apollo.io contacts. Sent hyper-personalized cold sequences.", icon: CheckSquare, color: "purple" },
    { time: "02:14 AM", text: "Intercepted and redacted PII data via NeMo Guardrails during RAG upload.", icon: CheckSquare, color: "red" },
  ];

  return (
    <div className="space-y-4">
      {logs.map((log, i) => (
        <motion.div 
           initial={{ opacity: 0, x: -10 }} 
           animate={{ opacity: 1, x: 0 }} 
           transition={{ delay: i * 0.15 }}
           key={i} 
           className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
        >
          <div className={`p-2 rounded-lg bg-${log.color}-500/10 border border-${log.color}-500/20 mt-0.5`}>
             <log.icon className={`w-4 h-4 text-${log.color}-400`} />
          </div>
          <div>
             <p className="text-[10px] text-neutral-500 font-mono mb-1">{log.time}</p>
             <p className="text-sm text-neutral-300 leading-relaxed">{log.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
