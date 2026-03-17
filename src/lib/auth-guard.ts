import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Reusable auth guard for API routes.
 * Returns the user email if authenticated, or a 401 response if not.
 *
 * Usage:
 * const auth = await requireAuth();
 * if (auth.error) return auth.error;
 * const email = auth.email;
 */
export async function requireAuth(): Promise<
  { email: string; userId: string; error?: never } | { error: NextResponse; email?: never; userId?: never }
> {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!user || !email) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized. Please sign in." },
          { status: 401 }
        ),
      };
    }
    return { email, userId: user.id };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Authentication failed." },
        { status: 401 }
      ),
    };
  }
}
