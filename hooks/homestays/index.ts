'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homestayService } from '@/services/homestay.service';
import type {
    CreateHomestayRequest, UpdateHomestayRequest, HomestayQueryParams,
    CreateRoomRequest, UpdateRoomRequest, SetAvailabilityRequest,
    UpdateSingleAvailabilityRequest, BlockDatesRequest, AddTagsRequest, AddFacilitiesRequest,
    AvailabilityQueryParams,
} from '@/types/homestay';

// ─── Query Keys ───────────────────────────────

export const HOMESTAY_KEYS = {
    all: (params?: HomestayQueryParams) => ['homestays', params] as const,
    one: (id: string) => ['homestays', id] as const,
    mine: ['homestays', 'mine'] as const,
    nearby: (params?: object) => ['homestays', 'nearby', params] as const,
    availability: (homestayId: string, params?: AvailabilityQueryParams) => ['homestays', homestayId, 'availability', params] as const,
    roomAvailability: (roomId: string, params?: AvailabilityQueryParams) => ['rooms', roomId, 'availability', params] as const,
    offlineBookings: (roomId: string) => ['rooms', roomId, 'offline-bookings'] as const,
};

// ─── Homestays ────────────────────────────────

export function useHomestays(params?: HomestayQueryParams) {
    return useQuery({
        queryKey: HOMESTAY_KEYS.all(params),
        queryFn: () => homestayService.getHomestays(params),
    });
}

export function useHomestay(id: string, params?: { checkIn?: string; checkOut?: string }) {
    return useQuery({
        queryKey: HOMESTAY_KEYS.one(id),
        queryFn: () => homestayService.getHomestay(id, params),
        enabled: !!id,
    });
}

export function useNearbyHomestays(params?: { latitude: number; longitude: number; radius?: number }) {
    return useQuery({
        queryKey: HOMESTAY_KEYS.nearby(params),
        queryFn: () => homestayService.getNearbyHomestays(params!),
        enabled: !!params?.latitude && !!params?.longitude,
    });
}

export function useMyHomestays() {
    return useQuery({
        queryKey: HOMESTAY_KEYS.mine,
        queryFn: () => homestayService.getMyHomestays(),
    });
}

export function useCreateHomestay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ data, onBehalfOf }: { data: CreateHomestayRequest; onBehalfOf?: string }) =>
            homestayService.createHomestay(data, onBehalfOf),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['homestays'] });
        },
    });
}

export function useUpdateHomestay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateHomestayRequest }) => homestayService.updateHomestay(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['homestays'] });
            qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(id) });
        },
    });
}

export function useDeleteHomestay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => homestayService.deleteHomestay(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['homestays'] });
        },
    });
}

export function useAddHomestayTags() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ homestayId, data }: { homestayId: string; data: AddTagsRequest }) =>
            homestayService.addTags(homestayId, data),
        onSuccess: (_, { homestayId }) => qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(homestayId) }),
    });
}

export function useRemoveHomestayTag() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ homestayId, tagId }: { homestayId: string; tagId: string }) =>
            homestayService.removeTag(homestayId, tagId),
        onSuccess: (_, { homestayId }) => qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(homestayId) }),
    });
}

export function useAddHomestayFacilities() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ homestayId, data }: { homestayId: string; data: AddFacilitiesRequest }) =>
            homestayService.addFacilities(homestayId, data),
        onSuccess: (_, { homestayId }) => qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(homestayId) }),
    });
}

export function useRemoveHomestayFacility() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ homestayId, facilityId }: { homestayId: string; facilityId: string }) =>
            homestayService.removeFacility(homestayId, facilityId),
        onSuccess: (_, { homestayId }) => qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(homestayId) }),
    });
}

// ─── Rooms ────────────────────────────────────

export function useCreateRoom() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ homestayId, data }: { homestayId: string; data: CreateRoomRequest }) =>
            homestayService.createRoom(homestayId, data),
        onSuccess: (_, { homestayId }) => qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(homestayId) }),
    });
}

export function useUpdateRoom() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ homestayId, roomId, data }: { homestayId: string; roomId: string; data: UpdateRoomRequest }) =>
            homestayService.updateRoom(homestayId, roomId, data),
        onSuccess: (_, { homestayId }) => {
            qc.invalidateQueries({ queryKey: ['homestays'] });
            qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(homestayId) });
        },
    });
}

export function useDeleteRoom() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ homestayId, roomId }: { homestayId: string; roomId: string }) =>
            homestayService.deleteRoom(homestayId, roomId),
        onSuccess: (_, { homestayId }) => {
            qc.invalidateQueries({ queryKey: ['homestays'] });
            qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.one(homestayId) });
        },
    });
}

// ─── Availability ─────────────────────────────

export function useHomestayAvailability(homestayId: string, params: AvailabilityQueryParams) {
    return useQuery({
        queryKey: HOMESTAY_KEYS.availability(homestayId, params),
        queryFn: () => homestayService.getHomestayAvailability(homestayId, params),
        enabled: !!homestayId && !!params.startDate && !!params.endDate,
    });
}

export function useRoomAvailability(roomId: string, params: AvailabilityQueryParams) {
    return useQuery({
        queryKey: HOMESTAY_KEYS.roomAvailability(roomId, params),
        queryFn: () => homestayService.getRoomAvailability(roomId, params),
        enabled: !!roomId && !!params.startDate && !!params.endDate,
    });
}

export function useSetAvailability() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, data }: { roomId: string; data: SetAvailabilityRequest }) =>
            homestayService.setAvailability(roomId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
}

export function useUpdateSingleAvailability() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, data }: { roomId: string; data: UpdateSingleAvailabilityRequest }) =>
            homestayService.updateSingleAvailability(roomId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
}

export function useBlockDates() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, data }: { roomId: string; data: BlockDatesRequest }) =>
            homestayService.blockDates(roomId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
    });
}

// ─── Offline Bookings ─────────────────────────

export function useOfflineBookings(roomId: string) {
    return useQuery({
        queryKey: HOMESTAY_KEYS.offlineBookings(roomId),
        queryFn: () => homestayService.getOfflineBookings(roomId),
        enabled: !!roomId,
    });
}

export function useCreateOfflineBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, data }: { roomId: string; data: any }) =>
            homestayService.createOfflineBooking(roomId, data),
        onSuccess: (_, { roomId }) => {
            qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.offlineBookings(roomId) });
        },
    });
}

export function useUpdateOfflineBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, bookingId, data }: { roomId: string; bookingId: string; data: any }) =>
            homestayService.updateOfflineBooking(roomId, bookingId, data),
        onSuccess: (_, { roomId }) => {
            qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.offlineBookings(roomId) });
        },
    });
}

export function useDeleteOfflineBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, bookingId }: { roomId: string; bookingId: string }) =>
            homestayService.deleteOfflineBooking(roomId, bookingId),
        onSuccess: (_, { roomId }) => {
            qc.invalidateQueries({ queryKey: HOMESTAY_KEYS.offlineBookings(roomId) });
        },
    });
}

