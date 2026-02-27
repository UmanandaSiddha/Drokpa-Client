'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminProviders, useVerifyProvider, useSuspendProvider } from '@/hooks/provider'
import { useState } from 'react'
import { Loader2, ShieldCheck, Ban, Search } from 'lucide-react'
import { ProviderStatus } from '@/types/provider'

function ProvidersContent() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<ProviderStatus | undefined>(undefined)
    const { data, isLoading } = useAdminProviders({ page, limit: 20, status })
    const verify = useVerifyProvider()
    const suspend = useSuspendProvider()

    const STATUSES = [
        { label: 'All', value: undefined },
        { label: 'Pending', value: ProviderStatus.PENDING },
        { label: 'Active', value: ProviderStatus.ACTIVE },
        { label: 'Suspended', value: ProviderStatus.SUSPENDED },
    ]

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Providers</h1>
                    <p className="admin-page__subtitle">Verify and manage onboarded providers</p>
                </div>
            </div>

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
                    <p className="admin-empty__title">No providers found</p>
                </div>
            )}

            {data && data.data.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Verified</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((p) => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.type.join(', ')}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${p.status.toLowerCase()}`}>{p.status}</span>
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${p.verified ? 'active' : 'pending'}`}>
                                                {p.verified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <div className="admin-table__actions">
                                                {!p.verified && (
                                                    <button
                                                        onClick={() => verify.mutate(p.id)}
                                                        className="admin-icon-btn admin-icon-btn--success"
                                                        title="Verify provider"
                                                    >
                                                        <ShieldCheck size={14} />
                                                    </button>
                                                )}
                                                {p.status !== ProviderStatus.SUSPENDED && (
                                                    <button
                                                        onClick={() => { if (confirm('Suspend this provider?')) suspend.mutate(p.id) }}
                                                        className="admin-icon-btn admin-icon-btn--danger"
                                                        title="Suspend provider"
                                                    >
                                                        <Ban size={14} />
                                                    </button>
                                                )}
                                            </div>
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

export default function ProvidersPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <ProvidersContent />
        </RoleGuard>
    )
}
