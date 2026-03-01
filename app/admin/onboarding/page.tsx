'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminOnboardings, useInviteProvider, useRevokeOnboarding, useResendOnboarding } from '@/hooks/provider'
import { useState } from 'react'
import { Loader2, Send, XCircle, Plus, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProviderType } from '@/types/provider'

const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
    [ProviderType.HOMESTAY_HOST]: 'Homestay Host',
    [ProviderType.VEHICLE_PARTNER]: 'Vehicle Partner',
    [ProviderType.LOCAL_GUIDE]: 'Local Guide',
    [ProviderType.TOUR_VENDOR]: 'Tour Vendor',
    [ProviderType.ACTIVITY_VENDOR]: 'Activity Vendor',
    [ProviderType.ILP_VENDOR]: 'ILP Vendor',
}

function OnboardingContent() {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useAdminOnboardings({ page, limit: 20 })
    const inviteProvider = useInviteProvider()
    const revoke = useRevokeOnboarding()
    const resend = useResendOnboarding()

    const [showForm, setShowForm] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteType, setInviteType] = useState<ProviderType>(ProviderType.HOMESTAY_HOST)

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault()
        inviteProvider.mutate(
            { email: inviteEmail, providerType: inviteType },
            { onSuccess: () => { setShowForm(false); setInviteEmail('') } }
        )
    }

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
            <div className="flex items-start md:items-center justify-between gap-6 flex-col md:flex-row">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Provider Onboarding</h1>
                    <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Invite and manage onboarding invitations</p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] transition-all"
                >
                    <Plus size={18} /> Invite Provider
                </button>
            </div>

            {/* Invite Form */}
            {showForm && (
                <form onSubmit={handleInvite} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address *</label>
                            <input
                                type="email"
                                placeholder="provider@example.com"
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                required
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Provider Type *</label>
                            <Select value={inviteType} onValueChange={(value) => setInviteType(value as ProviderType)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ProviderType).map(t => (
                                        <SelectItem key={t} value={t}>{PROVIDER_TYPE_LABELS[t]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <button
                            type="submit"
                            disabled={inviteProvider.isPending}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#005246] text-white hover:bg-[#003d34] disabled:opacity-50 h-10 md:col-span-2 lg:col-span-1 self-end"
                        >
                            {inviteProvider.isPending && <Loader2 size={14} className="animate-spin" />}
                            Send Invite
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setShowForm(false); setInviteEmail('') }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </form>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-[#005246]" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && data && data.data.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Search size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No invitations sent yet</h3>
                    <p className="text-gray-600">Click "Invite Provider" to get started.</p>
                </div>
            )}

            {/* Onboarding Table */}
            {!isLoading && data && data.data.length > 0 && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Expires</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.data.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{o.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {o.providerType.map(t => PROVIDER_TYPE_LABELS[t as ProviderType] ?? t).join(', ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${o.completedAt
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {o.completedAt ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(o.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {!o.completedAt && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => resend.mutate(o.id)}
                                                        className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                        title="Resend invite"
                                                        disabled={resend.isPending}
                                                    >
                                                        <Send size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Revoke this invite?')) revoke.mutate(o.id) }}
                                                        className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                        title="Revoke invite"
                                                        disabled={revoke.isPending}
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data.meta && data.meta.total > 20 && (
                        <div className="flex items-center justify-between pt-4">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                ← Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {data.meta.totalPages}
                            </span>
                            <button
                                disabled={page >= data.meta.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

export default function OnboardingPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <OnboardingContent />
        </RoleGuard>
    )
}
