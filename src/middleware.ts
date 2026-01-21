import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get tokens from cookies
    const userToken = request.cookies.get('user_token')?.value;
    const adminToken = request.cookies.get('admin_token')?.value;

    // ========================================
    // ADMIN ROUTES PROTECTION
    // ========================================
    if (pathname.startsWith('/admin')) {
        // Allow access to admin login page
        if (pathname === '/admin/login') {
            // If already logged in as admin, redirect to dashboard
            if (adminToken) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        // Protect all other admin routes
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // TODO: Verify JWT token here
        // You can decode the token and check if it's valid
        // For now, we'll just check if it exists

        return NextResponse.next();
    }

    // ========================================
    // USER ROUTES PROTECTION
    // ========================================
    const protectedUserRoutes = ['/profile'];

    if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
        if (!userToken) {
            // Redirect to login with return URL
            const url = new URL('/login', request.url);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }

        // TODO: Verify JWT token here
        return NextResponse.next();
    }

    // ========================================
    // AUTH ROUTES (Login/Register)
    // ========================================
    const authRoutes = ['/login', '/register'];

    if (authRoutes.includes(pathname)) {
        // If already logged in, redirect to profile
        if (userToken) {
            return NextResponse.redirect(new URL('/profile', request.url));
        }
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};