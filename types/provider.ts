// ──────────────────────────────────────────────
// Provider & Onboarding Types
// ──────────────────────────────────────────────

export enum ProviderStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    NOT_ACTIVE = 'NOT_ACTIVE',
}

export enum ProviderType {
    TOUR_VENDOR = 'TOUR_VENDOR',
    ACTIVITY_VENDOR = 'ACTIVITY_VENDOR',
    HOMESTAY_HOST = 'HOMESTAY_HOST',
    VEHICLE_PARTNER = 'VEHICLE_PARTNER',
    LOCAL_GUIDE = 'LOCAL_GUIDE',
    ILP_VENDOR = 'ILP_VENDOR',
}

// ─── Entities ────────────────────────────────

export interface Provider {
    id: string;
    name: string;
    type: ProviderType[];
    verified: boolean;
    status: ProviderStatus;
    contactNumber: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Onboarding {
    id: string;
    providerType: ProviderType[];
    email: string;
    token: string;
    expiresAt: string;
    completedAt?: string;
    providerId?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CompleteOnboardingRequest {
    token: string;
    providerName: string;
    providerType: ProviderType;
}

export interface InviteProviderRequest {
    email: string;
    providerType: ProviderType;
    message?: string;
}

// ─── Query Params ─────────────────────────────

export interface OnboardingQueryParams {
    page?: number;
    limit?: number;
}

export interface ProviderQueryParams {
    status?: ProviderStatus;
    verified?: boolean;
    page?: number;
    limit?: number;
}
