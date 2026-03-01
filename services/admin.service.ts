import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type { Booking } from "@/types/booking";
import type { User } from "@/types/auth";
import type {
    AdminDashboardStats,
    AdminPaymentStats,
    CancellationPolicy,
    CreateCancellationPolicyRequest,
    UpdateCancellationPolicyRequest,
    AdminBookingQueryParams,
    AdminUserQueryParams,
    CancellationPolicyQueryParams,
} from "@/types/admin";
import type { ProviderType } from "@/types/provider";

// ──────────────────────────────────────────────
// Admin Service
// ──────────────────────────────────────────────

class AdminService {
    async getDashboard(): Promise<AdminDashboardStats> {
        type DashboardApiResponse =
            | AdminDashboardStats
            | {
                totalUsers: number;
                totalProviders: number;
                totalBookings: number;
                totalPayments: number;
                totalRevenue: number;
            };

        const response = await apiClient.get<DashboardApiResponse>("/admin/dashboard");
        const data = response.data;

        if ("users" in data) {
            return data;
        }

        return {
            users: {
                total: data.totalUsers ?? 0,
                active: 0,
                newLast30Days: 0,
            },
            providers: {
                total: data.totalProviders ?? 0,
                verified: data.totalProviders ?? 0,
                pending: 0,
            },
            bookings: {
                total: data.totalBookings ?? 0,
                byStatus: {},
            },
            revenue: {
                totalCaptured: data.totalRevenue ?? 0,
                last30Days: 0,
            },
        };
    }

    async getAllBookings(params?: AdminBookingQueryParams): Promise<PaginatedResponse<Booking>> {
        const response = await apiClient.get<PaginatedResponse<Booking>>("/admin/bookings", { params });
        return response.data;
    }

    async confirmTourBooking(bookingId: string, data: { paymentWindowMinutes?: number }): Promise<Booking> {
        const response = await apiClient.patch<Booking | { data: Booking }>(`/admin/bookings/${bookingId}/tour/confirm`, data);
        return 'data' in response.data ? response.data.data : response.data;
    }

    async rejectTourBooking(bookingId: string, data: { reason: string }): Promise<Booking> {
        const response = await apiClient.patch<Booking | { data: Booking }>(`/admin/bookings/${bookingId}/tour/reject`, data);
        return 'data' in response.data ? response.data.data : response.data;
    }

    async completeBooking(bookingId: string): Promise<Booking> {
        const response = await apiClient.patch<Booking | { data: Booking }>(`/admin/bookings/${bookingId}/complete`);
        return 'data' in response.data ? response.data.data : response.data;
    }

    async assignRole(userId: string, data: { role: 'HOST' | 'VENDOR' | 'GUIDE'; providerTypes?: ProviderType[] }): Promise<User> {
        const response = await apiClient.patch<User | { data: User }>(`/admin/user/${userId}/assign-role`, data);
        return 'data' in response.data ? response.data.data : response.data;
    }

    async getAllUsers(params?: AdminUserQueryParams): Promise<PaginatedResponse<User>> {
        const response = await apiClient.get<PaginatedResponse<User>>("/admin/users", { params });
        return response.data;
    }

    async getPaymentStats(): Promise<AdminPaymentStats> {
        const response = await apiClient.get<AdminPaymentStats>("/admin/payments");
        return response.data;
    }

    // ─── Cancellation Policies ────────────────────

    async createCancellationPolicy(data: CreateCancellationPolicyRequest): Promise<CancellationPolicy> {
        const response = await apiClient.post<{ data: CancellationPolicy }>("/admin/cancellation-policy", data);
        return response.data.data;
    }

    async getCancellationPolicies(params?: CancellationPolicyQueryParams): Promise<CancellationPolicy[]> {
        const response = await apiClient.get<CancellationPolicy[]>("/admin/cancellation-policy", { params });
        return response.data;
    }

    async updateCancellationPolicy(id: string, data: UpdateCancellationPolicyRequest): Promise<CancellationPolicy> {
        const response = await apiClient.patch<{ data: CancellationPolicy }>(`/admin/cancellation-policy/${id}`, data);
        return response.data.data;
    }

    async deleteCancellationPolicy(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/admin/cancellation-policy/${id}`);
        return response.data;
    }

    async deleteReview(reviewId: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/admin/review/${reviewId}`);
        return response.data;
    }
}

export const adminService = new AdminService();
