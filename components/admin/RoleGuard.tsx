'use client'

import { useAuth } from '@/hooks/auth/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { UserRole } from '@/types/auth'

interface RoleGuardProps {
    children: React.ReactNode
    /** Required roles — user must have AT LEAST ONE of these */
    allowedRoles: UserRole[]
    /** Where to redirect if access is denied (default: '/') */
    redirectTo?: string
}

/**
 * Client-side role guard.
 * Waits for auth to resolve, then redirects if user lacks the required role.
 */
export function RoleGuard({ children, allowedRoles, redirectTo = '/' }: RoleGuardProps) {
    const { user, isLoading, roles } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return

        // Not authenticated → back to sign-in
        if (!user) {
            router.replace('/sign-in')
            return
        }

        // Authenticated but wrong role
        const hasRole = allowedRoles.some((r) => roles.includes(r))
        if (!hasRole) {
            router.replace(redirectTo)
        }
    }, [isLoading, user, roles, allowedRoles, redirectTo, router])

    // While loading, show nothing (layout has its own skeleton)
    if (isLoading) return null

    // While waiting for redirect
    if (!user || !allowedRoles.some((r) => roles.includes(r))) return null

    return <>{children}</>
}
