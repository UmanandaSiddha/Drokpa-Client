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
        const response = await apiClient.post<Coupon>("/coupon/admin", data);
        return response.data;
    }

    async getAllCoupons(params?: CouponQueryParams): Promise<PaginatedResponse<Coupon>> {
        const response = await apiClient.get<PaginatedResponse<Coupon>>("/coupon/admin", { params });
        return response.data;
    }

    async getCouponById(id: string): Promise<Coupon> {
        const response = await apiClient.get<Coupon>(`/coupon/admin/${id}`);
        return response.data;
    }

    async updateCoupon(id: string, data: UpdateCouponRequest): Promise<Coupon> {
        const response = await apiClient.patch<Coupon>(`/coupon/admin/${id}`, data);
        return response.data;
    }

    async deleteCoupon(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`/coupon/admin/${id}`);
        return response.data;
    }

    // ─── User Assignments ──────────────────────

    async assignCouponToUser(couponId: string, data: AssignCouponUserRequest): Promise<CouponUserAssignment> {
        const response = await apiClient.post<CouponUserAssignment>(
            `/coupon/admin/${couponId}/assign`,
            data
        );
        return response.data;
    }

    async removeCouponFromUser(couponId: string, userId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(
            `/coupon/admin/${couponId}/assign/${userId}`
        );
        return response.data;
    }

    async getCouponAssignments(couponId: string): Promise<CouponUserAssignment[]> {
        const response = await apiClient.get<CouponUserAssignment[]>(
            `/coupon/admin/${couponId}/usages`
        );
        return response.data;
    }

    // ─── Coupon Validation (User facing) ───────

    async validateCoupon(code: string, bookingValue?: number): Promise<ValidateCouponResponse> {
        const response = await apiClient.post<ValidateCouponResponse>("/coupon/validate", {
            code,
            bookingValue,
        });
        return response.data;
    }
}

export const couponService = new CouponService();
