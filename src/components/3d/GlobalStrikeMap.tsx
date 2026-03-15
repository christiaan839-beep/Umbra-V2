"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// @ts-ignore
import Globe from 'three-globe';

interface TelemetryLog {
    id: string | number;
    location: string;
    action: string;
    isCapital?: boolean;
    lat?: number;
    lng?: number;
}

export function GlobalStrikeMap({ logs }: { logs: TelemetryLog[] }) {
    const groupRef = useRef<THREE.Group>(null);
    const globeInstanceRef = useRef<any>(null);

    // Initial Globe Setup
    useEffect(() => {
        if (!groupRef.current) return;

        const globe = new Globe()
            // We use standard base64/hex colors instead of loading external images to prevent CORS/rendering latency
            .globeMaterial(new THREE.MeshPhongMaterial({ color: '#001824', transparent: true, opacity: 0.9 }))
            .showAtmosphere(true)
            .atmosphereColor('#00B7FF')
            .atmosphereAltitude(0.15);

        // Map the geographic data from logs (assuming fake or derived lat/lng for visual effect)
        // If the logs lack explicit coords, we generate deterministic fake ones based on location name.
        
        globeInstanceRef.current = globe;
        groupRef.current.add(globe);

        // Scale the globe to match the previous sphere size (~2 units radius)
        // three-globe default radius is 100, so scale it down
        globe.scale.set(0.02, 0.02, 0.02);

        return () => {
            if (groupRef.current) {
                groupRef.current.remove(globe);
            }
        };
    }, []);

    // Update Globe data dynamically when logs change
    useEffect(() => {
        if (!globeInstanceRef.current) return;
        const globe = globeInstanceRef.current;

        // Generate synthetic lat/lng from the log locations to scatter them (for visual simulation)
        const gData = logs.map(log => {
            // Simple deterministic hash for lat/lng based on location string
            let hash = 0;
            for (let i = 0; i < log.location.length; i++) {
                hash = log.location.charCodeAt(i) + ((hash << 5) - hash);
            }
            const lat = (Math.abs(hash) % 180) - 90;
            const lng = (Math.abs(hash >> 8) % 360) - 180;
            
            return {
                lat,
                lng,
                size: log.isCapital ? 0.8 : 0.3,
                color: log.isCapital ? '#34d399' : '#00B7FF' // Emerald for capital, Electric blue for attention
            };
        });

        // Push new points to the globe
        globe
            .pointsData(gData)
            .pointAltitude('size')
            .pointColor('color')
            .pointResolution(32);

        // Also add sweeping laser lines (Arcs) from the Swarm Core (e.g. London) to the Strike point
        const originLat = 51.5074;
        const originLng = -0.1278; // London Command

        const arcData = gData.map(point => ({
            startLat: originLat,
            startLng: originLng,
            endLat: point.lat,
            endLng: point.lng,
            color: point.color
        }));

        globe
            .arcsData(arcData)
            .arcColor('color')
            .arcAltitude(0.3)
            .arcStroke(0.5)
            .arcDashLength(0.4)
            .arcDashGap(4)
            .arcDashInitialGap(() => Math.random() * 5)
            .arcDashAnimateTime(2000);

    }, [logs]);

    // Earth Rotation Animation
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.003;
            // Slight tilt
            groupRef.current.rotation.x = 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <pointLight position={[100, 100, 100]} intensity={1.5} color="#00B7FF" />
            <pointLight position={[-100, -100, -100]} intensity={0.5} color="#34d399" />
        </group>
    );
}
