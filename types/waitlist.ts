// ──────────────────────────────────────────────
// Service Waitlist Types
// ──────────────────────────────────────────────

import type { ProviderType } from './provider';

// ─── Entities ────────────────────────────────

export interface ServiceWaitlist {
    id: string;
    email: string;
    name?: string;
    phoneNumber?: string;
    serviceType: ProviderType;
    location?: string;
    notified: boolean;
    notifiedAt?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface WaitlistStats {
    serviceType: ProviderType;
    total: number;
    notified: number;
    pending: number;
}

// ─── Request Types ────────────────────────────

export interface JoinWaitlistRequest {
    email: string;
    name?: string;
    phoneNumber?: string;
    serviceType: ProviderType;
    location?: string;
}

// ─── Query Params ─────────────────────────────

export interface WaitlistQueryParams {
    page?: number;
    limit?: number;
}
