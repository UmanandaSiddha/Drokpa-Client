'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/hooks/resources'
import { IconPicker } from '@/components/ui/icon-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Loader2, Plus, Tag as TagIcon, Edit2, Trash2, X, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

const CATEGORY_OPTIONS = [
    { value: 'tour', label: 'Tour' },
    { value: 'homestay', label: 'Homestay' },
    { value: 'activity', label: 'Activity' },
    { value: 'trek', label: 'Trek' },
]

export default function TagsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTag, setEditingTag] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [page, setPage] = useState(1)
    const [form, setForm] = useState({
        label: '',
        color: '#005246',
        icon: 'Tag',
        category: '',
    })

    const { data, isLoading } = useTags({ keyword: debouncedSearch, page, limit: 20 })
    const tags = data?.data || []
    const meta = data?.meta
    const createTag = useCreateTag()
    const updateTag = useUpdateTag()
    const deleteTag = useDeleteTag()

    const resetForm = () => {
        setForm({ label: '', color: '#005246', icon: 'Tag', category: '' })
        setEditingTag(null)
        setIsFormOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingTag) {
            updateTag.mutate(
                { id: editingTag.id, data: form },
                { onSuccess: resetForm }
            )
        } else {
            createTag.mutate(form, { onSuccess: resetForm })
        }
    }

    const startEdit = (tag: any) => {
        setEditingTag(tag)
        setForm({
            label: tag.label,
            color: tag.color,
            icon: tag.icon || 'Tag',
            category: tag.category || '',
        })
        setIsFormOpen(true)
    }

    const handleDelete = (id: string, label: string) => {
        if (confirm(`Delete tag "${label}"? This will remove it from all tours and homestays.`)) {
            deleteTag.mutate(id)
        }
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST, UserRole.VENDOR, UserRole.GUIDE]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-3xl md:text-4xl font-bold">
                            Tags
                        </h1>
                        <p style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }} className="text-gray-600 mt-2">
                            Manage global tags for tours and homestays
                        </p>
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] transition-colors"
                        >
                            <Plus size={16} />
                            Add Tag
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
                            placeholder="Search by label or category..."
                            className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005246]"
                        />
                    </div>
                </div>

                {/* Form */}
                {isFormOpen && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{editingTag ? 'Edit Tag' : 'Create New Tag'}</h2>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Label *</label>
                                <input
                                    value={form.label}
                                    onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., Adventure, Family-Friendly"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Color *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={form.color}
                                        onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                                        className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        value={form.color}
                                        onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                                        className="flex-1 h-10 px-3 border border-gray-300 rounded-lg font-mono text-sm"
                                        placeholder="#005246"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Icon *</label>
                                <IconPicker
                                    value={form.icon}
                                    onChange={(icon) => setForm(prev => ({ ...prev, icon }))}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={createTag.isPending || updateTag.isPending}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] disabled:opacity-50"
                            >
                                {(createTag.isPending || updateTag.isPending) && <Loader2 size={16} className="animate-spin" />}
                                {editingTag ? 'Update' : 'Create'} Tag
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
                {!isLoading && tags.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <TagIcon size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No tags configured</h3>
                        <p className="text-gray-600 mb-4">Create your first tag to start organizing your content.</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34]"
                        >
                            <Plus size={16} />
                            Add First Tag
                        </button>
                    </div>
                )}

                {/* Tags Grid */}
                {!isLoading && tags.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {tags.map((tag: any) => {
                                const IconComponent = require('lucide-react')[tag.icon || 'Tag']
                                return (
                                    <div
                                        key={tag.id}
                                        className="bg-white rounded-lg border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                                            >
                                                <IconComponent size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{tag.label}</h3>
                                                {tag.category && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{tag.category}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded border border-gray-200"
                                                style={{ backgroundColor: tag.color }}
                                                title={tag.color}
                                            />
                                            <span className="text-xs text-gray-500 font-mono">{tag.color}</span>
                                        </div>

                                        <div className="pt-2 border-t flex gap-2">
                                            <button
                                                onClick={() => startEdit(tag)}
                                                className="flex-1 p-2 rounded-md border border-gray-300 hover:bg-gray-50 inline-flex items-center justify-center gap-1.5 text-sm"
                                            >
                                                <Edit2 size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tag.id, tag.label)}
                                                className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                                                title="Delete tag"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                <div className="text-sm text-gray-600">
                                    Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} tags
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
