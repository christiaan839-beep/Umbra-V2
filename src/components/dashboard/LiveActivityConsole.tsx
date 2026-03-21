"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Server, Zap, Globe2, ShieldAlert, Cpu } from 'lucide-react';

type LogEntry = {
  id: string;
  timestamp: string;
  module: string;
  message: string;
  level: 'info' | 'warn' | 'success';
  icon: React.ElementType;
};

const LOG_MESSAGES = [
  { module: 'NemoClaw', message: 'Intercepted payload from competitor origin.', icon: Zap, level: 'info' },
  { module: 'Twilio X1', message: 'Outbound connection established (Latency: 284ms).', icon: Globe2, level: 'success' },
  { module: 'Nemotron V3', message: 'Synthesizing voice response envelope.', icon: Activity, level: 'info' },
  { module: 'Morpheus', message: 'Guardrails enforced. PII scrubbed from execution trace.', icon: ShieldAlert, level: 'success' },
  { module: 'Neon DB', message: 'Commit successful on leads_index table.', icon: Server, level: 'info' },
  { module: 'Cosmos VLM', message: 'Extracting semantic hooks from competitor MP4.', icon: Cpu, level: 'warn' },
];

export function LiveActivityConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with first 4 logs (deterministic)
    const initialLogs = Array.from({ length: 4 }).map((_, i) => createLog(i));
    setLogs(initialLogs);

    // Cycle through logs sequentially at fixed 4-second interval (deterministic, not random)
    let index = 4;
    const interval = setInterval(() => {
      const newLog = createLog(index);
      setLogs(prev => {
        const updated = [...prev, newLog];
        return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
      });
      index++;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="hidden xl:flex w-72 h-screen border-l border-[#00B7FF]/10 bg-black/40 backdrop-blur-3xl flex-col shrink-0 relative z-20">
       <div className="p-4 border-b border-[#00B7FF]/10 bg-black/20 flex items-center justify-between">
         <div className="flex items-center gap-2">
           <Terminal className="w-4 h-4 text-[#00B7FF]" />
           <span className="text-xs font-bold tracking-widest uppercase text-white">Swarm Activity</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Live</span>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
         <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                className="flex flex-col gap-1 p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-1.5">
                     <log.icon className={`w-3 h-3 ${log.level === 'warn' ? 'text-amber-500' : log.level === 'success' ? 'text-emerald-500' : 'text-[#00B7FF]'}`} />
                     <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">{log.module}</span>
                   </div>
                   <span className="text-[8px] font-mono text-neutral-600">{log.timestamp}</span>
                 </div>
                 <p className="text-[10px] text-neutral-300 font-mono leading-relaxed">
                   {log.message}
                 </p>
              </motion.div>
            ))}
         </AnimatePresence>
         <div ref={endRef} />
       </div>
    </div>
  );
}

function createLog(index: number): LogEntry {
  const template = LOG_MESSAGES[index % LOG_MESSAGES.length];
  const d = new Date();
  const timestamp = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  return {
    id: `log-${index}`,
    timestamp,
    module: template.module,
    message: template.message,
    level: template.level as 'info' | 'warn' | 'success',
    icon: template.icon
  };
}
