'use client'

import { useAuth } from '@/hooks/auth/useAuth'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminDashboard, useAdminPaymentStats } from '@/hooks/admin'
import {
    Users, Building2, BookOpen, ArrowRight,
    TrendingUp, DollarSign, Loader2, ClipboardList, Wallet
} from 'lucide-react'
import Link from 'next/link'

// ─── Stat card ────────────────────────────────────────────

function StatCard({
    label, value, sub, icon, color, href,
}: {
    label: string; value: string | number; sub?: string
    icon: React.ReactNode; color: string; href?: string
}) {
    const inner = (
        <div className={`admin-stat-card admin-stat-card--${color}`} style={{ cursor: href ? 'pointer' : 'default' }}>
            <div className="admin-stat-card__icon">{icon}</div>
            <div style={{ flex: 1 }}>
                <p className="admin-stat-card__label">{label}</p>
                <p className="admin-stat-card__value">{value}</p>
                {sub && <p className="admin-stat-card__sub">{sub}</p>}
            </div>
            {href && <ArrowRight size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />}
        </div>
    )
    return href ? <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}

// ─── Admin overview ───────────────────────────────────────

function AdminOverview() {
    const { data: stats, isLoading } = useAdminDashboard()
    const { data: payStats } = useAdminPaymentStats()

    if (isLoading) {
        return (
            <div className="admin-loading">
                <Loader2 size={32} className="admin-loading__spinner" />
                <span>Loading dashboard…</span>
            </div>
        )
    }

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="admin-page">
                <div className="admin-page__header">
                    <div className="admin-page__titles">
                        <h1 className="admin-page__title">Platform Overview</h1>
                        <p className="admin-page__subtitle">Real-time snapshot of Drokpa</p>
                    </div>
                </div>

                <div className="admin-stat-grid">
                    <StatCard
                        label="Total Users"
                        value={stats?.users?.total ?? '—'}
                        sub={`+${stats?.users?.newLast30Days ?? 0} this month`}
                        icon={<Users size={20} />}
                        color="blue"
                        href="/admin/users"
                    />
                    <StatCard
                        label="Verified Providers"
                        value={stats?.providers?.verified ?? '—'}
                        sub={`${stats?.providers?.pending ?? 0} awaiting review`}
                        icon={<Building2 size={20} />}
                        color="green"
                        href="/admin/providers"
                    />
                    <StatCard
                        label="Total Bookings"
                        value={stats?.bookings?.total ?? '—'}
                        icon={<BookOpen size={20} />}
                        color="purple"
                        href="/admin/bookings"
                    />
                    <StatCard
                        label="All-time Revenue"
                        value={`₹${(payStats?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
                        sub={`${payStats?.capturedCount ?? 0} successful payments`}
                        icon={<DollarSign size={20} />}
                        color="amber"
                    />
                    <StatCard
                        label="Revenue (30 days)"
                        value={`₹${(stats?.revenue?.last30Days ?? 0).toLocaleString('en-IN')}`}
                        icon={<TrendingUp size={20} />}
                        color="teal"
                    />
                </div>

                {/* Booking status breakdown */}
                {stats?.bookings?.byStatus && (
                    <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                        <p className="admin-card__title">Booking Status Breakdown</p>
                        <div className="admin-status-row">
                            {Object.entries(stats.bookings.byStatus).map(([status, count]) => (
                                <div key={status} className="admin-status-chip">
                                    <span className={`admin-status-dot admin-status-dot--${status.toLowerCase()}`} />
                                    <span>{status}</span>
                                    <span className="admin-status-chip__count">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick actions */}
                <div className="admin-card">
                    <p className="admin-card__title">Quick Actions</p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/bookings" className="admin-btn admin-btn--outline">
                            <ClipboardList size={16} /> View Bookings
                        </Link>
                        <Link href="/admin/onboarding" className="admin-btn admin-btn--outline">
                            <Building2 size={16} /> Invite Provider
                        </Link>
                        <Link href="/admin/payouts" className="admin-btn admin-btn--outline">
                            <Wallet size={16} /> Manage Payouts
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Provider dashboard ───────────────────────────────────

function ProviderCard({
    label, description, icon, color, href,
}: {
    label: string; description: string
    icon: React.ReactNode; color: string; href: string
}) {
    const inner = (
        <div className={`admin-stat-card admin-stat-card--${color}`} style={{ cursor: 'pointer' }}>
            <div className="admin-stat-card__icon">{icon}</div>
            <div style={{ flex: 1 }}>
                <p className="admin-stat-card__label">{label}</p>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>{description}</p>
            </div>
            <ArrowRight size={16} style={{ color: '#94a3b8', flexShrink: 0, marginTop: '0.25rem' }} />
        </div>
    )
    return <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link>
}

function ProviderOverview() {
    const { isHost, isVendor, isGuide, user } = useAuth()

    const links: { label: string; href: string; desc: string; color: string; icon: React.ReactNode }[] = [
        ...(isHost ? [{ label: 'My Homestays', href: '/admin/my-listings/homestays', desc: 'View and manage your homestay listings and rooms.', color: 'green', icon: <Building2 size={20} /> }] : []),
        ...(isVendor ? [{ label: 'My Vehicles', href: '/admin/my-listings/vehicles', desc: 'Manage your vehicle fleet and availability.', color: 'blue', icon: <Building2 size={20} /> }] : []),
        ...(isGuide ? [{ label: 'My Guide Profile', href: '/admin/my-listings/guide', desc: 'Update your guide profile and languages.', color: 'purple', icon: <Users size={20} /> }] : []),
        { label: 'My Bookings', href: '/admin/bookings', desc: 'See all bookings for your services.', color: 'amber', icon: <ClipboardList size={20} /> },
        { label: 'Payouts', href: '/admin/payouts', desc: 'Track your earnings and payout history.', color: 'teal', icon: <Wallet size={20} /> },
    ]

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="admin-page">
                <div className="admin-page__header">
                    <div className="admin-page__titles">
                        <h1 className="admin-page__title">Welcome back, {user?.firstName}!</h1>
                        <p className="admin-page__subtitle">Your provider dashboard</p>
                    </div>
                </div>

                <div className="admin-stat-grid">
                    {links.map((l) => (
                        <ProviderCard
                            key={l.href}
                            label={l.label}
                            description={l.desc}
                            color={l.color}
                            icon={l.icon}
                            href={l.href}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Exported page ─────────────────────────────────────────

export default function AdminOverviewPage() {
    const { isAdmin, isProvider } = useAuth()

    // Admins get the full platform overview dashboard
    if (isAdmin) {
        return (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <AdminOverview />
            </RoleGuard>
        )
    }

    // Providers get their personal overview
    return (
        <RoleGuard allowedRoles={[UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <ProviderOverview />
        </RoleGuard>
    )
}
