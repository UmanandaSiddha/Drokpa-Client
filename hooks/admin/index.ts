'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { couponService } from '@/services/coupon.service';
import type {
    AdminBookingQueryParams,
    AdminUserQueryParams,
    CreateCancellationPolicyRequest,
    UpdateCancellationPolicyRequest,
    CancellationPolicyQueryParams,
    AssignRoleRequest,
    AdminUpdateUserRequest,
    AdminSetUserPasswordRequest,
    AdminUserRole,
} from '@/types/admin';
import type {
    CreateCouponRequest,
    UpdateCouponRequest,
    CouponQueryParams,
    AssignCouponUserRequest,
} from '@/types/coupon';

// ─── Query Keys ───────────────────────────────

export const ADMIN_KEYS = {
    dashboard: ['admin', 'dashboard'] as const,
    bookings: (params?: AdminBookingQueryParams) => ['admin', 'bookings', params] as const,
    users: (params?: AdminUserQueryParams) => ['admin', 'users', params] as const,
    user: (id: string) => ['admin', 'user', id] as const,
    paymentStats: ['admin', 'payments'] as const,
    policies: (params?: CancellationPolicyQueryParams) => ['admin', 'policies', params] as const,
    coupons: (params?: CouponQueryParams) => ['admin', 'coupons', params] as const,
    coupon: (id: string) => ['admin', 'coupon', id] as const,
    couponAssignments: (couponId: string) => ['admin', 'coupon', couponId, 'assignments'] as const,
    permits: ['admin', 'permits'] as const,
    permit: (id: string) => ['admin', 'permit', id] as const,
    tours: ['admin', 'tours'] as const,
    tour: (id: string) => ['admin', 'tour', id] as const,
};

// ─── Dashboard ────────────────────────────────

export function useAdminDashboard() {
    return useQuery({
        queryKey: ADMIN_KEYS.dashboard,
        queryFn: () => adminService.getDashboard(),
        staleTime: 1000 * 60 * 2, // 2 minutes — stats change frequently
    });
}

// ─── Bookings ─────────────────────────────────

export function useAdminAllBookings(params?: AdminBookingQueryParams) {
    return useQuery({
        queryKey: ADMIN_KEYS.bookings(params),
        queryFn: () => adminService.getAllBookings(params),
    });
}

export function useAdminConfirmTourBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, paymentWindowMinutes }: { bookingId: string; paymentWindowMinutes?: number }) =>
            adminService.confirmTourBooking(bookingId, { paymentWindowMinutes }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
    });
}

export function useAdminRejectTourBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
            adminService.rejectTourBooking(bookingId, { reason }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
    });
}

export function useAdminCompleteBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (bookingId: string) => adminService.completeBooking(bookingId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
    });
}

// ─── Users ────────────────────────────────────

export function useAdminAllUsers(params?: AdminUserQueryParams) {
    return useQuery({
        queryKey: ADMIN_KEYS.users(params),
        queryFn: () => adminService.getAllUsers(params),
    });
}

export function useAdminAssignRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: AssignRoleRequest }) =>
            adminService.assignRole(userId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });
}

export function useAdminUser(id: string | undefined) {
    return useQuery({
        queryKey: ADMIN_KEYS.user(id!),
        queryFn: () => adminService.getUserById(id!),
        enabled: !!id,
    });
}

export function useAdminUpdateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: AdminUpdateUserRequest }) =>
            adminService.updateUser(userId, data),
        onSuccess: (_, { userId }) => {
            qc.invalidateQueries({ queryKey: ['admin', 'users'] });
            qc.invalidateQueries({ queryKey: ADMIN_KEYS.user(userId) });
        },
    });
}

export function useAdminAddRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: { role: AdminUserRole; providerTypes?: any[] } }) =>
            adminService.addRole(userId, data),
        onSuccess: (_, { userId }) => {
            qc.invalidateQueries({ queryKey: ['admin', 'users'] });
            qc.invalidateQueries({ queryKey: ADMIN_KEYS.user(userId) });
        },
    });
}

