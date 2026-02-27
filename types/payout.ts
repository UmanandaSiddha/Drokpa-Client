// ──────────────────────────────────────────────
// Payout Types
// ──────────────────────────────────────────────

export enum PayoutStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

// ─── Entities ────────────────────────────────

export interface ProviderPayout {
    id: string;
    providerId: string;
    bookingItemId: string;
    paymentId?: string;
    amount: number;
    platformFee: number;
    netAmount: number;
    periodStart: string;
    periodEnd: string;
    status: PayoutStatus;
    provider?: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PayoutSummary {
    pending: number;
    completed: number;
    totalEarned: number;
    totalPending: number;
}

// ─── Request Types ────────────────────────────

export interface CreatePayoutRequest {
    bookingItemId: string;
    providerId: string;
    amount: number;
    platformFee: number;
    periodStart: string;
    periodEnd: string;
}

// ─── Response Types ───────────────────────────

export interface PayoutListResponse {
    data: ProviderPayout[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
    summary: PayoutSummary;
}

// ─── Query Params ─────────────────────────────

export interface PayoutQueryParams {
    status?: PayoutStatus;
    page?: number;
    limit?: number;
}
