"use client";

import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UmbraLogo({ className = "", size = "md" }: LogoProps) {
  const dimensions = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`relative flex items-center justify-center ${dimensions[size]} ${className}`}>
      {/* Outer rotating ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-text-secondary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
      </motion.svg>

      {/* Inner geometric shapes */}
      <svg viewBox="0 0 100 100" className="w-[70%] h-[70%] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
        {/* Top left triangle */}
        <motion.polygon
          points="50,15 20,40 50,40"
          fill="currentColor"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        />
        {/* Top right triangle */}
        <motion.polygon
          points="50,15 80,40 50,40"
          fill="url(#gradient-electric)"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
        {/* Bottom diamond */}
        <motion.polygon
          points="50,45 25,65 50,85 75,65"
          fill="url(#gradient-rose)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient-electric" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D6EFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <linearGradient id="gradient-rose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2D55" />
            <stop offset="100%" stopColor="#FF9B00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
