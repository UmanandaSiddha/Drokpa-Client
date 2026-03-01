// ──────────────────────────────────────────────
// Admin Types
// ──────────────────────────────────────────────

import type { ProviderType } from './provider';
import type { Payment } from './payment';

// ─── Dashboard Stats ──────────────────────────

export interface AdminDashboardStats {
    users: {
        total: number;
        active: number;
        newLast30Days: number;
    };
    providers: {
        total: number;
        verified: number;
        pending: number;
    };
    bookings: {
        total: number;
        byStatus: Record<string, number>;
    };
    revenue: {
        totalCaptured: number;
        last30Days: number;
    };
}

export interface AdminPaymentStats {
    totalRevenue: number;
    totalRefunded: number;
    capturedCount: number;
    failedCount: number;
    recentPayments: Payment[];
}

// ─── Cancellation Policy ─────────────────────

export interface CancellationPolicy {
    id: string;
    productType: ProviderType;
    productId: string;
    hoursBefore: number;
    refundPct: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCancellationPolicyRequest {
    productType: ProviderType;
    productId: string;
    hoursBefore: number;
    refundPct: number;
}

export interface UpdateCancellationPolicyRequest {
    hoursBefore?: number;
    refundPct?: number;
}

// ─── Query Params ─────────────────────────────

export interface AdminBookingQueryParams {
    status?: string;
    page?: number;
    limit?: number;
}

export interface AdminUserQueryParams {
    keyword?: string;
    page?: number;
    limit?: number;
}

export interface AdminPaymentQueryParams {
    page?: number;
    limit?: number;
}

export interface CancellationPolicyQueryParams {
    productId?: string;
}

export type AdminAssignableRole = 'HOST' | 'VENDOR' | 'GUIDE';

export interface AssignRoleRequest {
    role: AdminAssignableRole;
    providerTypes?: ProviderType[];
}
