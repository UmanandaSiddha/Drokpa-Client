'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, X, Upload } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { TourType } from '@/types/tour'
import { useTour, useUpdateTour } from '@/hooks/tours'
import { useAddresses, useTags } from '@/hooks/resources'
import { useGuides } from '@/hooks/guide'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import { useDebounce } from '@/hooks/useDebounce'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function EditTourPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const tourId = params?.id

    const [addressSearch, setAddressSearch] = useState('')
    const debouncedAddressSearch = useDebounce(addressSearch, 500)
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
    })
    const [imageUrls, setImageUrls] = useState<string[]>([])

    const { data: tour, isLoading } = useTour(tourId)
    const updateTour = useUpdateTour()
    const { data: addresses } = useAddresses({ keyword: debouncedAddressSearch })
    const { data: guides } = useGuides()
    const { data: tags } = useTags()
    const { uploadFiles, isUploading } = useS3Upload()

    useEffect(() => {
        if (!tour) return
        setFormData({
            title: tour.title,
            description: tour.description,
            type: tour.type,
            price: tour.basePrice,
            discount: tour.discount,
            duration: tour.duration,
            maxCapacity: tour.maxCapacity,
            about: tour.about || '',
            isActive: tour.isActive,
            tags: tour.tags?.map((t) => t.tagId) || [],
            addressId: tour.addressId || '',
            guideId: tour.guideId || '',
            images: [],
        })
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
            updateTour.mutate(
                {
                    id: tourId,
                    data: {
                        title: formData.title,
                        description: formData.description,
                        type: formData.type,
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
                                    <Select value={formData.type} onValueChange={(value) => setFormData((p) => ({ ...p, type: value as TourType }))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
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
                                <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-10">
                                    {Array.isArray(tags) ? tags.map((tag: any) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => setFormData((p) => ({
                                                ...p,
                                                tags: formData.tags.includes(tag.id)
                                                    ? p.tags.filter((id) => id !== tag.id)
                                                    : [...p.tags, tag.id],
                                            }))}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${formData.tags.includes(tag.id)
                                                ? 'bg-[#005246] text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {tag.label}
                                        </button>
                                    )) : null}
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
                                {addressSearch && addresses?.data && addresses.data.length > 0 && (
                                    <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                                        {addresses.data.map((addr: any) => (
                                            <button
                                                key={addr.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData((p) => ({ ...p, addressId: addr.id }))
                                                    setAddressSearch(`${addr.city}, ${addr.state}`)
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
                                    <div className="text-sm text-gray-600">Selected: {addressSearch || 'Loading...'}</div>
                                )}
                            </div>

                            {formData.type === TourType.TREK && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Guide *</label>
                                    <Select value={formData.guideId} onValueChange={(value) => setFormData((p) => ({ ...p, guideId: value }))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a guide" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(Array.isArray(guides?.data) ? guides?.data : [])?.map((guide: any) => (
                                                <SelectItem key={guide.id} value={guide.id}>
                                                    {guide.firstName} {guide.lastName}
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
                    )}
                </div>
            </div>
        </RoleGuard>
    )
}
