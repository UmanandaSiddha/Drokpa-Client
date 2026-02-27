'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useQuery } from '@tanstack/react-query'
import { permitService } from '@/services/permit.service'
import { useApprovePermit, useRejectPermit } from '@/hooks/permit'
import { useState } from 'react'
import { Loader2, CheckCircle2, XCircle, FileText, Search } from 'lucide-react'
import { PermitStatus } from '@/types/permit'

function PermitsContent() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<PermitStatus | undefined>(undefined)

    // Fetch all permits (backend should implement)
    const { data, isLoading } = useQuery({
        queryKey: ['permits', 'admin', { page, limit: 20, status }],
        queryFn: async () => {
            // Note: Backend needs to implement GET /admin/permits endpoint
            const response = await fetch(`/api/v1/admin/permits?page=${page}&limit=20${status ? `&status=${status}` : ''}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (!response.ok) throw new Error('Failed to fetch permits')
            return response.json()
        },
    })

    const approveMutation = useApprovePermit()
    const rejectMutation = useRejectPermit()

    const STATUSES = [
        { label: 'All', value: undefined },
        { label: 'Submitted', value: PermitStatus.SUBMITTED },
        { label: 'Approved', value: PermitStatus.APPROVED },
        { label: 'Rejected', value: PermitStatus.REJECTED },
        { label: 'Expired', value: PermitStatus.EXPIRED },
    ]

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Permits</h1>
                    <p className="admin-page__subtitle">Review and manage user ILP permits</p>
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

            {isLoading && (
                <div className="admin-loading">
                    <Loader2 size={24} className="admin-loading__spinner" />
                </div>
            )}

            {data && data.data?.length === 0 && !isLoading && (
                <div className="admin-empty">
                    <FileText size={36} className="admin-empty__icon" />
                    <p className="admin-empty__title">No permits found</p>
                    <p className="admin-empty__body">All permits have been reviewed.</p>
                </div>
            )}

            {data && data.data?.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Permit Type</th>
                                    <th>Status</th>
                                    <th>Valid From</th>
                                    <th>Valid To</th>
                                    <th>Submitted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((permit: any) => (
                                    <tr key={permit.id}>
                                        <td style={{ fontWeight: 500 }}>
                                            {permit.user?.firstName} {permit.user?.lastName}
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {permit.permitType || 'ILP'}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${permit.status.toLowerCase()}`}>
                                                {permit.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {new Date(permit.validFrom).toLocaleDateString('en-IN')}
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {permit.validTo ? new Date(permit.validTo).toLocaleDateString('en-IN') : '—'}
                                        </td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {new Date(permit.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>
                                            <div className="admin-table__actions">
                                                {permit.status === PermitStatus.SUBMITTED && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                approveMutation.mutate({
                                                                    id: permit.id,
                                                                    data: { permitDocumentId: permit.permitDocumentId },
                                                                })
                                                            }}
                                                            className="admin-icon-btn admin-icon-btn--success"
                                                            title="Approve permit"
                                                            disabled={approveMutation.isPending}
                                                        >
                                                            <CheckCircle2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt('Rejection reason:')
                                                                if (reason) {
                                                                    rejectMutation.mutate({
                                                                        id: permit.id,
                                                                        data: { reason },
                                                                    })
                                                                }
                                                            }}
                                                            className="admin-icon-btn admin-icon-btn--danger"
                                                            title="Reject permit"
                                                            disabled={rejectMutation.isPending}
                                                        >
                                                            <XCircle size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {data.meta && (
                        <div className="admin-pagination">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="admin-pagination__btn"
                            >
                                ← Previous
                            </button>
                            <span className="admin-pagination__info">
                                Page {page} of {data.meta.totalPages} · {data.meta.total} permits
                            </span>
                            <button
                                disabled={page >= data.meta.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="admin-pagination__btn"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default function PermitsPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <PermitsContent />
        </RoleGuard>
    )
}
