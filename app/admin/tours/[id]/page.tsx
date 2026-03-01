'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Loader2, Plus, X, Edit2, Trash2, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    useTour,
    useAddItineraryDay,
    useUpdateItineraryDay,
    useDeleteItineraryDay,
    useLinkPOIToItinerary,
    useRemovePOIFromItinerary,
    usePOIs,
} from '@/hooks/tours'

export default function AdminTourDetailPage() {
    const params = useParams<{ id: string }>()
    const tourId = params?.id
    const { data: tour, isLoading, refetch } = useTour(tourId)
    const addItineraryDay = useAddItineraryDay()
    const updateItineraryDay = useUpdateItineraryDay()
    const deleteItineraryDay = useDeleteItineraryDay()
    const linkPOIToItinerary = useLinkPOIToItinerary()
    const removePOIFromItinerary = useRemovePOIFromItinerary()
    const { data: poiResponse } = usePOIs({ page: 1, limit: 200 })
    const availablePOIs = Array.isArray(poiResponse?.data) ? poiResponse.data : []

    const [dayForm, setDayForm] = useState({ dayNumber: 1, title: '', details: '' })
    const [isEditingDay, setIsEditingDay] = useState<number | null>(null)
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))
    const [selectedDayForPOI, setSelectedDayForPOI] = useState<number | null>(null)
    const [showPOIModal, setShowPOIModal] = useState(false)

    const itinerary = Array.isArray(tour?.itinerary) ? [...tour.itinerary].sort((a, b) => a.dayNumber - b.dayNumber) : []

    const toggleDay = (dayNumber: number) => {
        const next = new Set(expandedDays)
        if (next.has(dayNumber)) {
            next.delete(dayNumber)
        } else {
            next.add(dayNumber)
        }
        setExpandedDays(next)
    }

    const resetDayForm = () => {
        const nextDayNumber = Math.max(...itinerary.map((d) => d.dayNumber), 0) + 1
        setDayForm({ dayNumber: nextDayNumber, title: '', details: '' })
        setIsEditingDay(null)
    }

    const startEditDay = (day: { dayNumber: number; title: string; details?: Record<string, unknown> }) => {
        setDayForm({
            dayNumber: day.dayNumber,
            title: day.title,
            details: typeof day.details === 'string' ? day.details : day.details ? JSON.stringify(day.details, null, 2) : '',
        })
        setIsEditingDay(day.dayNumber)
    }

    const handleAddDay = (e: React.FormEvent) => {
        e.preventDefault()

        if (!tourId) return

        if (isEditingDay) {
            updateItineraryDay.mutate(
                {
                    tourId,
                    dayNumber: isEditingDay,
                    data: {
                        title: dayForm.title,
                        details: dayForm.details ? { text: dayForm.details } : undefined,
                    },
                },
                {
                    onSuccess: () => resetDayForm(),
                }
            )
            return
        }

        addItineraryDay.mutate(
            {
                tourId,
                data: {
                    dayNumber: Number(dayForm.dayNumber),
                    title: dayForm.title,
                    details: dayForm.details ? { text: dayForm.details } : undefined,
                },
            },
            {
                onSuccess: () => {
                    const createdDay = Number(dayForm.dayNumber)
                    setExpandedDays((prev) => new Set([...Array.from(prev), createdDay]))
                    resetDayForm()
                },
            }
        )
    }

    const handleDeleteDay = (dayNumber: number) => {
        if (!tourId) return
        if (!confirm(`Delete Day ${dayNumber}? This action cannot be undone.`)) return
        deleteItineraryDay.mutate({ tourId, dayNumber })
    }

    const handleAddPOI = (poiId: string) => {
        if (!tourId || selectedDayForPOI === null) return

        const day = itinerary.find((item) => item.dayNumber === selectedDayForPOI)
        if (!day) return

        const nextOrder = (day.pois?.length || 0) + 1
        linkPOIToItinerary.mutate(
            {
                itineraryId: day.id,
                poiId,
                order: nextOrder,
                tourId,
            },
            {
                onSuccess: async () => {
                    await refetch()
                    setShowPOIModal(false)
                    setSelectedDayForPOI(null)
                },
            }
        )
    }

    const handleRemovePOI = (itineraryId: string, poiId: string) => {
        if (!tourId) return
        if (!confirm('Remove this POI from the itinerary?')) return
        removePOIFromItinerary.mutate({ itineraryId, poiId, tourId })
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/tours">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-2xl font-bold">Tour Details</h1>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[#005246]" />
                        </div>
                    )}

                    {!isLoading && tour && (
                        <>
                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">{tour.title}</h2>
                                        <p className="text-gray-600 mt-1">{tour.description}</p>
                                    </div>
                                    <Link href={`/admin/tours/${tour.id}/edit`}>
                                        <button className="px-4 py-2 border border-[#005246] text-[#005246] rounded-lg hover:bg-[#005246] hover:text-white transition-colors">
                                            Edit Tour
                                        </button>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Type</p>
                                        <p className="font-medium">{tour.type}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Duration</p>
                                        <p className="font-medium">{tour.duration} days</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Price</p>
                                        <p className="font-medium">₹{tour.basePrice.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Discount / Final</p>
                                        <p className="font-medium">{tour.discount}% / ₹{tour.finalPrice.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Capacity</p>
                                        <p className="font-medium">{tour.maxCapacity} seats</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Available Spots</p>
                                        <p className="font-medium">{tour.availableSpots ?? '-'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Rating</p>
                                        <p className="font-medium">{tour.rating ?? 0} ({tour.totalReviews} reviews)</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Status</p>
                                        <p className="font-medium">{tour.isActive ? 'Active' : 'Inactive'}</p>
                                    </div>
                                </div>

                                {tour.about && (
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-sm font-medium text-gray-700 mb-1">About</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{tour.about}</p>
                                    </div>
                                )}

                                {(tour.highlights?.length || tour.included?.length || tour.notIncluded?.length || tour.tags?.length) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Highlights</p>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                {(tour.highlights || []).map((item, index) => (
                                                    <li key={`highlight-${index}`}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Included</p>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                {(tour.included || []).map((item, index) => (
                                                    <li key={`included-${index}`}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 p-4 md:col-span-2">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Not Included</p>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                {(tour.notIncluded || []).map((item, index) => (
                                                    <li key={`not-included-${index}`}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {tour.tags && tour.tags.length > 0 && (
                                            <div className="rounded-lg border border-gray-200 p-4 md:col-span-2">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {tour.tags.map((tourTag, index) => (
                                                        <span key={`${tourTag.tagId}-${index}`} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                            {tourTag.tag?.label || tourTag.tagId}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {tour.imageUrls && tour.imageUrls.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Images</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {tour.imageUrls.map((url, index) => (
                                                <img key={`${url}-${index}`} src={url} alt={`tour-${index}`} className="h-24 w-full object-cover rounded-lg border border-gray-200" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Plus size={18} />
                                    {isEditingDay ? `Edit Day ${isEditingDay}` : 'Add Itinerary Day'}
                                </h3>
                                <form onSubmit={handleAddDay} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Day Number</label>
                                        <input
                                            type="number"
                                            min={1}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={dayForm.dayNumber}
                                            onChange={(e) => setDayForm((p) => ({ ...p, dayNumber: Number(e.target.value) }))}
                                            required
                                            disabled={!!isEditingDay}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={dayForm.title} onChange={(e) => setDayForm((p) => ({ ...p, title: e.target.value }))} required />
                                    </div>
                                    <div className="space-y-2 md:col-span-3">
                                        <label className="text-sm font-medium">Details</label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-24"
                                            value={dayForm.details}
                                            onChange={(e) => setDayForm((p) => ({ ...p, details: e.target.value }))}
                                            placeholder="Describe what happens on this day"
                                        />
                                    </div>
                                    <div className="md:col-span-3 flex items-center gap-2">
                                        <button
                                            type="submit"
                                            disabled={addItineraryDay.isPending || updateItineraryDay.isPending}
                                            className="w-fit px-5 py-2.5 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {(addItineraryDay.isPending || updateItineraryDay.isPending) && <Loader2 size={16} className="animate-spin" />}
                                            {isEditingDay ? 'Update Day' : 'Add Day'}
                                        </button>
                                        {isEditingDay && (
                                            <button type="button" onClick={resetDayForm} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <h3 className="text-lg font-semibold">Itinerary ({itinerary.length})</h3>
                                {itinerary.length === 0 && (
                                    <p className="text-gray-600">No itinerary days added yet.</p>
                                )}
                                {itinerary.length > 0 && (
                                    <div className="space-y-3">
                                        {itinerary.map((day) => (
                                            <div key={day.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => toggleDay(day.dayNumber)} className="p-1 rounded hover:bg-gray-100">
                                                            {expandedDays.has(day.dayNumber) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Day {day.dayNumber}</p>
                                                            <p className="font-semibold">{day.title}</p>
                                                            <p className="text-xs text-gray-500">POIs: {day.pois?.length ?? 0}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedDayForPOI(day.dayNumber)
                                                                setShowPOIModal(true)
                                                            }}
                                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-md border border-[#005246] text-[#005246] hover:bg-[#005246] hover:text-white transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                            Add POI
                                                        </button>
                                                        <button type="button" onClick={() => startEditDay(day)} className="p-2 rounded border border-gray-300 hover:bg-gray-100">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button type="button" onClick={() => handleDeleteDay(day.dayNumber)} className="p-2 rounded border border-red-300 text-red-700 hover:bg-red-50">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {expandedDays.has(day.dayNumber) && (
                                                    <div className="p-4 space-y-3">
                                                        {day.details && (
                                                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                                                                {typeof day.details === 'string' ? day.details : JSON.stringify(day.details, null, 2)}
                                                            </div>
                                                        )}

                                                        {day.pois && day.pois.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {day.pois.map((poiItem, idx) => (
                                                                    <div key={poiItem.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                                                                        <div className="w-6 h-6 rounded-full bg-[#005246]/10 text-[#005246] flex items-center justify-center text-xs font-semibold shrink-0">
                                                                            {idx + 1}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-gray-900">{poiItem.poi?.name || 'POI'}</p>
                                                                            {poiItem.poi?.description && (
                                                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{poiItem.poi.description}</p>
                                                                            )}
                                                                            {poiItem.poi?.latitude && poiItem.poi?.longitude && (
                                                                                <p className="text-xs text-gray-500 mt-1 font-mono">
                                                                                    📍 {poiItem.poi.latitude.toFixed(4)}, {poiItem.poi.longitude.toFixed(4)}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemovePOI(day.id, poiItem.poiId)}
                                                                            className="p-1 rounded border border-red-300 text-red-700 hover:bg-red-50 shrink-0"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No POIs added yet.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Dialog
                                open={showPOIModal}
                                onOpenChange={(open) => {
                                    setShowPOIModal(open)
                                    if (!open) {
                                        setSelectedDayForPOI(null)
                                    }
                                }}
                            >
                                <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
                                    <DialogHeader>
                                        <DialogTitle>Select POI for Day {selectedDayForPOI}</DialogTitle>
                                    </DialogHeader>

                                    {availablePOIs.length === 0 ? (
                                        <div className="text-center py-6">
                                            <MapPin size={32} className="mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">No POIs available. Create some first.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {availablePOIs.map((poi) => {
                                                const selectedDay = itinerary.find((d) => d.dayNumber === selectedDayForPOI)
                                                const alreadyAdded = selectedDay?.pois?.some((p) => p.poiId === poi.id)

                                                return (
                                                    <button
                                                        key={poi.id}
                                                        type="button"
                                                        onClick={() => handleAddPOI(poi.id)}
                                                        disabled={!!alreadyAdded || linkPOIToItinerary.isPending}
                                                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#005246] hover:bg-[#005246]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <p className="font-medium text-gray-900">{poi.name}</p>
                                                        {poi.description && <p className="text-xs text-gray-600 mt-1 line-clamp-1">{poi.description}</p>}
                                                        {alreadyAdded && <p className="text-xs text-[#005246] font-medium mt-1">✓ Already added</p>}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>
        </RoleGuard>
    )
}
