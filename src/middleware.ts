import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log('🔵 [Middleware] Request:', pathname);

    // Try to get tokens from cookies first (fallback)
    const userToken = request.cookies.get('user_token')?.value;
    const adminToken = request.cookies.get('admin_token')?.value;

    // Admin routes
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            // If already has admin token cookie, redirect to dashboard
            if (adminToken) {
                console.log('🔄 [Middleware] Admin already logged in, redirecting to dashboard');
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        // For other admin routes, we can't check localStorage in middleware
        // So we'll let the page handle the check
        // The auth check will happen client-side in the admin layout
        return NextResponse.next();
    }

    // User protected routes
    const protectedUserRoutes = ['/profile'];

    if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
        // Can't check localStorage in middleware, let page handle it
        return NextResponse.next();
    }

    // Auth routes (login/register)
    const authRoutes = ['/login', '/register'];

    if (authRoutes.includes(pathname)) {
        if (userToken) {
            const redirect = request.nextUrl.searchParams.get('redirect');
            if (redirect) {
                return NextResponse.redirect(new URL(redirect, request.url));
            }
            return NextResponse.redirect(new URL('/profile', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};