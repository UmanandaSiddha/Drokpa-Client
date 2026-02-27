import { apiClient } from "@/lib/axiosClient";
import type {
    MeResponse,
    UpdateProfileRequest,
    UpdateEmailRequest,
    UpdateNotificationPreferencesRequest,
    User,
} from "@/types/auth";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type { Booking, BookingQueryParams } from "@/types/booking";
import type { Review } from "@/types/review";
import type { BucketList } from "@/types/bucketlist";

// ──────────────────────────────────────────────
// User Service - All user API calls
// ──────────────────────────────────────────────

class UserService {
    // ─── Current user ────────────────────────────

    async getMe(): Promise<MeResponse> {
        const response = await apiClient.get<MeResponse>("/user/me");
        return response.data;
    }

    async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; data: User }> {
        const response = await apiClient.put<{ message: string; data: User }>("/user/me/profile", data);
        return response.data;
    }

    async updateDetails(data: UpdateEmailRequest): Promise<{ message: string; data: User }> {
        const response = await apiClient.put<{ message: string; data: User }>("/user/me/details", data);
        return response.data;
    }

    async updateNotifications(data: UpdateNotificationPreferencesRequest): Promise<{ message: string; data: Record<string, boolean> }> {
        const response = await apiClient.put<{ message: string; data: Record<string, boolean> }>("/user/me/notifications", data);
        return response.data;
    }

    async getMyBookings(params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> {
        const response = await apiClient.get<{ data: Booking[]; meta: PaginatedResponse<Booking>['meta'] }>("/user/me/bookings", { params });
        return response.data;
    }

    async getMyReviews(): Promise<Review[]> {
        const response = await apiClient.get<{ data: Review[] }>("/user/me/reviews");
        return response.data.data;
    }

    async getMyBucketLists(): Promise<BucketList[]> {
        const response = await apiClient.get<{ data: BucketList[] }>("/user/me/bucket-lists");
        return response.data.data;
    }

    async deleteAccount(): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>("/user/me");
        return response.data;
    }

    // ─── Admin actions ────────────────────────────

    async getAllUsersAdmin(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<User>> {
        const response = await apiClient.get<PaginatedResponse<User>>("/user/admin/all", { params });
        return response.data;
    }

    async getUserAdmin(id: string): Promise<{ data: User }> {
        const response = await apiClient.get<{ data: User }>(`/user/admin/${id}`);
        return response.data;
    }

    async deleteUserAdmin(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/user/admin/${id}`);
        return response.data;
    }

    async updateUserStatus(id: string): Promise<{ id: string; isActive: boolean }> {
        const response = await apiClient.put<{ id: string; isActive: boolean }>(`/user/admin/${id}/status`);
        return response.data;
    }

    async verifyUserEmail(id: string): Promise<MessageResponse> {
        const response = await apiClient.put<MessageResponse>(`/user/admin/${id}/verify`);
        return response.data;
    }
}

export const userService = new UserService();