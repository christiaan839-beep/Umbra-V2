"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null);
  const count = 5000;
  
  // Generate random spherical distribution for an imposing "God-Brain" shape
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       const u = Math.random();
       const v = Math.random();
       const theta = u * 2.0 * Math.PI;
       const phi = Math.acos(2.0 * v - 1.0);
       const r = Math.cbrt(Math.random()) * 2.8;
       
       p[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
       p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
       p[i * 3 + 2] = r * Math.cos(phi); // z
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color="#34D399"
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export function ImmersiveNodeLayer() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
       {/* Deep dark gradient over the 3D globe to make it look embedded in obsidian */}
       <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10 opacity-70" />
       
       <Canvas camera={{ position: [0, 0, 4] }}>
         <ParticleSwarm />
       </Canvas>
    </div>
  );
}
