'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAuth } from '@/hooks/auth/useAuth'
import { useAdminAllBookings } from '@/hooks/admin'
import { useProviderBookings } from '@/hooks/booking'
import { useState } from 'react'
import { BookingStatus } from '@/types/booking'
import { Loader2, Search } from 'lucide-react'

const STATUS_OPTIONS = [undefined, ...Object.values(BookingStatus)] as (BookingStatus | undefined)[]

function BookingsContent() {
    const { isAdmin } = useAuth()
    const [status, setStatus] = useState<BookingStatus | undefined>(undefined)
    const [page, setPage] = useState(1)

    const adminQ = useAdminAllBookings(isAdmin ? { status, page, limit: 20 } : undefined)
    const providerQ = useProviderBookings(!isAdmin ? { status, page, limit: 20 } : undefined)
    const { data, isLoading } = isAdmin ? adminQ : providerQ

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Bookings</h1>
                    <p className="admin-page__subtitle">
                        {isAdmin ? 'All platform bookings' : 'Bookings for your services'}
                    </p>
                </div>
            </div>

            {/* Status filter */}
            <div className="admin-filters">
                {STATUS_OPTIONS.map((s) => (
                    <button
                        key={s ?? 'all'}
                        onClick={() => { setStatus(s); setPage(1) }}
                        className={`admin-filter-chip ${status === s ? 'admin-filter-chip--active' : ''}`}
                    >
                        {s ?? 'All'}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="admin-loading">
                    <Loader2 size={24} className="admin-loading__spinner" />
                </div>
            )}

            {data && data.data.length === 0 && !isLoading && (
                <div className="admin-empty">
                    <Search size={36} className="admin-empty__icon" />
                    <p className="admin-empty__title">No bookings found</p>
                    <p className="admin-empty__body">Try a different status filter.</p>
                </div>
            )}

            {data && data.data.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    {isAdmin && <th>User</th>}
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Source</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((b) => (
                                    <tr key={b.id}>
                                        <td className="admin-table__id">{b.id.slice(0, 8)}…</td>
                                        {isAdmin && <td className="admin-table__id">{b.userId.slice(0, 8)}…</td>}
                                        <td>
                                            <span className={`admin-badge admin-badge--${b.status.toLowerCase()}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td>{b.totalAmount ? `₹${b.totalAmount.toLocaleString('en-IN')}` : '—'}</td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.source}</td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="admin-pagination">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="admin-pagination__btn">← Previous</button>
                        <span className="admin-pagination__info">Page {page} of {data.meta.totalPages}</span>
                        <button disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="admin-pagination__btn">Next →</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default function BookingsPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <BookingsContent />
        </RoleGuard>
    )
}
