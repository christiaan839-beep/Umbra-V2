import { NextResponse } from "next/server";
import type { User } from "@/types";

// In-memory user store for MVP. Replace with DB in production.
const users: Map<string, User & { password?: string }> = new Map();

// Default admin user
users.set("admin@umbra.ai", {
  email: "admin@umbra.ai",
  password: "umbra", // simple password for testing
  name: "Umbra Admin",
  tier: "franchise"
});

export async function POST(req: Request) {
  try {
    const { action, email, password, name } = await req.json();

    if (!email || (!password && action !== "logout")) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    if (action === "signup") {
      if (users.has(email)) {
        return NextResponse.json({ error: "Account already exists." }, { status: 400 });
      }
      
      const newUser: User = { email, name: name || email.split("@")[0], tier: "sovereign" };
      users.set(email, { ...newUser, password });
      
      const response = NextResponse.json({ success: true, user: newUser });
      
      // Set auth cookie
      response.cookies.set("umbra_session", Buffer.from(JSON.stringify(newUser)).toString("base64"), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      
      return response;
    }

    if (action === "login") {
      const user = users.get(email);
      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
      }
      
      const response = NextResponse.json({ 
        success: true, 
        user: { email: user.email, name: user.name, tier: user.tier }
      });
      
      response.cookies.set("umbra_session", Buffer.from(JSON.stringify({ email: user.email, name: user.name, tier: user.tier })).toString("base64"), {
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
    console.error("[Auth Error]:", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
