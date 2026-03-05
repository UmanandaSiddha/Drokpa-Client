'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateTour } from '@/hooks/tours'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { TourType } from '@/types/tour'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import { useTags, useAddresses, useSearchAddresses } from '@/hooks/resources'
import { useGuides } from '@/hooks/guide'
import { useDebounce } from '@/hooks/useDebounce'
import { ArrowLeft, Upload, X, Loader2, AlertCircle, Search, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Address } from '@/types/address'

interface TourFormData {
    title: string
    description: string
    type: TourType
    price: number
    discount: number
    duration: number
    maxCapacity: number
    about: string
    included: string[]
    notIncluded: string[]
    highlights: string[]
    imageUrls: string[]
    isActive: boolean
    brochure?: string
    addressId?: string
    guideId?: string
    tags: string[]
}

export default function CreateTourPage() {
    const router = useRouter()
    const createTour = useCreateTour()
    const { uploadFile, uploadFiles, isUploading, uploadProgress, error: uploadError } = useS3Upload()

    const [formData, setFormData] = useState<TourFormData>({
        title: '',
        description: '',
        type: TourType.TOUR,
        price: 0,
        discount: 0,
        duration: 1,
        maxCapacity: 15,
        about: '',
        included: [],
        notIncluded: [],
        highlights: [],
        imageUrls: [],
        isActive: true,
        tags: [],
        brochure: '',
    })

    // Tags, Address, Guide state
    const [tagSearch, setTagSearch] = useState('')
    const [locationSearch, setLocationSearch] = useState('')
    const [guideSearch, setGuideSearch] = useState('')
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [selectedGuide, setSelectedGuide] = useState<any | null>(null)
    const [showAddressResults, setShowAddressResults] = useState(false)
    const [showGuideResults, setShowGuideResults] = useState(false)
    const [searchResults, setSearchResults] = useState<Address[]>([])
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
    const [advancedSearch, setAdvancedSearch] = useState({
        latitude: 0,
        longitude: 0,
        radius: 5,
    })

    const debouncedTagSearch = useDebounce(tagSearch, 300)
    const debouncedLocationSearch = useDebounce(locationSearch, 300)
    const debouncedGuideSearch = useDebounce(guideSearch, 300)

    // Data fetch hooks
    const { data: tagsData } = useTags({ keyword: debouncedTagSearch, page: 1, limit: 50 })
    const { data: addressesData } = useAddresses({ keyword: debouncedLocationSearch, page: 1, limit: 20 })
    const { data: guidesData } = useGuides({ keyword: debouncedGuideSearch, page: 1, limit: 20 })
    const searchAddresses = useSearchAddresses()

    const handleInputChange = (field: keyof TourFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear guide when type changes from TREK to TOUR
        if (field === 'type' && value === TourType.TOUR) {
            setFormData(prev => ({ ...prev, guideId: undefined }))
            setSelectedGuide(null)
            setGuideSearch('')
        }
    }

    // Sync text-based search results from useAddresses hook
    React.useEffect(() => {
        if (debouncedLocationSearch && !showAdvancedSearch) {
            // Text search only - use hook data
            const results = addressesData?.data || []
            setSearchResults(results)
        } else if (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0) {
            // Advanced coordinate search will be triggered separately
            performCoordinateSearch()
        } else {
            // No search active
            setSearchResults([])
        }
    }, [debouncedLocationSearch, addressesData, showAdvancedSearch])

    // Perform coordinate-based search with optional text filtering
    const performCoordinateSearch = async () => {
        try {
            const coordResults = await searchAddresses.mutateAsync({
                latitude: advancedSearch.latitude,
                longitude: advancedSearch.longitude,
                radius: advancedSearch.radius,
            })
            let results = coordResults

            // If there's also text search, filter coordinate results by text
            if (debouncedLocationSearch) {
                const searchTerm = debouncedLocationSearch.toLowerCase()
                results = results.filter((addr: Address) =>
                    addr.city?.toLowerCase().includes(searchTerm) ||
                    addr.state?.toLowerCase().includes(searchTerm) ||
                    addr.street?.toLowerCase().includes(searchTerm) ||
                    addr.country?.toLowerCase().includes(searchTerm)
                )
            }

            setSearchResults(results)
        } catch (error) {
            console.error('Coordinate search failed:', error)
            setSearchResults([])
        }
    }

    // Trigger coordinate search when advanced search values change
    React.useEffect(() => {
        if (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0) {
            const searchTimeout = setTimeout(() => {
                performCoordinateSearch()
            }, 300)
            return () => clearTimeout(searchTimeout)
        }
    }, [showAdvancedSearch, advancedSearch.latitude, advancedSearch.longitude, advancedSearch.radius, debouncedLocationSearch, searchAddresses])

    // Image Upload Handlers
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const publicUrls = await uploadFiles(files, 'tours', 'images')

        if (publicUrls.length > 0) {
            setFormData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...publicUrls]
            }))
        }
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files)
        if (files.length === 0) return

        const publicUrls = await uploadFiles(files, 'tours', 'images')

        if (publicUrls.length > 0) {
            setFormData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...publicUrls]
            }))
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate at least one image
        if (formData.imageUrls.length === 0) {
            alert('Please upload at least one image')
            return
        }

        const included = (formData.included || []).map((v) => v.trim()).filter(Boolean)
        const notIncluded = (formData.notIncluded || []).map((v) => v.trim()).filter(Boolean)
        const highlights = (formData.highlights || []).map((v) => v.trim()).filter(Boolean)

        const tourData = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            price: formData.price,
            discount: formData.discount,
            duration: formData.duration,
            maxCapacity: formData.maxCapacity,
            about: formData.about || undefined,
            included: included.length > 0 ? included : undefined,
            notIncluded: notIncluded.length > 0 ? notIncluded : undefined,
            highlights: highlights.length > 0 ? highlights : undefined,
            brochure: formData.brochure?.trim() ? formData.brochure.trim() : undefined,
            imageUrls: formData.imageUrls,
            isActive: formData.isActive,
            tags: formData.tags.length > 0 ? formData.tags : undefined,
            addressId: formData.addressId,
            guideId: formData.guideId,
        }

        createTour.mutate(tourData, {
            onSuccess: (created) => {
                router.push(`/admin/tours/${created.id}`)
            },
            onError: (error: any) => {
                console.error('Failed to create tour:', error)
                alert(error?.response?.data?.message || 'Failed to create tour')
            }
        })
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin/tours">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-2xl font-bold">Create Tour</h1>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Tour Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="e.g., Leh-Ladakh Adventure Tour"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Brief description of the tour..."
                                        className="min-h-24"
                                        required
                                    />
                                </div>

                                {/* Type, Duration, Capacity Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type *</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => handleInputChange('type', value as TourType)}
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={TourType.TOUR}>Tour</SelectItem>
                                                <SelectItem value={TourType.TREK}>Trek</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration (days) *</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            min="1"
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maxCapacity">Max Capacity *</Label>
                                        <Input
                                            id="maxCapacity"
                                            type="number"
                                            min="1"
                                            value={formData.maxCapacity}
                                            onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value) || 1)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price">Base Price (₹) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                        required
                                    />
                                </div>

                                {/* Discount */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="discount">Discount (%)</Label>
                                        <Input
                                            id="discount"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discount}
                                            onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                        <p className="text-xs text-gray-500">Discount percentage (0-100)</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Final Price</Label>
                                        <div className="h-10 px-3 border border-gray-300 rounded-lg flex items-center bg-gray-50">
                                            <span className="font-semibold text-green-600">
                                                ₹{Math.round(formData.price - (formData.price * formData.discount) / 100).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">Calculated from base price and discount</p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label>Tags (Optional)</Label>
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={tagSearch}
                                                onChange={(e) => setTagSearch(e.target.value)}
                                                onFocus={() => { }}
                                                placeholder="Search tags (e.g., Adventure, Cultural)..."
                                                className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                                            />
                                        </div>
                                        {tagSearch && tagsData?.data && tagsData.data.length > 0 && (
                                            <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                                                {tagsData.data
                                                    .filter((tag: any) => !formData.tags.includes(tag.label))
                                                    .map((tag: any) => (
                                                        <button
                                                            key={tag.id}
                                                            type="button"
                                                            onClick={() => {
                                                                handleInputChange('tags', [...formData.tags, tag.label])
                                                                setTagSearch('')
                                                            }}
                                                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
                                                        >
                                                            <span className="font-medium">{tag.label}</span>
                                                            {tag.category && <span className="text-xs text-gray-500 ml-2">({tag.category})</span>}
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                        {formData.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleInputChange('tags', formData.tags.filter((_, i) => i !== idx))}
                                                            className="hover:text-blue-900"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label>Location (Optional)</Label>
                                    <div className="space-y-3">
                                        {/* Text Search */}
                                        <div className="relative">
                                            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={locationSearch}
                                                onChange={(e) => {
                                                    setLocationSearch(e.target.value)
                                                    setShowAddressResults(true)
                                                }}
                                                onFocus={() => setShowAddressResults(true)}
                                                placeholder={showAdvancedSearch ? "Filter by name, city, state..." : "Search location..."}
                                                className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                                            />
                                        </div>

                                        {/* Advanced Search Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                            className="text-sm text-[#005246] hover:underline font-medium"
                                        >
                                            {showAdvancedSearch ? '← Back to text search' : 'Advanced: Search by coordinates'}
                                        </button>

                                        {/* Advanced Coordinate Search */}
                                        {showAdvancedSearch && (
                                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-700">Latitude</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={advancedSearch.latitude}
                                                            onChange={(e) => setAdvancedSearch(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                                                            placeholder="e.g., 27.4924"
                                                            className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-700">Longitude</label>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={advancedSearch.longitude}
                                                            onChange={(e) => setAdvancedSearch(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                                                            placeholder="e.g., 88.6468"
                                                            className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-700">Radius (km)</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={advancedSearch.radius}
                                                            onChange={(e) => setAdvancedSearch(prev => ({ ...prev, radius: parseInt(e.target.value) || 5 }))}
                                                            className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Find addresses within {advancedSearch.radius}km of the specified coordinates
                                                </p>
                                            </div>
                                        )}

                                        {/* Search Results */}
                                        {showAddressResults && searchResults.length > 0 && (
                                            <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                                                {searchResults.map((address: Address) => (
                                                    <button
                                                        key={address.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedAddress(address)
                                                            handleInputChange('addressId', address.id)
                                                            setLocationSearch('')
                                                            setShowAddressResults(false)
                                                            setSearchResults([])
                                                        }}
                                                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
                                                    >
                                                        <p className="text-sm font-medium">{address.street || 'Unnamed'} - {address.city}, {address.state}</p>
                                                        <p className="text-xs text-gray-500">{address.country} • {address.latitude?.toFixed(4)}, {address.longitude?.toFixed(4)}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Selected Address Badge */}
                                        {selectedAddress && (
                                            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm w-fit">
                                                <MapPin size={14} className="text-green-600" />
                                                <span>{selectedAddress.city}, {selectedAddress.state}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedAddress(null)
                                                        handleInputChange('addressId', undefined)
                                                    }}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Guide - Only for Treks */}
                                {formData.type === TourType.TREK && (
                                    <div className="space-y-2">
                                        <Label>Assign Guide (Required for Treks)</Label>
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    value={guideSearch}
                                                    onChange={(e) => {
                                                        setGuideSearch(e.target.value)
                                                        setShowGuideResults(true)
                                                    }}
                                                    onFocus={() => setShowGuideResults(true)}
                                                    placeholder="Search guide by name..."
                                                    className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                                                />
                                            </div>
                                            {showGuideResults && guideSearch && guidesData?.data && guidesData.data.length > 0 && (
                                                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                                                    {guidesData.data.map((guide: any) => (
                                                        <button
                                                            key={guide.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedGuide(guide)
                                                                handleInputChange('guideId', guide.id)
                                                                setGuideSearch('')
                                                                setShowGuideResults(false)
                                                            }}
                                                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
                                                        >
                                                            <p className="text-sm font-medium">{guide.provider?.name || 'Guide'}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {guide.languages?.slice(0, 2).join(', ')} • ₹{guide.basePricePerDay}/day
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {selectedGuide && (
                                                <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                                    <span className="font-medium">{selectedGuide.provider?.name || 'Guide'}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedGuide(null)
                                                            handleInputChange('guideId', undefined)
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* About */}
                                <div className="space-y-2">
                                    <Label htmlFor="about">About (Optional)</Label>
                                    <Textarea
                                        id="about"
                                        value={formData.about}
                                        onChange={(e) => handleInputChange('about', e.target.value)}
                                        placeholder="Detailed information about the tour..."
                                        className="min-h-32"
                                    />
                                </div>
                            </div>

                            {/* Tour Details */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold border-b pb-2">Tour Details</h2>

                                {/* Included */}
                                <div className="space-y-2">
                                    <Label>Included</Label>
                                    <div className="space-y-2">
                                        {formData.included.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const next = [...formData.included]
                                                        next[index] = e.target.value
                                                        handleInputChange('included', next)
                                                    }}
                                                    placeholder="Enter included item"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('included', formData.included.filter((_, i) => i !== index))}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('included', [...formData.included, ''])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            + Add Included Item
                                        </button>
                                    </div>
                                </div>

                                {/* Not Included */}
                                <div className="space-y-2">
                                    <Label>Not Included</Label>
                                    <div className="space-y-2">
                                        {formData.notIncluded.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const next = [...formData.notIncluded]
                                                        next[index] = e.target.value
                                                        handleInputChange('notIncluded', next)
                                                    }}
                                                    placeholder="Enter not included item"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('notIncluded', formData.notIncluded.filter((_, i) => i !== index))}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('notIncluded', [...formData.notIncluded, ''])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            + Add Not Included Item
                                        </button>
                                    </div>
                                </div>

                                {/* Highlights */}
                                <div className="space-y-2">
                                    <Label>Highlights</Label>
                                    <div className="space-y-2">
                                        {formData.highlights.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const next = [...formData.highlights]
                                                        next[index] = e.target.value
                                                        handleInputChange('highlights', next)
                                                    }}
                                                    placeholder="Enter highlight"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('highlights', formData.highlights.filter((_, i) => i !== index))}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('highlights', [...formData.highlights, ''])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            + Add Highlight
                                        </button>
                                    </div>
                                </div>

                                {/* Brochure */}
                                <div className="space-y-2">
                                    <Label htmlFor="brochure">Brochure URL (Optional)</Label>
                                    <Input
                                        id="brochure"
                                        value={formData.brochure || ''}
                                        onChange={(e) => handleInputChange('brochure', e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold border-b pb-2">Images *</h2>

                                {/* Upload Area */}
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#005246] transition-colors cursor-pointer"
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="text-[#005246] font-medium">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                    </label>
                                </div>

                                {/* Upload Progress */}
                                {isUploading && uploadProgress.length > 0 && (
                                    <div className="space-y-2">
                                        {uploadProgress.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-700">{item.fileName}</span>
                                                        <span className="text-gray-500">{item.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-[#005246] h-2 rounded-full transition-all"
                                                            style={{ width: `${item.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Error */}
                                {uploadError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                                        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700">{uploadError}</p>
                                    </div>
                                )}

                                {/* Image List */}
                                {formData.imageUrls.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">
                                            Uploaded Images ({formData.imageUrls.length})
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {formData.imageUrls.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Tour image ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                />
                                <Label htmlFor="isActive" className="cursor-pointer">
                                    Active (visible to users)
                                </Label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={createTour.isPending || isUploading || formData.imageUrls.length === 0}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                >
                                    {createTour.isPending && <Loader2 size={18} className="animate-spin" />}
                                    Create Tour
                                </button>
                                <Link href="/admin/tours">
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}
