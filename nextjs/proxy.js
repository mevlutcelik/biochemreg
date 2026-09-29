import { NextResponse } from 'next/server';
import { get } from '@/lib/api';

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // 2. Statik dosyaları atla
    if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
        return NextResponse.next();
    }

    const isLoginPage = pathname === '/login';
    const isHomePage = pathname === '/';
    const isRegisterPage = pathname === '/register';
    const isPublicPage =
        isHomePage ||
        isLoginPage ||
        isRegisterPage ||
        pathname.startsWith('/team') ||
        pathname.startsWith('/members') ||
        pathname.startsWith('/director');

    // 4. Token YOKSA
    if (!token) {
        if (isPublicPage) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 5. Token VARSA (Auth Kontrolü)
    try {
        const result = await get({
            endpoint: 'auth/verify-token',
            bearerToken: token,
        });

        if (!result || !result.status) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }

        if (isLoginPage) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Proxy Hatası:", error.message);
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};