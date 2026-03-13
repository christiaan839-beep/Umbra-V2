"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CITY_COORDS: [number, number, string][] = [
  [40.7128, -74.006, 'New York'],
  [51.5074, -0.1278, 'London'],
  [35.6762, 139.6503, 'Tokyo'],
  [-33.8688, 151.2093, 'Sydney'],
  [48.8566, 2.3522, 'Paris'],
  [1.3521, 103.8198, 'Singapore'],
  [55.7558, 37.6173, 'Moscow'],
  [-23.5505, -46.6333, 'São Paulo'],
  [25.2048, 55.2708, 'Dubai'],
  [37.7749, -122.4194, 'San Francisco'],
  [28.6139, 77.209, 'Delhi'],
  [-1.2921, 36.8219, 'Nairobi'],
  [52.52, 13.405, 'Berlin'],
  [31.2304, 121.4737, 'Shanghai'],
  [19.4326, -99.1332, 'Mexico City'],
];

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 36, 36]} />
      <meshBasicMaterial color="#00B7FF" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

function CityNodes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const positions = useMemo(() => {
    return CITY_COORDS.map(([lat, lon]) => latLonToVec3(lat, lon, 2.02));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#00B7FF" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function ArcConnections() {
  const groupRef = useRef<THREE.Group>(null);
  
  const arcs = useMemo(() => {
    const connections: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    const pairs = [
      [0, 1], [1, 4], [2, 5], [3, 10], [0, 9], [6, 13], [7, 14], [8, 11], [4, 12], [5, 2],
    ];
    
    pairs.forEach(([a, b]) => {
      const [lat1, lon1] = CITY_COORDS[a];
      const [lat2, lon2] = CITY_COORDS[b];
      connections.push({
        start: latLonToVec3(lat1, lon1, 2.02),
        end: latLonToVec3(lat2, lon2, 2.02),
        color: Math.random() > 0.5 ? '#00B7FF' : '#34d399',
      });
    });
    
    return connections;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc, i) => {
        const mid = arc.start.clone().add(arc.end).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(2.6 + Math.random() * 0.4);
        
        const curve = new THREE.QuadraticBezierCurve3(arc.start, mid, arc.end);
        const points = curve.getPoints(32);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={i}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial attach="material" color={arc.color} transparent opacity={0.35} />
          </line>
        );
      })}
    </group>
  );
}

function GlobeAtmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.15, 36, 36]} />
      <meshBasicMaterial color="#00B7FF" transparent opacity={0.02} side={THREE.BackSide} />
    </mesh>
  );
}

export default function TelemetryGlobe() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <GlobeWireframe />
        <CityNodes />
        <ArcConnections />
        <GlobeAtmosphere />
      </Canvas>
    </div>
  );
}
