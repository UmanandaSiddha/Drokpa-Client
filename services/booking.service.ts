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
    TourQuote,
    SuggestedTrek,
    CreateTourQuoteRequest,
    BookingDateRequest,
    CreateTourCustomDateRequestDto,
    CreateBookingFromCustomDateRequestDto,
    CreateIlpBookingDto,
    ApplyCouponRequest,
} from "@/types/booking";

type BookingRequestResponse =
    | Booking
    | {
        booking: Booking;
        checkoutUrl?: string;
    };

type ApiPayload<T> =
    | T
    | {
        data?: T;
    };

// ──────────────────────────────────────────────
// Booking Service
// ──────────────────────────────────────────────

class BookingService {
    private extractPayload<T>(payload: ApiPayload<T>): T {
        if (payload && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
            return payload.data;
        }

        return payload as T;
    }

    private unwrapBookingRequestResponse(data: BookingRequestResponse): Booking {
        if (data && typeof data === "object" && "booking" in data) {
            return data.booking;
        }

        return data;
    }

    // ─── Quotes ───────────────────────────────────

    async quoteTourBooking(data: CreateTourQuoteRequest): Promise<TourQuote> {
        const response = await apiClient.post<ApiPayload<TourQuote>>("/booking/tour/quote", data);
        return this.extractPayload(response.data);
    }

    // ─── Suggested Treks ──────────────────────────

    async getSuggestedTreksForTour(tourId: string): Promise<SuggestedTrek[]> {
        const response = await apiClient.get<ApiPayload<SuggestedTrek[]>>(`/booking/tour/${tourId}/suggested-treks`);
        return this.extractPayload(response.data);
    }

    // ─── Request endpoints (USER) ─────────────────

    async requestTourBooking(data: RequestTourBookingRequest): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<BookingRequestResponse>>("/booking/tour/request", data);
        return this.unwrapBookingRequestResponse(this.extractPayload(response.data));
    }

    async requestHomestayBooking(data: RequestHomestayBookingRequest): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<BookingRequestResponse>>("/booking/homestay/request", data);
        return this.unwrapBookingRequestResponse(this.extractPayload(response.data));
    }

    async requestVehicleBooking(data: RequestVehicleBookingRequest): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<BookingRequestResponse>>("/booking/vehicle/request", data);
        return this.unwrapBookingRequestResponse(this.extractPayload(response.data));
    }

    async requestGuideBooking(data: RequestGuideBookingRequest): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<BookingRequestResponse>>("/booking/guide/request", data);
        return this.unwrapBookingRequestResponse(this.extractPayload(response.data));
    }

    async createIlpBooking(data: CreateIlpBookingDto): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<BookingRequestResponse>>("/booking/ilp/request", data);
        return this.unwrapBookingRequestResponse(this.extractPayload(response.data));
    }

    // ─── Custom Date Requests (Tour-specific) ────

    async createTourCustomDateRequest(data: CreateTourCustomDateRequestDto): Promise<BookingDateRequest> {
        const response = await apiClient.post<ApiPayload<BookingDateRequest>>("/booking/tour/custom-date/request", data);
        return this.extractPayload(response.data);
    }

    async getMyTourCustomDateRequests(params?: BookingQueryParams): Promise<PaginatedResponse<BookingDateRequest>> {
        const response = await apiClient.get<PaginatedResponse<BookingDateRequest>>("/booking/tour/custom-date/my-requests", { params });
        return response.data;
    }

    async getTourCustomDateRequests(params?: BookingQueryParams): Promise<PaginatedResponse<BookingDateRequest>> {
        const response = await apiClient.get<PaginatedResponse<BookingDateRequest>>("/booking/tour/custom-date/requests", { params });
        return response.data;
    }

    async getTourCustomDateRequest(id: string): Promise<BookingDateRequest> {
        const response = await apiClient.get<ApiPayload<BookingDateRequest>>(`/booking/tour/custom-date/request/${id}`);
        return this.extractPayload(response.data);
    }

    async approveTourCustomDateRequest(id: string): Promise<BookingDateRequest> {
        const response = await apiClient.post<ApiPayload<BookingDateRequest>>(`/booking/tour/custom-date/approve/${id}`);
        return this.extractPayload(response.data);
    }

    async rejectTourCustomDateRequest(id: string, reason: string): Promise<BookingDateRequest> {
        const response = await apiClient.post<ApiPayload<BookingDateRequest>>(`/booking/tour/custom-date/reject/${id}`, { reason });
        return this.extractPayload(response.data);
    }

    async createBookingFromCustomDateRequest(data: CreateBookingFromCustomDateRequestDto): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<Booking>>("/booking/tour/custom-date/create-booking", data);
        return this.extractPayload(response.data);
    }

    // ─── Provider actions ─────────────────────────

    async confirmBooking(id: string, data: ConfirmBookingRequest): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<Booking>>(`/booking/${id}/confirm`, data);
        return this.extractPayload(response.data);
    }

    async rejectBooking(id: string, data: RejectBookingRequest): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<Booking>>(`/booking/${id}/reject`, data);
        return this.extractPayload(response.data);
    }

    // ─── Coupon ───────────────────────────────────

    async applyCoupon(bookingId: string, data: ApplyCouponRequest): Promise<Booking> {
        const response = await apiClient.post<ApiPayload<Booking>>(`/booking/${bookingId}/apply-coupon`, data);
        return this.extractPayload(response.data);
    }

    // ─── Query endpoints ──────────────────────────

    async getMyLastBooking(): Promise<Booking | null> {
        const response = await apiClient.get<ApiPayload<Booking | null>>("/booking/my-bookings/last");
        return this.extractPayload(response.data);
    }

    async getMyBookings(params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> {
        const response = await apiClient.get<PaginatedResponse<Booking>>("/booking/my-bookings", { params });
        return response.data;
    }

    async getProviderBookings(params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> {
        const response = await apiClient.get<PaginatedResponse<Booking>>("/booking/provider/bookings", { params });
        return response.data;
    }

    async getBooking(id: string): Promise<Booking> {
        const response = await apiClient.get<ApiPayload<Booking>>(`/booking/${id}`);
        return this.extractPayload(response.data);
    }
}

export const bookingService = new BookingService();
