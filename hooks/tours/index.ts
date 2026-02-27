'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tourService } from '@/services/tour.service';
import type { CreateTourRequest, UpdateTourRequest, AddItineraryDayRequest, TourQueryParams, CreatePOIRequest, UpdatePOIRequest } from '@/types/tour';

// ─── Query Keys ───────────────────────────────

export const TOUR_KEYS = {
    all: (params?: TourQueryParams) => ['tours', params] as const,
    one: (id: string) => ['tours', id] as const,
    pois: (params?: object) => ['pois', params] as const,
    onePoi: (id: string) => ['pois', id] as const,
};

// ─── Tours ────────────────────────────────────

export function useTours(params?: TourQueryParams) {
    return useQuery({
        queryKey: TOUR_KEYS.all(params),
        queryFn: () => tourService.getTours(params),
    });
}

export function useTour(id: string) {
    return useQuery({
        queryKey: TOUR_KEYS.one(id),
        queryFn: () => tourService.getTour(id),
        enabled: !!id,
    });
}

export function useCreateTour() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTourRequest) => tourService.createTour(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tours'] }),
    });
}

export function useUpdateTour() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTourRequest }) => tourService.updateTour(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['tours'] });
            qc.invalidateQueries({ queryKey: TOUR_KEYS.one(id) });
        },
    });
}

export function useDeleteTour() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tourService.deleteTour(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tours'] }),
    });
}

// ─── Itinerary ────────────────────────────────

export function useAddItineraryDay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ tourId, data }: { tourId: string; data: AddItineraryDayRequest }) =>
            tourService.addItineraryDay(tourId, data),
        onSuccess: (_, { tourId }) => qc.invalidateQueries({ queryKey: TOUR_KEYS.one(tourId) }),
    });
}

export function useLinkPOIToItinerary() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ itineraryId, poiId, order }: { itineraryId: string; poiId: string; order: number }) =>
            tourService.linkPOIToItinerary(itineraryId, poiId, { order }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tours'] }),
    });
}

export function useReorderPOIs() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ itineraryId, poiIds }: { itineraryId: string; poiIds: string[] }) =>
            tourService.reorderPOIs(itineraryId, { poiIds }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tours'] }),
    });
}

// ─── POIs ─────────────────────────────────────

export function usePOIs(params?: { page?: number; limit?: number; search?: string }) {
    return useQuery({
        queryKey: TOUR_KEYS.pois(params),
        queryFn: () => tourService.getPOIs(params),
    });
}

export function usePOI(id: string) {
    return useQuery({
        queryKey: TOUR_KEYS.onePoi(id),
        queryFn: () => tourService.getPOI(id),
        enabled: !!id,
    });
}

export function useNearbyPOIs(params?: { latitude: number; longitude: number; radius?: number }) {
    return useQuery({
        queryKey: ['pois', 'nearby', params],
        queryFn: () => tourService.getNearbyPOIs(params!),
        enabled: !!params?.latitude && !!params?.longitude,
    });
}

export function useCreatePOI() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePOIRequest) => tourService.createPOI(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['pois'] }),
    });
}

export function useUpdatePOI() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePOIRequest }) => tourService.updatePOI(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['pois'] });
            qc.invalidateQueries({ queryKey: TOUR_KEYS.onePoi(id) });
        },
    });
}

export function useDeletePOI() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tourService.deletePOI(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['pois'] }),
    });
}
