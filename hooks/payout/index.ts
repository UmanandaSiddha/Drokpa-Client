'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payoutService } from '@/services/payout.service';
import type { PayoutQueryParams, CreatePayoutRequest } from '@/types/payout';

export const PAYOUT_KEYS = {
    mine: (params?: PayoutQueryParams) => ['payouts', 'mine', params] as const,
    adminAll: (params?: PayoutQueryParams) => ['payouts', 'admin', params] as const,
    adminProvider: (providerId: string) => ['payouts', 'admin', 'provider', providerId] as const,
    one: (id: string) => ['payouts', id] as const,
};

export function useMyPayouts(params?: PayoutQueryParams) {
    return useQuery({
        queryKey: PAYOUT_KEYS.mine(params),
        queryFn: () => payoutService.getMyPayouts(params),
    });
}

export function usePayout(id: string) {
    return useQuery({
        queryKey: PAYOUT_KEYS.one(id),
        queryFn: () => payoutService.getPayout(id),
        enabled: !!id,
    });
}

export function useAdminPayouts(params?: PayoutQueryParams) {
    return useQuery({
        queryKey: PAYOUT_KEYS.adminAll(params),
        queryFn: () => payoutService.getAllPayoutsAdmin(params),
    });
}

export function useAdminProviderPayouts(providerId: string) {
    return useQuery({
        queryKey: PAYOUT_KEYS.adminProvider(providerId),
        queryFn: () => payoutService.getProviderPayoutsAdmin(providerId),
        enabled: !!providerId,
    });
}

export function useCreatePayout() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePayoutRequest) => payoutService.createPayout(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['payouts'] }),
    });
}

export function useCompletePayout() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => payoutService.completePayout(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['payouts'] }),
    });
}

export function useFailPayout() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => payoutService.failPayout(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['payouts'] }),
    });
}
