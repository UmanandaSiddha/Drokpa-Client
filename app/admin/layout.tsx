import type { Metadata } from 'next'
import './admin.css'
import { AdminSidebarWrapper } from '@/components/admin/AdminSidebarWrapper'

export const metadata: Metadata = {
    title: { default: 'Admin Panel | Drokpa', template: '%s · Admin | Drokpa' },
    description: 'Drokpa admin and provider management panel',
    robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row min-h-screen bg-[#f8f9f7]">
            <AdminSidebarWrapper />
            <main className="flex-1 min-w-0 overflow-y-auto py-8 pt-20 md:pt-8 md:pl-72">
                <div className="w-full max-w-[1100px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
