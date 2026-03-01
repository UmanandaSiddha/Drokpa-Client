'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useCancellationPolicies, useCreateCancellationPolicy, useUpdateCancellationPolicy, useDeleteCancellationPolicy } from '@/hooks/admin'
import { ProviderType } from '@/types/provider'
import { useState } from 'react'
import { Loader2, Plus, ShieldAlert, Edit2, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CancellationPoliciesPage() {
    const [form, setForm] = useState({
        productType: ProviderType.TOUR_VENDOR,
        productId: '',
        hoursBefore: 24,
        refundPct: 50,
    })
    const [editingId, setEditingId] = useState<string | null>(null)

    const { data: policies = [], isLoading } = useCancellationPolicies()
    const createPolicy = useCreateCancellationPolicy()
    const updatePolicy = useUpdateCancellationPolicy()
    const deletePolicy = useDeleteCancellationPolicy()

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.productId.trim()) return

        if (editingId) {
            updatePolicy.mutate({
                id: editingId,
                data: { hoursBefore: Number(form.hoursBefore), refundPct: Number(form.refundPct) },
            }, { onSuccess: () => setEditingId(null) })
            return
        }

        createPolicy.mutate({
            productType: form.productType,
            productId: form.productId.trim(),
            hoursBefore: Number(form.hoursBefore),
            refundPct: Number(form.refundPct),
        })
    }

    const startEdit = (policy: any) => {
        setEditingId(policy.id)
        setForm({
            productType: policy.productType,
            productId: policy.productId,
            hoursBefore: policy.hoursBefore,
            refundPct: policy.refundPct,
        })
    }

    const resetForm = () => {
        setEditingId(null)
        setForm({ productType: ProviderType.TOUR_VENDOR, productId: '', hoursBefore: 24, refundPct: 50 })
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Cancellation Policies</h1>
                    <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Configure refund rules for products</p>
                </div>

                <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Type *</label>
                            <Select value={form.productType} onValueChange={(value) => setForm(prev => ({ ...prev, productType: value as ProviderType }))} disabled={Boolean(editingId)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ProviderType).map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product ID *</label>
                            <input
                                value={form.productId}
                                onChange={(e) => setForm(prev => ({ ...prev, productId: e.target.value }))}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                placeholder="Enter product ID"
                                disabled={Boolean(editingId)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hours Before *</label>
                            <input
                                type="number"
                                min={0}
                                value={form.hoursBefore}
                                onChange={(e) => setForm(prev => ({ ...prev, hoursBefore: Number(e.target.value) }))}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                placeholder="e.g., 24"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Refund % *</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={form.refundPct}
                                onChange={(e) => setForm(prev => ({ ...prev, refundPct: Number(e.target.value) }))}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                                placeholder="0-100"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34]" disabled={createPolicy.isPending || updatePolicy.isPending}>
                            {(createPolicy.isPending || updatePolicy.isPending) ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            {editingId ? 'Update' : 'Add'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                        )}
                    </div>
                </form>

                {isLoading && <div className="flex items-center justify-center py-12"><Loader2 size={32} className="animate-spin text-[#005246]" /></div>}

                {!isLoading && policies.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <ShieldAlert size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No policies configured</h3>
                        <p className="text-gray-600">Add a policy for product-specific refund handling.</p>
                    </div>
                )}

                {!isLoading && policies.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {policies.map((policy: any) => (
                            <div key={policy.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Product Type</p>
                                    <p className="font-semibold">{policy.productType}</p>
                                </div>
                                <p className="text-sm text-gray-700">Product ID: <span className="font-mono text-xs">{policy.productId}</span></p>
                                <p className="text-sm text-gray-700">{policy.hoursBefore}h before → {policy.refundPct}% refund</p>
                                <div className="pt-2 border-t flex gap-2">
                                    <button onClick={() => startEdit(policy)} className="p-2 rounded-md border border-gray-300 hover:bg-gray-50" title="Edit policy">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => { if (confirm('Delete this policy?')) deletePolicy.mutate(policy.id) }} className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50" title="Delete policy">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RoleGuard>
    )
}
