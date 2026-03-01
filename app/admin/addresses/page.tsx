'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSearchAddresses } from '@/hooks/resources'
import { useState } from 'react'
import { Loader2, Plus, MapPin, Edit2, Trash2, X, Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function AddressesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [page, setPage] = useState(1)
    const [form, setForm] = useState({
        street: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        latitude: 0,
        longitude: 0,
    })
    const [coordSearchResults, setCoordSearchResults] = useState<any[]>([])
    const [hasSearchedCoords, setHasSearchedCoords] = useState(false)

    const { data, isLoading } = useAddresses({ keyword: debouncedSearch, page, limit: 20 })
    const addresses = data?.data || []
    const meta = data?.meta
    const createAddress = useCreateAddress()
    const updateAddress = useUpdateAddress()
    const deleteAddress = useDeleteAddress()
    const searchAddresses = useSearchAddresses()

    const resetForm = () => {
        setForm({
            street: '',
            city: '',
            state: '',
            country: 'India',
            postalCode: '',
            latitude: 0,
            longitude: 0,
        })
        setCoordSearchResults([])
        setHasSearchedCoords(false)
        setEditingAddress(null)
        setIsFormOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingAddress) {
            updateAddress.mutate(
                { id: editingAddress.id, data: form },
                { onSuccess: resetForm }
            )
        } else {
            createAddress.mutate(form, { onSuccess: resetForm })
        }
    }

    const startEdit = (address: any) => {
        setEditingAddress(address)
        setForm({
            street: address.street || '',
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode || '',
            latitude: address.latitude,
            longitude: address.longitude,
        })
        setCoordSearchResults([])
        setHasSearchedCoords(false)
        setIsFormOpen(true)
    }

    const handleDelete = (id: string, city: string) => {
        if (confirm(`Delete address in ${city}? This will affect all associated tours and homestays.`)) {
            deleteAddress.mutate(id)
        }
    }

    const handleSearchByCoords = async () => {
        if (!form.latitude || !form.longitude) return
        try {
            const results = await searchAddresses.mutateAsync({
                latitude: form.latitude,
                longitude: form.longitude
            })
            setCoordSearchResults(results)
            setHasSearchedCoords(true)
        } catch (error) {
            console.error('Coordinate search failed:', error)
            setCoordSearchResults([])
            setHasSearchedCoords(true)
        }
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                {/* Header */}
                <div>
                    <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-3xl md:text-4xl font-bold">
                        Addresses
                    </h1>
                    <p style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }} className="text-gray-600 mt-2">
                        Manage global address locations (no duplicates allowed)
                    </p>
                </div>

                {/* Search Bar */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setPage(1) // Reset to page 1 on search
                            }}
                            placeholder="Search by city, state, or country..."
                            className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                        />
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] transition-colors"
                        >
                            <Plus size={16} />
                            Add Address
                        </button>
                    )}
                </div>

                {/* Form */}
                {isFormOpen && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{editingAddress ? 'Edit Address' : 'Create New Address'}</h2>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                            <strong>Note:</strong> Before creating, search for existing addresses with similar coordinates to avoid duplicates.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Latitude * (Decimal)</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={form.latitude}
                                    onChange={(e) => setForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., 27.3389"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Longitude * (Decimal)</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={form.longitude}
                                    onChange={(e) => setForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., 88.6065"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleSearchByCoords}
                                    disabled={!form.latitude || !form.longitude || searchAddresses.isPending}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-[#005246] text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50"
                                >
                                    {searchAddresses.isPending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                                    Search for Matching Coordinates
                                </button>
                            </div>

                            {/* Coordinate Search Results */}
                            {hasSearchedCoords && (
                                <div className="md:col-span-2">
                                    {coordSearchResults.length > 0 ? (
                                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-orange-900">
                                                        Found {coordSearchResults.length} address{coordSearchResults.length !== 1 ? 'es' : ''} with similar coordinates
                                                    </p>
                                                    <p className="text-sm text-orange-800 mt-1">
                                                        Please check if any of these match before creating a duplicate:
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {coordSearchResults.map((result: any) => (
                                                    <div key={result.id} className="p-3 bg-white border border-orange-200 rounded">
                                                        <div className="font-medium text-gray-900">
                                                            {result.street ? `${result.street}, ` : ''}{result.city}, {result.state}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {result.country} {result.postalCode && `• ${result.postalCode}`}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 font-mono">
                                                            📍 {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-orange-700 font-medium">
                                                ⚠️ If this is a duplicate, please edit the existing address instead. Continue only if this is genuinely a new location.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                            <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-green-900">No duplicate addresses found</p>
                                                <p className="text-sm text-green-800 mt-1">
                                                    These coordinates are unique. You can proceed to create this address.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Street</label>
                                <input
                                    value={form.street}
                                    onChange={(e) => setForm(prev => ({ ...prev, street: e.target.value }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="Street address"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">City *</label>
                                <input
                                    value={form.city}
                                    onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., Gangtok"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">State *</label>
                                <input
                                    value={form.state}
                                    onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., Sikkim"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country *</label>
                                <input
                                    value={form.country}
                                    onChange={(e) => setForm(prev => ({ ...prev, country: e.target.value }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="India"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Postal Code</label>
                                <input
                                    value={form.postalCode}
                                    onChange={(e) => setForm(prev => ({ ...prev, postalCode: e.target.value }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., 737101"
                                />
                            </div>
                        </div>

                        {/* Submit Warning */}
                        {!editingAddress && !hasSearchedCoords && form.latitude && form.longitude && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-900">Duplicate Check Required</p>
                                    <p className="text-sm text-red-800 mt-1">
                                        Please search for matching coordinates above before creating this address to prevent duplicates.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={createAddress.isPending || updateAddress.isPending}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] disabled:opacity-50"
                            >
                                {(createAddress.isPending || updateAddress.isPending) && <Loader2 size={16} className="animate-spin" />}
                                {editingAddress ? 'Update' : 'Create'} Address
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
                {!isLoading && addresses.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No addresses found</h3>
                        <p className="text-gray-600 mb-4">Create your first address location.</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34]"
                        >
                            <Plus size={16} />
                            Add First Address
                        </button>
                    </div>
                )}

                {/* Addresses List */}
                {!isLoading && addresses.length > 0 && (
                    <>
                        <div className="space-y-3">
                            {addresses.map((address: any) => (
                                <div
                                    key={address.id}
                                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#005246]/10 text-[#005246] flex items-center justify-center shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {address.street ? `${address.street}, ` : ''}{address.city}, {address.state}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {address.country} {address.postalCode && `• ${address.postalCode}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2 font-mono">
                                                        📍 {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(address)}
                                                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                                                        title="Edit address"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(address.id, address.city)}
                                                        className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                                                        title="Delete address"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                <div className="text-sm text-gray-600">
                                    Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} addresses
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
