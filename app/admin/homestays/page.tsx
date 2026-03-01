'use client'

import { useHomestays, useDeleteHomestay } from '@/hooks/homestays'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useState } from 'react'
import { Loader2, Building2, Search, MapPin, Star, Plus, Edit2, Trash2, DoorOpen, Eye } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'

interface PaginationState {
    page: number
    limit: number
    keyword?: string
    sort?: string
}

export default function HomestaysPage() {
    const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: 10 })
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)
    const { data: homestaysData, isLoading } = useHomestays({ ...pagination, keyword: debouncedSearch || undefined })
    const deleteHomestay = useDeleteHomestay()

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this homestay?')) {
            deleteHomestay.mutate(id)
        }
    }

    const homestays = homestaysData?.data || []
    const total = homestaysData?.meta?.total || 0

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Homestays</h1>
                        <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Browse and manage all homestay listings</p>
                    </div>
                    <Link href="/admin/homestays/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] transition-colors font-medium">
                            <Plus size={18} />
                            Create Homestay
                        </button>
                    </Link>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search homestays..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })) }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005246]"
                    />
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-[#005246]" size={32} />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && homestays.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-600 mb-4">No homestays found</p>
                        <Link href="/admin/homestays/create">
                            <button className="px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] transition-colors">
                                Create First Homestay
                            </button>
                        </Link>
                    </div>
                )}

                {/* Homestays List */}
                {!isLoading && homestays.length > 0 && (
                    <div className="space-y-3">
                        {homestays.map((homestay: any) => (
                            <div key={homestay.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    {/* Image */}
                                    {homestay.imageUrls?.[0] && (
                                        <img
                                            src={homestay.imageUrls[0]}
                                            alt={homestay.name}
                                            className="w-full md:w-32 h-32 object-cover rounded-lg"
                                        />
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold">{homestay.name}</h3>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${homestay.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {homestay.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-2">{homestay.description}</p>

                                        <div className="flex flex-col md:flex-row md:items-center gap-3 text-sm text-gray-500">
                                            {homestay.address && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={16} />
                                                    {homestay.address?.city}
                                                </span>
                                            )}
                                            {homestay.avgRating && (
                                                <span className="flex items-center gap-1">
                                                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                                    {homestay.avgRating.toFixed(1)}
                                                </span>
                                            )}
                                            {homestay.rooms && (
                                                <span className="flex items-center gap-1">
                                                    <DoorOpen size={16} />
                                                    {homestay.rooms.length} room{homestay.rooms.length !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                            {homestay.displayPrice && (
                                                <span className="font-semibold text-gray-800">
                                                    ₹{homestay.displayPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 md:flex-col">
                                        <Link href={`/admin/homestays/${homestay.id}`}>
                                            <button
                                                title="View details"
                                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </Link>
                                        <Link href={`/admin/homestays/${homestay.id}/edit`}>
                                            <button
                                                title="Edit"
                                                className="p-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(homestay.id)}
                                            disabled={deleteHomestay.isPending}
                                            title="Delete"
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                        >
                                            {deleteHomestay.isPending ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && homestays.length > 0 && (
                    <div className="flex items-center justify-between py-4">
                        <p className="text-sm text-gray-600">
                            Showing {homestays.length} of {total} homestays
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1">Page {pagination.page}</span>
                            <button
                                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                                disabled={homestays.length < pagination.limit}
                                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    )
}
