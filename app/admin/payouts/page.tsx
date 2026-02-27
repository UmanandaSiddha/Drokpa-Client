'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useMyPayouts, useAdminPayouts, useCompletePayout } from '@/hooks/payout'
import { useAuth } from '@/hooks/auth/useAuth'
import { useState } from 'react'
import { Loader2, CheckCircle2, Search } from 'lucide-react'
import { PayoutStatus } from '@/types/payout'

function PayoutsContent() {
    const { isAdmin } = useAuth()
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<PayoutStatus | undefined>(undefined)

    const adminQ = useAdminPayouts(isAdmin ? { page, limit: 20, status } : undefined)
    const providerQ = useMyPayouts(!isAdmin ? { page, limit: 20, status } : undefined)
    const completePayout = useCompletePayout()
    const { data, isLoading } = isAdmin ? adminQ : providerQ

    const STATUSES = [
        { label: 'All', value: undefined },
        { label: 'Pending', value: PayoutStatus.PENDING },
        { label: 'Paid', value: PayoutStatus.PAID },
        { label: 'Failed', value: PayoutStatus.FAILED },
    ]

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Payouts</h1>
                    <p className="admin-page__subtitle">
                        {isAdmin ? 'All provider payouts' : 'Your earnings and payout history'}
                    </p>
                </div>
            </div>

            {/* Summary strip */}
            {data?.summary && (
                <div className="admin-summary-strip">
                    <div className="admin-summary-item">
                        <span className="admin-summary-item__label">Total Earned</span>
                        <span className="admin-summary-item__value">₹{data.summary.totalEarned.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="admin-summary-item">
                        <span className="admin-summary-item__label">Pending</span>
                        <span className="admin-summary-item__value">₹{data.summary.totalPending.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="admin-summary-item">
                        <span className="admin-summary-item__label">Completed</span>
                        <span className="admin-summary-item__value">{data.summary.completed}</span>
                    </div>
                </div>
            )}

            <div className="admin-filters">
                {STATUSES.map(({ label, value }) => (
                    <button
                        key={label}
                        onClick={() => { setStatus(value); setPage(1) }}
                        className={`admin-filter-chip ${status === value ? 'admin-filter-chip--active' : ''}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isLoading && <div className="admin-loading"><Loader2 size={24} className="admin-loading__spinner" /></div>}

            {data && data.data.length === 0 && !isLoading && (
                <div className="admin-empty">
                    <Search size={36} className="admin-empty__icon" />
                    <p className="admin-empty__title">No payouts found</p>
                </div>
            )}

            {data && data.data.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {isAdmin && <th>Provider</th>}
                                    <th>Gross</th>
                                    <th>Platform Fee</th>
                                    <th>Net</th>
                                    <th>Status</th>
                                    <th>Period</th>
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((p) => (
                                    <tr key={p.id}>
                                        {isAdmin && <td style={{ fontWeight: 500 }}>{p.provider?.name ?? p.providerId.slice(0, 8)}</td>}
                                        <td>₹{p.amount.toLocaleString('en-IN')}</td>
                                        <td style={{ color: '#dc2626' }}>₹{p.platformFee.toLocaleString('en-IN')}</td>
                                        <td style={{ fontWeight: 600, color: '#005246' }}>₹{p.netAmount.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${p.status.toLowerCase()}`}>{p.status}</span>
                                        </td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {new Date(p.periodStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            {' → '}
                                            {new Date(p.periodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                {p.status === PayoutStatus.PENDING && (
                                                    <button
                                                        onClick={() => completePayout.mutate(p.id)}
                                                        className="admin-icon-btn admin-icon-btn--success"
                                                        title="Mark as paid"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="admin-pagination">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="admin-pagination__btn">← Previous</button>
                        <span className="admin-pagination__info">
                            Page {page} of {Math.ceil(data.meta.total / data.meta.limit)}
                        </span>
                        <button disabled={page * data.meta.limit >= data.meta.total} onClick={() => setPage(p => p + 1)} className="admin-pagination__btn">Next →</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default function PayoutsPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <PayoutsContent />
        </RoleGuard>
    )
}
