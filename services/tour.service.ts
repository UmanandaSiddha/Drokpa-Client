import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type {
    Tour,
    TourItinerary,
    CreateTourRequest,
    UpdateTourRequest,
    AddItineraryDayRequest,
    LinkPOIToItineraryRequest,
    ReorderPOIsRequest,
    TourQueryParams,
    POI,
    CreatePOIRequest,
    UpdatePOIRequest,
} from "@/types/tour";

// ──────────────────────────────────────────────
// Tour Service
// ──────────────────────────────────────────────

class TourService {
    async getTours(params?: TourQueryParams): Promise<PaginatedResponse<Tour>> {
        const response = await apiClient.get<PaginatedResponse<Tour>>("/tours", { params });
        return response.data;
    }

    async getTour(id: string): Promise<Tour> {
        const response = await apiClient.get<{ data: Tour }>(`/tours/${id}`);
        return response.data.data;
    }

    async createTour(data: CreateTourRequest): Promise<Tour> {
        const response = await apiClient.post<{ data: Tour }>("/tours", data);
        return response.data.data;
    }

    async updateTour(id: string, data: UpdateTourRequest): Promise<Tour> {
        const response = await apiClient.patch<{ data: Tour }>(`/tours/${id}`, data);
        return response.data.data;
    }

    async deleteTour(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/tours/${id}`);
        return response.data;
    }

    async addItineraryDay(tourId: string, data: AddItineraryDayRequest): Promise<TourItinerary> {
        const response = await apiClient.post<{ data: TourItinerary }>(`/tours/${tourId}/itinerary`, data);
        return response.data.data;
    }

    async linkPOIToItinerary(itineraryId: string, poiId: string, data: LinkPOIToItineraryRequest): Promise<TourItinerary> {
        const response = await apiClient.post<{ data: TourItinerary }>(`/tours/itinerary/${itineraryId}/poi/${poiId}`, data);
        return response.data.data;
    }

    async reorderPOIs(itineraryId: string, data: ReorderPOIsRequest): Promise<TourItinerary> {
        const response = await apiClient.patch<{ data: TourItinerary }>(`/tours/itinerary/${itineraryId}/reorder`, data);
        return response.data.data;
    }

    // ─── POI endpoints ────────────────────────────

    async getPOIs(params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<POI>> {
        const response = await apiClient.get<PaginatedResponse<POI>>("/poi", { params });
        return response.data;
    }

    async getNearbyPOIs(params: { latitude: number; longitude: number; radius?: number }): Promise<POI[]> {
        const response = await apiClient.get<{ data: POI[] }>("/poi/nearby", { params });
        return response.data.data;
    }

    async getPOI(id: string): Promise<POI> {
        const response = await apiClient.get<{ data: POI }>(`/poi/${id}`);
        return response.data.data;
    }

    async createPOI(data: CreatePOIRequest): Promise<POI> {
        const response = await apiClient.post<{ data: POI }>("/poi", data);
        return response.data.data;
    }

    async updatePOI(id: string, data: UpdatePOIRequest): Promise<POI> {
        const response = await apiClient.patch<{ data: POI }>(`/poi/${id}`, data);
        return response.data.data;
    }

    async deletePOI(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/poi/${id}`);
        return response.data;
    }
}

export const tourService = new TourService();
