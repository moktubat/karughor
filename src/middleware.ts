import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const adminToken = request.cookies.get('admin_token')?.value;

    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            if (adminToken) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};