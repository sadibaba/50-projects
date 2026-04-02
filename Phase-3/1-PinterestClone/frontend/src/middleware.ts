import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname } = request.nextUrl;

  // Public routes - no authentication needed
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Check if it's an API route - don't intercept API calls
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if it's a static file
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|json)$/)) {
    return NextResponse.next();
  }

  // Get token from localStorage equivalent (using cookie for middleware)
  // Since middleware can't access localStorage, we check the cookie
  const hasToken = !!token;

  // If trying to access protected route without token, redirect to login
  if (!hasToken && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access login/register, redirect to home
  if (hasToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};