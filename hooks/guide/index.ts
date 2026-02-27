'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guideService } from '@/services/guide.service';
import type { CreateGuideRequest, UpdateGuideRequest, GuideQueryParams } from '@/types/guide';

export const GUIDE_KEYS = {
    all: (params?: GuideQueryParams) => ['guides', params] as const,
    one: (id: string) => ['guides', id] as const,
    mine: ['guides', 'mine'] as const,
    nearby: (params?: object) => ['guides', 'nearby', params] as const,
};

export function useGuides(params?: GuideQueryParams) {
    return useQuery({ queryKey: GUIDE_KEYS.all(params), queryFn: () => guideService.getGuides(params) });
}

export function useGuide(id: string) {
    return useQuery({ queryKey: GUIDE_KEYS.one(id), queryFn: () => guideService.getGuide(id), enabled: !!id });
}

export function useNearbyGuides(params?: { latitude: number; longitude: number; radius?: number }) {
    return useQuery({
        queryKey: GUIDE_KEYS.nearby(params),
        queryFn: () => guideService.getNearbyGuides(params!),
        enabled: !!params?.latitude && !!params?.longitude,
    });
}

export function useMyGuides() {
    return useQuery({ queryKey: GUIDE_KEYS.mine, queryFn: () => guideService.getMyGuides() });
}

export function useCreateGuide() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateGuideRequest) => guideService.createGuide(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['guides'] }),
    });
}

export function useUpdateGuide() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateGuideRequest }) => guideService.updateGuide(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['guides'] });
            qc.invalidateQueries({ queryKey: GUIDE_KEYS.one(id) });
        },
    });
}

export function useDeleteGuide() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => guideService.deleteGuide(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['guides'] }),
    });
}
