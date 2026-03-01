'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicle.service';
import type { CreateVehicleRequest, UpdateVehicleRequest, VehicleQueryParams } from '@/types/vehicle';

export const VEHICLE_KEYS = {
    all: (params?: VehicleQueryParams) => ['vehicles', params] as const,
    one: (id: string) => ['vehicles', id] as const,
    mine: ['vehicles', 'mine'] as const,
    nearby: (params?: object) => ['vehicles', 'nearby', params] as const,
};

export function useVehicles(params?: VehicleQueryParams) {
    return useQuery({ queryKey: VEHICLE_KEYS.all(params), queryFn: () => vehicleService.getVehicles(params) });
}

export function useVehicle(id: string) {
    return useQuery({ queryKey: VEHICLE_KEYS.one(id), queryFn: () => vehicleService.getVehicle(id), enabled: !!id });
}

export function useNearbyVehicles(params?: { latitude: number; longitude: number; radius?: number }) {
    return useQuery({
        queryKey: VEHICLE_KEYS.nearby(params),
        queryFn: () => vehicleService.getNearbyVehicles(params!),
        enabled: !!params?.latitude && !!params?.longitude,
    });
}

export function useMyVehicles() {
    return useQuery({
        queryKey: VEHICLE_KEYS.mine,
        queryFn: async () => {
            const vehicles = await vehicleService.getMyVehicles();
            // Return as paginated response for consistency
            return {
                data: vehicles ?? [],
                meta: {
                    total: vehicles?.length ?? 0,
                    totalPages: 1,
                },
            };
        },
    });
}

export function useCreateVehicle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateVehicleRequest) => vehicleService.createVehicle(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
    });
}

export function useUpdateVehicle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVehicleRequest }) => vehicleService.updateVehicle(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['vehicles'] });
            qc.invalidateQueries({ queryKey: VEHICLE_KEYS.one(id) });
        },
    });
}

export function useDeleteVehicle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => vehicleService.deleteVehicle(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
    });
}
