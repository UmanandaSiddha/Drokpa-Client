'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/admin'
import { CouponType, CouponVisibility, CouponApplyTo, type Coupon, type CreateCouponRequest } from '@/types/coupon'
import { useState } from 'react'
import { Loader2, Plus, Trash2, Edit2, Search, X } from 'lucide-react'

function CouponForm({ coupon, onClose }: { coupon?: Coupon; onClose: () => void }) {
    const create = useCreateCoupon()
    const update = useUpdateCoupon()
    const isLoading = create.isPending || update.isPending

    const [formData, setFormData] = useState<CreateCouponRequest>(coupon ? {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        visibility: coupon.visibility,
        applyTo: coupon.applyTo,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
        minOrderAmount: coupon.minOrderAmount,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        maxUsesTotal: coupon.maxUsesTotal,
        maxUsesPerUser: coupon.maxUsesPerUser,
        allowedRoles: coupon.allowedRoles,
        rules: coupon.rules,
        isActive: coupon.isActive,
    } : {
        code: '',
        type: CouponType.PERCENTAGE,
        visibility: CouponVisibility.PUBLIC,
        applyTo: CouponApplyTo.BOOKING_TOTAL,
        discountValue: 0,
        validFrom: new Date().toISOString().split('T')[0],
        isActive: true,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (coupon) {
            update.mutate({
                id: coupon.id,
                data: formData,
            }, {
                onSuccess: () => onClose(),
            })
        } else {
            create.mutate(formData, {
                onSuccess: () => onClose(),
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form__group">
                <label className="admin-form__label">Coupon Code</label>
                <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SUMMER20"
                    className="admin-form__input"
                    disabled={!!coupon}
                    required
                />
            </div>

            <div className="admin-form__group">
                <label className="admin-form__label">Description</label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add optional description"
                    className="admin-form__textarea"
                />
            </div>

            <div className="admin-form__row">
                <div className="admin-form__group">
                    <label className="admin-form__label">Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as CouponType })}
                        className="admin-form__input"
                    >
                        <option value={CouponType.PERCENTAGE}>Percentage (%)</option>
                        <option value={CouponType.FIXED_AMOUNT}>Fixed Amount (₹)</option>
                    </select>
                </div>

                <div className="admin-form__group">
                    <label className="admin-form__label">Discount Value</label>
                    <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) })}
                        placeholder="e.g., 20"
                        className="admin-form__input"
                        required
                    />
                </div>
            </div>

            <div className="admin-form__row">
                <div className="admin-form__group">
                    <label className="admin-form__label">Visibility</label>
                    <select
                        value={formData.visibility}
                        onChange={(e) => setFormData({ ...formData, visibility: e.target.value as CouponVisibility })}
                        className="admin-form__input"
                    >
                        <option value={CouponVisibility.PUBLIC}>Public</option>
                        <option value={CouponVisibility.PRIVATE}>Private</option>
                    </select>
                </div>

                <div className="admin-form__group">
                    <label className="admin-form__label">Apply To</label>
                    <select
                        value={formData.applyTo}
                        onChange={(e) => setFormData({ ...formData, applyTo: e.target.value as CouponApplyTo })}
                        className="admin-form__input"
                    >
                        <option value={CouponApplyTo.BOOKING_TOTAL}>Booking Total</option>
                        <option value={CouponApplyTo.PER_PERSON}>Per Person</option>
                    </select>
                </div>
            </div>

            <div className="admin-form__row">
                <div className="admin-form__group">
                    <label className="admin-form__label">Valid From</label>
                    <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                        className="admin-form__input"
                        required
                    />
                </div>

                <div className="admin-form__group">
                    <label className="admin-form__label">Valid Until (Optional)</label>
                    <input
                        type="date"
                        value={formData.validUntil || ''}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value || undefined })}
                        className="admin-form__input"
                    />
                </div>
            </div>

            <div className="admin-form__row">
                <div className="admin-form__group">
                    <label className="admin-form__label">Min Order Amount (Optional)</label>
                    <input
                        type="number"
                        value={formData.minOrderAmount || ''}
                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="e.g., 5000"
                        className="admin-form__input"
                    />
                </div>

                <div className="admin-form__group">
                    <label className="admin-form__label">Max Discount Amount (Optional)</label>
                    <input
                        type="number"
                        value={formData.maxDiscountAmount || ''}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="e.g., 1000"
                        className="admin-form__input"
                    />
                </div>
            </div>

            <div className="admin-form__row">
                <div className="admin-form__group">
                    <label className="admin-form__label">Max Uses Total (Optional)</label>
                    <input
                        type="number"
                        value={formData.maxUsesTotal || ''}
                        onChange={(e) => setFormData({ ...formData, maxUsesTotal: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="Unlimited if empty"
                        className="admin-form__input"
                    />
                </div>

                <div className="admin-form__group">
                    <label className="admin-form__label">Max Uses Per User (Optional)</label>
                    <input
                        type="number"
                        value={formData.maxUsesPerUser || ''}
                        onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="Unlimited if empty"
                        className="admin-form__input"
                    />
                </div>
            </div>

            <div className="admin-form__group">
                <label className="admin-form__label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="checkbox"
                        checked={formData.isActive || false}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    Active
                </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" disabled={isLoading} className="admin-btn admin-btn--primary">
                    {isLoading ? 'Saving…' : coupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button type="button" onClick={onClose} className="admin-btn admin-btn--outline">Cancel</button>
            </div>
        </form>
    )
}

function CouponsContent() {
    const [page, setPage] = useState(1)
    const [showForm, setShowForm] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>()
    const { data, isLoading } = useAdminCoupons({ page, limit: 20 })
    const deleteCoupon = useDeleteCoupon()

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon)
        setShowForm(true)
    }

    const handleCreate = () => {
        setEditingCoupon(undefined)
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingCoupon(undefined)
    }

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Coupons</h1>
                    <p className="admin-page__subtitle">Create and manage promotional codes</p>
                </div>
                <button onClick={handleCreate} className="admin-btn admin-btn--primary">
                    <Plus size={16} /> New Coupon
                </button>
            </div>

            {showForm && (
                <div className="admin-modal-overlay" onClick={handleCloseForm}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2 className="admin-modal__title">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                            <button onClick={handleCloseForm} className="admin-modal__close">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="admin-modal__body">
                            <CouponForm coupon={editingCoupon} onClose={handleCloseForm} />
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="admin-loading">
                    <Loader2 size={24} className="admin-loading__spinner" />
                </div>
            )}

            {data && data.data.length === 0 && !isLoading && (
                <div className="admin-empty">
                    <Search size={36} className="admin-empty__icon" />
                    <p className="admin-empty__title">No coupons created</p>
                    <p className="admin-empty__body">Create your first coupon to get started.</p>
                </div>
            )}

            {data && data.data.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                    <th>Uses</th>
                                    <th>Valid Until</th>
                                    <th>Visibility</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{coupon.code}</td>
                                        <td style={{ fontSize: '0.85rem' }}>
                                            {coupon.type === CouponType.PERCENTAGE ? '%' : '₹'}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            {coupon.discountValue}{coupon.type === CouponType.PERCENTAGE ? '%' : ''}
                                            {coupon.maxDiscountAmount && ` (max ₹${coupon.maxDiscountAmount})`}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${coupon.isActive ? 'active' : 'inactive'}`}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {coupon.currentUses}{coupon.maxUsesTotal ? `/${coupon.maxUsesTotal}` : ''}
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {coupon.validUntil
                                                ? new Date(coupon.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
                                                : 'Never'}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${coupon.visibility.toLowerCase()}`}>
                                                {coupon.visibility}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-table__actions">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="admin-icon-btn"
                                                    title="Edit coupon"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Delete coupon ${coupon.code}?`)) {
                                                            deleteCoupon.mutate(coupon.id)
                                                        }
                                                    }}
                                                    className="admin-icon-btn admin-icon-btn--danger"
                                                    title="Delete coupon"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="admin-pagination">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="admin-pagination__btn">← Previous</button>
                        <span className="admin-pagination__info">Page {page} of {data.meta.totalPages} · {data.meta.total} coupons</span>
                        <button disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="admin-pagination__btn">Next →</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default function CouponsPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <CouponsContent />
        </RoleGuard>
    )
}
