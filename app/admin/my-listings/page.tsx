'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAuth } from '@/hooks/auth/useAuth'

function MyListingsRedirectContent() {
    const router = useRouter()
    const { isLoading, isAdmin, isHost, isVendor, isGuide } = useAuth()

    useEffect(() => {
        if (isLoading) return

        if (isAdmin) {
            router.replace('/admin')
            return
        }

        if (isHost) {
            router.replace('/admin/homestays')
            return
        }

        if (isVendor) {
            router.replace('/admin/vehicles')
            return
        }

        if (isGuide) {
            router.replace('/admin/guides')
            return
        }

        router.replace('/admin')
    }, [isLoading, isAdmin, isHost, isVendor, isGuide, router])

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 py-12">
            <div className="flex items-center justify-center gap-3 text-gray-600">
                <Loader2 size={20} className="animate-spin" />
                <span>Redirecting to your management routes...</span>
            </div>
        </div>
    )
}

export default function MyListingsPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <MyListingsRedirectContent />
        </RoleGuard>
    )
}
