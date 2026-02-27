import { apiClient } from "@/lib/axiosClient";
import type { MessageResponse } from "@/types/common";
import type {
    ProviderPayout,
    CreatePayoutRequest,
    PayoutQueryParams,
    PayoutListResponse,
} from "@/types/payout";

// ──────────────────────────────────────────────
// Payout Service
// ──────────────────────────────────────────────

class PayoutService {
    async getMyPayouts(params?: PayoutQueryParams): Promise<PayoutListResponse> {
        const response = await apiClient.get<PayoutListResponse>("/payout/my-payouts", { params });
        return response.data;
    }

    async getPayout(id: string): Promise<ProviderPayout> {
        const response = await apiClient.get<{ data: ProviderPayout }>(`/payout/${id}`);
        return response.data.data;
    }

    async createPayout(data: CreatePayoutRequest): Promise<ProviderPayout> {
        const response = await apiClient.post<{ data: ProviderPayout }>("/payout", data);
        return response.data.data;
    }

    async getAllPayoutsAdmin(params?: PayoutQueryParams): Promise<PayoutListResponse> {
        const response = await apiClient.get<PayoutListResponse>("/payout/admin/all", { params });
        return response.data;
    }

    async getProviderPayoutsAdmin(providerId: string): Promise<ProviderPayout[]> {
        const response = await apiClient.get<{ data: ProviderPayout[] }>(`/payout/admin/provider/${providerId}`);
        return response.data.data;
    }

    async completePayout(id: string): Promise<ProviderPayout> {
        const response = await apiClient.patch<{ data: ProviderPayout }>(`/payout/${id}/complete`);
        return response.data.data;
    }

    async failPayout(id: string): Promise<ProviderPayout> {
        const response = await apiClient.patch<{ data: ProviderPayout }>(`/payout/${id}/fail`);
        return response.data.data;
    }
}

export const payoutService = new PayoutService();
