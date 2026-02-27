import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse } from "@/types/common";
import type {
    Coupon,
    CouponUserAssignment,
    CreateCouponRequest,
    UpdateCouponRequest,
    CouponQueryParams,
    AssignCouponUserRequest,
    RemoveCouponUserRequest,
    ValidateCouponResponse,
} from "@/types/coupon";

// ──────────────────────────────────────────────
// Coupon Service
// ──────────────────────────────────────────────

class CouponService {
    // ─── Admin: Create & Manage Coupons ────────

    async createCoupon(data: CreateCouponRequest): Promise<Coupon> {
        const response = await apiClient.post<{ data: Coupon }>("/admin/coupons", data);
        return response.data.data;
    }

    async getAllCoupons(params?: CouponQueryParams): Promise<PaginatedResponse<Coupon>> {
        const response = await apiClient.get<PaginatedResponse<Coupon>>("/admin/coupons", { params });
        return response.data;
    }

    async getCouponById(id: string): Promise<Coupon> {
        const response = await apiClient.get<{ data: Coupon }>(`/admin/coupons/${id}`);
        return response.data.data;
    }

    async updateCoupon(id: string, data: UpdateCouponRequest): Promise<Coupon> {
        const response = await apiClient.patch<{ data: Coupon }>(`/admin/coupons/${id}`, data);
        return response.data.data;
    }

    async deleteCoupon(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`/admin/coupons/${id}`);
        return response.data;
    }

    // ─── User Assignments ──────────────────────

    async assignCouponToUser(couponId: string, data: AssignCouponUserRequest): Promise<CouponUserAssignment> {
        const response = await apiClient.post<{ data: CouponUserAssignment }>(
            `/admin/coupons/${couponId}/assign-user`,
            data
        );
        return response.data.data;
    }

    async removeCouponFromUser(couponId: string, userId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(
            `/admin/coupons/${couponId}/users/${userId}`
        );
        return response.data;
    }

    async getCouponAssignments(couponId: string): Promise<CouponUserAssignment[]> {
        const response = await apiClient.get<{ data: CouponUserAssignment[] }>(
            `/admin/coupons/${couponId}/assignments`
        );
        return response.data.data;
    }

    // ─── Coupon Validation (User facing) ───────

    async validateCoupon(code: string, bookingValue?: number): Promise<ValidateCouponResponse> {
        const response = await apiClient.post<ValidateCouponResponse>("/coupons/validate", {
            code,
            bookingValue,
        });
        return response.data;
    }
}

export const couponService = new CouponService();
