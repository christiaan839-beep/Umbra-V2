"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UmbraLogo({ className = "", size = "md" }: LogoProps) {
  const dimensions = {
    sm: { wrapper: "w-6 h-6", px: 24 },
    md: { wrapper: "w-8 h-8", px: 32 },
    lg: { wrapper: "w-12 h-12", px: 48 },
  };

  const d = dimensions[size];

  return (
    <div className={`relative flex items-center justify-center ${d.wrapper} ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full"
      >
        <Image
          src="/logo.png"
          alt="UMBRA Sovereign Mark"
          width={d.px}
          height={d.px}
          className="w-full h-full object-cover rounded-md shadow-[0_0_20px_rgba(0,183,255,0.4)]"
          priority={size === "lg"}
        />
      </motion.div>
    </div>
  );
}
