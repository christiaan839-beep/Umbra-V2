"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Activity, MapPin, Database, Server, Zap, Target } from 'lucide-react';
import * as THREE from 'three';
import { io } from 'socket.io-client';

// 3D Rotating Earth Component
function NeuralEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);
  
  // Create random nodes on the sphere surface
  const nodes = React.useMemo(() => {
    const temp = [];
    const radius = 2; // match sphere radius
    for (let i = 0; i < 40; i++) {
        const phi = Math.acos(-1 + (2 * i) / 40);
        const theta = Math.sqrt(40 * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (earthRef.current) {
       earthRef.current.rotation.y += 0.002;
    }
    if (nodesGroupRef.current) {
       nodesGroupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00B7FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#34d399" />
      
      {/* Hollow / Wireframe Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial 
          color="#001824" 
          transparent={true} 
          opacity={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Neural Nodes */}
      <group ref={nodesGroupRef}>
        {nodes.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? "#34d399" : "#00B7FF"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}


// Active WebSocket Hook connecting to Executive Operations Server
function useOmnipresenceStream() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3011');
    
    socket.on('telemetry_update', (data) => {
      setLogs(prev => {
        const newLogs = [data, ...prev];
        return newLogs.slice(0, 8);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return logs;
}

export default function GlobalOmnipresenceGlobe() {
  const logs = useOmnipresenceStream();

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] flex overflow-hidden z-10 p-4 lg:p-8">
       
       {/* UI Overlay: Left Panel */}
       <div className="w-[380px] shrink-0 flex flex-col gap-6 z-20 pointer-events-none">
          <div className="pointer-events-auto bg-black/40 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,183,255,0.05)]">
             <h1 className="text-2xl font-light text-white tracking-widest font-mono flex items-center gap-3">
               <Globe2 className="w-6 h-6 text-[#00B7FF]" />
               OMNIPRESENCE
             </h1>
             <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-[10px] mt-2 font-bold mb-6">
               Global WebGL Telemetry Map
             </p>

             <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-[#00B7FF]/10 pb-4">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Active Earth Nodes</span>
                    <p className="text-2xl text-white font-mono font-light mt-1">42,801</p>
                  </div>
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                
                <div className="flex justify-between items-end border-b border-[#00B7FF]/10 pb-4">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Global Capital Deployed</span>
                    <p className="text-2xl text-emerald-400 font-mono font-light mt-1">$1.4M</p>
                  </div>
                  <Target className="w-5 h-5 text-[#00B7FF]" />
                </div>
             </div>
          </div>

          <div className="pointer-events-auto bg-black/60 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl p-6 flex-1 shadow-[0_0_50px_rgba(0,183,255,0.05)] overflow-hidden flex flex-col">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-4 flex items-center gap-2">
              <Database className="w-3 h-3" /> Live Geographical Extraction
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
               <AnimatePresence>
                 {logs.map(log => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-black/40 border border-[#00B7FF]/10 rounded-xl p-3"
                    >
                       <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3 h-3 text-[#00B7FF]" />
                          <span className="text-[10px] font-mono text-[#00B7FF] tracking-widest">{log.location}</span>
                       </div>
                       <p className={`text-xs font-mono ${log.isCapital ? 'text-emerald-400 font-bold' : 'text-neutral-300'}`}>
                         {log.action}
                       </p>
                       <div className="text-[9px] text-neutral-600 font-mono mt-1 text-right">
                         NODE_{log.id.toString().slice(-6)}
                       </div>
                    </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          </div>
       </div>

       {/* 3D Canvas Background (Takes up remaining space) */}
       <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,183,255,0.05),transparent_60%)]">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
             <NeuralEarth />
          </Canvas>
          
          {/* Target HUD Overlay */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
             <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#00B7FF]"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#00B7FF]"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#00B7FF]"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#00B7FF]"></div>
             <div className="absolute inset-0 rounded-full border border-[#00B7FF]/30 m-8"></div>
             <div className="absolute inset-[50%] bg-[#00B7FF] w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
          </div>
       </div>
       
    </div>
  );
}
