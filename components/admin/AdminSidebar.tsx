'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import {
    LayoutDashboard,
    CalendarClock,
    Users,
    Building2,
    Map,
    UserPlus,
    FileText,
    Wallet,
    Users2,
    Layers,
    Car,
    PersonStanding,
    LogOut,
    ExternalLink,
    Tag,
} from 'lucide-react'

// ─── Nav structure ─────────────────────────────────────────

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
    /** Only visible if the predicate returns true */
    visible?: (ctx: { isAdmin: boolean; isHost: boolean; isVendor: boolean; isGuide: boolean }) => boolean
}

interface NavSection {
    label: string
    items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
    {
        label: 'Admin',
        items: [
            {
                label: 'Overview',
                href: '/admin',
                icon: <LayoutDashboard size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Users',
                href: '/admin/users',
                icon: <Users size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Providers',
                href: '/admin/providers',
                icon: <Building2 size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Onboarding',
                href: '/admin/onboarding',
                icon: <UserPlus size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Permits',
                href: '/admin/permits',
                icon: <FileText size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Community',
                href: '/admin/community',
                icon: <Users2 size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Coupons',
                href: '/admin/coupons',
                icon: <Tag size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
        ],
    },
    {
        label: 'Bookings & Finance',
        items: [
            {
                label: 'Bookings',
                href: '/admin/bookings',
                icon: <CalendarClock size={16} />,
                visible: () => true,
            },
            {
                label: 'Payouts',
                href: '/admin/payouts',
                icon: <Wallet size={16} />,
                visible: () => true,
            },
            {
                label: 'Tours',
                href: '/admin/tours',
                icon: <Map size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
        ],
    },
    {
        label: 'My Provider Panel',
        items: [
            {
                label: 'My Listings',
                href: '/admin/my-listings',
                icon: <Layers size={16} />,
                visible: ({ isHost, isVendor, isGuide }) => isHost || isVendor || isGuide,
            },
        ],
    },
]

// ─── Component ─────────────────────────────────────────────

export function AdminSidebar() {
    const pathname = usePathname()
    const { user, isAdmin, isHost, isVendor, isGuide, logout } = useAuth()

    const ctx = { isAdmin, isHost, isVendor, isGuide }

    const isActive = (href: string) =>
        href === '/admin'
            ? pathname === '/admin'
            : pathname === href || pathname.startsWith(href + '/')

    return (
        <aside className="admin-sidebar">
            {/* Logo */}
            <div className="admin-sidebar__logo">
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <span className="admin-sidebar__wordmark">drokpa.</span>
                </Link>
                <span className="admin-sidebar__badge">
                    {isAdmin ? 'Admin' : 'Provider'}
                </span>
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '0.5rem' }}>
                {NAV_SECTIONS.map((section) => {
                    const visibleItems = section.items.filter((item) => item.visible?.(ctx) ?? true)
                    if (visibleItems.length === 0) return null

                    return (
                        <div key={section.label}>
                            <p className="admin-sidebar__section-label">{section.label}</p>
                            <nav className="admin-sidebar__nav">
                                {visibleItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`admin-sidebar__link${isActive(item.href) ? ' admin-sidebar__link--active' : ''}`}
                                    >
                                        <span className="admin-sidebar__link-icon">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )
                })}

                <div className="admin-sidebar__divider" />

                {/* Back to site */}
                <nav className="admin-sidebar__nav">
                    <Link href="/" className="admin-sidebar__link" style={{ marginTop: '0.25rem' }}>
                        <span className="admin-sidebar__link-icon"><ExternalLink size={16} /></span>
                        <span>Back to Site</span>
                    </Link>
                </nav>
            </div>

            {/* User footer */}
            <div className="admin-sidebar__footer">
                <div className="admin-sidebar__user">
                    <div className="admin-sidebar__avatar">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="admin-sidebar__user-info">
                        <p className="admin-sidebar__user-name">{user?.firstName} {user?.lastName}</p>
                        <p className="admin-sidebar__user-email">{user?.email}</p>
                    </div>
                </div>
                <button onClick={logout} className="admin-sidebar__logout">
                    <LogOut size={15} />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    )
}
