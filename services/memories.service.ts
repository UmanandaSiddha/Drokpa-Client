import { apiClient } from "@/lib/axiosClient";
import type { MessageResponse } from "@/types/common";
import type {
    Memory,
    CreateMemoryRequest,
    UpdateMemoryRequest,
    MemoryQueryParams,
} from "@/types/memories";

// ──────────────────────────────────────────────
// Memories Service
// ──────────────────────────────────────────────

class MemoriesService {
    async getMemories(params?: MemoryQueryParams): Promise<Memory[]> {
        const response = await apiClient.get<{ data: Memory[] }>("/memories", { params });
        return response.data.data;
    }

    async getMemory(id: string): Promise<Memory> {
        const response = await apiClient.get<{ data: Memory }>(`/memories/${id}`);
        return response.data.data;
    }

    async getMyMemories(): Promise<Memory[]> {
        const response = await apiClient.get<{ data: Memory[] }>("/memories/my-memories");
        return response.data.data;
    }

    async createMemory(data: CreateMemoryRequest): Promise<Memory> {
        const response = await apiClient.post<{ data: Memory }>("/memories", data);
        return response.data.data;
    }

    async updateMemory(id: string, data: UpdateMemoryRequest): Promise<Memory> {
        const response = await apiClient.put<{ data: Memory }>(`/memories/${id}`, data);
        return response.data.data;
    }

    async deleteMemory(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/memories/${id}`);
        return response.data;
    }
}

export const memoriesService = new MemoriesService();
