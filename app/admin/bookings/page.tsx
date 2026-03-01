'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAuth } from '@/hooks/auth/useAuth'
import { useAdminAllBookings, useAdminConfirmTourBooking, useAdminRejectTourBooking, useAdminCompleteBooking } from '@/hooks/admin'
import { useProviderBookings } from '@/hooks/booking'
import { useState } from 'react'
import { BookingStatus } from '@/types/booking'
import { Loader2, Search, CheckCircle2, XCircle, BadgeCheck } from 'lucide-react'

const STATUS_OPTIONS = [undefined, ...Object.values(BookingStatus)] as (BookingStatus | undefined)[]

function BookingsContent() {
    const { isAdmin } = useAuth()
    const [status, setStatus] = useState<BookingStatus | undefined>(undefined)
    const [productType, setProductType] = useState<string | undefined>(undefined)
    const [page, setPage] = useState(1)
    const confirmTour = useAdminConfirmTourBooking()
    const rejectTour = useAdminRejectTourBooking()
    const completeBooking = useAdminCompleteBooking()

    // Only call the appropriate query based on role
    const { data, isLoading } = isAdmin
        ? useAdminAllBookings({ status, page, limit: 20 })
        : useProviderBookings({ status, page, limit: 20 })

    const rows = data?.data ?? []
    const totalPages = data?.meta?.totalPages ?? 1
    const total = data?.meta?.total ?? 0

    // Filter rows by product type if selected
    const filteredRows = productType
        ? rows.filter((booking) => {
              const bookingProductType = booking.items?.[0]?.productType || booking.source
              return bookingProductType === productType
          })
        : rows

    const handleConfirmTour = (bookingId: string) => {
        const value = window.prompt('Payment window (minutes)', '30')
        const parsed = Number(value)
        confirmTour.mutate({ bookingId, paymentWindowMinutes: Number.isFinite(parsed) && parsed > 0 ? parsed : 30 })
    }

    const handleRejectTour = (bookingId: string) => {
        const reason = window.prompt('Reason for rejection', 'Tour unavailable for selected dates')
        if (!reason) return
        rejectTour.mutate({ bookingId, reason })
    }

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Bookings</h1>
                    <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>
                        {isAdmin ? 'Review and manage all platform bookings' : 'Bookings for your services'}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                    <button
                        key={s ?? 'all'}
                        onClick={() => { setStatus(s); setPage(1) }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${status === s ? 'bg-[#005246] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        {s ?? 'All'}
                    </button>
                ))}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by Product Type:</p>
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'All Types', value: undefined },
                        { label: 'Tours', value: 'TOUR_VENDOR' },
                        { label: 'Homestays', value: 'HOMESTAY_ROOM' },
                        { label: 'Vehicles', value: 'VEHICLE' },
                        { label: 'Guides', value: 'LOCAL_GUIDE' },
                    ].map((type) => (
                        <button
                            key={type.value ?? 'all'}
                            onClick={() => { setProductType(type.value); setPage(1) }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${productType === type.value ? 'bg-[#FC611E] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-[#005246]" />
                </div>
            )}

            {!isLoading && rows.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Search size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                    <p className="text-gray-600">Try a different status filter.</p>
                </div>
            )}

            {!isLoading && filteredRows.length === 0 && rows.length > 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Search size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No bookings found for selected product type</h3>
                    <p className="text-gray-600">Try a different filter.</p>
                </div>
            )}

            {!isLoading && filteredRows.length > 0 && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
                                        <th className="px-4 py-3 font-medium">ID</th>
                                        {isAdmin && <th className="px-4 py-3 font-medium">User</th>}
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Amount</th>
                                        <th className="px-4 py-3 font-medium">Type</th>
                                        <th className="px-4 py-3 font-medium">Created</th>
                                        {isAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.map((b) => {
                                        const isTourBooking = (b.items ?? []).some((item) => item.productType === 'TOUR_VENDOR')

                                        return (
                                            <tr key={b.id} className="border-b border-gray-100 last:border-0">
                                                <td className="px-4 py-3 font-mono text-xs text-gray-700">{b.id.slice(0, 8)}…</td>
                                                {isAdmin && <td className="px-4 py-3 font-mono text-xs text-gray-700">{b.userId.slice(0, 8)}…</td>}
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${b.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' :
                                                        b.status === BookingStatus.REQUESTED ? 'bg-amber-100 text-amber-700' :
                                                            b.status === BookingStatus.REJECTED ? 'bg-red-100 text-red-700' :
                                                                b.status === BookingStatus.COMPLETED ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{b.totalAmount ? `₹${b.totalAmount.toLocaleString('en-IN')}` : '—'}</td>
                                                <td className="px-4 py-3 text-xs text-gray-600">{isTourBooking ? 'Tour' : (b.items?.[0]?.productType ?? b.source)}</td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            {b.status === BookingStatus.REQUESTED && isTourBooking && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleConfirmTour(b.id)}
                                                                        disabled={confirmTour.isPending}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
                                                                    >
                                                                        <CheckCircle2 size={14} />
                                                                        Confirm
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectTour(b.id)}
                                                                        disabled={rejectTour.isPending}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                                    >
                                                                        <XCircle size={14} />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}

                                                            {b.status === BookingStatus.CONFIRMED && (
                                                                <button
                                                                    onClick={() => completeBooking.mutate(b.id)}
                                                                    disabled={completeBooking.isPending}
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-[#005246] text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50"
                                                                >
                                                                    <BadgeCheck size={14} />
                                                                    Complete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {page} of {totalPages} · {filteredRows.length} {productType ? 'filtered ' : ''}booking{filteredRows.length !== 1 ? 's' : ''}</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
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
