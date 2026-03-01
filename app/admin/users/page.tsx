'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminAllUsers, useAdminAssignRole } from '@/hooks/admin'
import { useAdminDeleteUser, useAdminToggleUserStatus, useAdminVerifyUser } from '@/hooks/user'
import { useState } from 'react'
import { Loader2, Trash2, ToggleLeft, ShieldCheck, Search, UserPlus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminAssignableRole } from '@/types/admin'
import { useDebounce } from '@/hooks/useDebounce'

function UsersContent() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)
    const [roleSelection, setRoleSelection] = useState<Record<string, AdminAssignableRole>>({})
    const { data, isLoading } = useAdminAllUsers({ page, limit: 20, keyword: debouncedSearch || undefined })
    const deleteUser = useAdminDeleteUser()
    const toggleStatus = useAdminToggleUserStatus()
    const verifyUser = useAdminVerifyUser()
    const assignRole = useAdminAssignRole()

    const users = data?.data ?? []
    const total = data?.meta?.total ?? 0
    const totalPages = data?.meta?.totalPages ?? 1

    const roleOptions: AdminAssignableRole[] = ['HOST', 'VENDOR', 'GUIDE']

    const handleAssignRole = (userId: string) => {
        const role = roleSelection[userId]
        if (!role) return
        assignRole.mutate({ userId, data: { role } })
    }

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>Users</h1>
                    <p className="text-gray-600 mt-2" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>Manage all registered users and assign provider roles</p>
                </div>
                <div className="relative w-full md:max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005246]"
                    />
                </div>
            </div>

            {isLoading && <div className="flex items-center justify-center py-12"><Loader2 size={32} className="animate-spin text-[#005246]" /></div>}

            {!isLoading && users.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Search size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                    <p className="text-gray-600">Try a different search term.</p>
                </div>
            )}

            {!isLoading && users.length > 0 && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Verified</th>
                                        <th className="px-4 py-3 font-medium">Roles</th>
                                        <th className="px-4 py-3 font-medium">Joined</th>
                                        <th className="px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="border-b border-gray-100 last:border-0">
                                            <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{u.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {u.isVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                {u.roles?.map(r => r.role).join(', ') || 'USER'}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {!u.isVerified && (
                                                        <button
                                                            onClick={() => verifyUser.mutate(u.id)}
                                                            className="p-2 rounded-md border border-green-300 text-green-700 hover:bg-green-50"
                                                            title="Verify email"
                                                        >
                                                            <ShieldCheck size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => toggleStatus.mutate(u.id)}
                                                        className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        title="Toggle active status"
                                                    >
                                                        <ToggleLeft size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Permanently delete this user?')) deleteUser.mutate(u.id) }}
                                                        className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>

                                                    <Select value={roleSelection[u.id] ?? ''} onValueChange={(value) => setRoleSelection(prev => ({ ...prev, [u.id]: value as AdminAssignableRole }))}>
                                                        <SelectTrigger className="w-24 h-8 text-xs">
                                                            <SelectValue placeholder="Assign role…" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roleOptions.map((role) => (
                                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <button
                                                        disabled={!roleSelection[u.id] || assignRole.isPending}
                                                        onClick={() => handleAssignRole(u.id)}
                                                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium border border-[#005246] text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50"
                                                        title="Assign provider role"
                                                    >
                                                        <UserPlus size={13} />
                                                        Assign
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {page} of {totalPages} · {total} users</span>
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

export default function UsersPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <UsersContent />
        </RoleGuard>
    )
}
