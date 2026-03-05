'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Upload, X, Search } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { BookingCriteria } from '@/types/homestay'
import { useHomestay, useUpdateHomestay } from '@/hooks/homestays'
import { useAuth } from '@/hooks/auth/useAuth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import Image from 'next/image'
import { useAddresses, useSearchAddresses } from '@/hooks/resources'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { Address } from '@/types/address'
import { useAdminProviders } from '@/hooks/provider'
import { ProviderType } from '@/types/provider'

export default function EditHomestayPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const { isAdmin } = useAuth()
    const homestayId = params?.id
    const { data: homestay, isLoading } = useHomestay(homestayId)
    const updateHomestay = useUpdateHomestay()
    const { uploadFiles, isUploading, uploadProgress, error: uploadError } = useS3Upload()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        phoneNumber: '',
        displayPrice: 0,
        bookingCriteria: BookingCriteria.PER_NIGHT,
        houseRules: [] as string[],
        safetyNSecurity: [] as string[],
        isActive: true,
        imageUrls: [] as string[],
        addressId: '' as string,
        providerId: '' as string,
    })
    const [uploadingImageNames, setUploadingImageNames] = useState<Set<string>>(new Set())

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

    const [providerSearch, setProviderSearch] = useState('')
    const { data: providersData, isLoading: providersLoading } = useAdminProviders(
        { page: 1, limit: 200 },
        isAdmin,
    )
    const allProviders = (providersData as any)?.data || []
    const homestayHostProviders = allProviders.filter((p: any) => Array.isArray(p.type) && p.type.includes(ProviderType.HOMESTAY_HOST))

    const homestayProvider = (homestay as any)?.provider as { id?: string; name?: string; type?: any } | undefined
    const currentProviderId = formData.providerId
    const providerOptions = (() => {
        if (!currentProviderId) return homestayHostProviders
        const alreadyIncluded = homestayHostProviders.some((p: any) => p?.id === currentProviderId)
        if (alreadyIncluded) return homestayHostProviders

        // Ensure the currently assigned provider is present so <Select> can render the selected value.
        const fallback = {
            id: currentProviderId,
            name: homestayProvider?.name || 'Current Provider',
            __missingFromAdminList: true,
        }
        return [fallback, ...homestayHostProviders]
    })()

    const filteredProviders = providerSearch
        ? providerOptions.filter((p: any) =>
            p?.id === currentProviderId ||
            `${p?.name ?? ''} ${p?.id ?? ''}`.toLowerCase().includes(providerSearch.toLowerCase())
        )
        : providerOptions

    const normalizeStringList = (items: string[]) => items.map((s) => (s ?? '').trim()).filter(Boolean)

    const updateStringListItem = (items: string[], index: number, value: string) => {
        const next = [...items]
        next[index] = value
        return next
    }

    const removeStringListItem = (items: string[], index: number) => items.filter((_, i) => i !== index)

    // Address search state (same flow as create)
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

    const { data: addressesData } = useAddresses({
        keyword: debouncedLocationSearch,
        page: 1,
        limit: 100,
    })

    useEffect(() => {
        if (!homestay) return
        setFormData({
            name: homestay.name,
            description: homestay.description,
            email: homestay.email,
            phoneNumber: homestay.phoneNumber,
            displayPrice: homestay.displayPrice || 0,
            bookingCriteria: homestay.bookingCriteria,
            houseRules: homestay.houseRules || [],
            safetyNSecurity: homestay.safetyNSecurity || [],
            isActive: homestay.isActive,
            imageUrls: homestay.imageUrls || [],
            addressId: homestay.addressId || '',
            providerId: (homestay as any)?.providerId || '',
        })

        const addr = (homestay as any)?.address as Address | undefined
        if (addr?.id) {
            setSelectedAddress(addr)
        }
    }, [homestay])

    // Sync text-based search results from useAddresses hook
    useEffect(() => {
        if (debouncedLocationSearch && !showAdvancedSearch) {
            const results = (addressesData as any)?.data || []
            setSearchResults(results)
        } else if (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0) {
            performCoordinateSearch()
        } else {
            setSearchResults([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedLocationSearch, addressesData, showAdvancedSearch])

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

    useEffect(() => {
        if (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0) {
            const searchTimeout = setTimeout(() => {
                performCoordinateSearch()
            }, 300)
            return () => clearTimeout(searchTimeout)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAdvancedSearch, advancedSearch.latitude, advancedSearch.longitude, advancedSearch.radius, debouncedLocationSearch])

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address)
        setFormData((prev) => ({ ...prev, addressId: address.id }))
        setSearchResults([])
        setLocationSearch('')
    }

    const clearSelectedAddress = () => {
        setSelectedAddress(null)
        setFormData((prev) => ({ ...prev, addressId: '' }))
    }

    const handleImageUpload = async (files: FileList) => {
        if (!files.length) return

        const fileArray = Array.from(files)
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateHomestay.mutate(
            {
                id: homestayId,
                data: {
                    name: formData.name,
                    description: formData.description,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    displayPrice: Number(formData.displayPrice),
                    bookingCriteria: formData.bookingCriteria,
                    houseRules: normalizeStringList(formData.houseRules),
                    safetyNSecurity: normalizeStringList(formData.safetyNSecurity),
                    isActive: formData.isActive,
                    imageUrls: formData.imageUrls,
                    addressId: formData.addressId || undefined,
                    ...(isAdmin && formData.providerId ? { providerId: formData.providerId } : {}),
                },
            },
            {
                onSuccess: () => router.push(`/admin/homestays/${homestayId}`),
            }
        )
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/homestays/${homestayId}`}>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-2xl font-bold">Edit Homestay</h1>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[#005246]" />
                        </div>
                    )}

                    {!isLoading && homestay && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                            {/* Schema fields (read-only / admin-only) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input value={homestay.slug || ''} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>Provider</Label>
                                    {isAdmin ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={providerSearch}
                                                onChange={(e) => setProviderSearch(e.target.value)}
                                                placeholder="Search providers (name or id)..."
                                                disabled={providersLoading}
                                            />
                                            <Select
                                                value={formData.providerId}
                                                onValueChange={(value) => setFormData((p) => ({ ...p, providerId: value }))}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={providersLoading ? 'Loading providers...' : 'Select provider'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredProviders.map((p: any) => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.__missingFromAdminList ? `${p.name} (${p.id}) — not in provider list` : `${p.name} (${p.id})`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500">Admin-only: changing provider changes ownership & who can edit this homestay.</p>
                                        </div>
                                    ) : (
                                        <Input value={(homestay as any)?.provider?.name || (homestay as any)?.providerId || ''} disabled />
                                    )}
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Homestay Name *</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Phone Number *</Label>
                                    <Input value={formData.phoneNumber} onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Booking Criteria</Label>
                                    <Select value={formData.bookingCriteria} onValueChange={(value) => setFormData((p) => ({ ...p, bookingCriteria: value as BookingCriteria }))}>
                                        <SelectTrigger className="w-full">
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
                                    <Label>Display Price (₹)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={formData.displayPrice}
                                        onChange={(e) => setFormData((p) => ({ ...p, displayPrice: e.target.value === '' ? 0 : Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center space-x-2 h-10">
                                        <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData((p) => ({ ...p, isActive: checked }))} />
                                        <Label className="cursor-pointer">{formData.isActive ? 'Active' : 'Inactive'}</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-3">
                                <Label>Search & Link to Address (Optional)</Label>

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

                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                    className="text-sm text-[#005246] hover:underline"
                                >
                                    {showAdvancedSearch ? '✕ Hide' : '+ Add'} Advanced Search (Coordinates & Radius)
                                </button>

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
                                                <Link href="/admin/addresses" className="text-sm text-[#005246] hover:underline">
                                                    Go to Address Management →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedAddress && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-green-900">✓ Selected Address:</p>
                                            <p className="text-sm text-green-700 mt-1">
                                                {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}
                                            </p>
                                        </div>
                                        <button type="button" onClick={clearSelectedAddress} className="text-sm text-green-900 hover:underline">
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label>Description *</Label>
                                <Textarea className="min-h-24" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} required />
                            </div>

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

                            <div className="space-y-2">
                                <Label className="block">Homestay Images</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#005246] transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                        className="hidden"
                                        id="homestay-image-upload"
                                        disabled={isUploading}
                                    />
                                    <label
                                        htmlFor="homestay-image-upload"
                                        className="flex flex-col items-center justify-center cursor-pointer"
                                    >
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">
                                            {isUploading ? 'Uploading...' : 'Click to upload homestay images'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                    </label>
                                </div>

                                {uploadingImageNames.size > 0 && (
                                    <div className="space-y-1">
                                        {Array.from(uploadingImageNames).map((name) => (
                                            <div key={name} className="flex items-center gap-2 text-sm text-gray-600">
                                                <Loader2 size={14} className="animate-spin" />
                                                Uploading {name}...
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {uploadProgress.length > 0 && (
                                    <div className="space-y-2">
                                        {uploadProgress.map((item) => (
                                            <div key={item.fileName} className="space-y-1">
                                                <p className="text-sm font-medium text-gray-700">{item.fileName}</p>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-[#005246] h-2 rounded-full transition-all"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">{item.progress}%</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {uploadError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-700">{uploadError}</p>
                                    </div>
                                )}

                                {formData.imageUrls.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mt-4">
                                        {formData.imageUrls.map((url, index) => (
                                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                                                <Image src={url} alt={`Homestay image ${index + 1}`} fill className="object-cover" unoptimized />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={updateHomestay.isPending || isUploading} className="px-5 py-2.5 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center gap-2">
                                    {updateHomestay.isPending && <Loader2 size={16} className="animate-spin" />}
                                    Save Changes
                                </button>
                                <Link href={`/admin/homestays/${homestayId}`}>
                                    <button type="button" className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </RoleGuard>
    )
}
