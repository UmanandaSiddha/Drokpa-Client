'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminOnboardings, useInviteProvider, useRevokeOnboarding, useResendOnboarding } from '@/hooks/provider'
import { useState } from 'react'
import { Loader2, Send, XCircle, Plus, Search } from 'lucide-react'
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
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Provider Onboarding</h1>
                    <p className="admin-page__subtitle">Invite and manage onboarding invitations</p>
                </div>
                <button onClick={() => setShowForm(v => !v)} className="admin-btn admin-btn--primary">
                    <Plus size={15} /> Invite Provider
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleInvite} className="admin-form-row">
                    <input
                        type="email"
                        placeholder="Provider email address"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        required
                        className="admin-input"
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <select
                        value={inviteType}
                        onChange={e => setInviteType(e.target.value as ProviderType)}
                        className="admin-select"
                    >
                        {Object.values(ProviderType).map(t => (
                            <option key={t} value={t}>{PROVIDER_TYPE_LABELS[t]}</option>
                        ))}
                    </select>
                    <button type="submit" disabled={inviteProvider.isPending} className="admin-btn admin-btn--primary">
                        {inviteProvider.isPending ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</> : 'Send Invite'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="admin-btn admin-btn--outline">
                        Cancel
                    </button>
                </form>
            )}

            {isLoading && <div className="admin-loading"><Loader2 size={24} className="admin-loading__spinner" /></div>}

            {data && data.data.length === 0 && !isLoading && (
                <div className="admin-empty">
                    <Search size={36} className="admin-empty__icon" />
                    <p className="admin-empty__title">No invitations sent yet</p>
                    <p className="admin-empty__body">Click "Invite Provider" to get started.</p>
                </div>
            )}

            {data && data.data.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Expires</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((o) => (
                                    <tr key={o.id}>
                                        <td style={{ fontWeight: 500 }}>{o.email}</td>
                                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {o.providerType.map(t => PROVIDER_TYPE_LABELS[t as ProviderType] ?? t).join(', ')}
                                        </td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${o.completedAt ? 'active' : 'pending'}`}>
                                                {o.completedAt ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {new Date(o.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            {!o.completedAt && (
                                                <div className="admin-table__actions">
                                                    <button
                                                        onClick={() => resend.mutate(o.id)}
                                                        className="admin-icon-btn"
                                                        title="Resend invite"
                                                    >
                                                        <Send size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Revoke this invite?')) revoke.mutate(o.id) }}
                                                        className="admin-icon-btn admin-icon-btn--danger"
                                                        title="Revoke invite"
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="admin-pagination">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="admin-pagination__btn">← Previous</button>
                        <span className="admin-pagination__info">Page {page} of {data.meta.totalPages}</span>
                        <button disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="admin-pagination__btn">Next →</button>
                    </div>
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
