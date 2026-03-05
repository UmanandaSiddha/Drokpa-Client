'use client'

import { useTours, useDeleteTour } from '@/hooks/tours'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { TourType } from '@/types/tour'
import { useState } from 'react'
import { Loader2, MapPin, Clock, Plus, Edit2, Trash2, Eye, Users, Search } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'

interface PaginationState {
    page: number
    limit: number
    keyword?: string
    type?: TourType
}

export default function ToursPage() {
    const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: 12 })
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)
    const [typeFilter, setTypeFilter] = useState<TourType | 'ALL'>('ALL')
    const { data: toursData, isLoading } = useTours({ ...pagination, keyword: debouncedSearch || undefined })
    const deleteTour = useDeleteTour()

    // Remove handleSearch function - debounce handles it automatically

    const handleTypeFilter = (type: TourType | 'ALL') => {
        setTypeFilter(type)
        setPagination(prev => ({
            ...prev,
            page: 1,
            type: type === 'ALL' ? undefined : type
        }))
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this tour?')) {
            deleteTour.mutate(id)
        }
    }

    const tours = toursData?.data || []
    const total = toursData?.meta?.total || 0
    const totalPages = toursData?.meta?.totalPages || 1

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Tours & Treks</h1>
                        <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Manage package tours and trekking experiences</p>
                    </div>
                    <Link href="/admin/tours/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] transition-colors font-medium">
                            <Plus size={18} />
                            Create Tour
                        </button>
                    </Link>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })) }}
                            placeholder="Search tours by title..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005246] focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleTypeFilter('ALL')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${typeFilter === 'ALL'
                                ? 'bg-[#005246] text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleTypeFilter(TourType.TOUR)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${typeFilter === TourType.TOUR
                                ? 'bg-[#005246] text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Tours
                        </button>
                        <button
                            onClick={() => handleTypeFilter(TourType.TREK)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${typeFilter === TourType.TREK
                                ? 'bg-[#005246] text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Treks
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-[#005246]" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && tours.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No Tours Yet</h3>
                        <p className="text-gray-600 mb-4">Start by creating your first tour package.</p>
                        <Link href="/admin/tours/create">
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] transition-colors">
                                <Plus size={18} />
                                Create First Tour
                            </button>
                        </Link>
                    </div>
                )}

                {/* Tours Grid */}
                {!isLoading && tours.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tours.map((tour: any) => (
                                <div key={tour.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Image */}
                                    {tour.imageUrls && tour.imageUrls.length > 0 ? (
                                        <img
                                            src={tour.imageUrls[0]}
                                            alt={tour.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <MapPin size={48} className="text-gray-400" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-4 space-y-3">
                                        {/* Title & Type */}
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-semibold text-lg line-clamp-1">{tour.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${tour.type === 'TREK'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {tour.type}
                                                </span>
                                            </div>
                                            {tour.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2">{tour.description}</p>
                                            )}
                                        </div>

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Clock size={16} />
                                                <span>
                                                    {tour.duration} {tour.duration === 1 ? 'day' : 'days'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Users size={16} />
                                                <span>Max {tour.maxCapacity}</span>
                                            </div>
                                        </div>

                                        {/* Price & Status */}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <div>
                                                {(() => {
                                                    const basePrice = Number(tour.basePrice ?? tour.price ?? 0)
                                                    const discount = Number(tour.discount ?? 0)
                                                    const finalPrice = Number(
                                                        tour.finalPrice ??
                                                        (discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice)
                                                    )
                                                    const hasDiscount = discount > 0 && finalPrice > 0 && finalPrice < basePrice

                                                    return (
                                                        <div className="space-y-0.5">
                                                            <p className="text-xl font-bold text-[#005246]">
                                                                ₹{finalPrice.toLocaleString('en-IN')}
                                                            </p>
                                                            {hasDiscount && (
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-xs text-gray-500 line-through">
                                                                        ₹{basePrice.toLocaleString('en-IN')}
                                                                    </p>
                                                                    <span className="text-xs font-medium text-[#005246]">{discount}% off</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })()}
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${tour.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {tour.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Link href={`/admin/tours/${tour.id}`} className="flex-1">
                                                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </Link>
                                            <Link href={`/admin/tours/${tour.id}/edit`} className="flex-1">
                                                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-[#005246] text-[#005246] rounded-lg hover:bg-[#005246] hover:text-white transition-colors">
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(tour.id)}
                                                disabled={deleteTour.isPending}
                                                className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deleteTour.isPending ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={pagination.page <= 1}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {pagination.page} of {totalPages} · {total} total
                                </span>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page >= totalPages}
                                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
