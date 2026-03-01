import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type {
    LocalGuide,
    CreateGuideRequest,
    UpdateGuideRequest,
    GuideQueryParams,
} from "@/types/guide";

// ──────────────────────────────────────────────
// Local Guide Service
// ──────────────────────────────────────────────

class GuideService {
    async getGuides(params?: GuideQueryParams): Promise<PaginatedResponse<LocalGuide>> {
        const response = await apiClient.get<PaginatedResponse<LocalGuide>>("/local-guide", { params });
        return response.data;
    }

    async getNearbyGuides(params: { latitude: number; longitude: number; radius?: number }): Promise<LocalGuide[]> {
        const response = await apiClient.get<{ data: LocalGuide[] }>("/local-guide/nearby", { params });
        return response.data.data;
    }

    async getMyGuides(): Promise<LocalGuide[]> {
        const response = await apiClient.get<{ data: LocalGuide[] }>("/local-guide/provider/my-guides");
        return response.data.data;
    }

    async getGuide(id: string): Promise<LocalGuide> {
        const response = await apiClient.get<{ data: LocalGuide }>(`/local-guide/${id}`);
        return response.data.data;
    }

    async createGuide(data: CreateGuideRequest, onBehalfOf?: string): Promise<LocalGuide> {
        const params = onBehalfOf ? { onBehalfOf } : undefined;
        const response = await apiClient.post<{ data: LocalGuide }>("/local-guide", data, { params });
        return response.data.data;
    }

    async updateGuide(id: string, data: UpdateGuideRequest): Promise<LocalGuide> {
        const response = await apiClient.patch<{ data: LocalGuide }>(`/local-guide/${id}`, data);
        return response.data.data;
    }

    async deleteGuide(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/local-guide/${id}`);
        return response.data;
    }
}

export const guideService = new GuideService();
