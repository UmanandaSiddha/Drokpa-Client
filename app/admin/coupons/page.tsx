'use client'

import Link from 'next/link'
import { Plus, Loader2, TicketPercent, Edit2, Trash2 } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { CouponType } from '@/types/coupon'
import { useAdminCoupons, useDeleteCoupon } from '@/hooks/admin'
import { useState } from 'react'

export default function CouponsPage() {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useAdminCoupons({ page, limit: 20 })
    const deleteCoupon = useDeleteCoupon()

    const coupons = data?.data ?? []
    const totalPages = data?.meta?.totalPages ?? 1
    const total = data?.meta?.total ?? 0

    const handleDelete = (id: string, code: string) => {
        if (confirm(`Delete coupon ${code}?`)) {
            deleteCoupon.mutate(id)
        }
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Coupons</h1>
                        <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Create and manage promotional codes</p>
                    </div>
                    <Link href="/admin/coupons/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] transition-colors font-medium">
                            <Plus size={18} />
                            Create Coupon
                        </button>
                    </Link>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-[#005246]" />
                    </div>
                )}

                {!isLoading && coupons.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <TicketPercent size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No Coupons Yet</h3>
                        <p className="text-gray-600 mb-4">Create your first coupon to start promotions.</p>
                        <Link href="/admin/coupons/create">
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] transition-colors">
                                <Plus size={18} />
                                Create First Coupon
                            </button>
                        </Link>
                    </div>
                )}

                {!isLoading && coupons.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {coupons.map((coupon) => (
                                <div key={coupon.id} className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Code</p>
                                            <p className="font-mono text-lg font-semibold">{coupon.code}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        <p>
                                            <span className="text-gray-500">Value:</span>{' '}
                                            {coupon.discountValue}
                                            {coupon.type === CouponType.PERCENTAGE ? '%' : '₹'}
                                        </p>
                                        <p>
                                            <span className="text-gray-500">Visibility:</span> {coupon.visibility}
                                        </p>
                                        <p>
                                            <span className="text-gray-500">Uses:</span> {coupon.currentUses}
                                            {coupon.maxUsesTotal ? `/${coupon.maxUsesTotal}` : ''}
                                        </p>
                                        {coupon.minParticipants && (
                                            <p>
                                                <span className="text-gray-500">Min Participants:</span> {coupon.minParticipants}+
                                            </p>
                                        )}
                                        {coupon.firstTimeOnly && (
                                            <p className="text-blue-700 text-xs font-medium">First-time users only</p>
                                        )}
                                        {coupon.applicableProductTypes.length > 0 && (
                                            <p className="text-xs text-gray-500">
                                                Restricted to: {coupon.applicableProductTypes.slice(0, 2).map(t => t.replace(/_/g, ' ')).join(', ')}
                                                {coupon.applicableProductTypes.length > 2 && ` +${coupon.applicableProductTypes.length - 2} more`}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <p className="text-xs text-gray-500">
                                            {coupon.validUntil ? `Valid till ${new Date(coupon.validUntil).toLocaleDateString('en-IN')}` : 'No expiry'}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/coupons/${coupon.id}/edit`}>
                                                <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" title="Edit coupon">
                                                    <Edit2 size={16} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(coupon.id, coupon.code)}
                                                disabled={deleteCoupon.isPending}
                                                className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="Delete coupon"
                                            >
                                                {deleteCoupon.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">Page {page} of {totalPages} · {total} total</span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </RoleGuard>
    )
}
