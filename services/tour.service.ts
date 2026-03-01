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
        const response = await apiClient.get<Tour | { data: Tour }>(`/tours/${id}`);

        // Handle both response formats: raw Tour or { data: Tour }
        if (!response.data) {
            throw new Error('Failed to fetch tour data');
        }

        // If response.data has a 'data' property, use it; otherwise use response.data directly
        const tour = (response.data as any).data || response.data;

        if (!tour || !tour.id) {
            throw new Error('Invalid tour data structure');
        }

        return tour as Tour;
    }

    async getTourBySlug(slug: string): Promise<Tour> {
        const response = await apiClient.get<Tour | { data: Tour }>(`/tours/slug/${slug}`);

        // Handle both response formats: raw Tour or { data: Tour }
        if (!response.data) {
            console.error('[tourService.getTourBySlug] No data in response');
            throw new Error('Failed to fetch tour data');
        }

        // If response.data has a 'data' property, use it; otherwise use response.data directly
        const tour = (response.data as any).data || response.data;

        if (!tour || !tour.id) {
            console.error('[tourService.getTourBySlug] Invalid tour structure:', tour);
            throw new Error('Invalid tour data structure');
        }

        return tour as Tour;
    }

    async createTour(data: CreateTourRequest): Promise<Tour> {
        const response = await apiClient.post<{ data: Tour }>("/tours", data);
        if (!response.data || !response.data.data) {
            throw new Error('Failed to create tour');
        }
        return response.data.data;
    }

    async updateTour(id: string, data: UpdateTourRequest): Promise<Tour> {
        const response = await apiClient.patch<{ data: Tour }>(`/tours/${id}`, data);
        if (!response.data || !response.data.data) {
            throw new Error('Failed to update tour');
        }
        return response.data.data;
    }

    async deleteTour(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/tours/${id}`);
        return response.data;
    }

    async addItineraryDay(tourId: string, data: AddItineraryDayRequest): Promise<TourItinerary> {
        const response = await apiClient.post<{ data: TourItinerary }>(`/tours/${tourId}/itinerary`, data);
        if (!response.data || !response.data.data) {
            throw new Error('Failed to add itinerary day');
        }
        return response.data.data;
    }

    async updateItineraryDay(tourId: string, dayNumber: number, data: Partial<AddItineraryDayRequest>): Promise<TourItinerary> {
        const response = await apiClient.patch<{ data: TourItinerary }>(`/tours/${tourId}/itinerary/${dayNumber}`, data);
        if (!response.data || !response.data.data) {
            throw new Error('Failed to update itinerary day');
        }
        return response.data.data;
    }

    async deleteItineraryDay(tourId: string, dayNumber: number): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/tours/${tourId}/itinerary/${dayNumber}`);
        return response.data;
    }

    async linkPOIToItinerary(itineraryId: string, poiId: string, data: LinkPOIToItineraryRequest): Promise<TourItinerary> {
        const response = await apiClient.post<{ data: TourItinerary }>(`/tours/itinerary/${itineraryId}/poi/${poiId}`, data);
        if (!response.data || !response.data.data) {
            throw new Error('Failed to link POI to itinerary');
        }
        return response.data.data;
    }

    async removePOIFromItinerary(itineraryId: string, poiId: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/tours/itinerary/${itineraryId}/poi/${poiId}`);
        return response.data;
    }

    async reorderPOIs(itineraryId: string, data: ReorderPOIsRequest): Promise<TourItinerary> {
        const response = await apiClient.patch<{ data: TourItinerary }>(`/tours/itinerary/${itineraryId}/reorder`, data);
        if (!response.data || !response.data.data) {
            throw new Error('Failed to reorder POIs');
        }
        return response.data.data;
    }

    // ─── POI endpoints ────────────────────────────

    async getPOIs(params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<POI>> {
        const queryParams = params
            ? { ...params, keyword: params.search }
            : undefined;
        const response = await apiClient.get<PaginatedResponse<POI>>("/pois", { params: queryParams });
        return response.data;
    }

    async getNearbyPOIs(params: { latitude: number; longitude: number; radius?: number }): Promise<POI[]> {
        const response = await apiClient.get<POI[]>("/pois/nearby", { params });
        if (!response.data) {
            throw new Error('Failed to fetch nearby POIs');
        }
        return response.data;
    }

    async getPOI(id: string): Promise<POI> {
        const response = await apiClient.get<POI>(`/pois/${id}`);
        if (!response.data) {
            throw new Error('Failed to fetch POI data');
        }
        return response.data;
    }

    async createPOI(data: CreatePOIRequest): Promise<POI> {
        const response = await apiClient.post<POI>("/pois", data);
        if (!response.data) {
            throw new Error('Failed to create POI');
        }
        return response.data;
    }

    async updatePOI(id: string, data: UpdatePOIRequest): Promise<POI> {
        const response = await apiClient.patch<POI>(`/pois/${id}`, data);
        if (!response.data) {
            throw new Error('Failed to update POI');
        }
        return response.data;
    }

    async deletePOI(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/pois/${id}`);
        return response.data;
    }
}

export const tourService = new TourService();