export function useAdminRemoveRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: AdminUserRole }) =>
            adminService.removeRole(userId, { role }),
        onSuccess: (_, { userId }) => {
            qc.invalidateQueries({ queryKey: ['admin', 'users'] });
            qc.invalidateQueries({ queryKey: ADMIN_KEYS.user(userId) });
        },
    });
}

export function useAdminSetUserPassword() {
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: AdminSetUserPasswordRequest }) =>
            adminService.setUserPassword(userId, data),
    });
}

// ─── Payments ─────────────────────────────────

export function useAdminPaymentStats() {
    return useQuery({
        queryKey: ADMIN_KEYS.paymentStats,
        queryFn: () => adminService.getPaymentStats(),
    });
}

// ─── Cancellation Policies ────────────────────

export function useCancellationPolicies(params?: CancellationPolicyQueryParams) {
    return useQuery({
        queryKey: ADMIN_KEYS.policies(params),
        queryFn: () => adminService.getCancellationPolicies(params),
    });
}

export function useCreateCancellationPolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCancellationPolicyRequest) => adminService.createCancellationPolicy(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'policies'] }),
    });
}

export function useUpdateCancellationPolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCancellationPolicyRequest }) =>
            adminService.updateCancellationPolicy(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'policies'] }),
    });
}

export function useDeleteCancellationPolicy() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminService.deleteCancellationPolicy(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'policies'] }),
    });
}

export function useAdminDeleteReview() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (reviewId: string) => adminService.deleteReview(reviewId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
            qc.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
}

// ─── Coupons ──────────────────────────────────

export function useAdminCoupons(params?: CouponQueryParams) {
    return useQuery({
        queryKey: ADMIN_KEYS.coupons(params),
        queryFn: () => couponService.getAllCoupons(params),
    });
}

export function useAdminCoupon(id: string | undefined) {
    return useQuery({
        queryKey: ADMIN_KEYS.coupon(id!),
        queryFn: () => couponService.getCouponById(id!),
        enabled: !!id, // Only run query when id exists
    });
}

export function useCreateCoupon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCouponRequest) => couponService.createCoupon(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
    });
}

export function useUpdateCoupon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCouponRequest }) =>
            couponService.updateCoupon(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
            qc.invalidateQueries({ queryKey: ADMIN_KEYS.coupon(id) });
        },
    });
}

export function useDeleteCoupon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => couponService.deleteCoupon(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
    });
}

export function useAssignCouponToUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ couponId, data }: { couponId: string; data: AssignCouponUserRequest }) =>
            couponService.assignCouponToUser(couponId, data),
        onSuccess: (_, { couponId }) => {
            qc.invalidateQueries({ queryKey: ADMIN_KEYS.couponAssignments(couponId) });
        },
    });
}

export function useRemoveCouponFromUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ couponId, userId }: { couponId: string; userId: string }) =>
            couponService.removeCouponFromUser(couponId, userId),
        onSuccess: (_, { couponId }) => {
            qc.invalidateQueries({ queryKey: ADMIN_KEYS.couponAssignments(couponId) });
        },
    });
}

export function useGetCouponAssignments(couponId: string | undefined) {
    return useQuery({
        queryKey: ADMIN_KEYS.couponAssignments(couponId!),
        queryFn: () => couponService.getCouponAssignments(couponId!),
        enabled: !!couponId, // Only run query when couponId exists
    });
}

// ─── Permits ──────────────────────────────────

export { useApprovePermit, useRejectPermit, useSubmitPermit, usePermitsByBooking } from '../permit';

// ─── Tours ────────────────────────────────────

export { useTours, useTour, useCreateTour, useUpdateTour, useDeleteTour, useAddItineraryDay, useLinkPOIToItinerary, usePOIs, usePOI, useCreatePOI, useUpdatePOI, useDeletePOI } from '../tours';
