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
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Permits</h1>
                <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Review and manage user ILP permits</p>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
                {STATUSES.map(({ label, value }) => (
                    <button
                        key={label}
                        onClick={() => { setStatus(value); setPage(1) }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${status === value
                            ? 'bg-[#005246] text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-[#005246]" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && data && data.data?.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No permits found</h3>
                    <p className="text-gray-600">All permits have been reviewed.</p>
                </div>
            )}

            {/* Permits Table */}
            {!isLoading && data && data.data?.length > 0 && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">User</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Valid From</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Valid To</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Submitted</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.data.map((permit: any) => (
                                    <tr key={permit.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {permit.user?.firstName} {permit.user?.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {permit.permitType || 'ILP'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${permit.status === PermitStatus.APPROVED
                                                ? 'bg-green-100 text-green-800'
                                                : permit.status === PermitStatus.SUBMITTED
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : permit.status === PermitStatus.REJECTED
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {permit.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(permit.validFrom).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {permit.validTo ? new Date(permit.validTo).toLocaleDateString('en-IN') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(permit.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {permit.status === PermitStatus.SUBMITTED && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            approveMutation.mutate({
                                                                id: permit.id,
                                                                data: { permitDocumentId: permit.permitDocumentId || undefined },
                                                            })
                                                        }}
                                                        className="p-2 rounded-md border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
                                                        title="Approve permit"
                                                        disabled={approveMutation.isPending}
                                                    >
                                                        <CheckCircle2 size={16} />
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
                                                        className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                        title="Reject permit"
                                                        disabled={rejectMutation.isPending}
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data.meta && data.meta.total > 20 && (
                        <div className="flex items-center justify-between pt-4">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                ← Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {data.meta.totalPages} · {data.meta.total} permits
                            </span>
                            <button
                                disabled={page >= data.meta.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
