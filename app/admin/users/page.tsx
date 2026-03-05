'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminAddRole, useAdminAllUsers, useAdminRemoveRole } from '@/hooks/admin'
import { useAdminDeleteUser, useAdminToggleUserStatus, useAdminVerifyUser } from '@/hooks/user'
import { useState } from 'react'
import { Loader2, Trash2, ToggleLeft, ShieldCheck, Search, UserPlus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminUserRole } from '@/types/admin'
import { useDebounce } from '@/hooks/useDebounce'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth/useAuth'

function UsersContent() {
    const { user: currentUser } = useAuth()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)
    const [roleSelection, setRoleSelection] = useState<Record<string, AdminUserRole>>({})
    const { data, isLoading } = useAdminAllUsers({ page, limit: 20, keyword: debouncedSearch || undefined })
    const deleteUser = useAdminDeleteUser()
    const toggleStatus = useAdminToggleUserStatus()
    const verifyUser = useAdminVerifyUser()
    const addRole = useAdminAddRole()
    const removeRole = useAdminRemoveRole()

    const users = data?.data ?? []
    const total = data?.meta?.total ?? 0
    const totalPages = data?.meta?.totalPages ?? 1

    const roleOptions: AdminUserRole[] = ['ADMIN', 'HOST', 'VENDOR', 'GUIDE']

    const handleAssignRole = (userId: string) => {
        const role = roleSelection[userId]
        if (!role) return
        addRole.mutate({ userId, data: { role } })
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
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-gray-50/95 backdrop-blur border-b border-gray-200 text-left text-gray-600">
                                        <th className="px-4 py-3 font-medium">User</th>
                                        <th className="px-4 py-3 font-medium">Verified</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Roles</th>
                                        <th className="px-4 py-3 font-medium">Joined</th>
                                        <th className="px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((u, idx) => {
                                        const isSelf = !!currentUser?.id && currentUser.id === u.id
                                        const disableRoleActions = isSelf
                                        const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'

                                        return (
                                            <tr key={u.id} className={`${rowBg} hover:bg-gray-50`}>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{u.firstName} {u.lastName}</div>
                                                    <div className="text-xs text-gray-600 break-all">{u.email}</div>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {isSelf && (
                                                            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-200 text-gray-800">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {u.isVerified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.isDisabled ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {u.isDisabled ? 'Disabled' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(u.roles?.length ? u.roles.map(r => r.role) : ['USER']).map((role) => (
                                                            <span key={`${u.id}-${role}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                                                                {role}
                                                                {role !== 'USER' && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={disableRoleActions || removeRole.isPending}
                                                                        onClick={() => {
                                                                            if (disableRoleActions) return
                                                                            if (confirm(`Remove role ${role} from ${u.email}?`)) {
                                                                                removeRole.mutate({ userId: u.id, role: role as AdminUserRole })
                                                                            }
                                                                        }}
                                                                        className="text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:hover:text-gray-500"
                                                                        title={disableRoleActions ? 'You cannot change your own roles' : 'Remove role'}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                                                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Link href={`/admin/users/${u.id}`} className="h-8 px-2.5 inline-flex items-center rounded-md border border-gray-300 text-xs hover:bg-gray-50">
                                                            View
                                                        </Link>
                                                        {!u.isVerified && (
                                                            <button
                                                                disabled={verifyUser.isPending}
                                                                onClick={() => verifyUser.mutate(u.id)}
                                                                className="p-2 rounded-md border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:hover:bg-transparent"
                                                                title="Verify email"
                                                            >
                                                                <ShieldCheck size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            disabled={toggleStatus.isPending}
                                                            onClick={() => toggleStatus.mutate(u.id)}
                                                            className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                                                            title="Toggle active status"
                                                        >
                                                            <ToggleLeft size={14} />
                                                        </button>
                                                        <button
                                                            disabled={deleteUser.isPending}
                                                            onClick={() => {
                                                                if (confirm('Permanently delete this user?')) deleteUser.mutate(u.id)
                                                            }}
                                                            className="p-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                                                            title="Delete user"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>

                                                        <div className="flex items-center gap-2">
                                                            <Select
                                                                value={roleSelection[u.id] ?? ''}
                                                                onValueChange={(value) => setRoleSelection(prev => ({ ...prev, [u.id]: value as AdminUserRole }))}
                                                                disabled={disableRoleActions}
                                                            >
                                                                <SelectTrigger className="w-28 h-8 text-xs">
                                                                    <SelectValue placeholder="Add role…" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {roleOptions.map((role) => (
                                                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <button
                                                                disabled={disableRoleActions || !roleSelection[u.id] || addRole.isPending}
                                                                onClick={() => handleAssignRole(u.id)}
                                                                className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium border border-[#005246] text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50"
                                                                title={disableRoleActions ? 'You cannot change your own roles' : 'Add role'}
                                                            >
                                                                <UserPlus size={13} />
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
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
