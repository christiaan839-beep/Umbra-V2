"use client";

import React from "react";
import { Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PdfExportButtonProps {
  elementId?: string; // Optional: If we want to hide other elements, we can add classes
  fileName?: string;
  className?: string;
}

export default function PdfExportButton({ fileName = "SOVEREIGN_Report", className = "" }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Add a custom class to the body to trigger print-specific CSS
    document.body.classList.add("printing-pdf");

    // Optional: Update title temporarily for the PDF filename
    const originalTitle = document.title;
    document.title = fileName;

    // Small delay to allow any print-specific CSS or rendering to apply
    setTimeout(() => {
      window.print();
      
      // Cleanup
      document.title = originalTitle;
      document.body.classList.remove("printing-pdf");
      setIsExporting(false);
    }, 500);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${
        isExporting 
          ? "bg-white/10 text-neutral-400 cursor-not-allowed" 
          : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20"
      } ${className}`}
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      Export PDF
    </motion.button>
  );
}
