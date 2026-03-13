"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// A single glowing particle/node in the AGI Swarm Network
function NodeParticle({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Subtle hovering animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
    </mesh>
  );
}

// Global rotating neural constellation
function SwarmConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random node positions within a spherical radius
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 150; i++) {
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.acos(Math.random() * 2 - 1);
       const r = 3 + Math.random() * 2; // Radius between 3 and 5

       const x = r * Math.sin(phi) * Math.cos(theta);
       const y = r * Math.sin(phi) * Math.sin(theta);
       const z = r * Math.cos(phi);
       
       // Assign colors based on node "type"
       const type = Math.random();
       let color = "#00B7FF"; // Electric Blue (Processing)
       if (type > 0.8) color = "#10B981"; // Emerald (Revenue)
       else if (type > 0.6) color = "#F43F5E"; // Rose (Action)

       temp.push({ position: [x, y, z] as [number, number, number], color });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow cinematic rotation
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <NodeParticle key={i} position={n.position} color={n.color} />
      ))}
    </group>
  );
}

export default function ImmersiveNodeLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <fog attach="fog" args={['#050505', 5, 15]} />
        <ambientLight intensity={0.5} />
        <SwarmConstellation />
      </Canvas>
    </div>
  );
}
