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
        mutationFn: (data: CreateHomestayRequest) => homestayService.createHomestay(data),
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
        mutationFn: ({ roomId, data }: { roomId: string; data: UpdateRoomRequest }) =>
            homestayService.updateRoom(roomId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['homestays'] }),
    });
}

export function useDeleteRoom() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (roomId: string) => homestayService.deleteRoom(roomId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['homestays'] }),
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
