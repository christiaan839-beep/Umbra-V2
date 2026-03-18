"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function ImmersiveNodeLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // ⚡ SOVEREIGN SWARM: Node Architecture
    const nodes: { x: number, y: number, vx: number, vy: number, label: string, color: string }[] = [];
    const nodeLabels = ['NemoClaw', 'Twilio X1', 'Gemini 1.5', 'Postgres DB', 'N8N Webhook', 'Aider OS', 'ChromaDB', 'NVIDIA Riva'];
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E'];

    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        label: i < nodeLabels.length ? nodeLabels[i] : '',
        color: colors[i % colors.length]
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // Trailing effect for absolute cinematic motion
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw connections (The Neural Sync)
        for (let j = i + 1; j < nodes.length; j++) {
          const target = nodes[j];
          const dx = node.x - target.x;
          const dy = node.y - target.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1500})`;
            ctx.lineWidth = 1;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();

            // Draw Data Packets flowing securely across the Swarm
            if (Math.random() > 0.98) {
                ctx.beginPath();
                ctx.fillStyle = node.color;
                const packetX = node.x + dx * 0.5;
                const packetY = node.y + dy * 0.5;
                ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
                ctx.fill();
                // Glow effect on packet
                ctx.shadowBlur = 10;
                ctx.shadowColor = node.color;
            }
            ctx.shadowBlur = 0;
          }
        }

        // Draw Nodes
        ctx.beginPath();
        ctx.fillStyle = i < nodeLabels.length ? node.color : "rgba(255,255,255,0.3)";
        ctx.arc(node.x, node.y, i < nodeLabels.length ? 4 : 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw Labels for Core Sovereign Modules
        if (node.label) {
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.font = "10px monospace";
          ctx.fillText(node.label, node.x + 8, node.y + 4);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 z-0 pointer-events-none"
    >
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
       <canvas ref={canvasRef} className="w-full h-full block" />
    </motion.div>
  );
}
