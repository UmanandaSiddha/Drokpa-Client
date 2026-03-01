'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Upload, X, Trash2 } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { BookingCriteria } from '@/types/homestay'
import { useHomestay, useUpdateHomestay } from '@/hooks/homestays'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import Image from 'next/image'

export default function EditHomestayPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const homestayId = params?.id
    const { data: homestay, isLoading } = useHomestay(homestayId)
    const updateHomestay = useUpdateHomestay()
    const { uploadFiles, isUploading } = useS3Upload()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        phoneNumber: '',
        displayPrice: 0,
        bookingCriteria: BookingCriteria.PER_NIGHT,
        houseRulesText: '',
        safetyText: '',
        isActive: true,
        imageUrls: [] as string[],
    })
    const [uploadingImageNames, setUploadingImageNames] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (!homestay) return
        setFormData({
            name: homestay.name,
            description: homestay.description,
            email: homestay.email,
            phoneNumber: homestay.phoneNumber,
            displayPrice: homestay.displayPrice || 0,
            bookingCriteria: homestay.bookingCriteria,
            houseRulesText: (homestay.houseRules || []).join('\n'),
            safetyText: (homestay.safetyNSecurity || []).join('\n'),
            isActive: homestay.isActive,
            imageUrls: homestay.imageUrls || [],
        })
    }, [homestay])

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
                    houseRules: formData.houseRulesText.split('\n').map((s) => s.trim()).filter(Boolean),
                    safetyNSecurity: formData.safetyText.split('\n').map((s) => s.trim()).filter(Boolean),
                    isActive: formData.isActive,
                    imageUrls: formData.imageUrls,
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name *</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Display Price</label>
                                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.displayPrice} onChange={(e) => setFormData((p) => ({ ...p, displayPrice: Number(e.target.value) }))} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description *</label>
                                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-24" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email *</label>
                                    <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone *</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.phoneNumber} onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Booking Criteria</label>
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium">House Rules (one per line)</label>
                                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20" value={formData.houseRulesText} onChange={(e) => setFormData((p) => ({ ...p, houseRulesText: e.target.value }))} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Safety & Security (one per line)</label>
                                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20" value={formData.safetyText} onChange={(e) => setFormData((p) => ({ ...p, safetyText: e.target.value }))} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium block">Homestay Images</label>
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

                            <label className="inline-flex items-center gap-2 text-sm font-medium">
                                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))} />
                                Active
                            </label>

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
