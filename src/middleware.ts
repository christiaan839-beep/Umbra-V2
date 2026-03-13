import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Routes that require authentication
  const protectedRoutes = ['/dashboard', '/portal'];
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // Check for the session cookie
  const session = request.cookies.get('umbra_session');

  // If accessing a protected route without a session, redirect to login
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login while already authenticated, redirect to dashboard
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*', '/login'],
};
