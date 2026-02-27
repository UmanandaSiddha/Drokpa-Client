import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type {
    Homestay,
    HomestayRoom,
    CreateHomestayRequest,
    UpdateHomestayRequest,
    CreateRoomRequest,
    UpdateRoomRequest,
    SetAvailabilityRequest,
    UpdateSingleAvailabilityRequest,
    BlockDatesRequest,
    AddTagsRequest,
    AddFacilitiesRequest,
    HomestayQueryParams,
    AvailabilityQueryParams,
    HomestayAvailabilityResponse,
    RoomAvailability,
} from "@/types/homestay";

// ──────────────────────────────────────────────
// Homestay Service
// ──────────────────────────────────────────────

class HomestayService {
    async getHomestays(params?: HomestayQueryParams): Promise<PaginatedResponse<Homestay>> {
        const response = await apiClient.get<PaginatedResponse<Homestay>>("/homestay", { params });
        return response.data;
    }

    async getNearbyHomestays(params: { latitude: number; longitude: number; radius?: number }): Promise<Homestay[]> {
        const response = await apiClient.get<{ data: Homestay[] }>("/homestay/nearby", { params });
        return response.data.data;
    }

    async getHomestay(id: string, params?: { checkIn?: string; checkOut?: string }): Promise<Homestay> {
        const response = await apiClient.get<{ data: Homestay }>(`/homestay/${id}`, { params });
        return response.data.data;
    }

    async getMyHomestays(): Promise<Homestay[]> {
        const response = await apiClient.get<{ data: Homestay[] }>("/homestay/provider/my-homestays");
        return response.data.data;
    }

    async createHomestay(data: CreateHomestayRequest): Promise<Homestay> {
        const response = await apiClient.post<{ data: Homestay }>("/homestay", data);
        return response.data.data;
    }

    async updateHomestay(id: string, data: UpdateHomestayRequest): Promise<Homestay> {
        const response = await apiClient.patch<{ data: Homestay }>(`/homestay/${id}`, data);
        return response.data.data;
    }

    async addTags(homestayId: string, data: AddTagsRequest): Promise<Homestay> {
        const response = await apiClient.post<{ data: Homestay }>(`/homestay/${homestayId}/tags`, data);
        return response.data.data;
    }

    async removeTag(homestayId: string, tagId: string): Promise<Homestay> {
        const response = await apiClient.delete<{ data: Homestay }>(`/homestay/${homestayId}/tags/${tagId}`);
        return response.data.data;
    }

    async addFacilities(homestayId: string, data: AddFacilitiesRequest): Promise<Homestay> {
        const response = await apiClient.post<{ data: Homestay }>(`/homestay/${homestayId}/facilities`, data);
        return response.data.data;
    }

    async removeFacility(homestayId: string, facilityId: string): Promise<Homestay> {
        const response = await apiClient.delete<{ data: Homestay }>(`/homestay/${homestayId}/facilities/${facilityId}`);
        return response.data.data;
    }

    // ─── Room endpoints ───────────────────────────

    async createRoom(homestayId: string, data: CreateRoomRequest): Promise<HomestayRoom> {
        const response = await apiClient.post<{ data: HomestayRoom }>(`/homestay/${homestayId}/room`, data);
        return response.data.data;
    }

    async updateRoom(roomId: string, data: UpdateRoomRequest): Promise<HomestayRoom> {
        const response = await apiClient.patch<{ data: HomestayRoom }>(`/homestay/room/${roomId}`, data);
        return response.data.data;
    }

    async deleteRoom(roomId: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/homestay/room/${roomId}`);
        return response.data;
    }

    // ─── Room Availability endpoints ──────────────

    async setAvailability(roomId: string, data: SetAvailabilityRequest): Promise<RoomAvailability[]> {
        const response = await apiClient.post<{ data: RoomAvailability[] }>(`/room-availability/${roomId}`, data);
        return response.data.data;
    }

    async updateSingleAvailability(roomId: string, data: UpdateSingleAvailabilityRequest): Promise<RoomAvailability> {
        const response = await apiClient.patch<{ data: RoomAvailability }>(`/room-availability/${roomId}/date`, data);
        return response.data.data;
    }

    async blockDates(roomId: string, data: BlockDatesRequest): Promise<RoomAvailability[]> {
        const response = await apiClient.post<{ data: RoomAvailability[] }>(`/room-availability/${roomId}/block`, data);
        return response.data.data;
    }

    async deleteAvailability(roomId: string, params: AvailabilityQueryParams): Promise<{ count: number; message: string }> {
        const response = await apiClient.delete<{ count: number; message: string }>(`/room-availability/${roomId}`, { params });
        return response.data;
    }

    async getHomestayAvailability(homestayId: string, params: AvailabilityQueryParams): Promise<HomestayAvailabilityResponse> {
        const response = await apiClient.get<HomestayAvailabilityResponse>(`/room-availability/homestay/${homestayId}`, { params });
        return response.data;
    }

    async getRoomAvailability(roomId: string, params: AvailabilityQueryParams): Promise<RoomAvailability[]> {
        const response = await apiClient.get<RoomAvailability[]>(`/room-availability/${roomId}`, { params });
        return response.data;
    }
}

export const homestayService = new HomestayService();
