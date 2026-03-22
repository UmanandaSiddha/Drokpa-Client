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
    CreateTourQuoteRequest,
    CreateTourCustomDateRequestDto,
    CreateBookingFromCustomDateRequestDto,
    CreateIlpBookingDto,
    ApplyCouponRequest,
} from '@/types/booking';

// ─── Query Keys ───────────────────────────────

export const BOOKING_KEYS = {
    all: ['bookings'] as const,
    quotes: () => ['bookings', 'quotes'] as const,
    quote: (tourId: string) => ['bookings', 'quotes', tourId] as const,
    suggestedTreks: (tourId: string) => ['bookings', 'suggestedTreks', tourId] as const,
    dateRequests: () => ['bookings', 'dateRequests'] as const,
    dateRequestsMine: (params?: BookingQueryParams) => ['bookings', 'dateRequests', 'mine', params] as const,
    dateRequest: (id: string) => ['bookings', 'dateRequest', id] as const,
    mine: (params?: BookingQueryParams) => ['bookings', 'mine', params] as const,
    provider: (params?: BookingQueryParams) => ['bookings', 'provider', params] as const,
    last: ['bookings', 'my-last'] as const,
    one: (id: string) => ['bookings', id] as const,
};

// ─── Queries ──────────────────────────────────

export function useTourQuote(data: CreateTourQuoteRequest, enabled = true) {
    return useQuery({
        queryKey: BOOKING_KEYS.quote(data.tourId),
        queryFn: () => bookingService.quoteTourBooking(data),
        enabled,
    });
}

export function useSuggestedTreks(tourId: string, enabled = true) {
    return useQuery({
        queryKey: BOOKING_KEYS.suggestedTreks(tourId),
        queryFn: () => bookingService.getSuggestedTreksForTour(tourId),
        enabled: !!tourId && enabled,
    });
}

export function useMyLastBooking(enabled = true) {
    return useQuery({
        queryKey: BOOKING_KEYS.last,
        queryFn: () => bookingService.getMyLastBooking(),
        enabled,
    });
}

export function useMyBookings(params?: BookingQueryParams) {
    return useQuery({
        queryKey: BOOKING_KEYS.mine(params),
        queryFn: () => bookingService.getMyBookings(params),
    });
}

export function useMyTourCustomDateRequests(params?: BookingQueryParams) {
    return useQuery({
        queryKey: BOOKING_KEYS.dateRequestsMine(params),
        queryFn: () => bookingService.getMyTourCustomDateRequests(params),
    });
}

export function useTourCustomDateRequests(params?: BookingQueryParams) {
    return useQuery({
        queryKey: BOOKING_KEYS.dateRequests(),
        queryFn: () => bookingService.getTourCustomDateRequests(params),
    });
}

export function useTourCustomDateRequest(id: string, enabled = true) {
    return useQuery({
        queryKey: BOOKING_KEYS.dateRequest(id),
        queryFn: () => bookingService.getTourCustomDateRequest(id),
        enabled: !!id && enabled,
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
        onSuccess: () => qc.invalidateQueries({ queryKey: BOOKING_KEYS.mine() }),
    });
}

export function useRequestHomestayBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RequestHomestayBookingRequest) => bookingService.requestHomestayBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOOKING_KEYS.mine() }),
    });
}

export function useRequestVehicleBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RequestVehicleBookingRequest) => bookingService.requestVehicleBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOOKING_KEYS.mine() }),
    });
}

export function useRequestGuideBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RequestGuideBookingRequest) => bookingService.requestGuideBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOOKING_KEYS.mine() }),
    });
}

export function useCreateIlpBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateIlpBookingDto) => bookingService.createIlpBooking(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: BOOKING_KEYS.mine() }),
    });
}

export function useCreateTourCustomDateRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTourCustomDateRequestDto) => bookingService.createTourCustomDateRequest(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.dateRequestsMine() });
        },
    });
}

export function useApproveTourCustomDateRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bookingService.approveTourCustomDateRequest(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.dateRequests() });
        },
    });
}

export function useRejectTourCustomDateRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            bookingService.rejectTourCustomDateRequest(id, reason),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.dateRequests() });
        },
    });
}

export function useCreateBookingFromCustomDateRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBookingFromCustomDateRequestDto) => bookingService.createBookingFromCustomDateRequest(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.mine() });
        },
    });
}

export function useConfirmBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ConfirmBookingRequest }) =>
            bookingService.confirmBooking(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.all });
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
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.all });
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.one(id) });
        },
    });
}

export function useApplyCoupon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, data }: { bookingId: string; data: ApplyCouponRequest }) =>
            bookingService.applyCoupon(bookingId, data),
        onSuccess: (_, { bookingId }) => {
            qc.invalidateQueries({ queryKey: BOOKING_KEYS.one(bookingId) });
        },
    });
}
