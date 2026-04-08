import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log('🔵 [Middleware] Request:', pathname);

    const adminToken = request.cookies.get('admin_token')?.value;

    // Admin routes
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            if (adminToken) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        return NextResponse.next();
    }

    // User protected routes (handled client-side)
    const protectedUserRoutes = ['/profile'];

    if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};