'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { usePOIs, useCreatePOI, useUpdatePOI, useDeletePOI, useSearchAddresses, useAddresses } from '@/hooks/resources'
import React, { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import { Loader2, Plus, MapPin, Edit2, Trash2, X, Image as ImageIcon, Search, ChevronLeft, ChevronRight, Upload, AlertCircle } from 'lucide-react'
import type { Address } from '@/types/address'

export default function POIsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingPOI, setEditingPOI] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [page, setPage] = useState(1)
    const [form, setForm] = useState({
        name: '',
        description: '',
        specialty: '',
        imageUrls: [] as string[],
        latitude: 0,
        longitude: 0,
        addressId: '',
    })
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const { uploadFiles, isUploading, uploadProgress, error: uploadError } = useS3Upload()

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

    // Text-based address search hook - searches all addresses by keyword
    const { data: addressesData, isLoading: addressesLoading } = useAddresses({
        keyword: debouncedLocationSearch,
        page: 1,
        limit: 100,
    })

    const { data: poisData, isLoading } = usePOIs({ keyword: debouncedSearch, page, limit: 20 })
    const pois = poisData?.data || []
    const meta = poisData?.meta
    const createPOI = useCreatePOI()
    const updatePOI = useUpdatePOI()
    const deletePOI = useDeletePOI()

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            specialty: '',
            imageUrls: [],
            latitude: 0,
            longitude: 0,
            addressId: '',
        })
        setSelectedAddress(null)
        setLocationSearch('')
        setSearchResults([])
        setShowAdvancedSearch(false)
        setAdvancedSearch({ latitude: 0, longitude: 0, radius: 5 })
        setEditingPOI(null)
        setIsFormOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (form.imageUrls.length === 0) {
            alert('Please upload at least one image')
            return
        }

        const processedData = {
            ...form,
            specialty: form.specialty.split(',').map(s => s.trim()).filter(s => s),
        }

        if (editingPOI) {
            updatePOI.mutate(
                { id: editingPOI.id, data: processedData },
                { onSuccess: resetForm }
            )
        } else {
            createPOI.mutate(processedData, { onSuccess: resetForm })
        }
    }

    const startEdit = (poi: any) => {
        setEditingPOI(poi)
        setForm({
            name: poi.name,
            description: poi.description || '',
            specialty: poi.specialty || '',
            imageUrls: poi.imageUrls || [],
            latitude: poi.latitude,
            longitude: poi.longitude,
            addressId: poi.addressId || '',
        })
        setIsFormOpen(true)
    }

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Delete POI "${name}"? This will remove it from all tour itineraries.`)) {
            deletePOI.mutate(id)
        }
    }

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address)
        setForm(prev => ({
            ...prev,
            addressId: address.id,
            latitude: address.latitude,
            longitude: address.longitude,
        }))
        setSearchResults([])
        setLocationSearch('')
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

    const handleImageUpload = async (files: FileList) => {
        if (!files.length) return

        const fileArray = Array.from(files)
        const publicUrls = await uploadFiles(fileArray, 'poi', 'images')

        if (publicUrls.length > 0) {
            setForm(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...publicUrls],
            }))
        }
    }

    const removeImageUrl = (index: number) => {
        setForm(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        }))
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.GUIDE]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-3xl md:text-4xl font-bold">
                            Points of Interest
                        </h1>
                        <p style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }} className="text-gray-600 mt-2">
                            Manage global POIs for tour itineraries
                        </p>
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] transition-colors"
                        >
                            <Plus size={16} />
                            Add POI
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Search by name or specialty..."
                            className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                        />
                    </div>
                </div>

                {/* Form */}
                {isFormOpen && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{editingPOI ? 'Edit POI' : 'Create New POI'}</h2>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">POI Name *</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., Rumtek Monastery"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg resize-none"
                                    placeholder="Brief description of the POI"
                                />
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-sm font-medium">Search & Link to Address (Optional)</label>

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
                                        <p className="text-xs text-blue-700 font-medium">Narrow search results by location coordinates and radius</p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-700">Latitude</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={advancedSearch.latitude}
                                                    onChange={(e) => setAdvancedSearch(prev => ({
                                                        ...prev,
                                                        latitude: parseFloat(e.target.value) || 0
                                                    }))}
                                                    className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                                                    placeholder="e.g., 27.3389"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-700">Longitude</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={advancedSearch.longitude}
                                                    onChange={(e) => setAdvancedSearch(prev => ({
                                                        ...prev,
                                                        longitude: parseFloat(e.target.value) || 0
                                                    }))}
                                                    className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                                                    placeholder="e.g., 88.6065"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-700">Radius (km)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                value={advancedSearch.radius}
                                                onChange={(e) => setAdvancedSearch(prev => ({
                                                    ...prev,
                                                    radius: parseFloat(e.target.value) || 5
                                                }))}
                                                className="w-full h-9 px-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>

                                        <p className="text-xs text-blue-600">Results update automatically as you change coordinates</p>
                                    </div>
                                )}

                                {/* Search Results */}
                                {(debouncedLocationSearch || (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0)) && (
                                    <div className="space-y-2">
                                        {searchResults.length > 0 ? (
                                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                                                <p className="text-xs font-medium text-gray-700 px-2 py-1">
                                                    Found {searchResults.length} address(es)
                                                </p>
                                                {searchResults.map((addr) => (
                                                    <button
                                                        key={addr.id}
                                                        type="button"
                                                        onClick={() => handleAddressSelect(addr)}
                                                        className={`w-full text-left px-2 py-2 rounded text-sm transition-colors ${selectedAddress?.id === addr.id
                                                            ? 'bg-[#005246]/20 border border-[#005246]'
                                                            : 'hover:bg-gray-100 border border-transparent'
                                                            }`}
                                                    >
                                                        <div className="font-medium text-gray-900">
                                                            {addr.street ? `${addr.street}, ` : ''}{addr.city}, {addr.state}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {addr.country} {addr.postalCode && `• ${addr.postalCode}`}
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-mono">
                                                            📍 {addr.latitude.toFixed(6)}, {addr.longitude.toFixed(6)}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
                                                <p className="text-sm font-medium text-amber-900 mb-2">No locations found</p>
                                                <p className="text-xs text-amber-800 mb-3">
                                                    Try adjusting your search or create a new address
                                                </p>
                                                <a
                                                    href="/admin/addresses"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded hover:bg-amber-200 transition-colors"
                                                >
                                                    Create New Address →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedAddress && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-xs font-medium text-green-700">✓ Selected Address:</p>
                                        <p className="text-sm text-green-900 mt-1">
                                            {selectedAddress.street ? `${selectedAddress.street}, ` : ''}{selectedAddress.city}, {selectedAddress.state}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Auto-populated Coordinates */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Latitude (Auto-populated)</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={form.latitude}
                                    readOnly
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                    placeholder="Auto-filled from address"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Longitude (Auto-populated)</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={form.longitude}
                                    readOnly
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                    placeholder="Auto-filled from address"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Specialty</label>
                                <textarea
                                    value={form.specialty}
                                    onChange={(e) => setForm(prev => ({ ...prev, specialty: e.target.value }))}
                                    className="w-full h-16 px-3 py-2 border border-gray-300 rounded-lg resize-none"
                                    placeholder="e.g., Buddhist Temple, Scenic View, Historical Significance"
                                />
                                <p className="text-xs text-gray-500">Describe the specialty or category of this POI</p>
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-sm font-medium">Images *</label>

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
                                        id="poi-image-input"
                                    />
                                    <label htmlFor="poi-image-input" className="cursor-pointer block">
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
                                {form.imageUrls.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">
                                            Uploaded Images ({form.imageUrls.length})
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {form.imageUrls.map((url, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`POI ${idx + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageUrl(idx)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {form.imageUrls.length === 0 && !isUploading && (
                                    <p className="text-xs text-red-600">⚠️ At least one image is required</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createPOI.isPending || updatePOI.isPending || isUploading || form.imageUrls.length === 0}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {(createPOI.isPending || updatePOI.isPending) && <Loader2 size={16} className="animate-spin" />}
                                {editingPOI ? 'Update' : 'Create'} POI
                            </button>
                        </div>
                    </form>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-[#005246]" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && pois.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No POI yet</h3>
                        <p className="text-gray-600 mb-4">Create your first Point of Interest to get started.</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34]"
                        >
                            <Plus size={16} />
                            Add First POI
                        </button>
                    </div>
                )}

                {/* POIs Grid */}
                {!isLoading && pois.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pois.map((poi: any) => (
                                <div
                                    key={poi.id}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {poi.imageUrls?.[0] ? (
                                        <img
                                            src={poi.imageUrls[0]}
                                            alt={poi.name}
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                            <ImageIcon size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">{poi.name}</h3>
                                        {poi.description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{poi.description}</p>
                                        )}
                                        {poi.specialty && poi.specialty.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {poi.specialty.slice(0, 3).map((tag: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded-md bg-[#005246]/10 text-[#005246] text-xs"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {poi.specialty.length > 3 && (
                                                    <span className="px-2 py-0.5 text-gray-500 text-xs">
                                                        +{poi.specialty.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <MapPin size={12} />
                                            <span className="font-mono">
                                                {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(poi)}
                                                className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                                            >
                                                <Edit2 size={14} className="inline mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(poi.id, poi.name)}
                                                className="flex-1 px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 size={14} className="inline mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                <div className="text-sm text-gray-600">
                                    Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} POIs
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                                            let pageNum: number
                                            if (meta.totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (page <= 3) {
                                                pageNum = i + 1
                                            } else if (page >= meta.totalPages - 2) {
                                                pageNum = meta.totalPages - 4 + i
                                            } else {
                                                pageNum = page - 2 + i
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`w-9 h-9 rounded-md ${page === pageNum
                                                        ? 'bg-[#005246] text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                        disabled={page === meta.totalPages}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </RoleGuard>
    )
}
