"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface DynamicCopyProps {
  copyKey: string;
  fallbackText: string;
  className?: string;
}

export function DynamicCopy({ copyKey, fallbackText, className = "" }: DynamicCopyProps) {
  const [text, setText] = useState(fallbackText);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Simulated realtime Pinecone/Gemini dynamic pull
    // In production, this hooks into the Swarm WebSocket or Server Actions
    const checkVariant = setTimeout(() => {
      // Simulate an AI overriding the fallback text based on ad source attribution
      setIsUpdating(true);
      setTimeout(() => {
        if (copyKey === "hero_headline") {
          setText("Stop Renting Employees. Own A Sovereign God-Brain.");
        } else if (copyKey === "hero_sub") {
          setText("The Elite AI Architecture that replaces your entire 50-person agency with an automated, self-healing swarm.");
        }
        setIsUpdating(false);
      }, 800);
    }, 3000); // 3 seconds after page loads, the AI adapts the message

    return () => clearTimeout(checkVariant);
  }, [copyKey]);

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
      
      {isUpdating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -right-6 top-1/2 -translate-y-1/2 text-emerald-400"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </motion.div>
      )}
    </div>
  );
}
