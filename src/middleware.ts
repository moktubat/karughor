import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin/login')) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_token')?.value;

        console.log('PATH:', pathname);
        console.log('COOKIE TOKEN:', token);

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};