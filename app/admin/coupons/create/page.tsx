'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { CouponApplyTo, CouponType, CouponVisibility } from '@/types/coupon'
import { ProviderType } from '@/types/provider'
import { useCreateCoupon } from '@/hooks/admin'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreateCouponPage() {
    const router = useRouter()
    const createCoupon = useCreateCoupon()
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        type: CouponType.PERCENTAGE,
        visibility: CouponVisibility.PUBLIC,
        applyTo: CouponApplyTo.BOOKING_TOTAL,
        discountValue: 0,
        maxDiscountAmount: '',
        minOrderAmount: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        maxUsesTotal: '',
        maxUsesPerUser: '',
        minParticipants: '',
        applicableProductTypes: [] as string[],
        applicableProductIds: '',
        firstTimeOnly: false,
        isActive: true,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createCoupon.mutate(
            {
                code: formData.code.toUpperCase(),
                description: formData.description || undefined,
                type: formData.type,
                visibility: formData.visibility,
                applyTo: formData.applyTo,
                discountValue: Number(formData.discountValue),
                maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
                minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : undefined,
                validFrom: formData.validFrom,
                validUntil: formData.validUntil || undefined,
                maxUsesTotal: formData.maxUsesTotal ? Number(formData.maxUsesTotal) : undefined,
                maxUsesPerUser: formData.maxUsesPerUser ? Number(formData.maxUsesPerUser) : undefined,
                minParticipants: formData.minParticipants ? Number(formData.minParticipants) : undefined,
                applicableProductTypes: formData.applicableProductTypes.length > 0 ? formData.applicableProductTypes : undefined,
                applicableProductIds: formData.applicableProductIds ? formData.applicableProductIds.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                firstTimeOnly: formData.firstTimeOnly,
                isActive: formData.isActive,
            },
            {
                onSuccess: () => router.push('/admin/coupons'),
            }
        )
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/coupons">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-2xl font-bold">Create Coupon</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Coupon Code *</label>
                                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Discount Value *</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.discountValue} onChange={(e) => setFormData((p) => ({ ...p, discountValue: Number(e.target.value) }))} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-24" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <Select value={formData.type} onValueChange={(value) => setFormData((p) => ({ ...p, type: value as CouponType }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={CouponType.PERCENTAGE}>Percentage</SelectItem>
                                        <SelectItem value={CouponType.FIXED_AMOUNT}>Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Visibility</label>
                                <Select value={formData.visibility} onValueChange={(value) => setFormData((p) => ({ ...p, visibility: value as CouponVisibility }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={CouponVisibility.PUBLIC}>Public</SelectItem>
                                        <SelectItem value={CouponVisibility.PRIVATE}>Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apply To</label>
                                <Select value={formData.applyTo} onValueChange={(value) => setFormData((p) => ({ ...p, applyTo: value as CouponApplyTo }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={CouponApplyTo.BOOKING_TOTAL}>Booking Total</SelectItem>
                                        <SelectItem value={CouponApplyTo.PER_PERSON}>Per Person</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Valid From *</label>
                                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.validFrom} onChange={(e) => setFormData((p) => ({ ...p, validFrom: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Valid Until</label>
                                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.validUntil} onChange={(e) => setFormData((p) => ({ ...p, validUntil: e.target.value }))} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Min Order Amount</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.minOrderAmount} onChange={(e) => setFormData((p) => ({ ...p, minOrderAmount: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Max Discount Amount</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.maxDiscountAmount} onChange={(e) => setFormData((p) => ({ ...p, maxDiscountAmount: e.target.value }))} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Max Uses Total</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.maxUsesTotal} onChange={(e) => setFormData((p) => ({ ...p, maxUsesTotal: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Max Uses Per User</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.maxUsesPerUser} onChange={(e) => setFormData((p) => ({ ...p, maxUsesPerUser: e.target.value }))} />
                            </div>
                        </div>

                        {/* Business Rules Section */}
                        <div className="pt-4 border-t">
                            <h3 className="text-base font-semibold mb-4">Business Rules</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Minimum Participants</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="e.g., 10 (for group discounts)"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={formData.minParticipants}
                                        onChange={(e) => setFormData((p) => ({ ...p, minParticipants: e.target.value }))}
                                    />
                                    <p className="text-xs text-gray-500">Only apply coupon if booking has this many participants or more</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Applicable Product Types</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {Object.values(ProviderType).map((type) => (
                                            <label key={type} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.applicableProductTypes.includes(type)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData((p) => ({ ...p, applicableProductTypes: [...p.applicableProductTypes, type] }))
                                                        } else {
                                                            setFormData((p) => ({ ...p, applicableProductTypes: p.applicableProductTypes.filter(t => t !== type) }))
                                                        }
                                                    }}
                                                />
                                                {type.replace(/_/g, ' ')}
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Restrict coupon to specific product types only</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Applicable Product IDs</label>
                                    <textarea
                                        placeholder="Enter product IDs separated by commas (e.g., uuid1, uuid2, uuid3)"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20"
                                        value={formData.applicableProductIds}
                                        onChange={(e) => setFormData((p) => ({ ...p, applicableProductIds: e.target.value }))}
                                    />
                                    <p className="text-xs text-gray-500">Restrict coupon to specific products only (comma-separated UUIDs)</p>
                                </div>

                                <label className="inline-flex items-center gap-2 text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        checked={formData.firstTimeOnly}
                                        onChange={(e) => setFormData((p) => ({ ...p, firstTimeOnly: e.target.checked }))}
                                    />
                                    First-Time Users Only
                                    <span className="text-xs text-gray-500 font-normal">(Users with no prior confirmed bookings)</span>
                                </label>
                            </div>
                        </div>

                        <label className="inline-flex items-center gap-2 text-sm font-medium">
                            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))} />
                            Active
                        </label>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={createCoupon.isPending} className="px-5 py-2.5 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center gap-2">
                                {createCoupon.isPending && <Loader2 size={16} className="animate-spin" />}
                                Create Coupon
                            </button>
                            <Link href="/admin/coupons">
                                <button type="button" className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </RoleGuard>
    )
}
