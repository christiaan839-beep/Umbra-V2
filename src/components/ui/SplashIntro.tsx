"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "UMBRA SYSTEMS v2.0.7", delay: 0 },
  { text: "Initializing Sovereign AI Core...", delay: 200 },
  { text: "█████████████████████ 100%", delay: 500 },
  { text: "Gemini 2.5 Pro: ONLINE", delay: 900 },
  { text: "29 AI Agents: ARMED", delay: 1100 },
  { text: "Anti-Slop Engine: ACTIVE", delay: 1300 },
  { text: "Threat Level: ZERO COMPETITION", delay: 1500 },
  { text: "", delay: 1700 },
  { text: "SWARM OPERATIONAL.", delay: 1800 },
];

export function SplashIntro({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if user has seen the intro before
  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem("umbra-intro-seen");
    if (seen) {
      onComplete();
      return;
    }

    // Boot sequence timing
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay);
    });

    // Glitch effect
    setTimeout(() => setShowGlitch(true), 2000);
    
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      sessionStorage.setItem("umbra-intro-seen", "true");
      setDismissed(true);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center cursor-pointer"
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("umbra-intro-seen", "true");
          onComplete();
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />

        {/* CRT glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,183,255,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative w-full max-w-xl mx-auto px-8">
          {/* Terminal window */}
          <div className="font-mono text-sm space-y-1">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`${
                  line.text === "SWARM OPERATIONAL."
                    ? "text-emerald-400 text-lg font-bold mt-4"
                    : line.text.includes("100%")
                    ? "text-[#00B7FF]"
                    : line.text.includes("ZERO COMPETITION")
                    ? "text-rose-400"
                    : line.text.includes("ONLINE") || line.text.includes("ARMED") || line.text.includes("ACTIVE")
                    ? "text-emerald-400/80"
                    : "text-neutral-500"
                }`}
              >
                {line.text && (
                  <>
                    <span className="text-neutral-700 mr-2">›</span>
                    {line.text}
                  </>
                )}
              </motion.div>
            ))}

            {/* Blinking cursor */}
            {visibleLines < BOOT_LINES.length && (
              <span className="inline-block w-2 h-4 bg-[#00B7FF] animate-pulse" />
            )}
          </div>

          {/* Glitch flash */}
          {showGlitch && (
            <motion.div
              className="absolute inset-0 bg-[#00B7FF]/5"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Skip text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 text-[10px] text-neutral-600 uppercase tracking-[0.3em]"
        >
          Click to skip
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
