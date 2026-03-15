import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, whitelabelConfig } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // 1. Ensure we have a dummy tenant
    let testTenant = await db.query.tenants.findFirst();
    
    if (!testTenant) {
        const [newTenant] = await db.insert(tenants).values({
            clerkUserId: "mock_user_123",
            nodeId: "UMB-NX-MOCK",
        }).returning();
        testTenant = newTenant;
    }

    // 2. Clear old config for doman
    await db.delete(whitelabelConfig).where(eq(whitelabelConfig.domain, "omega"));

    // 3. Insert mock config
    await db.insert(whitelabelConfig).values({
        tenantId: testTenant.id,
        domain: "omega",
        agencyName: "OMEGA ACQUISITIONS",
        primaryColor: "#ff00ff", // Neon Fuchsia
        supportEmail: "support@omega.ai"
    });

    return NextResponse.json({ success: true, message: "Omega configuration injected." });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
