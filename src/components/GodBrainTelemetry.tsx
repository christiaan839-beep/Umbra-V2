'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const STATIC_TELEMETRY_LOGS = [
    { id: 1, action: "Ghost Fleet initiated on X/Twitter.", status: "SUCCESS", latency: "24ms" },
    { id: 2, action: "Closer Agent intercepted IG Lead @b2b_founder.", status: "SUCCESS", latency: "102ms" },
    { id: 3, action: "Gemini 1.5 Pro synthesized 5k words SEO content.", status: "SUCCESS", latency: "890ms" },
    { id: 4, action: "Stripe God-Node generated R90,000 retainer invoice.", status: "SUCCESS", latency: "42ms" },
    { id: 5, action: "Pipecat Voice Swarm dialed target 555-0199.", status: "ACTIVE", latency: "14ms" },
    { id: 6, action: "God-Brain auto-patched Vercel Edge configuration.", status: "SUCCESS", latency: "7ms" },
    { id: 7, action: "Deepfake Hub rendered Veo 3.1 4k Cinematic Reel.", status: "SUCCESS", latency: "2104ms" },
    { id: 8, action: "Local Mac Node OpenClaw bridged to Python daemon.", status: "ACTIVE", latency: "4ms" },
];

export default function GodBrainTelemetry() {
    const [mounted, setMounted] = useState(false);
    const [logs, setLogs] = useState<typeof STATIC_TELEMETRY_LOGS>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Simulate active telemetry stream
    useEffect(() => {
        if (!mounted) return;
        let index = 0;
        const interval = setInterval(() => {
            if (index < STATIC_TELEMETRY_LOGS.length) {
                setLogs(prev => [STATIC_TELEMETRY_LOGS[index], ...prev].slice(0, 5)); // Keep only latest 5
                index++;
            } else {
                index = 0; // Loop logs
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl font-mono text-sm relative z-50">
            {/* Terminal Header */}
            <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between bg-black/50">
                <div className="flex items-center gap-2 text-gray-500">
                    <Terminal className="w-4 h-4" />
                    <span>SOVEREIGN_NODE_STDOUT</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
            </div>

            {/* Feed Data */}
            <div className="p-4 h-[200px] overflow-hidden flex flex-col justify-end relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none" />
                <AnimatePresence initial={false}>
                    {mounted && logs.map((log) => (
                        <motion.div
                            key={`${log.id}-${Math.random()}`}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-4 mb-3"
                        >
                            <span className="text-gray-600 shrink-0">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                            <span className="text-primary animate-pulse shrink-0">►</span>
                            <span className="text-gray-300 flex-1">{log.action}</span>
                            <span className={`shrink-0 ${log.status === 'SUCCESS' ? 'text-green-500' : 'text-yellow-500'}`}>[{log.status}]</span>
                            <span className="text-gray-600 shrink-0">{log.latency}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {logs.length === 0 && (
                    <div className="text-gray-600 animate-pulse">Awaiting God-Brain uplink...</div>
                )}
            </div>
        </div>
    );
}
