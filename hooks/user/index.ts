'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import type { UpdateProfileRequest, UpdateEmailRequest, UpdateNotificationPreferencesRequest } from '@/types/auth';
import type { BookingQueryParams } from '@/types/booking';

// ─── Query Keys ───────────────────────────────

export const USER_KEYS = {
    me: ['user', 'me'] as const,
    myBookings: (params?: BookingQueryParams) => ['user', 'bookings', params] as const,
    myReviews: ['user', 'reviews'] as const,
    myBucketLists: ['user', 'bucketlists'] as const,
    allAdmin: (params?: object) => ['admin', 'users', params] as const,
    oneAdmin: (id: string) => ['admin', 'users', id] as const,
};

// ─── Current User Hooks ───────────────────────

export function useMyBookings(params?: BookingQueryParams) {
    return useQuery({
        queryKey: USER_KEYS.myBookings(params),
        queryFn: () => userService.getMyBookings(params),
    });
}

export function useMyReviews() {
    return useQuery({
        queryKey: USER_KEYS.myReviews,
        queryFn: () => userService.getMyReviews(),
    });
}

export function useMyBucketLists() {
    return useQuery({
        queryKey: USER_KEYS.myBucketLists,
        queryFn: () => userService.getMyBucketLists(),
    });
}

export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: USER_KEYS.me });
        },
    });
}

export function useUpdateDetails() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateEmailRequest) => userService.updateDetails(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: USER_KEYS.me });
        },
    });
}

export function useUpdateNotifications() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateNotificationPreferencesRequest) => userService.updateNotifications(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: USER_KEYS.me });
        },
    });
}

export function useDeleteAccount() {
    return useMutation({
        mutationFn: () => userService.deleteAccount(),
    });
}

// ─── Admin User Hooks ─────────────────────────

export function useAdminUsers(params?: { search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: USER_KEYS.allAdmin(params),
        queryFn: () => userService.getAllUsersAdmin(params),
    });
}

export function useAdminUser(id: string) {
    return useQuery({
        queryKey: USER_KEYS.oneAdmin(id),
        queryFn: () => userService.getUserAdmin(id),
        enabled: !!id,
    });
}

export function useAdminDeleteUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.deleteUserAdmin(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });
}

export function useAdminToggleUserStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.updateUserStatus(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });
}

export function useAdminVerifyUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.verifyUserEmail(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });
}
