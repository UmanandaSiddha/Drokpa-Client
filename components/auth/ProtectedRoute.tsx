'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { PROTECTED_ROUTES, AUTH_ROUTES, OTP_ROUTE } from '@/constants/protectedRoutes'
import LoadingComponent from '../LoadingComponent'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated, isVerified } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const rawFrom = searchParams.get('from')
    const from = rawFrom?.startsWith('/') ? rawFrom : '/account'

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
    const isOtpRoute = pathname.startsWith(OTP_ROUTE)

    useEffect(() => {
        if (isLoading) return

        if (isProtected) {
            if (!isAuthenticated) {
                // Save where they were trying to go
                router.replace(`/sign-in?from=${encodeURIComponent(pathname)}`)
                return
            }
            if (!isVerified) {
                router.replace(`${OTP_ROUTE}?from=${encodeURIComponent(pathname)}`)
                return
            }
        }

        // Logged-in verified users shouldn't be on auth pages
        if (isAuthRoute && isAuthenticated && isVerified) {
            router.replace(from)
            return
        }

        // Verified users shouldn't be on OTP page
        if (isOtpRoute && isAuthenticated && isVerified) {
            router.replace(from)
            return
        }
    }, [isLoading, isAuthenticated, isVerified, pathname])

    if (isLoading) {
        return (
            <LoadingComponent message="Loading..." size="medium" />
        )
    }

    // Block render until redirect completes for protected routes
    if (isProtected && (!isAuthenticated || !isVerified)) return null
    if (isAuthRoute && isAuthenticated && isVerified) return null
    if (isOtpRoute && isAuthenticated && isVerified) return null

    return <>{children}</>
}