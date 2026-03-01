"use client"

import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { useVehicles, useMyVehicles } from '@/hooks/vehicle'
import { useAuth } from '@/hooks/auth/useAuth'
import { useState } from 'react'
import { Loader2, Car, Search, MapPin, Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { VehicleType, Vehicle } from '@/types/vehicle'
// Local fallback for paginated response type
type PaginatedResponse<T> = {
    data: T[];
    meta: {
        total: number;
        totalPages: number;
        [key: string]: any;
    };
};
import { useDebounce } from '@/hooks/useDebounce'

function VehiclesContent() {
    const { user, isAdmin } = useAuth()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)
    const [type, setType] = useState<VehicleType | undefined>(undefined)

    // Use correct query based on role
    const adminQuery = useVehicles({
        page,
        limit: 20,
        keyword: debouncedSearch || undefined,
        type,
    });
    const vendorQuery = useMyVehicles();

    let data: PaginatedResponse<Vehicle>;
    let isLoading: boolean;
    if (isAdmin) {
        data = adminQuery.data ?? { data: [], meta: { total: 0, totalPages: 1 } };
        isLoading = adminQuery.isLoading;
    } else {
        data = vendorQuery.data ?? { data: [], meta: { total: 0, totalPages: 1 } };
        isLoading = vendorQuery.isLoading;
    }

    const vehicles: Vehicle[] = data.data;

    const TYPE_FILTERS = [
        { label: 'All', value: undefined },
        { label: 'Bike', value: VehicleType.BIKE },
        { label: 'Scooty', value: VehicleType.SCOOTY },
        { label: 'Car', value: VehicleType.CAR },
        { label: 'SUV', value: VehicleType.SUV },
        { label: 'Tempo', value: VehicleType.TEMPO },
    ]

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="admin-page">
                <div className="admin-page__header">
                    <div className="admin-page__titles">
                        <h1 className="admin-page__title" style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }}>{isAdmin ? 'All Vehicles' : 'My Vehicles'}</h1>
                        <p className="admin-page__subtitle" style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}>{isAdmin ? 'All vehicle listings on the platform' : 'Manage your vehicle listings'}</p>
                    </div>
                </div>
                <div>
                    {/* Only show search/filter for admin */}
                    {isAdmin && (
                        <div>
                            <div className="admin-search-wrapper" style={{ marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Search vehicles..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="admin-search"
                                />
                            </div>
                            <div className="admin-filters">
                                {TYPE_FILTERS.map(({ label, value }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => { setType(value); setPage(1); }}
                                        className={`admin-filter-chip${type === value ? ' admin-filter-chip--active' : ''}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {isLoading && (
                        <div className="admin-loading">
                            <Loader2 size={24} className="admin-loading__spinner" />
                        </div>
                    )}
                    {vehicles.length === 0 && !isLoading && (
                        <div className="admin-empty">
                            <Car size={36} className="admin-empty__icon" />
                            <p className="admin-empty__title">No vehicles found</p>
                            <p className="admin-empty__body">No vehicle listings match your filters.</p>
                        </div>
                    )}
                    {vehicles.length > 0 && (
                        <div>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Provider</th>
                                            <th>Location</th>
                                            <th>Price/Day</th>
                                            <th>Rating</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((vehicle: Vehicle) => (
                                            <tr key={vehicle.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {vehicle.imageUrls?.[0] ? (
                                                            <img
                                                                src={vehicle.imageUrls[0]}
                                                                alt={vehicle.name}
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Car size={18} color="#9ca3af" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div style={{ fontWeight: 500 }}>{vehicle.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{vehicle.brand} {vehicle.model}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-badge admin-badge--secondary" style={{ textTransform: 'capitalize' }}>
                                                        {typeof vehicle.type === 'string' ? vehicle.type.toLowerCase() : vehicle.type}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                    {vehicle.provider?.name || (vehicle.providerId ? vehicle.providerId.slice(0, 8) : 'N/A')}
                                                </td>
                                                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MapPin size={12} />
                                                        {vehicle.address?.city || vehicle.address?.state || (vehicle.addressId ? vehicle.addressId.slice(0, 8) : 'N/A')}
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 500 }}>
                                                    ₹{vehicle.basePricePerDay?.toLocaleString?.('en-IN') ?? 'N/A'}
                                                </td>
                                                <td style={{ fontSize: '0.85rem' }}>
                                                    {vehicle.rating ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Star size={12} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                                                            <span>{vehicle.rating.toFixed(1)}</span>
                                                            <span style={{ color: '#9ca3af' }}>({vehicle.totalReviews})</span>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#9ca3af' }}>No reviews</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`admin-badge admin-badge--${vehicle.isActive ? 'active' : 'inactive'}`}>
                                                        {vehicle.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="admin-table__actions">
                                                        <Link
                                                            href={`/vehicles/${vehicle.id}`}
                                                            target="_blank"
                                                            className="admin-icon-btn admin-icon-btn--secondary"
                                                            title="View vehicle"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="admin-pagination">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="admin-pagination__btn"
                                >
                                    ← Previous
                                </button>
                                <span className="admin-pagination__info">
                                    Page {page} of {data.meta.totalPages} · {data.meta.total} vehicles
                                </span>
                                <button
                                    type="button"
                                    disabled={page >= data.meta.totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="admin-pagination__btn"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    // ...existing code...
}

export default function VehiclesPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.VENDOR]}>
            <VehiclesContent />
        </RoleGuard>
    )
}
