'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axiosClient';

// ─── Types ────────────────────────────────────

export interface Tag {
    id: string;
    label: string;
    color: string;
    icon?: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Facility {
    id: string;
    name: string;
    icon: string;
    description?: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id: string;
    street?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
}

export interface POI {
    id: string;
    name: string;
    description?: string;
    specialty: string[];
    imageUrls: string[];
    latitude: number;
    longitude: number;
    addressId?: string;
    address?: Address;
    createdAt: string;
    updatedAt: string;
}

export interface TourItinerary {
    id: string;
    tourId: string;
    dayNumber: number;
    title: string;
    details?: any;
    pois?: POI[];
    createdAt?: string;
    updatedAt?: string;
}

// ─── API Services ─────────────────────────────

const tagService = {
    getAll: (params?: { keyword?: string; page?: number; limit?: number }) => apiClient.get<Tag[]>('/tags', { params }).then((res: any) => res.data),
    getOne: (id: string) => apiClient.get<Tag>(`/tags/${id}`).then((res: any) => res.data),
    create: (data: Partial<Tag>) => apiClient.post<Tag>('/tags', data).then((res: any) => res.data),
    update: (id: string, data: Partial<Tag>) => apiClient.patch<Tag>(`/tags/${id}`, data).then((res: any) => res.data),
    delete: (id: string) => apiClient.delete(`/tags/${id}`).then((res: any) => res.data),
};

const facilityService = {
    getAll: (params?: { keyword?: string; page?: number; limit?: number }) =>
        apiClient.get<{ data: Facility[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/facilities', { params })
            .then((res: any) => res.data),
    getOne: (id: string) => apiClient.get<Facility>(`/facilities/${id}`).then((res: any) => res.data),
    create: (data: Partial<Facility>) => apiClient.post<Facility>('/facilities', data).then((res: any) => res.data),
    update: (id: string, data: Partial<Facility>) => apiClient.patch<Facility>(`/facilities/${id}`, data).then((res: any) => res.data),
    delete: (id: string) => apiClient.delete(`/facilities/${id}`).then((res: any) => res.data),
};

const addressService = {
    getAll: (params?: { keyword?: string; page?: number; limit?: number }) =>
        apiClient.get<{ data: Address[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/addresses', { params })
            .then((res: any) => res.data),
    getOne: (id: string) => apiClient.get<Address>(`/addresses/byId/${id}`).then((res: any) => res.data),
    nearby: (query: { latitude: number; longitude: number; radius?: number }) =>
        apiClient.get<Address[]>('/addresses/nearby', { params: query }).then((res: any) => res.data),
    create: (data: Partial<Address>) => apiClient.post<Address>('/addresses', data).then((res: any) => res.data),
    update: (id: string, data: Partial<Address>) => apiClient.patch<Address>(`/addresses/byId/${id}`, data).then((res: any) => res.data),
    delete: (id: string) => apiClient.delete(`/addresses/byId/${id}`).then((res: any) => res.data),
};

const poiService = {
    getAll: (params?: { keyword?: string; page?: number; limit?: number }) => apiClient.get<POI[]>('/pois', { params }).then((res: any) => res.data),
    getOne: (id: string) => apiClient.get<POI>(`/pois/${id}`).then((res: any) => res.data),
    create: (data: Partial<POI>) => apiClient.post<POI>('/pois', data).then((res: any) => res.data),
    update: (id: string, data: Partial<POI>) => apiClient.patch<POI>(`/pois/${id}`, data).then((res: any) => res.data),
    delete: (id: string) => apiClient.delete(`/pois/${id}`).then((res: any) => res.data),
};

const itineraryService = {
    getByTour: (tourId: string) => apiClient.get<TourItinerary[]>(`/tours/${tourId}/itinerary`).then((res: any) => res.data),
    create: (tourId: string, data: Partial<TourItinerary>) =>
        apiClient.post<TourItinerary>(`/tours/${tourId}/itinerary`, data).then((res: any) => res.data),
    update: (tourId: string, dayNumber: number, data: Partial<TourItinerary>) =>
        apiClient.patch<TourItinerary>(`/tours/${tourId}/itinerary/${dayNumber}`, data).then((res: any) => res.data),
    delete: (tourId: string, dayNumber: number) =>
        apiClient.delete(`/tours/${tourId}/itinerary/${dayNumber}`).then((res: any) => res.data),
    addPOI: (itineraryId: string, poiId: string, order: number) =>
        apiClient.post(`/tours/itinerary/${itineraryId}/poi/${poiId}`, { order }).then((res: any) => res.data),
    removePOI: (itineraryId: string, poiId: string) =>
        apiClient.delete(`/tours/itinerary/${itineraryId}/poi/${poiId}`).then((res: any) => res.data),
};

// ─── Query Keys ───────────────────────────────

export const RESOURCE_KEYS = {
    tags: (params?: any) => ['tags', params] as const,
    tag: (id: string) => ['tags', id] as const,
    facilities: (params?: any) => ['facilities', params] as const,
    facility: (id: string) => ['facilities', id] as const,
    addresses: (params?: any) => ['addresses', params] as const,
    address: (id: string) => ['addresses', id] as const,
    pois: (params?: any) => ['pois', params] as const,
    poi: (id: string) => ['pois', id] as const,
    tourItinerary: (tourId: string) => ['tour-itinerary', tourId] as const,
};

// ─── Tags Hooks ───────────────────────────────

export function useTags(params?: { keyword?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: RESOURCE_KEYS.tags(params),
        queryFn: () => tagService.getAll(params),
    });
}

export function useTag(id: string) {
    return useQuery({
        queryKey: RESOURCE_KEYS.tag(id),
        queryFn: () => tagService.getOne(id),
        enabled: !!id,
    });
}

export function useCreateTag() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Tag>) => tagService.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
    });
}

