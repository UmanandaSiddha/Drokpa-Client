'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminDashboard, useAdminPaymentStats } from '@/hooks/admin'
import { Users, Building2, BookOpen, DollarSign, TrendingUp, Loader2 } from 'lucide-react'

function StatCard({
    label,
    value,
    sub,
    icon,
    color,
}: {
    label: string
    value: string | number
    sub?: string
    icon: React.ReactNode
    color: string
}) {
    return (
        <div className={`admin-stat-card admin-stat-card--${color}`}>
            <div className="admin-stat-card__icon">{icon}</div>
            <div className="admin-stat-card__content">
                <p className="admin-stat-card__label">{label}</p>
                <p className="admin-stat-card__value">{value}</p>
                {sub && <p className="admin-stat-card__sub">{sub}</p>}
            </div>
        </div>
    )
}

function DashboardContent() {
    const { data: stats, isLoading } = useAdminDashboard()
    const { data: payStats } = useAdminPaymentStats()

    if (isLoading) {
        return (
            <div className="admin-loading">
                <Loader2 size={32} className="admin-loading__spinner" />
                <p>Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="admin-dashboard">
                <div className="admin-page__header">
                    <h1 className="admin-page__title" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Dashboard</h1>
                    <p className="admin-page__subtitle" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Overview of your platform</p>
                </div>

                <div className="admin-stat-grid">
                    <StatCard
                        label="Total Users"
                        value={stats?.users.total ?? '—'}
                        sub={`${stats?.users.newLast30Days ?? 0} new this month`}
                        icon={<Users size={22} />}
                        color="blue"
                    />
                    <StatCard
                        label="Verified Providers"
                        value={stats?.providers.verified ?? '—'}
                        sub={`${stats?.providers.pending ?? 0} pending verification`}
                        icon={<Building2 size={22} />}
                        color="green"
                    />
                    <StatCard
                        label="Total Bookings"
                        value={stats?.bookings.total ?? '—'}
                        icon={<BookOpen size={22} />}
                        color="purple"
                    />
                    <StatCard
                        label="Revenue (All Time)"
                        value={`₹${(payStats?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
                        sub={`${payStats?.capturedCount ?? 0} successful payments`}
                        icon={<DollarSign size={22} />}
                        color="orange"
                    />
                    <StatCard
                        label="Last 30 Days Revenue"
                        value={`₹${(stats?.revenue.last30Days ?? 0).toLocaleString('en-IN')}`}
                        icon={<TrendingUp size={22} />}
                        color="teal"
                    />
                </div>

                <div className="admin-booking-status">
                    <h2 className="admin-section__title">Bookings by Status</h2>
                    <div className="admin-status-chips">
                        {stats?.bookings.byStatus &&
                            Object.entries(stats.bookings.byStatus).map(([status, count]) => (
                                <div key={status} className="admin-status-chip">
                                    <span className={`admin-status-dot admin-status-dot--${status.toLowerCase()}`} />
                                    <span className="admin-status-chip__label">{status}</span>
                                    <span className="admin-status-chip__count">{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboardPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <DashboardContent />
        </RoleGuard>
    )
}
