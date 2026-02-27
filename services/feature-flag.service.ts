import { apiClient } from "@/lib/axiosClient";
import type { ProviderType } from "@/types/provider";
import type {
    FeatureFlag,
    FeatureFlagCheck,
    UpdateFeatureFlagRequest,
} from "@/types/feature-flag";

// ──────────────────────────────────────────────
// Feature Flag Service
// ──────────────────────────────────────────────

class FeatureFlagService {
    async getAll(): Promise<FeatureFlag[]> {
        const response = await apiClient.get<FeatureFlag[]>("/feature-flag");
        return response.data;
    }

    async check(serviceType: ProviderType): Promise<FeatureFlagCheck> {
        const response = await apiClient.get<FeatureFlagCheck>(`/feature-flag/check/${serviceType}`);
        return response.data;
    }

    async get(serviceType: ProviderType): Promise<FeatureFlag> {
        const response = await apiClient.get<{ data: FeatureFlag }>(`/feature-flag/${serviceType}`);
        return response.data.data;
    }

    async update(serviceType: ProviderType, data: UpdateFeatureFlagRequest): Promise<FeatureFlag> {
        const response = await apiClient.put<{ data: FeatureFlag }>(`/feature-flag/${serviceType}`, data);
        return response.data.data;
    }
}

export const featureFlagService = new FeatureFlagService();
