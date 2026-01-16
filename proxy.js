import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/settings', '/templates'];

// Define public routes (no auth required)
const publicRoutes = ['/', '/login', '/signup', '/forgot-password'];

export function proxy(request) {
  const path = request.nextUrl.pathname;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Get the auth token from cookies
  const authToken = request.cookies.get('authToken')?.value;

  // For protected routes, redirect to login if no auth token exists
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    // Store the original URL so we can redirect back after login
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (files with extensions like .svg, .png, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*|_next).*)',
  ],
};
