'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useMyPayouts, useAdminPayouts, useCompletePayout } from '@/hooks/payout'
import { useAuth } from '@/hooks/auth/useAuth'
import { useState } from 'react'
import { Loader2, CheckCircle2, Search, Wallet } from 'lucide-react'
import { PayoutStatus } from '@/types/payout'

function PayoutsContent() {
    const { isAdmin } = useAuth()
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<PayoutStatus | undefined>(undefined)

    // Only call the appropriate query based on role
    const { data, isLoading } = isAdmin
        ? useAdminPayouts({ page, limit: 20, status })
        : useMyPayouts({ page, limit: 20, status })
    const completePayout = useCompletePayout()

    const STATUSES = [
        { label: 'All', value: undefined },
        { label: 'Pending', value: PayoutStatus.PENDING },
        { label: 'Paid', value: PayoutStatus.PAID },
        { label: 'Failed', value: PayoutStatus.FAILED },
    ]

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Payouts</h1>
                <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>
                    {isAdmin ? 'All provider payouts' : 'Your earnings and payout history'}
                </p>
            </div>

            {/* Summary Cards */}
            {data?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Total Earned</p>
                        <p className="text-2xl font-bold text-gray-900">₹{data.summary.totalEarned.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Pending</p>
                        <p className="text-2xl font-bold text-orange-600">₹{data.summary.totalPending.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{data.summary.completed}</p>
                    </div>
                </div>
            )}

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
            {!isLoading && data && data.data.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No payouts found</h3>
                    <p className="text-gray-600">Try adjusting filters or check back later.</p>
                </div>
            )}

            {/* Payouts Table */}
            {!isLoading && data && data.data.length > 0 && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {isAdmin && <th className="px-6 py-3 text-left font-semibold text-gray-900">Provider</th>}
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Gross</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Platform Fee</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Net</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Period</th>
                                    {isAdmin && <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        {isAdmin && (
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {p.provider?.name ?? p.providerId.slice(0, 8)}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-gray-900">₹{p.amount.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-red-600 font-medium">
                                            ₹{p.platformFee.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#005246]">
                                            ₹{p.netAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === PayoutStatus.PAID
                                                ? 'bg-green-100 text-green-800'
                                                : p.status === PayoutStatus.PENDING
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600">
                                            {new Date(p.periodStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            {' → '}
                                            {new Date(p.periodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4">
                                                {p.status === PayoutStatus.PENDING && (
                                                    <button
                                                        onClick={() => completePayout.mutate(p.id)}
                                                        className="p-2 rounded-md border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
                                                        title="Mark as paid"
                                                        disabled={completePayout.isPending}
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data.meta.total > 20 && (
                        <div className="flex items-center justify-between pt-4">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                ← Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {Math.ceil(data.meta.total / data.meta.limit)}
                            </span>
                            <button
                                disabled={page * data.meta.limit >= data.meta.total}
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

export default function PayoutsPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <PayoutsContent />
        </RoleGuard>
    )
}
