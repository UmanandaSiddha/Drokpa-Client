'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAuth } from '@/hooks/auth/useAuth'
import { useMyHomestays } from '@/hooks/homestays'
import { useMyVehicles } from '@/hooks/vehicle'
import { useMyGuides } from '@/hooks/guide'
import { Building2, Car, PersonStanding, Star, Loader2 } from 'lucide-react'
import Link from 'next/link'

// ─── Homestay cards ────────────────────────────────────────

function HomestaySection() {
    const { data, isLoading } = useMyHomestays()

    if (isLoading) return <div className="admin-loading"><Loader2 size={24} className="admin-loading__spinner" /></div>
    if (!data || data.length === 0) {
        return (
            <div className="admin-empty">
                <Building2 size={36} className="admin-empty__icon" />
                <p className="admin-empty__title">No homestays yet</p>
                <p className="admin-empty__body">Contact support to request a new listing.</p>
            </div>
        )
    }

    return (
        <div className="admin-listing-grid">
            {data.map((h) => (
                <div key={h.id} className="admin-listing-card">
                    {h.imageUrls?.[0] ? (
                        <img src={h.imageUrls[0]} alt={h.name} className="admin-listing-card__img" />
                    ) : (
                        <div className="admin-listing-card__img--placeholder">
                            <Building2 size={28} />
                        </div>
                    )}
                    <div className="admin-listing-card__body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <p className="admin-listing-card__name">{h.name}</p>
                            <span className={`admin-badge admin-badge--${h.isActive ? 'active' : 'pending'}`}>
                                {h.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="admin-listing-card__meta">
                            {h.rooms?.length ?? 0} room{(h.rooms?.length ?? 0) !== 1 ? 's' : ''}
                            {h.displayPrice ? ` · ₹${h.displayPrice.toLocaleString('en-IN')}/night` : ''}
                        </p>
                        {h.rating ? (
                            <p className="admin-listing-card__meta">
                                <Star size={11} style={{ display: 'inline', marginRight: 3, color: '#f59e0b' }} />
                                {h.rating.toFixed(1)} ({h.totalReviews} reviews)
                            </p>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Vehicle cards ─────────────────────────────────────────

function VehicleSection() {
    const { data, isLoading } = useMyVehicles()

    if (isLoading) return <div className="admin-loading"><Loader2 size={24} className="admin-loading__spinner" /></div>
    if (!data || data.length === 0) {
        return (
            <div className="admin-empty">
                <Car size={36} className="admin-empty__icon" />
                <p className="admin-empty__title">No vehicles yet</p>
            </div>
        )
    }

    return (
        <div className="admin-listing-grid">
            {data.map((v) => (
                <div key={v.id} className="admin-listing-card">
                    {v.imageUrls?.[0] ? (
                        <img src={v.imageUrls[0]} alt={v.name} className="admin-listing-card__img" />
                    ) : (
                        <div className="admin-listing-card__img--placeholder">
                            <Car size={28} />
                        </div>
                    )}
                    <div className="admin-listing-card__body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <p className="admin-listing-card__name">{v.name}</p>
                            <span className={`admin-badge admin-badge--${v.isActive ? 'active' : 'pending'}`}>
                                {v.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="admin-listing-card__meta">{v.brand} {v.model}</p>
                        <p className="admin-listing-card__meta">
                            ₹{v.basePricePerDay.toLocaleString('en-IN')}/day
                        </p>
                        <p className="admin-listing-card__meta" style={{ textTransform: 'capitalize' }}>
                            {v.type.toLowerCase().replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Guide cards ───────────────────────────────────────────

function GuideSection() {
    const { data, isLoading } = useMyGuides()

    if (isLoading) return <div className="admin-loading"><Loader2 size={24} className="admin-loading__spinner" /></div>
    if (!data || data.length === 0) {
        return (
            <div className="admin-empty">
                <PersonStanding size={36} className="admin-empty__icon" />
                <p className="admin-empty__title">No guide profiles yet</p>
            </div>
        )
    }

    return (
        <div className="admin-listing-grid">
            {data.map((g) => (
                <div key={g.id} className="admin-listing-card">
                    <div className="admin-listing-card__img--placeholder">
                        <PersonStanding size={28} />
                    </div>
                    <div className="admin-listing-card__body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <p className="admin-listing-card__name">{g.provider?.name ?? 'My Guide Profile'}</p>
                            <span className={`admin-badge admin-badge--${g.isActive ? 'active' : 'pending'}`}>
                                {g.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="admin-listing-card__meta">Languages: {g.languages.join(', ')}</p>
                        <p className="admin-listing-card__meta">₹{g.basePricePerDay.toLocaleString('en-IN')}/day</p>
                        {g.specialties.length > 0 && (
                            <p className="admin-listing-card__meta">Specialties: {g.specialties.join(', ')}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Main page ─────────────────────────────────────────────

function MyListingsContent() {
    const { isHost, isVendor, isGuide } = useAuth()

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">My Listings</h1>
                    <p className="admin-page__subtitle">Manage your active service listings</p>
                </div>
            </div>

            {isHost && (
                <div className="admin-section-gap">
                    <div className="admin-section-header">
                        <Building2 size={20} style={{ color: '#005246' }} />
                        <h2 className="admin-section-title">Homestays</h2>
                    </div>
                    <HomestaySection />
                </div>
            )}

            {isVendor && (
                <div className="admin-section-gap">
                    <div className="admin-section-header">
                        <Car size={20} style={{ color: '#005246' }} />
                        <h2 className="admin-section-title">Vehicles</h2>
                    </div>
                    <VehicleSection />
                </div>
            )}

            {isGuide && (
                <div className="admin-section-gap">
                    <div className="admin-section-header">
                        <PersonStanding size={20} style={{ color: '#005246' }} />
                        <h2 className="admin-section-title">Guide Profile</h2>
                    </div>
                    <GuideSection />
                </div>
            )}
        </div>
    )
}

export default function MyListingsPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <MyListingsContent />
        </RoleGuard>
    )
}
