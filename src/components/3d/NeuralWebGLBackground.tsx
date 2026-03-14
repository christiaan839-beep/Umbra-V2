"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null!);
  const [positions, setPositions] = React.useState<Float32Array | null>(null);
  
  // Generate 2000 random particles in a spherical distribution safely
  React.useEffect(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        // radius between 2 and 4
        const r = 2 + Math.random() * 2;
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
    }
    setPositions(pos);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Slowly rotate the entire swarm
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  if (!positions) return null;

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#10b981" // Emerald 500
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

export function NeuralWebGLBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
         {/* Ambient light isn't strictly necessary for Points, but good if we add 3D meshes later */}
         <ambientLight intensity={0.5} />
         <ParticleSwarm />
      </Canvas>
    </div>
  );
}
