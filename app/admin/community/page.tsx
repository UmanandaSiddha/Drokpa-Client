'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useCommunityRequests, useCommunityStats, useMarkCommunityContacted } from '@/hooks/misc'
import { useState } from 'react'
import { Loader2, CheckCircle2, Search } from 'lucide-react'

function CommunityContent() {
    const [page, setPage] = useState(1)
    const [contacted, setContacted] = useState<boolean | undefined>(undefined)
    const { data, isLoading } = useCommunityRequests({ page, limit: 20, contacted })
    const { data: stats } = useCommunityStats()
    const markContacted = useMarkCommunityContacted()

    const FILTERS = [
        { label: 'All', value: undefined },
        { label: 'Pending', value: false },
        { label: 'Contacted', value: true },
    ]

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="admin-page">
                <div className="admin-page__header">
                    <div className="admin-page__titles">
                        <h1 className="admin-page__title" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Community Requests</h1>
                        <p className="admin-page__subtitle" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Early-access interest signups</p>
                    </div>
                </div>

                {stats && (
                    <div className="admin-summary-strip">
                        <div className="admin-summary-item">
                            <span className="admin-summary-item__label">Total</span>
                            <span className="admin-summary-item__value">{stats.total}</span>
                        </div>
                        <div className="admin-summary-item">
                            <span className="admin-summary-item__label">Contacted</span>
                            <span className="admin-summary-item__value">{stats.contacted}</span>
                        </div>
                        <div className="admin-summary-item">
                            <span className="admin-summary-item__label">Pending</span>
                            <span className="admin-summary-item__value">{stats.pending}</span>
                        </div>
                    </div>
                )}

                <div className="admin-filters">
                    {FILTERS.map(({ label, value }) => (
                        <button
                            key={label}
                            onClick={() => { setContacted(value as boolean | undefined); setPage(1) }}
                            className={`admin-filter-chip ${contacted === value ? 'admin-filter-chip--active' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {isLoading && <div className="admin-loading"><Loader2 size={24} className="admin-loading__spinner" /></div>}

                {data && data.data.length === 0 && !isLoading && (
                    <div className="admin-empty">
                        <Search size={36} className="admin-empty__icon" />
                        <p className="admin-empty__title">No requests found</p>
                    </div>
                )}

                {data && data.data.length > 0 && (
                    <>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((r) => (
                                        <tr key={r.id}>
                                            <td style={{ fontWeight: 500 }}>{r.fullName}</td>
                                            <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{r.email}</td>
                                            <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{r.phoneNumber}</td>
                                            <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{r.location ?? '—'}</td>
                                            <td>
                                                <span className={`admin-badge admin-badge--${r.contacted ? 'active' : 'pending'}`}>
                                                    {r.contacted ? 'Contacted' : 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                                {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td>
                                                {!r.contacted && (
                                                    <button
                                                        onClick={() => markContacted.mutate({ id: r.id })}
                                                        className="admin-icon-btn admin-icon-btn--success"
                                                        title="Mark as contacted"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                )}
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
        </div>
    )
}

export default function CommunityPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <CommunityContent />
        </RoleGuard>
    )
}
