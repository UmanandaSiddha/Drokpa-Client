'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useQuery } from '@tanstack/react-query'
import { useTours, useCreateTour, useUpdateTour, useDeleteTour } from '@/hooks/tours'
import { useAuth } from '@/hooks/auth/useAuth'
import { useState } from 'react'
import { Loader2, Plus, Edit2, Trash2, X, MapPin, Clock } from 'lucide-react'

interface TourFormData {
    title: string
    description: string
    duration: number
    maxCapacity: number
    basePrice: number
    isActive: boolean
}

function TourForm({ tour, onSave, onCancel, isLoading }: any) {
    const [formData, setFormData] = useState<TourFormData>(
        tour ? {
            title: tour.title,
            description: tour.description,
            duration: tour.duration,
            maxCapacity: tour.maxCapacity,
            basePrice: tour.basePrice,
            isActive: tour.isActive,
        } : {
            title: '',
            description: '',
            duration: 1,
            maxCapacity: 4,
            basePrice: 0,
            isActive: true,
        }
    )

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'duration' || name === 'maxCapacity' || name === 'basePrice' ? parseFloat(value) : value),
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ ...formData, ...(tour?.id && { id: tour.id }) })
    }

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form__group">
                <label className="admin-form__label">Tour Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Leh-Ladakh Adventure"
                    className="admin-form__input"
                    required
                />
            </div>

            <div className="admin-form__group">
                <label className="admin-form__label">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tour details..."
                    className="admin-form__textarea"
                    rows={4}
                />
            </div>

            <div className="admin-form__row">
                <div className="admin-form__group">
                    <label className="admin-form__label">Duration (days)</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="1"
                        className="admin-form__input"
                    />
                </div>
                <div className="admin-form__group">
                    <label className="admin-form__label">Max Capacity</label>
                    <input
                        type="number"
                        name="maxCapacity"
                        value={formData.maxCapacity}
                        onChange={handleChange}
                        min="1"
                        className="admin-form__input"
                    />
                </div>
            </div>

            <div className="admin-form__row">
                <div className="admin-form__group">
                    <label className="admin-form__label">Base Price (₹)</label>
                    <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        min="0"
                        className="admin-form__input"
                    />
                </div>
                <div className="admin-form__group">
                    <label className="admin-form__label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            style={{ width: 'auto', margin: 0 }}
                        />
                        Active
                    </label>
                </div>
            </div>

            <div className="admin-form__actions">
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isLoading}>
                    {isLoading ? <Loader2 size={14} className="admin-loading__spinner" /> : null}
                    {tour ? 'Update Tour' : 'Create Tour'}
                </button>
                <button type="button" onClick={onCancel} className="admin-btn admin-btn--secondary">
                    Cancel
                </button>
            </div>
        </form>
    )
}

function ToursContent() {
    const [page, setPage] = useState(1)
    const [showForm, setShowForm] = useState(false)
    const [editingTour, setEditingTour] = useState<any>(null)

    const { data, isLoading } = useTours({
        page,
        limit: 20,
    })

    const createMutation = useCreateTour()
    const updateMutation = useUpdateTour()
    const deleteMutation = useDeleteTour()

    const handleSave = (formData: any) => {
        if (editingTour) {
            updateMutation.mutate(
                { id: editingTour.id, data: formData },
                {
                    onSuccess: () => {
                        setEditingTour(null)
                        setShowForm(false)
                    },
                }
            )
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setShowForm(false)
                },
            })
        }
    }

    const handleDeleteClick = (id: string) => {
        if (confirm('Are you sure you want to delete this tour?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleEditClick = (tour: any) => {
        setEditingTour(tour)
        setShowForm(true)
    }

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Tours</h1>
                    <p className="admin-page__subtitle">Create and manage package tours</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTour(null)
                        setShowForm(true)
                    }}
                    className="admin-btn admin-btn--primary"
                >
                    <Plus size={14} />
                    New Tour
                </button>
            </div>

            {showForm && (
                <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h2>{editingTour ? 'Edit Tour' : 'Create New Tour'}</h2>
                            <button
                                onClick={() => {
                                    setShowForm(false)
                                    setEditingTour(null)
                                }}
                                className="admin-modal__close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="admin-modal__body">
                            <TourForm
                                tour={editingTour}
                                onSave={handleSave}
                                onCancel={() => {
                                    setShowForm(false)
                                    setEditingTour(null)
                                }}
                                isLoading={createMutation.isPending || updateMutation.isPending}
                            />
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="admin-loading">
                    <Loader2 size={24} className="admin-loading__spinner" />
                </div>
            )}

            {data && data.data?.length === 0 && !isLoading && (
                <div className="admin-empty">
                    <MapPin size={36} className="admin-empty__icon" />
                    <p className="admin-empty__title">No tours created yet</p>
                    <p className="admin-empty__body">Create your first tour to get started.</p>
                </div>
            )}

            {data && data.data?.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Tour Name</th>
                                    <th>Duration</th>
                                    <th>Group Size</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Bookings</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((tour: any) => (
                                    <tr key={tour.id}>
                                        <td style={{ fontWeight: 500 }}>{tour.title}</td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} />
                                                {tour.duration} days
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>Max {tour.maxCapacity}</td>
                                        <td style={{ fontWeight: 500 }}>₹{tour.basePrice?.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${tour.isActive ? 'active' : 'inactive'}`}>
                                                {tour.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {tour.totalReviews || 0}
                                        </td>
                                        <td>
                                            <div className="admin-table__actions">
                                                <button
                                                    onClick={() => handleEditClick(tour)}
                                                    className="admin-icon-btn admin-icon-btn--secondary"
                                                    title="Edit tour"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(tour.id)}
                                                    className="admin-icon-btn admin-icon-btn--danger"
                                                    title="Delete tour"
                                                    disabled={deleteMutation.isPending}
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
                                Page {page} of {data.meta.totalPages} · {data.meta.total} tours
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
    )
}

export default function ToursPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <ToursContent />
        </RoleGuard>
    )
}
