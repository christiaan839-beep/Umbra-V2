"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Activity, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import { pusherClient } from "@/lib/pusher";

interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: "thinking" | "resolved" | "error" | "action";
  source: string;
}

export function LiveTelemetry() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pusherClient) return;

    // Initial mock logs to show it's working
    setLogs([
      { id: 'init-1', timestamp: Date.now(), message: "Initializing UMBRA Neural Net...", type: "action", source: "SYSTEM" },
      { id: 'init-2', timestamp: Date.now() + 500, message: "Connecting to Vertex AI endpoints...", type: "thinking", source: "GOD-BRAIN" },
      { id: 'init-3', timestamp: Date.now() + 1000, message: "Connection established. Awaiting telemetry.", type: "resolved", source: "SYSTEM" }
    ]);

    const channel = pusherClient.subscribe("umbra-global");

    channel.bind("log", (data: Omit<LogEntry, "id">) => {
      setLogs((prev) => [...prev, { ...data, id: Math.random().toString(36).substring(7) }].slice(-50)); // Keep last 50
    });

    // Mock incoming telemetry for testing the UI
    const mockInterval = setInterval(() => {
      const types: LogEntry["type"][] = ["thinking", "resolved", "action"];
      const type = types[Math.floor(Math.random() * types.length)];
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          message: `Processing node sequence... [Status: ${type.toUpperCase()}]`,
          type,
          source: "GOD-BRAIN"
        }
      ].slice(-50));
    }, 8500);

    return () => {
      clearInterval(mockInterval);
      if (pusherClient) {
        pusherClient.unsubscribe("umbra-global");
      }
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed z-[90] bottom-20 right-4 lg:bottom-6 lg:right-6 bg-black/80 backdrop-blur-2xl border border-[#00B7FF]/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,183,255,0.15)] flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? "w-[90vw] lg:w-[600px] h-[400px]" : "w-[300px] lg:w-[350px] h-[160px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#00B7FF]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00B7FF] uppercase flex items-center gap-1.5">
            God-Brain <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 custom-scrollbar font-mono text-[10px] sm:text-xs space-y-2 opacity-90"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2"
            >
              <span className="text-neutral-600 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-neutral-500 shrink-0">[{log.source}]</span>
              <ChevronRight className={`w-3 h-3 shrink-0 mt-0.5 ${
                log.type === "thinking" ? "text-blue-400 animate-pulse" :
                log.type === "resolved" ? "text-emerald-400" :
                log.type === "error" ? "text-red-400" :
                "text-neutral-400"
              }`} />
              <span className={`break-words ${
                log.type === "thinking" ? "text-blue-300" :
                log.type === "resolved" ? "text-emerald-300" :
                log.type === "error" ? "text-red-400" :
                "text-neutral-300"
              }`}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input / Status Bar */}
      <div className="px-3 py-1.5 bg-black/50 border-t border-white/5 flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase">System nominal</span>
      </div>
    </motion.div>
  );
}
