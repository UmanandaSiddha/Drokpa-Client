'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoriesService } from '@/services/memories.service';
import { featureFlagService } from '@/services/feature-flag.service';
import { communityService } from '@/services/community.service';
import { waitlistService } from '@/services/waitlist.service';
import { uploadService } from '@/services/upload.service';
import type { CreateMemoryRequest, UpdateMemoryRequest, MemoryQueryParams } from '@/types/memories';
import type { ProviderType } from '@/types/provider';
import type { UpdateFeatureFlagRequest } from '@/types/feature-flag';
import type { CreateCommunityJoinRequest, MarkContactedRequest, UpdateCommunityNotesRequest, CommunityQueryParams } from '@/types/community';
import type { JoinWaitlistRequest } from '@/types/waitlist';
import type { PresignedUrlRequest, BulkPresignedUrlRequest } from '@/types/upload';

// ─────────────────────────────────────────
// Memories Hooks
// ─────────────────────────────────────────

export const MEMORY_KEYS = {
    all: (params?: MemoryQueryParams) => ['memories', params] as const,
    mine: ['memories', 'mine'] as const,
    one: (id: string) => ['memories', id] as const,
};

export function useMemories(params?: MemoryQueryParams) {
    return useQuery({ queryKey: MEMORY_KEYS.all(params), queryFn: () => memoriesService.getMemories(params) });
}
export function useMyMemories() {
    return useQuery({ queryKey: MEMORY_KEYS.mine, queryFn: () => memoriesService.getMyMemories() });
}
export function useMemory(id: string) {
    return useQuery({ queryKey: MEMORY_KEYS.one(id), queryFn: () => memoriesService.getMemory(id), enabled: !!id });
}
export function useCreateMemory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateMemoryRequest) => memoriesService.createMemory(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['memories'] }),
    });
}
export function useUpdateMemory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMemoryRequest }) => memoriesService.updateMemory(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['memories'] });
            qc.invalidateQueries({ queryKey: MEMORY_KEYS.one(id) });
        },
    });
}
export function useDeleteMemory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => memoriesService.deleteMemory(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['memories'] }),
    });
}

// ─────────────────────────────────────────
// Upload Hooks
// ─────────────────────────────────────────

export function usePresignedUrl() {
    return useMutation({
        mutationFn: (data: PresignedUrlRequest) => uploadService.getPresignedUrl(data),
    });
}

export function useBulkPresignedUrls() {
    return useMutation({
        mutationFn: (data: BulkPresignedUrlRequest) => uploadService.getBulkPresignedUrls(data),
    });
}

// ─────────────────────────────────────────
// Feature Flag Hooks
// ─────────────────────────────────────────

export const FEATURE_FLAG_KEYS = {
    all: ['feature-flags'] as const,
    one: (serviceType: ProviderType) => ['feature-flags', serviceType] as const,
    check: (serviceType: ProviderType) => ['feature-flags', 'check', serviceType] as const,
};

export function useFeatureFlags() {
    return useQuery({ queryKey: FEATURE_FLAG_KEYS.all, queryFn: () => featureFlagService.getAll() });
}
export function useFeatureFlag(serviceType: ProviderType) {
    return useQuery({ queryKey: FEATURE_FLAG_KEYS.one(serviceType), queryFn: () => featureFlagService.get(serviceType) });
}
export function useCheckFeatureFlag(serviceType: ProviderType) {
    return useQuery({ queryKey: FEATURE_FLAG_KEYS.check(serviceType), queryFn: () => featureFlagService.check(serviceType) });
}
export function useUpdateFeatureFlag() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ serviceType, data }: { serviceType: ProviderType; data: UpdateFeatureFlagRequest }) =>
            featureFlagService.update(serviceType, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['feature-flags'] }),
    });
}

// ─────────────────────────────────────────
// Community Hooks
// ─────────────────────────────────────────

export const COMMUNITY_KEYS = {
    all: (params?: CommunityQueryParams) => ['community', params] as const,
    stats: ['community', 'stats'] as const,
};

export function useJoinCommunity() {
    return useMutation({
        mutationFn: (data: CreateCommunityJoinRequest) => communityService.joinCommunity(data),
    });
}
export function useCheckCommunityStatus(email: string) {
    return useQuery({
        queryKey: ['community', 'check', email],
        queryFn: () => communityService.checkStatus(email),
        enabled: !!email,
        retry: false,
    });
}
export function useCommunityRequests(params?: CommunityQueryParams) {
    return useQuery({ queryKey: COMMUNITY_KEYS.all(params), queryFn: () => communityService.getAllRequests(params) });
}
export function useCommunityStats() {
    return useQuery({ queryKey: COMMUNITY_KEYS.stats, queryFn: () => communityService.getStats() });
}
export function useMarkCommunityContacted() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data?: MarkContactedRequest }) => communityService.markContacted(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['community'] }),
    });
}
export function useUpdateCommunityNotes() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCommunityNotesRequest }) => communityService.updateNotes(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['community'] }),
    });
}

// ─────────────────────────────────────────
// Waitlist Hooks
// ─────────────────────────────────────────

export function useJoinWaitlist() {
    return useMutation({
        mutationFn: (data: JoinWaitlistRequest) => waitlistService.joinWaitlist(data),
    });
}
export function useWaitlistByServiceType(serviceType: ProviderType, params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['waitlist', serviceType, params],
        queryFn: () => waitlistService.getByServiceType(serviceType, params),
    });
}
export function useWaitlistStats() {
    return useQuery({ queryKey: ['waitlist', 'stats'], queryFn: () => waitlistService.getStats() });
}
export function useNotifyWaitlist() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (serviceType: ProviderType) => waitlistService.notifyWaitlist(serviceType),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['waitlist'] }),
    });
}
