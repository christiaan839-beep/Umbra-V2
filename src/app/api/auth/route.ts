import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { User } from "@/types";

export async function POST(req: Request) {
  try {
    const { action, email, password, name } = await req.json();

    if (!email || (!password && action !== "logout")) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    if (action === "signup") {
      if (db.users.findByEmail(email)) {
        return NextResponse.json({ error: "Account already exists." }, { status: 400 });
      }

      const newUser = db.users.create(email, password, name);
      const sessionUser: User = { email: newUser.email, name: newUser.name, tier: newUser.tier };
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
      const user = db.users.verifyPassword(email, password);
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
      }

      const sessionUser: User = { email: user.email, name: user.name, tier: user.tier };
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
    console.error("[Auth Error]:", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
