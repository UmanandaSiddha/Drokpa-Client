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
    // Helper to extract homestay from response (handles both wrapped and unwrapped)
    private extractHomestay(payload: any): Homestay {
        return payload?.data ?? payload;
    }

    // Helper to extract homestay array from response (handles both wrapped and unwrapped)
    private extractHomestayList(payload: any): Homestay[] {
        const list = payload?.data ?? payload;
        return Array.isArray(list) ? list : [];
    }

    // Helper to extract room from response (handles both wrapped and unwrapped)
    private extractRoom(payload: any): HomestayRoom {
        return payload?.data ?? payload;
    }

    // Helper to extract availability array from response (handles both wrapped and unwrapped)
    private extractAvailabilityList(payload: any): RoomAvailability[] {
        const list = payload?.data ?? payload;
        return Array.isArray(list) ? list : [];
    }

    // Helper to extract single availability from response (handles both wrapped and unwrapped)
    private extractAvailability(payload: any): RoomAvailability {
        return payload?.data ?? payload;
    }

    async getHomestays(params?: HomestayQueryParams): Promise<PaginatedResponse<Homestay>> {
        const response = await apiClient.get<PaginatedResponse<Homestay>>("/homestay", { params });
        return response.data;
    }

    async getNearbyHomestays(params: { latitude: number; longitude: number; radius?: number }): Promise<Homestay[]> {
        const response = await apiClient.get("/homestay/nearby", { params });
        return this.extractHomestayList(response.data);
    }

    async getHomestay(id: string, params?: { checkIn?: string; checkOut?: string }): Promise<Homestay> {
        const response = await apiClient.get(`/homestay/${id}`, { params });
        return this.extractHomestay(response.data);
    }

    async getHomestayBySlug(slug: string, params?: { checkIn?: string; checkOut?: string }): Promise<Homestay> {
        const response = await apiClient.get(`/homestay/slug/${slug}`, { params });
        return this.extractHomestay(response.data);
    }

    async getMyHomestays(): Promise<Homestay[]> {
        const response = await apiClient.get("/homestay/provider/my-homestays");
        return this.extractHomestayList(response.data);
    }

    async createHomestay(data: CreateHomestayRequest, onBehalfOf?: string): Promise<Homestay> {
        const response = await apiClient.post("/homestay", data, {
            params: onBehalfOf ? { onBehalfOf } : undefined
        });
        return this.extractHomestay(response.data);
    }

    async updateHomestay(id: string, data: UpdateHomestayRequest): Promise<Homestay> {
        const response = await apiClient.patch(`/homestay/${id}`, data);
        return this.extractHomestay(response.data);
    }

    async deleteHomestay(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/homestay/${id}`);
        return response.data;
    }

    async addTags(homestayId: string, data: AddTagsRequest): Promise<Homestay> {
        const response = await apiClient.post(`/homestay/${homestayId}/tags`, data);
        return this.extractHomestay(response.data);
    }

    async removeTag(homestayId: string, tagId: string): Promise<Homestay> {
        const response = await apiClient.delete(`/homestay/${homestayId}/tags/${tagId}`);
        return this.extractHomestay(response.data);
    }

    async addFacilities(homestayId: string, data: AddFacilitiesRequest): Promise<Homestay> {
        const response = await apiClient.post(`/homestay/${homestayId}/facilities`, data);
        return this.extractHomestay(response.data);
    }

    async removeFacility(homestayId: string, facilityId: string): Promise<Homestay> {
        const response = await apiClient.delete(`/homestay/${homestayId}/facilities/${facilityId}`);
        return this.extractHomestay(response.data);
    }

    // ─── Room endpoints ───────────────────────────

    async createRoom(homestayId: string, data: CreateRoomRequest): Promise<HomestayRoom> {
        const response = await apiClient.post(`/homestay/${homestayId}/room`, data);
        return this.extractRoom(response.data);
    }

    async updateRoom(homestayId: string, roomId: string, data: UpdateRoomRequest): Promise<HomestayRoom> {
        const response = await apiClient.patch(`/homestay/${homestayId}/room/${roomId}`, data);
        return this.extractRoom(response.data);
    }

    async deleteRoom(homestayId: string, roomId: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/homestay/${homestayId}/room/${roomId}`);
        return response.data;
    }

    // ─── Room Availability endpoints ──────────────

    async setAvailability(roomId: string, data: SetAvailabilityRequest): Promise<RoomAvailability[]> {
        const response = await apiClient.post(`/room-availability/${roomId}`, data);
        return this.extractAvailabilityList(response.data);
    }

    async updateSingleAvailability(roomId: string, data: UpdateSingleAvailabilityRequest): Promise<RoomAvailability> {
        const response = await apiClient.patch(`/room-availability/${roomId}/date`, data);
        return this.extractAvailability(response.data);
    }

    async blockDates(roomId: string, data: BlockDatesRequest): Promise<RoomAvailability[]> {
        const response = await apiClient.post(`/room-availability/${roomId}/block`, data);
        return this.extractAvailabilityList(response.data);
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

    // ─── Offline Room Booking endpoints ────────────

    async getOfflineBookings(roomId: string): Promise<any[]> {
        const response = await apiClient.get(`/rooms/${roomId}/offline-bookings`);
        const data = response.data?.data ?? response.data;
        return Array.isArray(data) ? data : [];
    }

    async createOfflineBooking(roomId: string, data: any): Promise<any> {
        const response = await apiClient.post(`/rooms/${roomId}/offline-bookings`, data);
        return response.data?.data ?? response.data;
    }

    async updateOfflineBooking(roomId: string, bookingId: string, data: any): Promise<any> {
        const response = await apiClient.patch(`/rooms/${roomId}/offline-bookings/${bookingId}`, data);
        return response.data?.data ?? response.data;
    }

    async deleteOfflineBooking(roomId: string, bookingId: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/rooms/${roomId}/offline-bookings/${bookingId}`);
        return response.data;
    }
}

export const homestayService = new HomestayService();
