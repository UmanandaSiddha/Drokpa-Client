// ──────────────────────────────────────────────
// Feature Flag Types
// ──────────────────────────────────────────────

import type { ProviderType } from './provider';

// ─── Entities ────────────────────────────────

export interface FeatureFlag {
    id: string;
    serviceType: ProviderType;
    enabled: boolean;
    message?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FeatureFlagCheck {
    enabled: boolean;
    message?: string;
}

// ─── Request Types ────────────────────────────

export interface UpdateFeatureFlagRequest {
    enabled: boolean;
    message?: string;
}
