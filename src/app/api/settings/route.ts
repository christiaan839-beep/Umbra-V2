import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromCookie } from "@/lib/db"; // we still use this utility function

export async function POST(req: Request) {
  try {
    const { action, settings: newSettings } = await req.json();
    const userEmail = getUserFromCookie(req) || "admin@umbra.ai";

    if (action === "save") {
      const existing = await db.select().from(settings).where(eq(settings.userEmail, userEmail));
      
      let mergedConfig = newSettings;
      if (existing.length > 0) {
        const oldConfig = JSON.parse(existing[0].config);
        mergedConfig = { ...oldConfig, ...newSettings };
        
        await db.update(settings)
          .set({ config: JSON.stringify(mergedConfig) })
          .where(eq(settings.userEmail, userEmail));
      } else {
        await db.insert(settings).values({
          userEmail,
          config: JSON.stringify(mergedConfig)
        });
      }

      // Inject into runtime env for this serverless instance
      if (mergedConfig.META_ACCESS_TOKEN) process.env.META_ACCESS_TOKEN = mergedConfig.META_ACCESS_TOKEN;
      if (mergedConfig.META_AD_ACCOUNT_ID) process.env.META_AD_ACCOUNT_ID = mergedConfig.META_AD_ACCOUNT_ID;
      if (mergedConfig.TELEGRAM_BOT_TOKEN) process.env.TELEGRAM_BOT_TOKEN = mergedConfig.TELEGRAM_BOT_TOKEN;
      if (mergedConfig.TELEGRAM_ADMIN_CHAT_ID) process.env.TELEGRAM_ADMIN_CHAT_ID = mergedConfig.TELEGRAM_ADMIN_CHAT_ID;

      return NextResponse.json({ success: true, message: "Settings saved to Neon DB." });
    }

    if (action === "load") {
      const existing = await db.select().from(settings).where(eq(settings.userEmail, userEmail));
      const savedConfig = existing.length > 0 ? JSON.parse(existing[0].config) : {};

      // Mask sensitive values
      const masked: Record<string, string> = {};
      for (const [key, val] of Object.entries(savedConfig)) {
        const valStr = val as string;
        masked[key] = valStr.length > 8 ? valStr.slice(0, 4) + "••••" + valStr.slice(-4) : "••••••••";
      }

      const status = {
        META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
        META_AD_ACCOUNT_ID: !!process.env.META_AD_ACCOUNT_ID,
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_ADMIN_CHAT_ID: !!process.env.TELEGRAM_ADMIN_CHAT_ID,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      };

      return NextResponse.json({ success: true, masked, status });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("[Settings Postgres API]:", error);
    return NextResponse.json({ error: "Failed to process settings." }, { status: 500 });
  }
}
