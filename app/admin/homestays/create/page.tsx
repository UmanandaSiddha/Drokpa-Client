'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { useCreateHomestay } from '@/hooks/homestays'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { BookingCriteria } from '@/types/homestay'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import { useAddresses, useSearchAddresses } from '@/hooks/resources'
import { useDebounce } from '@/hooks/useDebounce'
import { ArrowLeft, Upload, X, Loader2, AlertCircle, Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { UserSearchSelect } from '@/components/admin/UserSearchSelect'
import type { User } from '@/types/auth'
import type { Address } from '@/types/address'

interface HomestayFormData {
    name: string
    description: string
    email: string
    phoneNumber: string
    houseRules: string[]
    safetyNSecurity: string[]
    displayPrice: number
    bookingCriteria: BookingCriteria
    imageUrls: string[]
    addressId?: string
    isActive: boolean
    onBehalfOf?: string
}

export default function CreateHomestayPage() {
    const router = useRouter()
    const { isAdmin } = useAuth()
    const { mutate: createHomestay, isPending } = useCreateHomestay()
    const { uploadFiles, isUploading, uploadProgress, error: uploadError } = useS3Upload()

    const normalizeStringList = (items: string[]) => items.map((s) => (s ?? '').trim()).filter(Boolean)

    const updateStringListItem = (items: string[], index: number, value: string) => {
        const next = [...items]
        next[index] = value
        return next
    }

    const removeStringListItem = (items: string[], index: number) => items.filter((_, i) => i !== index)

    const [formData, setFormData] = useState<HomestayFormData>({
        name: '',
        description: '',
        email: '',
        phoneNumber: '',
        houseRules: [],
        safetyNSecurity: [],
        displayPrice: 0,
        bookingCriteria: BookingCriteria.PER_NIGHT,
        imageUrls: [],
        isActive: true,
    })

    const [selectedHost, setSelectedHost] = useState<User | null>(null)
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [uploadingImageNames, setUploadingImageNames] = useState<Set<string>>(new Set())

    // Address search state
    const [locationSearch, setLocationSearch] = useState('')
    const debouncedLocationSearch = useDebounce(locationSearch, 500)
    const [searchResults, setSearchResults] = useState<Address[]>([])
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
    const [advancedSearch, setAdvancedSearch] = useState({
        latitude: 0,
        longitude: 0,
        radius: 5,
    })
    const searchAddresses = useSearchAddresses()

    // Text-based address search hook
    const { data: addressesData, isLoading: addressesLoading } = useAddresses({
        keyword: debouncedLocationSearch,
        page: 1,
        limit: 100,
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'displayPrice' ? (value === '' ? 0 : parseInt(value)) : value,
        }))
    }

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            bookingCriteria: value as BookingCriteria,
        }))
    }

    const handleImageUpload = async (files: FileList) => {
        if (!files.length) return

        const fileArray = Array.from(files)

        // Add animated names to uploading set
        fileArray.forEach(f => setUploadingImageNames(prev => new Set([...prev, f.name])))

        const publicUrls = await uploadFiles(fileArray, 'homestays', 'images')

        if (publicUrls.length > 0) {
            setFormData((prev) => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...publicUrls],
            }))
        }

        setUploadingImageNames(new Set())
    }

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        }))
    }

    const handleHostSelect = (userId: string, user: User) => {
        setSelectedHost(user)
        setFormData((prev) => ({
            ...prev,
            onBehalfOf: userId,
        }))
    }

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address)
        setFormData((prev) => ({
            ...prev,
            addressId: address.id,
        }))
        setSearchResults([])
        setLocationSearch('')
    }

    // Sync text-based search results from useAddresses hook
    React.useEffect(() => {
        if (debouncedLocationSearch && !showAdvancedSearch) {
            const results = addressesData?.data || []
            setSearchResults(results)
        } else if (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0) {
            performCoordinateSearch()
        } else {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.imageUrls.length === 0) {
            alert('Please upload at least one image')
            return
        }

        if (isAdmin && !selectedHost) {
            alert('Please select a host user')
            return
        }

        const { onBehalfOf, ...dataWithoutOnBehalfOf } = formData

        const payload = {
            ...dataWithoutOnBehalfOf,
            houseRules: normalizeStringList(formData.houseRules),
            safetyNSecurity: normalizeStringList(formData.safetyNSecurity),
        }

        createHomestay(
            { data: payload, onBehalfOf },
            {
                onSuccess: (created) => {
                    router.push(`/admin/homestays/${created.id}`)
                },
            }
        )
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin/homestays">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-2xl font-bold">Create Homestay</h1>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Admin: Select Host User */}
                            {isAdmin && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <UserSearchSelect
                                        value={formData.onBehalfOf || ''}
                                        onSelect={handleHostSelect}
                                        label="Select Host User *"
                                        placeholder="Search host by name or email..."
                                        required
                                    />
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Homestay Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Cozy Mountain Retreat"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contact@homestay.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bookingCriteria">Booking Criteria</Label>
                                    <Select value={formData.bookingCriteria} onValueChange={handleSelectChange}>
                                        <SelectTrigger id="bookingCriteria">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={BookingCriteria.PER_NIGHT}>Per Night</SelectItem>
                                            <SelectItem value={BookingCriteria.PER_PERSON}>Per Person</SelectItem>
                                            <SelectItem value={BookingCriteria.HYBRID}>Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayPrice">Display Price (₹)</Label>
                                    <Input
                                        id="displayPrice"
                                        name="displayPrice"
                                        type="number"
                                        value={formData.displayPrice}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center space-x-2 h-10">
                                        <Switch
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) =>
                                                setFormData((prev) => ({ ...prev, isActive: checked }))
                                            }
                                        />
                                        <Label className="cursor-pointer">
                                            {formData.isActive ? 'Active' : 'Inactive'}
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Search & Link to Address (Optional)</Label>

                                {/* Simple Location Search */}
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            placeholder="Search by city, state, country, or address..."
                                            className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Searches all available locations in the database</p>
                                </div>

                                {/* Advanced Search Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                    className="text-sm text-[#005246] hover:underline"
                                >
                                    {showAdvancedSearch ? '✕ Hide' : '+ Add'} Advanced Search (Coordinates & Radius)
                                </button>

                                {/* Advanced Search Fields */}
                                {showAdvancedSearch && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                                        <p className="text-sm font-medium text-blue-900">Search by Coordinates</p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-700">Latitude</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={advancedSearch.latitude}
                                                    onChange={(e) => setAdvancedSearch(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="27.3389"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-700">Longitude</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={advancedSearch.longitude}
                                                    onChange={(e) => setAdvancedSearch(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="88.6065"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-700">Search Radius (km)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={advancedSearch.radius}
                                                onChange={(e) => setAdvancedSearch(prev => ({ ...prev, radius: parseInt(e.target.value) || 5 }))}
                                                className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="5"
                                            />
                                        </div>

                                        <p className="text-xs text-blue-700">💡 Enter coordinates and radius to search nearby addresses</p>
                                    </div>
                                )}

                                {/* Search Results */}
                                {(debouncedLocationSearch || (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0)) && (
                                    <div className="space-y-2">
                                        {searchResults.length > 0 ? (
                                            <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                                                {searchResults.map((address) => (
                                                    <button
                                                        key={address.id}
                                                        type="button"
                                                        onClick={() => handleAddressSelect(address)}
                                                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
                                                    >
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {address.street || 'Unnamed'} - {address.city}, {address.state}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {address.country} • {address.postalCode || 'N/A'}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                                                <p className="text-sm text-gray-600 mb-2">No addresses found</p>
                                                <Link
                                                    href="/admin/addresses"
                                                    className="text-sm text-[#005246] hover:underline"
                                                >
                                                    Go to Address Management →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedAddress && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm font-medium text-green-900">✓ Selected Address:</p>
                                        <p className="text-sm text-green-700 mt-1">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}</p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the homestay, its amenities, and unique features..."
                                    required
                                    className="min-h-24"
                                />
                            </div>

                            {/* House Rules */}
                            <div className="space-y-2">
                                <Label>House Rules</Label>
                                <div className="space-y-2">
                                    {formData.houseRules.length > 0 ? (
                                        formData.houseRules.map((rule, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    value={rule}
                                                    onChange={(e) =>
                                                        setFormData((p) => ({
                                                            ...p,
                                                            houseRules: updateStringListItem(p.houseRules, idx, e.target.value),
                                                        }))
                                                    }
                                                    placeholder="e.g. No smoking"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, houseRules: removeStringListItem(p.houseRules, idx) }))}
                                                    className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
                                                    aria-label="Remove rule"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No rules added.</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setFormData((p) => ({ ...p, houseRules: [...p.houseRules, ''] }))}
                                        className="text-sm text-[#005246] hover:underline"
                                    >
                                        + Add rule
                                    </button>
                                </div>
                            </div>

                            {/* Safety & Security */}
                            <div className="space-y-2">
                                <Label>Safety & Security</Label>
                                <div className="space-y-2">
                                    {formData.safetyNSecurity.length > 0 ? (
                                        formData.safetyNSecurity.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) =>
                                                        setFormData((p) => ({
                                                            ...p,
                                                            safetyNSecurity: updateStringListItem(p.safetyNSecurity, idx, e.target.value),
                                                        }))
                                                    }
                                                    placeholder="e.g. CCTV in common areas"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, safetyNSecurity: removeStringListItem(p.safetyNSecurity, idx) }))}
                                                    className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
                                                    aria-label="Remove item"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No safety items added.</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setFormData((p) => ({ ...p, safetyNSecurity: [...p.safetyNSecurity, ''] }))}
                                        className="text-sm text-[#005246] hover:underline"
                                    >
                                        + Add safety item
                                    </button>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <Label>Images * (Minimum 1 required)</Label>

                                {/* Drag & Drop Area */}
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        e.currentTarget.classList.add('bg-blue-50', 'border-blue-400')
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove('bg-blue-50', 'border-blue-400')
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        e.currentTarget.classList.remove('bg-blue-50', 'border-blue-400')
                                        handleImageUpload(e.dataTransfer.files)
                                    }}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files!)}
                                        className="hidden"
                                        id="image-input"
                                    />
                                    <label htmlFor="image-input" className="cursor-pointer block">
                                        <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-700">
                                            Drag & drop images or click to browse
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supported formats: JPG, PNG, WebP (Max 10MB each)
                                        </p>
                                    </label>
                                </div>

                                {/* Upload Progress */}
                                {uploadProgress.length > 0 && (
                                    <div className="space-y-2">
                                        {uploadProgress.map((item) => (
                                            <div key={item.fileName} className="space-y-1">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {item.fileName}
                                                </p>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">{item.progress}%</p>
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
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {formData.imageUrls.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Homestay ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.imageUrls.length === 0 && !isUploading && (
                                    <p className="text-xs text-red-600">⚠️ At least one image is required</p>
                                )}
                            </div>

                            {/* Submit & Cancel */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Link href="/admin/homestays" className="flex-1">
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isPending || isUploading || (isAdmin && !selectedHost)}
                                    className="flex-1 px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Homestay'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}
