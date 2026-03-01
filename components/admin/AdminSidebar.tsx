'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { useState } from 'react'
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
    Menu,
    X,
    Star,
    MapPin,
    Home,
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
                label: 'Reviews',
                href: '/admin/reviews',
                icon: <Star size={16} />,
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
                label: 'Cancellation Policies',
                href: '/admin/cancellation-policies',
                icon: <FileText size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
        ],
    },
    {
        label: 'Listings',
        items: [
            {
                label: 'Homestays',
                href: '/admin/homestays',
                icon: <Building2 size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Vehicles',
                href: '/admin/vehicles',
                icon: <Car size={16} />,
                visible: ({ isAdmin }) => isAdmin,
            },
            {
                label: 'Guides',
                href: '/admin/guides',
                icon: <PersonStanding size={16} />,
                visible: ({ isAdmin }) => isAdmin,
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
        label: 'Resources',
        items: [
            {
                label: 'Tags',
                href: '/admin/tags',
                icon: <Tag size={16} />,
                visible: ({ isAdmin, isHost, isVendor, isGuide }) => isAdmin || isHost || isVendor || isGuide,
            },
            {
                label: 'Facilities',
                href: '/admin/facilities',
                icon: <Home size={16} />,
                visible: ({ isAdmin, isHost }) => isAdmin || isHost,
            },
            {
                label: 'Addresses',
                href: '/admin/addresses',
                icon: <MapPin size={16} />,
                visible: ({ isAdmin, isHost, isVendor, isGuide }) => isAdmin || isHost || isVendor || isGuide,
            },
            {
                label: 'POIs',
                href: '/admin/pois',
                icon: <Map size={16} />,
                visible: ({ isAdmin, isGuide }) => isAdmin || isGuide,
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

// ─── Sidebar Component ────────────────────────────────────

interface AdminSidebarProps {
    isOpen?: boolean
}

function SidebarContent() {
    const pathname = usePathname()
    const { user, isAdmin, isHost, isVendor, isGuide, logout } = useAuth()

    const ctx = { isAdmin, isHost, isVendor, isGuide }

    const isActive = (href: string) =>
        href === '/admin'
            ? pathname === '/admin'
            : pathname === href || pathname.startsWith(href + '/')

    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2 no-underline">
                    <span className="font-subjectivity text-lg font-bold text-white">drokpa.</span>
                </Link>
                <span className="ml-auto text-xs font-semibold tracking-wider uppercase bg-white/15 text-white/85 px-2 py-0.5 rounded-full border border-white/20">
                    {isAdmin ? 'Admin' : 'Provider'}
                </span>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto pb-2 admin-sidebar-scroll">
                {NAV_SECTIONS.map((section) => {
                    const visibleItems = section.items.filter((item) => item.visible?.(ctx) ?? true)
                    if (visibleItems.length === 0) return null

                    return (
                        <div key={section.label}>
                            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 px-5 pt-5 pb-2">
                                {section.label}
                            </p>
                            <nav className="flex flex-col gap-0.5 px-1">
                                {visibleItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive(item.href)
                                            ? 'bg-white/15 text-white font-semibold'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <span className="shrink-0">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )
                })}

                <div className="my-4 border-t border-white/10" />

                {/* Back to site */}
                <nav className="flex flex-col gap-0.5 px-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all mt-1"
                    >
                        <span className="shrink-0"><ExternalLink size={16} /></span>
                        <span>Back to Site</span>
                    </Link>
                </nav>
            </div>

            {/* User footer */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                    <LogOut size={15} />
                    <span>Sign out</span>
                </button>
            </div>
        </>
    )
}

export function AdminSidebar({ isOpen = false }: AdminSidebarProps) {
    return (
        <aside
            className={`
                fixed left-0 top-0 h-screen w-64 bg-[#005246] text-white flex flex-col
                transition-transform duration-300 ease-out z-40
                md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
        >
            <SidebarContent />
        </aside>
    )
}

export function AdminSidebarTrigger({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <button
            className="w-10 h-10 rounded-md bg-[#005246] text-white flex md:hidden items-center justify-center transition-all hover:bg-[#003d34] active:scale-95"
            onClick={() => onOpenChange(!isOpen)}
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
        >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    )
}
