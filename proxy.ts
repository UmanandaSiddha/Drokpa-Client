import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/admin')) {
        const hasRefreshToken = request.cookies.has('refreshToken')

        if (!hasRefreshToken) {
            const signInUrl = new URL('/sign-in', request.url)
            signInUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(signInUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
