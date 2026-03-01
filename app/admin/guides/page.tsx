'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useGuides } from '@/hooks/guide'
import { useCreateGuide } from '@/hooks/guide'
import type { User } from '@/types/auth'
import type { Address } from '@/types/address'
import { useAddresses, useSearchAddresses } from '@/hooks/resources'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import React, { useState } from 'react'
import { Loader2, PersonStanding, Search, MapPin, Star, ExternalLink, Upload, X, AlertCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'
import { UserSearchSelect } from '@/components/admin/UserSearchSelect'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

function GuidesContent() {
    // Form visibility state
    const [isFormOpen, setIsFormOpen] = useState(false);
    // Form state
    const [form, setForm] = useState<{
        bio: string;
        languages: string;
        specialties: string;
        basePricePerDay: number;
        imageUrls: string[];
        addressId?: string;
        isActive: boolean;
    }>({
        bio: '',
        languages: '',
        specialties: '',
        basePricePerDay: 1000,
        imageUrls: [],
        isActive: true,
    });
    // User search state
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    // Address search state
    const [locationSearch, setLocationSearch] = useState('');
    const debouncedLocationSearch = useDebounce(locationSearch, 300);
    const [searchResults, setSearchResults] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [advancedSearch, setAdvancedSearch] = useState({ latitude: 0, longitude: 0, radius: 5 });
    // Image upload state
    const [uploadingImageNames, setUploadingImageNames] = useState<Set<string>>(new Set());
    // Table/search state
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const { data, isLoading, refetch } = useGuides({
        page,
        limit: 20,
        keyword: debouncedSearch || undefined,
    });
    const createGuide = useCreateGuide();

    // Address search hooks
    const { data: addressesData } = useAddresses({
        keyword: debouncedLocationSearch,
        page: 1,
        limit: 100,
    });
    const searchAddresses = useSearchAddresses();

    // S3 Upload hook
    const { uploadFiles, isUploading, uploadProgress: s3UploadProgress, error: s3UploadError } = useS3Upload();

    const resetForm = () => {
        setForm({
            bio: '',
            languages: '',
            specialties: '',
            basePricePerDay: 1000,
            imageUrls: [],
            isActive: true,
        });
        setSelectedUser(null);
        setSelectedAddress(null);
        setLocationSearch('');
        setSearchResults([]);
        setUploadingImageNames(new Set());
        setIsFormOpen(false);
    };

    // Sync text-based search results from useAddresses hook
    React.useEffect(() => {
        if (debouncedLocationSearch && !showAdvancedSearch) {
            const results = addressesData?.data || [];
            setSearchResults(results);
        } else if (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0) {
            performCoordinateSearch();
        } else {
            setSearchResults([]);
        }
    }, [debouncedLocationSearch, addressesData, showAdvancedSearch]);

    // Perform coordinate-based search with optional text filtering
    const performCoordinateSearch = async () => {
        try {
            const coordResults = await searchAddresses.mutateAsync({
                latitude: advancedSearch.latitude,
                longitude: advancedSearch.longitude,
                radius: advancedSearch.radius,
            });
            let results = coordResults;

            if (debouncedLocationSearch) {
                const searchTerm = debouncedLocationSearch.toLowerCase();
                results = results.filter((addr: Address) =>
                    addr.city?.toLowerCase().includes(searchTerm) ||
                    addr.state?.toLowerCase().includes(searchTerm) ||
                    addr.street?.toLowerCase().includes(searchTerm) ||
                    addr.country?.toLowerCase().includes(searchTerm)
                );
            }

            setSearchResults(results);
        } catch (error) {
            console.error('Coordinate search failed:', error);
            setSearchResults([]);
        }
    };

    // Trigger coordinate search when advanced search values change
    React.useEffect(() => {
        if (showAdvancedSearch && advancedSearch.latitude !== 0 && advancedSearch.longitude !== 0) {
            const searchTimeout = setTimeout(() => {
                performCoordinateSearch();
            }, 300);
            return () => clearTimeout(searchTimeout);
        }
    }, [showAdvancedSearch, advancedSearch.latitude, advancedSearch.longitude, advancedSearch.radius, debouncedLocationSearch]);

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
        setForm((prev) => ({ ...prev, addressId: address.id }));
        setSearchResults([]);
        setLocationSearch('');
    };

    // Image upload logic (multi-image, progress, error)
    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray: File[] = Array.from(files);

        // Add animated names to uploading set
        fileArray.forEach(f => setUploadingImageNames(prev => new Set([...prev, f.name])));

        const publicUrls = await uploadFiles(fileArray, 'guides', 'images');

        if (publicUrls.length > 0) {
            setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...publicUrls] }));
        }

        setUploadingImageNames(new Set());
    };

    const handleRemoveImage = (index: number) => {
        setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) {
            alert('Please select a user');
            return;
        }
        if (form.imageUrls.length === 0) {
            alert('Please upload at least one image');
            return;
        }
        createGuide.mutate(
            {
                data: {
                    bio: form.bio,
                    languages: form.languages.split(',').map(l => l.trim()),
                    specialties: form.specialties.split(',').map(s => s.trim()),
                    basePricePerDay: parseInt(String(form.basePricePerDay)) || 0,
                    imageUrls: form.imageUrls,
                    addressId: selectedAddress?.id || undefined,
                    isActive: form.isActive,
                },
                onBehalfOf: selectedUser.id,
            },
            {
                onSuccess: () => {
                    resetForm();
                    refetch();
                },
                onError: (err) => {
                    alert(err?.message || 'Failed to create guide');
                },
            }
        );
    };

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-3xl md:text-4xl font-bold">
                        Local Guides
                    </h1>
                    <p style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }} className="text-gray-600 mt-2">
                        All local guide listings on the platform
                    </p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] transition-colors"
                    >
                        <Plus size={16} />
                        Make User a Guide
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Search guides..."
                        className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                    />
                </div>
            </div>

            {/* Create Guide Form */}
            {isFormOpen && (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Make User a Guide</h2>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* User Search */}
                    <UserSearchSelect
                        value={selectedUser?.id || ''}
                        onSelect={(_: string, user: User) => setSelectedUser(user)}
                        label="Select User *"
                        placeholder="Search user by name or email..."
                        required
                    />
                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio *</Label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={form.bio}
                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg p-3 min-h-24"
                            placeholder="Tell us about this guide's experience and expertise..."
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Languages */}
                        <div className="space-y-2">
                            <Label htmlFor="languages">Languages (comma separated)</Label>
                            <input
                                id="languages"
                                type="text"
                                value={form.languages}
                                onChange={e => setForm(f => ({ ...f, languages: e.target.value }))}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                placeholder="e.g., English, Hindi, Nepali"
                            />
                        </div>
                        {/* Specialties */}
                        <div className="space-y-2">
                            <Label htmlFor="specialties">Specialties (comma separated)</Label>
                            <input
                                id="specialties"
                                type="text"
                                value={form.specialties}
                                onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                placeholder="e.g., Trekking, Photography"
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="basePricePerDay">Base Price Per Day (₹) *</Label>
                        <input
                            id="basePricePerDay"
                            type="number"
                            value={form.basePricePerDay}
                            onChange={e => setForm(f => ({ ...f, basePricePerDay: parseInt(e.target.value) || 0 }))}
                            min={1}
                            step="1"
                            required
                            className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                            placeholder="1000"
                        />
                    </div>
                    {/* Address Search */}
                    <div className="space-y-3">
                        <Label>Search & Link to Address (Optional)</Label>
                        {/* Simple Location Search */}
                        <div className="space-y-2">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={locationSearch}
                                    onChange={e => setLocationSearch(e.target.value)}
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
                                            onChange={e => setAdvancedSearch(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
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
                                            onChange={e => setAdvancedSearch(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
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
                                        onChange={e => setAdvancedSearch(prev => ({ ...prev, radius: parseInt(e.target.value) || 5 }))}
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
                                <p className="text-sm text-green-700 mt-1">{selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state}</p>
                            </div>
                        )}
                    </div>
                    {/* Image Upload */}
                    <div className="space-y-3">
                        <Label>Images * (Minimum 1 required)</Label>
                        {/* Drag & Drop Area */}
                        <div
                            onDragOver={e => {
                                e.preventDefault();
                                e.currentTarget.classList.add('bg-blue-50', 'border-blue-400');
                            }}
                            onDragLeave={e => {
                                e.currentTarget.classList.remove('bg-blue-50', 'border-blue-400');
                            }}
                            onDrop={e => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('bg-blue-50', 'border-blue-400');
                                handleImageUpload(e.dataTransfer.files);
                            }}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={e => handleImageUpload(e.target.files)}
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
                        {s3UploadProgress.length > 0 && (
                            <div className="space-y-2">
                                {s3UploadProgress.map((item) => (
                                    <div key={item.fileName} className="space-y-1">
                                        <p className="text-sm font-medium text-gray-700">{item.fileName}</p>
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
                        {s3UploadError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{s3UploadError}</p>
                            </div>
                        )}
                        {/* Image List */}
                        {form.imageUrls.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">
                                    Uploaded Images ({form.imageUrls.length})
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {form.imageUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Guide ${index + 1}`}
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
                        {form.imageUrls.length === 0 && uploadingImageNames.size === 0 && (
                            <p className="text-xs text-red-600">⚠️ At least one image is required</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex items-center space-x-2 h-10">
                            <Switch
                                checked={form.isActive}
                                onCheckedChange={(checked) => setForm(f => ({ ...f, isActive: checked }))}
                            />
                            <Label className="cursor-pointer">
                                {form.isActive ? 'Active' : 'Inactive'}
                            </Label>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={createGuide.isPending}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] disabled:opacity-50"
                        >
                            {createGuide.isPending && <Loader2 size={16} className="animate-spin" />}
                            Create Guide
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
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
            {!isLoading && data?.data?.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <PersonStanding size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No guides found</h3>
                    <p className="text-gray-600 mb-4">No guide listings match your search.</p>
                    {!isFormOpen && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34]"
                        >
                            <Plus size={16} />
                            Make User a Guide
                        </button>
                    )}
                </div>
            )}

            {/* Guides Table */}
            {!isLoading && data && data.data?.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Provider</th>
                                    <th>Location</th>
                                    <th>Languages</th>
                                    <th>Specialties</th>
                                    <th>Price/Day</th>
                                    <th>Rating</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((guide) => (
                                    <tr key={guide.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: '#f3f4f6',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <PersonStanding size={18} color="#9ca3af" />
                                                </div>
                                                <span style={{ fontWeight: 500 }}>
                                                    {guide.provider?.name || guide.providerId?.slice(0, 8) || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} />
                                                {guide.address?.city || guide.address?.state || guide.addressId?.slice(0, 8) || 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {guide.languages.slice(0, 2).join(', ')}
                                            {guide.languages.length > 2 && ` +${guide.languages.length - 2}`}
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {guide.specialties.length > 0
                                                ? guide.specialties.slice(0, 2).join(', ') + (guide.specialties.length > 2 ? `...` : '')
                                                : '—'
                                            }
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            ₹{guide.basePricePerDay.toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>
                                            {guide.rating ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Star size={12} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                                                    <span>{guide.rating.toFixed(1)}</span>
                                                    <span style={{ color: '#9ca3af' }}>({guide.totalReviews})</span>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#9ca3af' }}>No reviews</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${guide.isActive ? 'active' : 'inactive'}`}>
                                                {guide.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-table__actions">
                                                <Link
                                                    href={`/guides/${guide.id}`}
                                                    target="_blank"
                                                    className="admin-icon-btn admin-icon-btn--secondary"
                                                    title="View guide"
                                                >
                                                    <ExternalLink size={14} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {data.meta && (
                        <div className="admin-pagination">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="admin-pagination__btn"
                            >
                                ← Previous
                            </button>
                            <span className="admin-pagination__info">
                                Page {page} of {data.meta.totalPages} · {data.meta.total} guides
                            </span>
                            <button
                                disabled={page >= data.meta.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="admin-pagination__btn"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


export default function GuidesPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <GuidesContent />
        </RoleGuard>
    )
}
