import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import './admin.css'

export const metadata: Metadata = {
    title: { default: 'Admin Panel | Drokpa', template: '%s · Admin | Drokpa' },
    description: 'Drokpa admin and provider management panel',
    robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="admin-shell">
            <AdminSidebar />
            <main className="admin-main">
                {children}
            </main>
        </div>
    )
}
