// ──────────────────────────────────────────────
// Review Types
// ──────────────────────────────────────────────

import type { ProviderType } from './provider';

// ─── Entities ────────────────────────────────

export interface Review {
    id: string;
    userId: string;
    targetType: ProviderType;
    tourId?: string;
    homestayId?: string;
    rating: number;
    comment?: string;
    bookingId?: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateReviewRequest {
    targetType: ProviderType;
    targetId: string;
    rating: number;
    comment?: string;
    bookingId?: string;
}

export interface UpdateReviewRequest {
    rating?: number;
    comment?: string;
}

// ─── Query Params ─────────────────────────────

export interface ReviewQueryParams {
    page?: number;
    limit?: number;
    sort?: 'rating' | 'date';
}
