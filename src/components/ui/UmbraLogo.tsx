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
      <motion.img
        src="/logo.png"
        alt="UMBRA Sovereign Mark"
        className="w-full h-full object-cover rounded-md shadow-[0_0_20px_rgba(0,183,255,0.4)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
