// ──────────────────────────────────────────────
// Address Types
// ──────────────────────────────────────────────

// ─── Entities ────────────────────────────────

export interface Address {
    id: string;
    street?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
    distanceKm?: number;
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateAddressRequest {
    street?: string;
    city: string;
    state: string;
    country?: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> { }

// ─── Query Params ─────────────────────────────

export interface NearbyAddressParams {
    latitude: number;
    longitude: number;
    radius?: number;
}
