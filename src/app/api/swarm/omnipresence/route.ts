import { NextResponse } from "next/server";
import { getAllMemories } from "@/lib/memory";

// Helper to assign rough geographic coordinates to events
const getRandomCity = () => {
  const cities = [
    { name: "New York", lat: 40.7128, lng: -74.0060, region: "NA" },
    { name: "London", lat: 51.5074, lng: -0.1278, region: "EU" },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, region: "AS" },
    { name: "Sydney", lat: -33.8688, lng: 151.2093, region: "OC" },
    { name: "San Francisco", lat: 37.7749, lng: -122.4194, region: "NA" },
    { name: "Berlin", lat: 52.5200, lng: 13.4050, region: "EU" },
    { name: "Singapore", lat: 1.3521, lng: 103.8198, region: "AS" },
    { name: "Austin", lat: 30.2672, lng: -97.7431, region: "NA" },
    { name: "Miami", lat: 25.7617, lng: -80.1918, region: "NA" },
    { name: "Dubai", lat: 25.2048, lng: 55.2708, region: "ME" }
  ];
  return cities[Math.floor(Math.random() * cities.length)];
};

export async function GET() {
  try {
    // 1. Pull recent memories to simulate global footprint
    const memories = getAllMemories();
    
    // Sort youngest to oldest
    const recentEvents = [...memories].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50);

    // 2. Map events to geographic telemetry data
    const telemetry = recentEvents.map((event, index) => {
        const city = getRandomCity();
        let typeGroup = "intelligence";
        
        if (event.metadata?.type?.includes("revenue") || event.metadata?.type?.includes("treasury")) {
            typeGroup = "capital";
        } else if (event.metadata?.type?.includes("ad-") || event.metadata?.type?.includes("social")) {
            typeGroup = "attention";
        } else if (event.metadata?.type?.includes("prospector") || event.metadata?.type?.includes("lead")) {
            typeGroup = "acquisition";
        }

        return {
            id: `tel_${index}_${Date.now()}`,
            timestamp: event.timestamp,
            location: {
                lat: city.lat + (Math.random() * 2 - 1), // Add slight fuzziness 
                lng: city.lng + (Math.random() * 2 - 1),
                name: city.name,
                region: city.region
            },
            type: typeGroup,
            description: event.text.substring(0, 60) + "...",
            intensity: Math.random() * 100
        };
    });

    // 3. Aggregate Global Stats
    const stats = {
        activeNodes: Math.floor(Math.random() * 500) + 1200,
        funnelsHijacked: Math.floor(Math.random() * 50) + 300,
        capitalExtracted: Math.floor(Math.random() * 50000) + 80000,
        attentionCaptured: Math.floor(Math.random() * 1000000) + 2500000,
    };

    return NextResponse.json({
        success: true,
        data: {
            telemetry,
            stats,
            lastPing: new Date().toISOString()
        }
    });

  } catch (error: any) {
    console.error("[Omnipresence Error]:", error);
    return NextResponse.json({ error: "Failed to generate global telemetry" }, { status: 500 });
  }
}
