'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import type {
    BookingQueryParams,
    RequestTourBookingRequest,
    RequestHomestayBookingRequest,
    RequestVehicleBookingRequest,
    RequestGuideBookingRequest,
    ConfirmBookingRequest,
    RejectBookingRequest,
} from '@/types/booking';

// ─── Query Keys ───────────────────────────────

export const BOOKING_KEYS = {
    mine: (params?: BookingQueryParams) => ['bookings', 'mine', params] as const,
    provider: (params?: BookingQueryParams) => ['bookings', 'provider', params] as const,
    one: (id: string) => ['bookings', id] as const,
};

// ─── Queries ──────────────────────────────────

export function useMyBookings(params?: BookingQueryParams) {
    return useQuery({
        queryKey: BOOKING_KEYS.mine(params),
        queryFn: () => bookingService.getMyBookings(params),
    });
}

export function useProviderBookings(params?: BookingQueryParams) {
    return useQuery({
        queryKey: BOOKING_KEYS.provider(params),
        queryFn: () => bookingService.getProviderBookings(params),
    });
}

export function useBooking(id: string) {
    return useQuery({
        queryKey: BOOKING_KEYS.one(id),
        queryFn: () => bookingService.getBooking(id),
        enabled: !!id,
    });
}

// ─── Mutations ────────────────────────────────

export function useRequestTourBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RequestTourBookingRequest) => bookingService.requestTourBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', 'mine'] }),
    });
}

export function useRequestHomestayBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RequestHomestayBookingRequest) => bookingService.requestHomestayBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', 'mine'] }),
    });
}

export function useRequestVehicleBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RequestVehicleBookingRequest) => bookingService.requestVehicleBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', 'mine'] }),
    });
}

export function useRequestGuideBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RequestGuideBookingRequest) => bookingService.requestGuideBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', 'mine'] }),
    });
}

export function useConfirmBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ConfirmBookingRequest }) =>
            bookingService.confirmBooking(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['bookings'] });
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.one(id) });
        },
    });
}

export function useRejectBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RejectBookingRequest }) =>
            bookingService.rejectBooking(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['bookings'] });
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.one(id) });
        },
    });
}
