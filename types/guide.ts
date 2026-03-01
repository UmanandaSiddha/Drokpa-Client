// ──────────────────────────────────────────────
// Local Guide Types
// ──────────────────────────────────────────────

// ─── Entities ────────────────────────────────

export interface LocalGuide {
    id: string;
    providerId: string;
    bio?: string;
    languages: string[];
    specialties: string[];
    basePricePerDay: number;
    imageUrls: string[];
    rating?: number;
    totalReviews: number;
    isActive: boolean;
    addressId?: string;
    provider?: {
        id: string;
        name: string;
    };
    address?: {
        city: string;
        state: string;
    };
    distanceKm?: number;
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateGuideRequest {
    bio?: string;
    languages: string[];
    specialties: string[];
    basePricePerDay: number;
    imageUrls?: string[];
    isActive?: boolean;
    addressId?: string;
}

export interface UpdateGuideRequest extends Partial<CreateGuideRequest> { }

// ─── Query Params ─────────────────────────────

export interface GuideQueryParams {
    page?: number;
    limit?: number;
    keyword?: string;
}
