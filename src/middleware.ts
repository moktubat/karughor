import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes
    if (pathname.startsWith('/admin')) {
        const authHeader = request.headers.get('authorization');

        console.log('PATH:', pathname);
        console.log('AUTH HEADER:', authHeader);

        // No token → redirect
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // ✅ OPTIONAL: basic check (no verify here)
        try {
            // You can decode manually if needed
            // but NOT required for simple protection
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};