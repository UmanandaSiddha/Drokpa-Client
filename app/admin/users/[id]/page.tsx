'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import { UserRole, Gender } from '@/types/auth'
import type { AdminUserRole } from '@/types/admin'

import { useAdminAddRole, useAdminRemoveRole, useAdminSetUserPassword, useAdminUpdateUser, useAdminUser } from '@/hooks/admin'
import { useAdminDeleteUser, useAdminToggleUserStatus, useAdminVerifyUser } from '@/hooks/user'
import { useAuth } from '@/hooks/auth/useAuth'

export default function AdminUserDetailsPage() {
    const { user: currentUser } = useAuth()
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const userId = params?.id

    const { data, isLoading } = useAdminUser(userId)
    const user = data?.data

    const updateUser = useAdminUpdateUser()
    const addRole = useAdminAddRole()
    const removeRole = useAdminRemoveRole()
    const setPassword = useAdminSetUserPassword()

    const verifyUser = useAdminVerifyUser()
    const toggleStatus = useAdminToggleUserStatus()
    const deleteUser = useAdminDeleteUser()

    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '' as '' | Gender,
        avatarUrl: '',
    })

    const [roleToAdd, setRoleToAdd] = useState<AdminUserRole | ''>('')

    const [password, setPasswordValue] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    useEffect(() => {
        if (!user) return
        setForm({
            email: user.email ?? '',
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            phoneNumber: user.phoneNumber ?? '',
            gender: (user.gender as Gender) ?? '',
            avatarUrl: user.avatarUrl ?? '',
        })
    }, [user])

    const currentRoles = useMemo(() => {
        return user?.roles?.length ? user.roles.map(r => r.role) : (['USER'] as const)
    }, [user])

    const roleOptions: AdminUserRole[] = ['ADMIN', 'HOST', 'VENDOR', 'GUIDE']
    const isSelf = !!currentUser?.id && currentUser.id === user?.id
    const disableRoleActions = isSelf

    const handleSave = () => {
        if (!userId) return
        updateUser.mutate({
            userId,
            data: {
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                phoneNumber: form.phoneNumber || undefined,
                gender: form.gender || undefined,
                avatarUrl: form.avatarUrl || undefined,
            },
        })
    }

    const handleSetPassword = async () => {
        if (!userId) return
        if (!password || password.length < 8) {
            alert('Password must be at least 8 characters')
            return
        }
        if (password !== passwordConfirm) {
            alert('Passwords do not match')
            return
        }

        await setPassword.mutateAsync({ userId, data: { password } })
        setPasswordValue('')
        setPasswordConfirm('')
        alert('Password updated')
    }

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0 space-y-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/users')}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>
                            User Details
                        </h1>
                        {user?.email && <p className="text-sm text-gray-600">{user.email}</p>}
                    </div>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-[#005246]" />
                    </div>
                )}

                {!isLoading && user && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>User ID</Label>
                                <Input value={user.id} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Created</Label>
                                <Input value={new Date(user.createdAt).toLocaleString('en-IN')} disabled />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input value={form.phoneNumber} onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select value={form.gender} onValueChange={(value) => setForm((p) => ({ ...p, gender: value as Gender }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                        <SelectItem value={Gender.OTHER}>Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Avatar URL</Label>
                                <Input value={form.avatarUrl} onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))} placeholder="https://..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Verified</Label>
                                <div className="flex items-center gap-3 h-10">
                                    <Switch checked={user.isVerified} disabled />
                                    {!user.isVerified ? (
                                        <button
                                            type="button"
                                            disabled={verifyUser.isPending}
                                            onClick={() => verifyUser.mutate(user.id)}
                                            className="h-10 px-3 rounded-md border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:hover:bg-transparent text-sm"
                                        >
                                            Verify
                                        </button>
                                    ) : (
                                        <span className="text-sm text-gray-600">Verified</span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Disabled</Label>
                                <div className="flex items-center gap-3 h-10">
                                    <Switch
                                        checked={user.isDisabled}
                                        disabled={toggleStatus.isPending}
                                        onCheckedChange={() => toggleStatus.mutate(user.id)}
                                    />
                                    <span className="text-sm text-gray-600">{user.isDisabled ? 'Disabled' : 'Active'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Roles</Label>
                            <div className="flex flex-wrap gap-2">
                                {currentRoles.map((role) => (
                                    <span key={role} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                                        {role}
                                        {role !== 'USER' && (
                                            <button
                                                type="button"
                                                disabled={disableRoleActions || removeRole.isPending}
                                                onClick={() => {
                                                    if (disableRoleActions) return
                                                    if (confirm(`Remove role ${role}?`)) {
                                                        removeRole.mutate({ userId: user.id, role: role as AdminUserRole })
                                                    }
                                                }}
                                                className="text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:hover:text-gray-500"
                                                title="Remove role"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                <Select value={roleToAdd} onValueChange={(value) => setRoleToAdd(value as AdminUserRole)} disabled={disableRoleActions}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Add role…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <button
                                    type="button"
                                    disabled={disableRoleActions || !roleToAdd || addRole.isPending}
                                    onClick={() => userId && roleToAdd && addRole.mutate({ userId, data: { role: roleToAdd } })}
                                    className="h-10 px-3 rounded-md border border-[#005246] text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50 text-sm"
                                >
                                    Add Role
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={updateUser.isPending}
                                className="h-10 px-4 rounded-md bg-[#005246] text-white hover:bg-[#003d34] disabled:opacity-50 text-sm"
                            >
                                {updateUser.isPending ? 'Saving…' : 'Save Details'}
                            </button>
                            <Link href="/admin/users" className="h-10 px-4 inline-flex items-center rounded-md border border-gray-300 hover:bg-gray-50 text-sm">
                                Back to list
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Permanently delete this user?')) {
                                        deleteUser.mutate(user.id)
                                        router.push('/admin/users')
                                    }
                                }}
                                disabled={deleteUser.isPending}
                                className="h-10 px-4 rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent text-sm"
                            >
                                Delete User
                            </button>
                        </div>

                        <div className="border-t border-gray-200 pt-6 space-y-3">
                            <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>
                                Set Password
                            </h2>
                            <p className="text-sm text-gray-600">
                                Admins can set a new password for the user. The current password is never visible.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" value={password} onChange={(e) => setPasswordValue(e.target.value)} placeholder="Minimum 8 characters" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm Password</Label>
                                    <Input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSetPassword}
                                disabled={setPassword.isPending}
                                className="h-10 px-4 rounded-md border border-[#005246] text-[#005246] hover:bg-[#005246] hover:text-white disabled:opacity-50 text-sm"
                            >
                                {setPassword.isPending ? 'Updating…' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                )}

                {!isLoading && !user && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <p className="text-sm text-gray-600">User not found.</p>
                    </div>
                )}
            </div>
        </RoleGuard>
    )
}
