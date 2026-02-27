import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse } from "@/types/common";
import type {
    Booking,
    BookingQueryParams,
    RequestTourBookingRequest,
    RequestHomestayBookingRequest,
    RequestVehicleBookingRequest,
    RequestGuideBookingRequest,
    ConfirmBookingRequest,
    RejectBookingRequest,
} from "@/types/booking";

// ──────────────────────────────────────────────
// Booking Service
// ──────────────────────────────────────────────

class BookingService {
    // ─── Request endpoints (USER) ─────────────────

    async requestTourBooking(data: RequestTourBookingRequest): Promise<Booking> {
        const response = await apiClient.post<{ data: Booking }>("/booking/tour/request", data);
        return response.data.data;
    }

    async requestHomestayBooking(data: RequestHomestayBookingRequest): Promise<Booking> {
        const response = await apiClient.post<{ data: Booking }>("/booking/homestay/request", data);
        return response.data.data;
    }

    async requestVehicleBooking(data: RequestVehicleBookingRequest): Promise<Booking> {
        const response = await apiClient.post<{ data: Booking }>("/booking/vehicle/request", data);
        return response.data.data;
    }

    async requestGuideBooking(data: RequestGuideBookingRequest): Promise<Booking> {
        const response = await apiClient.post<{ data: Booking }>("/booking/guide/request", data);
        return response.data.data;
    }

    // ─── Provider actions ─────────────────────────

    async confirmBooking(id: string, data: ConfirmBookingRequest): Promise<Booking> {
        const response = await apiClient.post<{ data: Booking }>(`/booking/${id}/confirm`, data);
        return response.data.data;
    }

    async rejectBooking(id: string, data: RejectBookingRequest): Promise<Booking> {
        const response = await apiClient.post<{ data: Booking }>(`/booking/${id}/reject`, data);
        return response.data.data;
    }

    // ─── Query endpoints ──────────────────────────

    async getMyBookings(params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> {
        const response = await apiClient.get<PaginatedResponse<Booking>>("/booking/my-bookings", { params });
        return response.data;
    }

    async getProviderBookings(params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> {
        const response = await apiClient.get<PaginatedResponse<Booking>>("/booking/provider/bookings", { params });
        return response.data;
    }

    async getBooking(id: string): Promise<Booking> {
        const response = await apiClient.get<{ data: Booking }>(`/booking/${id}`);
        return response.data.data;
    }
}

export const bookingService = new BookingService();
