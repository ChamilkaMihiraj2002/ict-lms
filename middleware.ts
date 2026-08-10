import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT, COOKIE_NAME } from '@/lib/auth';

const PUBLIC_ROUTES = ['/login', '/register'];
const PUBLIC_API_ROUTES = ['/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public API routes or internal Next.js requests
  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyJWT(token) : null;
  const isAuthenticated = !!payload;

  const isAuthPage = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');

  // 1. If user is authenticated and tries to visit auth pages (/login, /register), redirect to home or admin
  if (isAuthenticated && isAuthPage) {
    const targetUrl = payload.role === 'ADMIN' ? '/admin' : '/';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // 2. If user is NOT authenticated and tries to visit a protected route or admin page
  if (!isAuthenticated && !isAuthPage) {
    // For API routes (excluding public ones), return 401 JSON response
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized. Valid JWT token required.' }, { status: 401 });
    }
    // For page routes, redirect to login with callbackUrl
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If user is authenticated but NOT an admin, and tries to access /admin
  if (isAuthenticated && isAdminPage && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static resources
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
