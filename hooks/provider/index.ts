'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerService } from '@/services/provider.service';
import type { CompleteOnboardingRequest, InviteProviderRequest, OnboardingQueryParams, ProviderQueryParams } from '@/types/provider';

export const PROVIDER_KEYS = {
    onboardingByToken: (token: string) => ['onboarding', 'token', token] as const,
    allOnboardings: (params?: OnboardingQueryParams) => ['onboarding', 'admin', params] as const,
    pendingOnboardings: ['onboarding', 'admin', 'pending'] as const,
    allProviders: (params?: ProviderQueryParams) => ['providers', 'admin', params] as const,
};

// ─── Public / User ────────────────────────────

export function useOnboardingByToken(token: string) {
    return useQuery({
        queryKey: PROVIDER_KEYS.onboardingByToken(token),
        queryFn: () => providerService.getOnboardingByToken(token),
        enabled: !!token,
        retry: false, // Don't retry on invalid/expired tokens
    });
}

export function useCompleteOnboarding() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CompleteOnboardingRequest) => providerService.completeOnboarding(data),
        onSuccess: () => {
            // Refresh auth cache to pick up new role
            qc.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
}

// ─── Admin ────────────────────────────────────

export function useAdminOnboardings(params?: OnboardingQueryParams) {
    return useQuery({
        queryKey: PROVIDER_KEYS.allOnboardings(params),
        queryFn: () => providerService.getAllOnboardings(params),
    });
}

export function usePendingOnboardings() {
    return useQuery({
        queryKey: PROVIDER_KEYS.pendingOnboardings,
        queryFn: () => providerService.getPendingOnboardings(),
    });
}

export function useInviteProvider() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: InviteProviderRequest) => providerService.inviteProvider(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['onboarding'] }),
    });
}

export function useRevokeOnboarding() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => providerService.revokeOnboarding(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['onboarding'] }),
    });
}

export function useResendOnboarding() {
    return useMutation({
        mutationFn: (id: string) => providerService.resendOnboarding(id),
    });
}

export function useAdminProviders(params?: ProviderQueryParams, enabled: boolean = true) {
    return useQuery({
        queryKey: PROVIDER_KEYS.allProviders(params),
        queryFn: () => providerService.getProvidersAdmin(params),
        enabled,
    });
}

export function useVerifyProvider() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => providerService.verifyProvider(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['providers'] }),
    });
}

export function useSuspendProvider() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => providerService.suspendProvider(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['providers'] }),
    });
}
