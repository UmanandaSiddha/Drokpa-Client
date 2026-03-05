'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, X, Upload, Plus, Edit2, Trash2, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { TourType } from '@/types/tour'
import {
    useTour,
    useUpdateTour,
    useAddItineraryDay,
    useUpdateItineraryDay,
    useDeleteItineraryDay,
    useLinkPOIToItinerary,
    useRemovePOIFromItinerary,
    usePOIs,
    useCreatePOI,
} from '@/hooks/tours'
import { useAddresses, useTags } from '@/hooks/resources'
import { useGuides } from '@/hooks/guide'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import { useDebounce } from '@/hooks/useDebounce'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export default function EditTourPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const tourId = params?.id

    const [tagSearch, setTagSearch] = useState('')
    const [addressSearch, setAddressSearch] = useState('')
    const [selectedAddressLabel, setSelectedAddressLabel] = useState('')
    const debouncedAddressSearch = useDebounce(addressSearch, 500)
    const [poiAddressSearch, setPoiAddressSearch] = useState('')
    const debouncedPoiAddressSearch = useDebounce(poiAddressSearch, 500)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: TourType.TOUR,
        price: 0,
        discount: 0,
        duration: 1,
        maxCapacity: 1,
        about: '',
        isActive: true,
        tags: [] as string[],
        addressId: '',
        guideId: '',
        images: [] as File[],
        included: [] as string[],
        notIncluded: [] as string[],
        highlights: [] as string[],
        brochure: '',
    })
    const [imageUrls, setImageUrls] = useState<string[]>([])

    const { data: tour, isLoading, refetch } = useTour(tourId)
    const updateTour = useUpdateTour()
    const addItineraryDay = useAddItineraryDay()
    const updateItineraryDay = useUpdateItineraryDay()
    const deleteItineraryDay = useDeleteItineraryDay()
    const linkPOIToItinerary = useLinkPOIToItinerary()
    const removePOIFromItinerary = useRemovePOIFromItinerary()
    const createPOI = useCreatePOI()
    const { data: poiResponse } = usePOIs({ page: 1, limit: 200 })
    const availablePOIs = Array.isArray(poiResponse?.data) ? poiResponse.data : []
    const { data: addresses } = useAddresses({ keyword: debouncedAddressSearch })
    const { data: poiAddresses } = useAddresses({ keyword: debouncedPoiAddressSearch })
    const { data: guides, isLoading: guidesLoading } = useGuides()
    const { data: tags } = useTags()
    const { uploadFiles, isUploading } = useS3Upload()

    const normalizeTourType = (value: unknown): TourType => {
        if (typeof value !== 'string') return TourType.TOUR
        const normalized = value.trim().toUpperCase()
        if (normalized.includes('TREK')) return TourType.TREK
        if (normalized.includes('TOUR')) return TourType.TOUR
        return TourType.TOUR
    }

    const tagOptions = Array.isArray(tags)
        ? tags
        : Array.isArray((tags as any)?.data)
            ? (tags as any).data
            : []

    const addressOptions = Array.isArray((addresses as any)?.data)
        ? (addresses as any).data
        : Array.isArray(addresses)
            ? (addresses as any)
            : []

    const poiAddressOptions = Array.isArray((poiAddresses as any)?.data)
        ? (poiAddresses as any).data
        : Array.isArray(poiAddresses)
            ? (poiAddresses as any)
            : []

    // Normalize guides response - recalculates on every render when guides changes
    const guideOptions = Array.isArray((guides as any)?.data)
        ? (guides as any).data
        : Array.isArray(guides)
            ? (guides as any)
            : []

    const itinerary = Array.isArray((tour as any)?.itinerary)
        ? [...((tour as any).itinerary as any[])].sort((a, b) => a.dayNumber - b.dayNumber)
        : []

    const [dayForm, setDayForm] = useState({ dayNumber: 1, title: '', details: '' })
    const [isEditingDay, setIsEditingDay] = useState<number | null>(null)
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))
    const [selectedDayForPOI, setSelectedDayForPOI] = useState<number | null>(null)
    const [showPOIModal, setShowPOIModal] = useState(false)
    const [poiDialogMode, setPoiDialogMode] = useState<'select' | 'create'>('select')
    const [poiSpecialtyInput, setPoiSpecialtyInput] = useState('')
    const [poiForm, setPoiForm] = useState({
        name: '',
        description: '',
        specialty: [] as string[],
        addressId: '',
        latitude: '',
        longitude: '',
        images: [] as File[],
    })

    const resetPoiForm = () => {
        setPoiDialogMode('select')
        setPoiSpecialtyInput('')
        setPoiAddressSearch('')
        setPoiForm({
            name: '',
            description: '',
            specialty: [],
            addressId: '',
            latitude: '',
            longitude: '',
            images: [],
        })
    }

    const handleCreatePOIAndAttach = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tourId) return
        if (!poiForm.name.trim()) return

        try {
            const uploadedUrls = poiForm.images.length
                ? await uploadFiles(poiForm.images, 'poi', tourId)
                : []

            const created = await createPOI.mutateAsync({
                name: poiForm.name.trim(),
                description: poiForm.description.trim() || undefined,
                specialty: poiForm.specialty.length ? poiForm.specialty : undefined,
                imageUrls: uploadedUrls.length ? uploadedUrls : undefined,
                addressId: poiForm.addressId || undefined,
                latitude: poiForm.latitude ? Number(poiForm.latitude) : undefined,
                longitude: poiForm.longitude ? Number(poiForm.longitude) : undefined,
            })

            if (created?.id) {
                handleAddPOI(created.id)
            }
        } catch (err) {
            console.error('Failed to create POI', err)
        }
    }

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
        const nextDayNumber = Math.max(...itinerary.map((d: any) => d.dayNumber), 0) + 1
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

        const day = itinerary.find((item: any) => item.dayNumber === selectedDayForPOI)
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

    useEffect(() => {
        if (!tour) return
        setFormData({
            title: tour.title,
            description: tour.description,
            type: normalizeTourType(tour.type),
            price: tour.basePrice,
            discount: tour.discount,
            duration: tour.duration,
            maxCapacity: tour.maxCapacity,
            about: tour.about || '',
            isActive: tour.isActive,
            tags: tour.tags?.map((t) => t.tag?.label).filter((label): label is string => Boolean(label)) || [],
            addressId: tour.addressId || '',
            guideId: tour.guideId || '',
            images: [],
            included: tour.included || [],
            notIncluded: tour.notIncluded || [],
            highlights: tour.highlights || [],
            brochure: tour.brochure || '',
        })
        if ((tour as any).address?.city || (tour as any).address?.state) {
            setSelectedAddressLabel(`${(tour as any).address?.city ?? ''}${(tour as any).address?.city && (tour as any).address?.state ? ', ' : ''}${(tour as any).address?.state ?? ''}`)
        } else {
            setSelectedAddressLabel('')
        }
        setAddressSearch('')
        if (tour.imageUrls && tour.imageUrls.length > 0) {
            setImageUrls(tour.imageUrls)
        }
    }, [tour])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Upload new images if any
        const uploadPromise = formData.images.length > 0
            ? uploadFiles(formData.images, 'tours', tourId || '')
            : Promise.resolve([])

        uploadPromise.then((uploadedImages: string[]) => {
            const payloadType = normalizeTourType(formData.type)
            updateTour.mutate(
                {
                    id: tourId,
                    data: {
                        title: formData.title,
                        description: formData.description,
                        type: payloadType,
                        price: parseInt(String(formData.price)) || 0,
                        discount: parseInt(String(formData.discount)) || 0,
                        duration: parseInt(String(formData.duration)) || 1,
                        maxCapacity: parseInt(String(formData.maxCapacity)) || 1,
                        about: formData.about || undefined,
                        isActive: formData.isActive,
                        tags: formData.tags,
                        addressId: formData.addressId || undefined,
                        guideId: formData.guideId || undefined,
                        imageUrls: uploadedImages.length > 0 ? uploadedImages : undefined,
                        included: formData.included.length > 0 ? formData.included : undefined,
                        notIncluded: formData.notIncluded.length > 0 ? formData.notIncluded : undefined,
                        highlights: formData.highlights.length > 0 ? formData.highlights : undefined,
                        brochure: formData.brochure || undefined,
                    },
                },
                {
                    onSuccess: () => router.push(`/admin/tours/${tourId}`),
                }
            )
        })
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/tours/${tourId}`}>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-2xl font-bold">Edit Tour</h1>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[#005246]" />
                        </div>
                    )}

                    {!isLoading && tour && (
                        <>
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title *</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description *</label>
                                    <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-24" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <Select
                                            value={formData.type || TourType.TOUR}
                                            onValueChange={(value) => {
                                                if (value === TourType.TREK || value === TourType.TOUR) {
                                                    setFormData((p) => ({
                                                        ...p,
                                                        type: value,
                                                        guideId: value === TourType.TOUR ? '' : p.guideId,
                                                    }))
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={TourType.TOUR}>Tour</SelectItem>
                                                <SelectItem value={TourType.TREK}>Trek</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Price (₹) *</label>
                                        <input type="number" min={0} step="1" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: parseInt(e.target.value) || 0 }))} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Discount (%)</label>
                                        <input type="number" min={0} max={100} className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.discount} onChange={(e) => setFormData((p) => ({ ...p, discount: Number(e.target.value) }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Final Price</label>
                                        <div className="h-10 px-3 border border-gray-300 rounded-lg flex items-center bg-gray-50">
                                            <span className="font-semibold text-green-600">
                                                ₹{Math.round(formData.price - (formData.price * formData.discount) / 100).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Duration (days) *</label>
                                        <input type="number" min={1} className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.duration} onChange={(e) => setFormData((p) => ({ ...p, duration: Number(e.target.value) }))} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Max Capacity *</label>
                                    <input type="number" min={1} className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.maxCapacity} onChange={(e) => setFormData((p) => ({ ...p, maxCapacity: Number(e.target.value) }))} required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags</label>
                                    <input
                                        type="text"
                                        value={tagSearch}
                                        onChange={(e) => setTagSearch(e.target.value)}
                                        placeholder="Search tags..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((label) => (
                                                <span
                                                    key={label}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[#005246]/10 text-[#005246]"
                                                >
                                                    {label}
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData((p) => ({ ...p, tags: p.tags.filter((t) => t !== label) }))}
                                                        className="hover:text-[#003d34]"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                        {tagOptions
                                            .filter((t: any) => {
                                                const q = tagSearch.trim().toLowerCase()
                                                if (!q) return true
                                                return String(t.label || '').toLowerCase().includes(q)
                                            })
                                            .filter((t: any) => !formData.tags.includes(t.label))
                                            .map((tag: any) => (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, tags: [...p.tags, tag.label] }))}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                                                >
                                                    <div className="text-sm font-medium">{tag.label}</div>
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <input
                                        type="text"
                                        placeholder="Search address..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={addressSearch}
                                        onChange={(e) => setAddressSearch(e.target.value)}
                                    />
                                    {addressSearch && addressOptions.length > 0 && (
                                        <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                            {addressOptions.map((addr: any) => (
                                                <button
                                                    key={addr.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((p) => ({ ...p, addressId: addr.id }))
                                                        setSelectedAddressLabel(`${addr.city}, ${addr.state}`)
                                                        setAddressSearch('')
                                                    }}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                                                >
                                                    <div className="text-sm font-medium">{addr.city}, {addr.state}</div>
                                                    {addr.street && <div className="text-xs text-gray-600">{addr.street}</div>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {formData.addressId && (
                                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm w-fit">
                                            <MapPin size={14} className="text-green-600" />
                                            <span>{selectedAddressLabel || 'Selected address'}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData((p) => ({ ...p, addressId: '' }))
                                                    setSelectedAddressLabel('')
                                                    setAddressSearch('')
                                                }}
                                                className="text-green-700 hover:text-green-900"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {formData.type === TourType.TREK && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <label className="text-sm font-medium">Guide *</label>
                                            {formData.guideId && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, guideId: '' }))}
                                                    className="text-sm text-[#005246] hover:underline"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        <Select
                                            value={formData.guideId || undefined}
                                            onValueChange={(value) => setFormData((p) => ({ ...p, guideId: value }))}
                                            disabled={guidesLoading}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={
                                                    guidesLoading
                                                        ? "Loading guides..."
                                                        : guideOptions.length === 0
                                                            ? "No guides available"
                                                            : "Select a guide"
                                                } />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {!guidesLoading && guideOptions.length === 0 && (
                                                    <SelectItem value="no-guides" disabled>
                                                        No guides available
                                                    </SelectItem>
                                                )}
                                                {!guidesLoading && guideOptions.map((guide: any) => (
                                                    <SelectItem key={guide.id} value={guide.id}>
                                                        {guide.provider?.name} • {guide.specialties?.[0]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">About</label>
                                    <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-24" value={formData.about} onChange={(e) => setFormData((p) => ({ ...p, about: e.target.value }))} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Highlights</label>
                                    <div className="space-y-2">
                                        {formData.highlights.map((highlight, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={highlight}
                                                    onChange={(e) => {
                                                        const newHighlights = [...formData.highlights];
                                                        newHighlights[index] = e.target.value;
                                                        setFormData((p) => ({ ...p, highlights: newHighlights }));
                                                    }}
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                                    placeholder="Enter highlight"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newHighlights = formData.highlights.filter((_, i) => i !== index);
                                                        setFormData((p) => ({ ...p, highlights: newHighlights }));
                                                    }}
                                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setFormData((p) => ({ ...p, highlights: [...p.highlights, ''] }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            + Add Highlight
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Included</label>
                                    <div className="space-y-2">
                                        {formData.included.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newIncluded = [...formData.included];
                                                        newIncluded[index] = e.target.value;
                                                        setFormData((p) => ({ ...p, included: newIncluded }));
                                                    }}
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                                    placeholder="Enter included item"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newIncluded = formData.included.filter((_, i) => i !== index);
                                                        setFormData((p) => ({ ...p, included: newIncluded }));
                                                    }}
                                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setFormData((p) => ({ ...p, included: [...p.included, ''] }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            + Add Included Item
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Not Included</label>
                                    <div className="space-y-2">
                                        {formData.notIncluded.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newNotIncluded = [...formData.notIncluded];
                                                        newNotIncluded[index] = e.target.value;
                                                        setFormData((p) => ({ ...p, notIncluded: newNotIncluded }));
                                                    }}
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                                    placeholder="Enter not included item"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newNotIncluded = formData.notIncluded.filter((_, i) => i !== index);
                                                        setFormData((p) => ({ ...p, notIncluded: newNotIncluded }));
                                                    }}
                                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setFormData((p) => ({ ...p, notIncluded: [...p.notIncluded, ''] }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            + Add Not Included Item
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Brochure URL</label>
                                    <input
                                        type="text"
                                        value={formData.brochure}
                                        onChange={(e) => setFormData((p) => ({ ...p, brochure: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Enter brochure URL"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Images</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload size={24} className="text-gray-400" />
                                            <p className="text-sm text-gray-600">Drag and drop images here or click to browse</p>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || [])
                                                    setFormData((p) => ({ ...p, images: [...p.images, ...files] }))
                                                }}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                <Button type="button" variant="outline" size="sm">
                                                    Browse Files
                                                </Button>
                                            </label>
                                        </div>
                                    </div>

                                    {(imageUrls.length > 0 || formData.images.length > 0) && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {imageUrls.map((url, idx) => (
                                                <div key={`existing-${idx}`} className="relative group">
                                                    <img src={url} alt={`Tour ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setImageUrls((p) => p.filter((_, i) => i !== idx))}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.images.map((file, idx) => (
                                                <div key={`new-${idx}`} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`New ${idx}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                    <label className="text-sm font-medium">Active</label>
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData((p) => ({ ...p, isActive: checked }))}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={updateTour.isPending || isUploading} className="px-5 py-2.5 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center gap-2">
                                        {(updateTour.isPending || isUploading) && <Loader2 size={16} className="animate-spin" />}
                                        Save Changes
                                    </button>
                                    <Link href={`/admin/tours/${tourId}`}>
                                        <button type="button" className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                    </Link>
                                </div>
                            </form>

                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <h3 className="text-lg font-semibold">Itinerary</h3>
                                <p className="text-sm text-gray-600">Create days and add POIs in the same section.</p>

                                <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <Plus size={16} />
                                        {isEditingDay ? `Edit Day ${isEditingDay}` : 'Add Itinerary Day'}
                                    </h4>
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
                                            <input
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                value={dayForm.title}
                                                onChange={(e) => setDayForm((p) => ({ ...p, title: e.target.value }))}
                                                required
                                            />
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

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">Days ({itinerary.length})</h4>
                                    </div>
                                    {itinerary.length === 0 && <p className="text-gray-600">No itinerary days added yet.</p>}
                                    {itinerary.length > 0 && (
                                        <div className="space-y-3">
                                            {itinerary.map((day: any) => (
                                                <div key={day.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                    <div className="px-4 py-3 bg-gray-50 flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <button type="button" onClick={() => toggleDay(day.dayNumber)} className="p-1 rounded hover:bg-gray-100">
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
                                                                    setPoiDialogMode('select')
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
                                                                    {day.pois.map((poiItem: any, idx: number) => (
                                                                        <div key={poiItem.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                                                                            <div className="w-6 h-6 rounded-full bg-[#005246]/10 text-[#005246] flex items-center justify-center text-xs font-semibold shrink-0">
                                                                                {idx + 1}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="font-medium text-gray-900">{poiItem.poi?.name || 'POI'}</p>
                                                                                {poiItem.poi?.description && (
                                                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{poiItem.poi.description}</p>
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
                            </div>

                            <Dialog
                                open={showPOIModal}
                                onOpenChange={(open) => {
                                    setShowPOIModal(open)
                                    if (!open) {
                                        setSelectedDayForPOI(null)
                                        resetPoiForm()
                                    }
                                }}
                            >
                                <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
                                    <DialogHeader>
                                        <DialogTitle>Select POI for Day {selectedDayForPOI}</DialogTitle>
                                    </DialogHeader>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant={poiDialogMode === 'select' ? 'default' : 'outline'}
                                            onClick={() => setPoiDialogMode('select')}
                                            className="flex-1"
                                        >
                                            Select Existing
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={poiDialogMode === 'create' ? 'default' : 'outline'}
                                            onClick={() => setPoiDialogMode('create')}
                                            className="flex-1"
                                        >
                                            Create POI
                                        </Button>
                                    </div>

                                    {poiDialogMode === 'create' && (
                                        <form onSubmit={handleCreatePOIAndAttach} className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Name</label>
                                                <input
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                    value={poiForm.name}
                                                    onChange={(e) => setPoiForm((p) => ({ ...p, name: e.target.value }))}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Description</label>
                                                <textarea
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20"
                                                    value={poiForm.description}
                                                    onChange={(e) => setPoiForm((p) => ({ ...p, description: e.target.value }))}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Specialty</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                                        value={poiSpecialtyInput}
                                                        onChange={(e) => setPoiSpecialtyInput(e.target.value)}
                                                        placeholder="e.g. viewpoint, monastery"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const next = poiSpecialtyInput.trim()
                                                            if (!next) return
                                                            setPoiForm((p) => ({ ...p, specialty: Array.from(new Set([...(p.specialty || []), next])) }))
                                                            setPoiSpecialtyInput('')
                                                        }}
                                                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                {poiForm.specialty.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {poiForm.specialty.map((s) => (
                                                            <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100">
                                                                {s}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPoiForm((p) => ({ ...p, specialty: p.specialty.filter((x) => x !== s) }))}
                                                                    className="text-gray-500 hover:text-gray-700"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Address (optional)</label>
                                                <input
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                    value={poiAddressSearch}
                                                    onChange={(e) => setPoiAddressSearch(e.target.value)}
                                                    placeholder="Search city/state"
                                                />
                                                <Select
                                                    value={poiForm.addressId || undefined}
                                                    onValueChange={(value) => setPoiForm((p) => ({ ...p, addressId: value }))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select address" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {poiAddressOptions.map((a: any) => (
                                                            <SelectItem key={a.id} value={a.id}>
                                                                {(a.city || a.state) ? `${a.city ?? ''}${a.city && a.state ? ', ' : ''}${a.state ?? ''}` : a.id}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Latitude (optional)</label>
                                                    <input
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                        value={poiForm.latitude}
                                                        onChange={(e) => setPoiForm((p) => ({ ...p, latitude: e.target.value }))}
                                                        inputMode="decimal"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Longitude (optional)</label>
                                                    <input
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                        value={poiForm.longitude}
                                                        onChange={(e) => setPoiForm((p) => ({ ...p, longitude: e.target.value }))}
                                                        inputMode="decimal"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Images (optional)</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => setPoiForm((p) => ({ ...p, images: Array.from(e.target.files || []) }))}
                                                />
                                                {poiForm.images.length > 0 && (
                                                    <p className="text-xs text-gray-600">Selected: {poiForm.images.length} file(s)</p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={createPOI.isPending || isUploading || linkPOIToItinerary.isPending}
                                                    className="w-fit px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {(createPOI.isPending || isUploading) && <Loader2 size={16} className="animate-spin" />}
                                                    Create & Attach
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPoiDialogMode('select')}
                                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {poiDialogMode === 'select' && (
                                        <>
                                            {availablePOIs.length === 0 ? (
                                                <div className="text-center py-6">
                                                    <MapPin size={32} className="mx-auto mb-2 text-gray-400" />
                                                    <p className="text-sm text-gray-600">No POIs available yet. Use “Create POI”.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 pt-2">
                                                    {availablePOIs.map((poi: any) => {
                                                        const selectedDay = itinerary.find((d: any) => d.dayNumber === selectedDayForPOI)
                                                        const alreadyAdded = selectedDay?.pois?.some((p: any) => p.poiId === poi.id)

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
                                        </>
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
