import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type { ProviderType } from "@/types/provider";
import type {
    ServiceWaitlist,
    JoinWaitlistRequest,
    WaitlistStats,
    WaitlistQueryParams,
} from "@/types/waitlist";

// ──────────────────────────────────────────────
// Service Waitlist Service
// ──────────────────────────────────────────────

class WaitlistService {
    async joinWaitlist(data: JoinWaitlistRequest): Promise<{ message: string; data: Pick<ServiceWaitlist, 'id' | 'serviceType' | 'notified'> }> {
        const response = await apiClient.post<{ message: string; data: Pick<ServiceWaitlist, 'id' | 'serviceType' | 'notified'> }>("/waitlist/join", data);
        return response.data;
    }

    // ─── Admin ────────────────────────────────────

    async getByServiceType(serviceType: ProviderType, params?: WaitlistQueryParams): Promise<PaginatedResponse<ServiceWaitlist>> {
        const response = await apiClient.get<PaginatedResponse<ServiceWaitlist>>(`/waitlist/admin/${serviceType}`, { params });
        return response.data;
    }

    async deleteEntry(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/waitlist/admin/${id}`);
        return response.data;
    }

    async notifyWaitlist(serviceType: ProviderType): Promise<{ notified: number }> {
        const response = await apiClient.post<{ notified: number }>(`/waitlist/admin/${serviceType}/notify`);
        return response.data;
    }

    async getStats(): Promise<WaitlistStats[]> {
        const response = await apiClient.get<WaitlistStats[]>("/waitlist/admin/stats");
        return response.data;
    }
}

export const waitlistService = new WaitlistService();
