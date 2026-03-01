'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminProviders, useVerifyProvider, useSuspendProvider } from '@/hooks/provider'
import { useState } from 'react'
import { Loader2, ShieldCheck, Ban, Search, UserCheck } from 'lucide-react'
import { ProviderStatus } from '@/types/provider'

function ProvidersContent() {
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<ProviderStatus | undefined>(undefined)
    const { data, isLoading } = useAdminProviders({ page, limit: 20, status })
    const verify = useVerifyProvider()
    const suspend = useSuspendProvider()

    const STATUSES = [
        { label: 'All', value: undefined },
        { label: 'Pending', value: ProviderStatus.PENDING },
        { label: 'Active', value: ProviderStatus.ACTIVE },
        { label: 'Suspended', value: ProviderStatus.SUSPENDED },
    ]

    const providers = data?.data ?? []
    const totalPages = data?.meta?.totalPages ?? 1
    const total = data?.meta?.total ?? 0

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Providers</h1>
                    <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Verify and manage onboarded providers</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {STATUSES.map(({ label, value }) => (
                    <button
                        key={label}
                        onClick={() => { setStatus(value); setPage(1) }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${status === value ? 'bg-[#005246] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isLoading && <div className="flex items-center justify-center py-12"><Loader2 size={32} className="animate-spin text-[#005246]" /></div>}

            {!isLoading && providers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Search size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No providers found</h3>
                </div>
            )}

            {!isLoading && providers.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {providers.map((p) => (
                            <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-lg truncate">{p.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{p.type.join(', ')}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${p.status === ProviderStatus.ACTIVE ? 'bg-green-100 text-green-700' :
                                        p.status === ProviderStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-700 space-y-1">
                                    <p className="flex items-center gap-1.5">
                                        <UserCheck size={14} />
                                        <span className="text-gray-500">Verified:</span> {p.verified ? 'Yes' : 'No'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Joined {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-2 border-t">
                                    {!p.verified && (
                                        <button
                                            onClick={() => verify.mutate(p.id)}
                                            disabled={verify.isPending}
                                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-md border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
                                        >
                                            <ShieldCheck size={14} />
                                            Verify
                                        </button>
                                    )}
                                    {p.status !== ProviderStatus.SUSPENDED && (
                                        <button
                                            onClick={() => { if (confirm('Suspend this provider?')) suspend.mutate(p.id) }}
                                            disabled={suspend.isPending}
                                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Ban size={14} />
                                            Suspend
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {page} of {totalPages} · {total} total</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default function ProvidersPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <ProvidersContent />
        </RoleGuard>
    )
}
