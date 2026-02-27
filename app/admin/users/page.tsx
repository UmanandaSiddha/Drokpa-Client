'use client'

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useAdminAllUsers } from '@/hooks/admin'
import { useAdminDeleteUser, useAdminToggleUserStatus, useAdminVerifyUser } from '@/hooks/user'
import { useState } from 'react'
import { Loader2, Trash2, ToggleLeft, ShieldCheck, Search } from 'lucide-react'

function UsersContent() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const { data, isLoading } = useAdminAllUsers({ page, limit: 20, search: debouncedSearch || undefined })
    const deleteUser = useAdminDeleteUser()
    const toggleStatus = useAdminToggleUserStatus()
    const verifyUser = useAdminVerifyUser()

    const handleSearch = (v: string) => {
        setSearch(v)
        clearTimeout((window as any).__adminUserSearch)
            ; (window as any).__adminUserSearch = setTimeout(() => {
                setDebouncedSearch(v)
                setPage(1)
            }, 400)
    }

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <div className="admin-page__titles">
                    <h1 className="admin-page__title">Users</h1>
                    <p className="admin-page__subtitle">Manage all registered users</p>
                </div>
                <div className="admin-search-wrapper">
                    <Search size={15} className="admin-search-icon" />
                    <input
                        type="search"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        className="admin-search"
                    />
                </div>
            </div>

            {isLoading && <div className="admin-loading"><Loader2 size={24} className="admin-loading__spinner" /></div>}

            {data && data.data.length === 0 && !isLoading && (
                <div className="admin-empty">
                    <Search size={36} className="admin-empty__icon" />
                    <p className="admin-empty__title">No users found</p>
                    <p className="admin-empty__body">Try a different search term.</p>
                </div>
            )}

            {data && data.data.length > 0 && (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Verified</th>
                                    <th>Roles</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((u) => (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{u.email}</td>
                                        <td>
                                            <span className={`admin-badge admin-badge--${u.isVerified ? 'active' : 'pending'}`}>
                                                {u.isVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {u.roles?.map(r => r.role).join(', ') || 'USER'}
                                        </td>
                                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <div className="admin-table__actions">
                                                {!u.isVerified && (
                                                    <button
                                                        onClick={() => verifyUser.mutate(u.id)}
                                                        className="admin-icon-btn admin-icon-btn--success"
                                                        title="Verify email"
                                                    >
                                                        <ShieldCheck size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => toggleStatus.mutate(u.id)}
                                                    className="admin-icon-btn"
                                                    title="Toggle active status"
                                                >
                                                    <ToggleLeft size={14} />
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('Permanently delete this user?')) deleteUser.mutate(u.id) }}
                                                    className="admin-icon-btn admin-icon-btn--danger"
                                                    title="Delete user"
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
                    <div className="admin-pagination">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="admin-pagination__btn">← Previous</button>
                        <span className="admin-pagination__info">Page {page} of {data.meta.totalPages} · {data.meta.total} users</span>
                        <button disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="admin-pagination__btn">Next →</button>
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
