import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type {
    Onboarding,
    CompleteOnboardingRequest,
    InviteProviderRequest,
    OnboardingQueryParams,
    Provider,
    ProviderQueryParams,
} from "@/types/provider";

// ──────────────────────────────────────────────
// Provider / Onboarding Service
// ──────────────────────────────────────────────

class ProviderService {
    // ─── Onboarding ───────────────────────────────

    async getOnboardingByToken(token: string): Promise<Onboarding> {
        const response = await apiClient.get<{ data: Onboarding }>(`/onboarding/token/${token}`);
        return response.data.data;
    }

    async completeOnboarding(data: CompleteOnboardingRequest): Promise<{ provider: Provider }> {
        const response = await apiClient.post<{ data: { provider: Provider } }>("/onboarding/complete", data);
        return response.data.data;
    }

    // ─── Admin: Onboarding management ─────────────

    async inviteProvider(data: InviteProviderRequest): Promise<Onboarding> {
        const response = await apiClient.post<{ data: Onboarding }>("/onboarding/admin/invite", data);
        return response.data.data;
    }

    async getAllOnboardings(params?: OnboardingQueryParams): Promise<PaginatedResponse<Onboarding>> {
        const response = await apiClient.get<PaginatedResponse<Onboarding>>("/onboarding/admin/all", { params });
        return response.data;
    }

    async getPendingOnboardings(): Promise<Onboarding[]> {
        const response = await apiClient.get<{ data: Onboarding[] }>("/onboarding/admin/pending");
        return response.data.data;
    }

    async getProviderOnboarding(providerId: string): Promise<Onboarding> {
        const response = await apiClient.get<{ data: Onboarding }>(`/onboarding/admin/provider/${providerId}`);
        return response.data.data;
    }

    async revokeOnboarding(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/onboarding/admin/${id}/revoke`);
        return response.data;
    }

    async resendOnboarding(id: string): Promise<MessageResponse> {
        const response = await apiClient.patch<MessageResponse>(`/onboarding/admin/${id}/resend`);
        return response.data;
    }

    // ─── Admin: Provider management ───────────────

    async getProvidersAdmin(params?: ProviderQueryParams): Promise<PaginatedResponse<Provider>> {
        const response = await apiClient.get<PaginatedResponse<Provider>>("/admin/providers", { params });
        return response.data;
    }

    async verifyProvider(id: string): Promise<Provider> {
        const response = await apiClient.patch<{ data: Provider }>(`/admin/provider/${id}/verify`);
        return response.data.data;
    }

    async suspendProvider(id: string): Promise<Provider> {
        const response = await apiClient.patch<{ data: Provider }>(`/admin/provider/${id}/suspend`);
        return response.data.data;
    }
}

export const providerService = new ProviderService();
