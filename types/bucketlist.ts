// ──────────────────────────────────────────────
// Bucket List Types
// ──────────────────────────────────────────────

import type { ProviderType } from './provider';

export enum BucketListStatus {
    DRAFT = 'DRAFT',
    PENDING_CHECKOUT = 'PENDING_CHECKOUT',
    CONVERTED_TO_BOOKING = 'CONVERTED_TO_BOOKING',
    EXPIRED = 'EXPIRED',
}

// ─── Entities ────────────────────────────────

export interface BucketListItem {
    id: string;
    bucketListId: string;
    productType: ProviderType;
    tourId?: string;
    homestayId?: string;
    quantity: number;
    startDate?: string;
    endDate?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export interface BucketList {
    id: string;
    userId: string;
    tripName?: string;
    status: BucketListStatus;
    items?: BucketListItem[];
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateBucketListRequest {
    tripName?: string;
}

export interface AddBucketListItemRequest {
    productType: ProviderType;
    productId: string;
    quantity?: number;
    startDate?: string;
    endDate?: string;
    metadata?: Record<string, unknown>;
}

export interface UpdateBucketListItemRequest extends Partial<AddBucketListItemRequest> { }

// ─── Query Params ─────────────────────────────

export interface BucketListQueryParams {
    status?: BucketListStatus;
}
