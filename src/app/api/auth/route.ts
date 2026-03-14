import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@/types";

/** Simple hash for MVP login backwards compatibility */
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const chr = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}`;
}

export async function POST(req: Request) {
  try {
    const { action, email, password, name } = await req.json();

    if (!email || (!password && action !== "logout")) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    if (action === "signup") {
      const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (existing.length > 0) {
        return NextResponse.json({ error: "Account already exists." }, { status: 400 });
      }

      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        name: name || email.split("@")[0],
      }).returning();

      const sessionUser: User = { email: newUser.email, name: newUser.name, tier: newUser.tier as any };
      const response = NextResponse.json({ success: true, user: sessionUser });

      response.cookies.set("umbra_session", Buffer.from(JSON.stringify(sessionUser)).toString("base64"), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      return response;
    }

    if (action === "login") {
      const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      const user = existing[0];
      
      if (!user || user.passwordHash !== hashPassword(password)) {
        return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
      }

      const sessionUser: User = { email: user.email, name: user.name, tier: user.tier as any };
      const response = NextResponse.json({ success: true, user: sessionUser });

      response.cookies.set("umbra_session", Buffer.from(JSON.stringify(sessionUser)).toString("base64"), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("umbra_session");
      return response;
    }

    return NextResponse.json({ error: "Invalid action. Use: login, signup, logout" }, { status: 400 });
  } catch (error) {
    console.error("[Auth Postgres API Error]:", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