export function useUpdateTag() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) => tagService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
    });
}

export function useDeleteTag() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tagService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
    });
}

// ─── Facilities Hooks ─────────────────────────

export function useFacilities(params?: { keyword?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: RESOURCE_KEYS.facilities(params),
        queryFn: () => facilityService.getAll(params),
    });
}

export function useFacility(id: string) {
    return useQuery({
        queryKey: RESOURCE_KEYS.facility(id),
        queryFn: () => facilityService.getOne(id),
        enabled: !!id,
    });
}

export function useCreateFacility() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Facility>) => facilityService.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['facilities'] }),
    });
}

export function useUpdateFacility() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Facility> }) => facilityService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['facilities'] }),
    });
}

export function useDeleteFacility() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => facilityService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['facilities'] }),
    });
}

// ─── Addresses Hooks ──────────────────────────

export function useAddresses(params?: { keyword?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: RESOURCE_KEYS.addresses(params),
        queryFn: () => addressService.getAll(params),
    });
}

export function useAddress(id: string) {
    return useQuery({
        queryKey: RESOURCE_KEYS.address(id),
        queryFn: () => addressService.getOne(id),
        enabled: !!id,
    });
}

export function useSearchAddresses() {
    return useMutation({
        mutationFn: (query: { latitude: number; longitude: number; radius?: number }) => addressService.nearby(query),
    });
}

export function useCreateAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Address>) => addressService.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
    });
}

export function useUpdateAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) => addressService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
    });
}

export function useDeleteAddress() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => addressService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
    });
}

// ─── POIs Hooks ───────────────────────────────

export function usePOIs(params?: { keyword?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: RESOURCE_KEYS.pois(params),
        queryFn: () => poiService.getAll(params),
    });
}

export function usePOI(id: string) {
    return useQuery({
        queryKey: RESOURCE_KEYS.poi(id),
        queryFn: () => poiService.getOne(id),
        enabled: !!id,
    });
}

export function useCreatePOI() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<POI>) => poiService.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['pois'] }),
    });
}

export function useUpdatePOI() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<POI> }) => poiService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['pois'] }),
    });
}

export function useDeletePOI() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => poiService.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['pois'] }),
    });
}

// ─── Tour Itinerary Hooks ─────────────────────

export function useTourItinerary(tourId: string) {
    return useQuery({
        queryKey: RESOURCE_KEYS.tourItinerary(tourId),
        queryFn: () => itineraryService.getByTour(tourId),
        enabled: !!tourId,
    });
}

export function useCreateItineraryDay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ tourId, data }: { tourId: string; data: Partial<TourItinerary> }) =>
            itineraryService.create(tourId, data),
        onSuccess: (_: any, variables: { tourId: string; data: Partial<TourItinerary> }) => qc.invalidateQueries({ queryKey: RESOURCE_KEYS.tourItinerary(variables.tourId) }),
    });
}

export function useUpdateItineraryDay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ tourId, dayNumber, data }: { tourId: string; dayNumber: number; data: Partial<TourItinerary> }) =>
            itineraryService.update(tourId, dayNumber, data),
        onSuccess: (_: any, variables: { tourId: string; dayNumber: number; data: Partial<TourItinerary> }) => qc.invalidateQueries({ queryKey: RESOURCE_KEYS.tourItinerary(variables.tourId) }),
    });
}

export function useDeleteItineraryDay() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ tourId, dayNumber }: { tourId: string; dayNumber: number }) =>
            itineraryService.delete(tourId, dayNumber),
        onSuccess: (_: any, variables: { tourId: string; dayNumber: number }) => qc.invalidateQueries({ queryKey: RESOURCE_KEYS.tourItinerary(variables.tourId) }),
    });
}

export function useAddPOIToItinerary() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ itineraryId, poiId, order, tourId }: { itineraryId: string; poiId: string; order: number; tourId: string }) =>
            itineraryService.addPOI(itineraryId, poiId, order),
        onSuccess: (_: any, variables: { itineraryId: string; poiId: string; order: number; tourId: string }) => qc.invalidateQueries({ queryKey: RESOURCE_KEYS.tourItinerary(variables.tourId) }),
    });
}

export function useRemovePOIFromItinerary() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ itineraryId, poiId, tourId }: { itineraryId: string; poiId: string; tourId: string }) =>
            itineraryService.removePOI(itineraryId, poiId),
        onSuccess: (_: any, variables: { itineraryId: string; poiId: string; tourId: string }) => qc.invalidateQueries({ queryKey: RESOURCE_KEYS.tourItinerary(variables.tourId) }),
    });
}
