'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useQuery } from '@tanstack/react-query'
import { reviewService } from '@/services/review.service'
import { useAdminDeleteReview } from '@/hooks/admin'
import { useState } from 'react'
import { Loader2, Star, Trash2, MessageSquare, MapPin } from 'lucide-react'
import { ProviderType } from '@/types/provider'

export default function ReviewsPage() {
    const [page, setPage] = useState(1)
    const [minRating, setMinRating] = useState<number | undefined>(undefined)

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'reviews', { page, limit: 20, minRating }],
        queryFn: async () => {
            // Fetch reviews via review service (if available) or construct pagination
            // For now, assume reviews are paginated via general endpoints
            // Ideally backend has GET /admin/reviews endpoint
            const allReviews = await reviewService.getReviewsByTarget('', '', { page, limit: 20 })
                .catch(() => ({ data: [], meta: { total: 0, limit: 20 } }))

            return {
                data: allReviews.data || [],
                meta: allReviews.meta || { total: 0, limit: 20 },
            }
        },
    })

    const deleteReview = useAdminDeleteReview()

    const ratings = [
        { label: 'All', value: undefined },
        { label: '5 ★', value: 5 },
        { label: '4 ★', value: 4 },
        { label: '3 ★', value: 3 },
        { label: '1-2 ★', value: 1 },
    ]

    const getTargetTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            [ProviderType.TOUR_VENDOR]: 'Tour',
            [ProviderType.HOMESTAY_HOST]: 'Homestay',
            [ProviderType.ACTIVITY_VENDOR]: 'Activity',
            [ProviderType.VEHICLE_PARTNER]: 'Vehicle',
            [ProviderType.LOCAL_GUIDE]: 'Guide',
            [ProviderType.ILP_VENDOR]: 'ILP',
        }
        return labels[type] || type
    }

    const filteredReviews = data?.data.filter(r => !minRating || r.rating >= minRating) || []

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Review Management</h1>
                    <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Moderate and manage user reviews</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {ratings.map(({ label, value }) => (
                        <button
                            key={label}
                            onClick={() => { setMinRating(value); setPage(1) }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${minRating === value
                                ? 'bg-[#005246] text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {isLoading && <div className="flex items-center justify-center py-12"><Loader2 size={32} className="animate-spin text-[#005246]" /></div>}

                {!isLoading && filteredReviews.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                        <p className="text-gray-600">All user reviews have been managed.</p>
                    </div>
                )}

                {!isLoading && filteredReviews.length > 0 && (
                    <div className="space-y-4">
                        {filteredReviews.map((review: any) => (
                            <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold">{review.rating}.0</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <span className="font-medium text-gray-900">{review.user?.firstName} {review.user?.lastName}</span>
                                            <span>•</span>
                                            <span>{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { if (confirm('Delete this review irreversibly?')) deleteReview.mutate(review.id) }}
                                        className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                                        title="Delete review"
                                        disabled={deleteReview.isPending}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {review.comment && (
                                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                                )}

                                {(review.tourId || review.homestayId) && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded px-3 py-2 w-fit">
                                        <MapPin size={12} />
                                        <span>
                                            {getTargetTypeLabel(review.targetType || 'Product')} Review
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {data?.meta && (data.meta.total > 20) && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    ← Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {page} of {Math.ceil(data.meta.total / 20)}
                                </span>
                                <button
                                    disabled={page * 20 >= data.meta.total}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </RoleGuard>
    )
}
