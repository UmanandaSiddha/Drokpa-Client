'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar, AdminSidebarTrigger } from './AdminSidebar'
import { useAuth } from '@/hooks/auth/useAuth'

export function AdminSidebarWrapper() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { isAdmin } = useAuth()

    // Close sidebar when pathname changes (user navigates)
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Header - Logo on left, Menu on right */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white md:hidden z-40 flex items-center justify-between px-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="font-subjectivity text-lg font-bold text-[#005246]">drokpa.</span>
                    <span className="text-xs font-semibold tracking-wider uppercase bg-[#005246]/10 text-[#005246] px-2 py-0.5 rounded-full">
                        {isAdmin ? 'Admin' : 'Provider'}
                    </span>
                </div>
                <AdminSidebarTrigger isOpen={isOpen} onOpenChange={setIsOpen} />
            </header>

            {/* Sidebar */}
            <AdminSidebar isOpen={isOpen} />
        </>
    )
}
