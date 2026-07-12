import { NextResponse } from 'next/server';
import { get } from '@/lib/api';

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // 1. Statik dosyalar ve Next iç dosyaları
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const isLoginPage = pathname === '/login';
    const isHomePage = pathname === '/';

    // 2. Token YOKSA → sadece login ve home serbest
    if (!token) {
        if (isLoginPage || isHomePage) return NextResponse.next();

        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // 3. Token doğrulama
        const result = await get({
            endpoint: 'auth/verify-token',
            bearerToken: token,
        });

        // 4. Token geçersizse
        if (!result || !result.status) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }

        // 5. Token VARSA
        // Login sayfasına girerse dashboarda at
        if (isLoginPage) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Home sayfası serbest (ister loginli ister değil)
        if (isHomePage) {
            return NextResponse.next();
        }

        // Diğer sayfalar serbest
        return NextResponse.next();

    } catch (error) {
        console.error("Proxy Hatası:", error.message);

        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

// 6. Matcher
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};