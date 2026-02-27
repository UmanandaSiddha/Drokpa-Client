import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type {
    CommunityJoinRequest,
    CreateCommunityJoinRequest,
    MarkContactedRequest,
    UpdateCommunityNotesRequest,
    CommunityStats,
    CommunityQueryParams,
} from "@/types/community";

// ──────────────────────────────────────────────
// Community Service
// ──────────────────────────────────────────────

class CommunityService {
    async joinCommunity(data: CreateCommunityJoinRequest): Promise<{ message: string; data: Pick<CommunityJoinRequest, 'id' | 'email' | 'contacted'> }> {
        const response = await apiClient.post<{ message: string; data: Pick<CommunityJoinRequest, 'id' | 'email' | 'contacted'> }>("/community/join", data);
        return response.data;
    }

    async checkStatus(email: string): Promise<{ data: Pick<CommunityJoinRequest, 'id' | 'email' | 'contacted'> }> {
        const response = await apiClient.get<{ data: Pick<CommunityJoinRequest, 'id' | 'email' | 'contacted'> }>(`/community/check/${email}`);
        return response.data;
    }

    // ─── Admin ────────────────────────────────────

    async getAllRequests(params?: CommunityQueryParams): Promise<PaginatedResponse<CommunityJoinRequest>> {
        const response = await apiClient.get<PaginatedResponse<CommunityJoinRequest>>("/community/admin/requests", { params });
        return response.data;
    }

    async markContacted(id: string, data?: MarkContactedRequest): Promise<CommunityJoinRequest> {
        const response = await apiClient.patch<{ data: CommunityJoinRequest }>(`/community/admin/requests/${id}/contact`, data);
        return response.data.data;
    }

    async updateNotes(id: string, data: UpdateCommunityNotesRequest): Promise<CommunityJoinRequest> {
        const response = await apiClient.patch<{ data: CommunityJoinRequest }>(`/community/admin/requests/${id}/notes`, data);
        return response.data.data;
    }

    async deleteRequest(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/community/admin/requests/${id}`);
        return response.data;
    }

    async getStats(): Promise<CommunityStats> {
        const response = await apiClient.get<CommunityStats>("/community/admin/stats");
        return response.data;
    }
}

export const communityService = new CommunityService();
