'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminAddRole, useAdminAllUsers, useAdminRemoveRole } from '@/hooks/admin'
import { useAdminDeleteUser, useAdminToggleUserStatus, useAdminVerifyUser } from '@/hooks/user'
import { useState } from 'react'
import { Loader2, Trash2, ToggleLeft, ShieldCheck, Search, MoreVertical, Eye, AlertCircle, CheckCircle, Users, UserCheck, UserX } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminUserRole } from '@/types/admin'
import { useDebounce } from '@/hooks/useDebounce'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth/useAuth'

function UsersContent() {
    const { user: currentUser } = useAuth()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
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
    const verifiedUsers = users.filter((u) => u.isVerified).length
    const activeUsers = users.filter((u) => !u.isDisabled).length

    const roleOptions: AdminUserRole[] = ['ADMIN', 'HOST', 'VENDOR', 'GUIDE']

    const getRoleTone = (role: string) => {
        if (role === 'ADMIN') return 'bg-red-100 text-red-700 border-red-200'
        if (role === 'HOST') return 'bg-blue-100 text-blue-700 border-blue-200'
        if (role === 'VENDOR') return 'bg-purple-100 text-purple-700 border-purple-200'
        if (role === 'GUIDE') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }

    const handleAssignRole = (userId: string) => {
        const role = roleSelection[userId]
        if (!role) return
        addRole.mutate({ userId, data: { role } })
        setRoleSelection(prev => {
            const updated = { ...prev }
            delete updated[userId]
            return updated
        })
    }

    return (

        <div className="admin-page space-y-6 px-4 sm:px-6 md:px-8 lg:px-0">
            <section className="relative overflow-hidden rounded-3xl border border-[#d8e7e2] bg-linear-to-br from-[#005246] via-[#0b6759] to-[#0f7e6a] p-5 sm:p-7">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-[#f8f9f7]/15 blur-xl" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-subjectivity), sans-serif' }}>
                            Users
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-emerald-50/90" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>
                            Manage registered users, account status, verification, and provider roles.
                        </p>
                    </div>

                    <div className="relative w-full lg:max-w-sm">
                        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search by name or email"
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            className="h-11 w-full rounded-xl border border-white/35 bg-white/95 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                        />
                    </div>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-white">
                        <div className="flex items-center gap-2 text-xs text-emerald-50/90">
                            <Users size={14} />
                            Total
                        </div>
                        <p className="mt-1 text-xl font-semibold">{total}</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-white">
                        <div className="flex items-center gap-2 text-xs text-emerald-50/90">
                            <CheckCircle size={14} />
                            Verified
                        </div>
                        <p className="mt-1 text-xl font-semibold">{verifiedUsers}</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-white">
                        <div className="flex items-center gap-2 text-xs text-emerald-50/90">
                            <UserCheck size={14} />
                            Active
                        </div>
                        <p className="mt-1 text-xl font-semibold">{activeUsers}</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-white">
                        <div className="flex items-center gap-2 text-xs text-emerald-50/90">
                            <UserX size={14} />
                            Disabled
                        </div>
                        <p className="mt-1 text-xl font-semibold">{users.length - activeUsers}</p>
                    </div>
                </div>
            </section>

            {isLoading && (
                <div className="admin-card flex items-center justify-center gap-3 py-14">
                    <Loader2 size={26} className="animate-spin text-[#005246]" />
                    <p className="text-sm text-gray-600">Loading users...</p>
                </div>
            )}

            {!isLoading && users.length === 0 && (
                <div className="admin-card text-center py-14">
                    <Search size={44} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                    <p className="text-sm text-gray-500">Try a different keyword or clear your current search.</p>
                </div>
            )}

            {!isLoading && users.length > 0 && (
                <>
                    <div className="space-y-4 md:hidden">
                        {users.map((u) => {
                            const isSelf = !!currentUser?.id && currentUser.id === u.id
                            const assignedRoles = u.roles?.length ? u.roles.map(r => r.role) : ['USER']
                            const availableRoles = roleOptions.filter(r => !assignedRoles.includes(r))

                            return (
                                <article key={u.id} className="rounded-2xl border border-[#dde9e4] bg-white p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-semibold text-gray-900">
                                                {u.firstName} {u.lastName}
                                            </h3>
                                            <p className="mt-0.5 truncate text-xs text-gray-500">{u.email}</p>
                                            <p className="mt-1 text-[11px] text-gray-400">
                                                Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/admin/users/${u.id}`}
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            <Eye size={13} />
                                            View
                                        </Link>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        {isSelf && (
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                                                You
                                            </span>
                                        )}
                                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${u.isVerified ? 'border-green-200 bg-green-100 text-green-700' : 'border-amber-200 bg-amber-100 text-amber-700'}`}>
                                            {u.isVerified ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                            {u.isVerified ? 'Verified' : 'Unverified'}
                                        </span>
                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${u.isDisabled ? 'border-red-200 bg-red-100 text-red-700' : 'border-emerald-200 bg-emerald-100 text-emerald-700'}`}>
                                            {u.isDisabled ? 'Disabled' : 'Active'}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {assignedRoles.map((role) => (
                                            <span key={`${u.id}-${role}`} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${getRoleTone(role)}`}>
                                                {role}
                                                {role !== 'USER' && !isSelf && (
                                                    <button
                                                        type="button"
                                                        disabled={removeRole.isPending}
                                                        onClick={() => {
                                                            if (confirm(`Remove ${role} role from ${u.firstName}?`)) {
                                                                removeRole.mutate({ userId: u.id, role: role as AdminUserRole })
                                                            }
                                                        }}
                                                        className="text-gray-500 hover:text-gray-700 disabled:opacity-40"
                                                        title="Remove role"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </span>
                                        ))}
                                    </div>

                                    {!isSelf && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <Select
                                                value={roleSelection[u.id] ?? ''}
                                                onValueChange={(value) => setRoleSelection(prev => ({ ...prev, [u.id]: value as AdminUserRole }))}
                                            >
                                                <SelectTrigger className="h-9 w-28 border-gray-200 text-xs">
                                                    <SelectValue placeholder="Add role" />
                                                </SelectTrigger>
                                                <SelectContent align="start">
                                                    {availableRoles.map((role) => (
                                                        <SelectItem key={role} value={role} className="text-xs">{role}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {roleSelection[u.id] && (
                                                <button
                                                    type="button"
                                                    disabled={addRole.isPending}
                                                    onClick={() => handleAssignRole(u.id)}
                                                    className="h-9 rounded-lg border border-[#005246] px-3 text-xs font-medium text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50"
                                                >
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {!u.isVerified && (
                                            <button
                                                type="button"
                                                disabled={verifyUser.isPending}
                                                onClick={() => verifyUser.mutate(u.id)}
                                                className="inline-flex items-center justify-center gap-1 rounded-lg border border-green-300 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                                            >
                                                <ShieldCheck size={13} />
                                                Verify
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            disabled={toggleStatus.isPending}
                                            onClick={() => toggleStatus.mutate(u.id)}
                                            className={`inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium disabled:opacity-50 ${u.isDisabled ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50' : 'border-amber-300 text-amber-700 hover:bg-amber-50'}`}
                                        >
                                            <ToggleLeft size={13} />
                                            {u.isDisabled ? 'Enable' : 'Disable'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={deleteUser.isPending}
                                            onClick={() => {
                                                if (confirm(`Permanently delete ${u.firstName}? This cannot be undone.`)) {
                                                    deleteUser.mutate(u.id)
                                                }
                                            }}
                                            className="col-span-2 inline-flex items-center justify-center gap-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 size={13} />
                                            Delete User
                                        </button>
                                    </div>
                                </article>
                            )
                        })}
                    </div>

                    <div className="hidden md:block admin-table-wrapper">
                        <div className="overflow-x-auto">
                            <table className="admin-table" style={{ minWidth: '930px' }}>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Status</th>
                                        <th>Roles</th>
                                        <th>Joined</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => {
                                        const isSelf = !!currentUser?.id && currentUser.id === u.id
                                        const assignedRoles = u.roles?.length ? u.roles.map(r => r.role) : ['USER']
                                        const availableRoles = roleOptions.filter(r => !assignedRoles.includes(r))

                                        return (
                                            <tr key={u.id}>
                                                <td>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                                                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                                        {isSelf && <span className="mt-1 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">You</span>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${u.isVerified ? 'border-green-200 bg-green-100 text-green-700' : 'border-amber-200 bg-amber-100 text-amber-700'}`}>
                                                            {u.isVerified ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                            {u.isVerified ? 'Verified' : 'Unverified'}
                                                        </span>
                                                        <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${u.isDisabled ? 'border-red-200 bg-red-100 text-red-700' : 'border-emerald-200 bg-emerald-100 text-emerald-700'}`}>
                                                            {u.isDisabled ? 'Disabled' : 'Active'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {assignedRoles.map((role) => (
                                                            <span key={`${u.id}-${role}`} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${getRoleTone(role)}`}>
                                                                {role}
                                                                {role !== 'USER' && !isSelf && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={removeRole.isPending}
                                                                        onClick={() => {
                                                                            if (confirm(`Remove ${role} role from ${u.firstName}?`)) {
                                                                                removeRole.mutate({ userId: u.id, role: role as AdminUserRole })
                                                                            }
                                                                        }}
                                                                        className="text-gray-500 hover:text-gray-700 disabled:opacity-40"
                                                                        title="Remove role"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                )}
                                                            </span>
                                                        ))}

                                                        {!isSelf && (
                                                            <div className="flex items-center gap-1">
                                                                <Select
                                                                    value={roleSelection[u.id] ?? ''}
                                                                    onValueChange={(value) => setRoleSelection(prev => ({ ...prev, [u.id]: value as AdminUserRole }))}
                                                                >
                                                                    <SelectTrigger className="h-8 w-24 border-gray-200 text-xs">
                                                                        <SelectValue placeholder="Add" />
                                                                    </SelectTrigger>
                                                                    <SelectContent align="start">
                                                                        {availableRoles.map((role) => (
                                                                            <SelectItem key={role} value={role} className="text-xs">{role}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {roleSelection[u.id] && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={addRole.isPending}
                                                                        onClick={() => handleAssignRole(u.id)}
                                                                        className="h-8 rounded-md border border-[#005246] px-2.5 text-xs font-medium text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-xs text-gray-600 whitespace-nowrap">
                                                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                </td>
                                                <td>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/users/${u.id}`}
                                                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <Eye size={13} />
                                                            View
                                                        </Link>

                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                                                                className="rounded-md border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50"
                                                                title="More actions"
                                                            >
                                                                <MoreVertical size={15} />
                                                            </button>

                                                            {openMenuId === u.id && (
                                                                <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                                                                    {!u.isVerified && (
                                                                        <button
                                                                            type="button"
                                                                            disabled={verifyUser.isPending}
                                                                            onClick={() => {
                                                                                verifyUser.mutate(u.id)
                                                                                setOpenMenuId(null)
                                                                            }}
                                                                            className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                                        >
                                                                            <ShieldCheck size={15} className="text-green-600" />
                                                                            Verify Email
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        type="button"
                                                                        disabled={toggleStatus.isPending}
                                                                        onClick={() => {
                                                                            toggleStatus.mutate(u.id)
                                                                            setOpenMenuId(null)
                                                                        }}
                                                                        className={`flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left text-sm disabled:opacity-50 ${u.isDisabled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-amber-700 hover:bg-amber-50'}`}
                                                                    >
                                                                        <ToggleLeft size={15} />
                                                                        {u.isDisabled ? 'Enable Account' : 'Disable Account'}
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        disabled={deleteUser.isPending}
                                                                        onClick={() => {
                                                                            if (confirm(`Permanently delete ${u.firstName}? This cannot be undone.`)) {
                                                                                deleteUser.mutate(u.id)
                                                                                setOpenMenuId(null)
                                                                            }
                                                                        }}
                                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                                    >
                                                                        <Trash2 size={15} />
                                                                        Delete User
                                                                    </button>
                                                                </div>
                                                            )}
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

                    <div className="admin-card p-4!">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <p className="text-sm text-gray-600">
                                Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> · <span className="font-semibold">{total}</span> users
                            </p>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
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
