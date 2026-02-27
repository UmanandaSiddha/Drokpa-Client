'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import type { CreateReviewRequest, UpdateReviewRequest, ReviewQueryParams } from '@/types/review';

export const REVIEW_KEYS = {
    mine: ['reviews', 'mine'] as const,
    byTarget: (targetType: string, targetId: string, params?: ReviewQueryParams) => ['reviews', targetType, targetId, params] as const,
    one: (id: string) => ['reviews', id] as const,
};

export function useReviews(targetType: string, targetId: string, params?: ReviewQueryParams) {
    return useQuery({
        queryKey: REVIEW_KEYS.byTarget(targetType, targetId, params),
        queryFn: () => reviewService.getReviewsByTarget(targetType, targetId, params),
        enabled: !!targetType && !!targetId,
    });
}

export function useReview(id: string) {
    return useQuery({
        queryKey: REVIEW_KEYS.one(id),
        queryFn: () => reviewService.getReview(id),
        enabled: !!id,
    });
}

export function useMyReviewsList() {
    return useQuery({
        queryKey: REVIEW_KEYS.mine,
        queryFn: () => reviewService.getMyReviews(),
    });
}

export function useCreateReview() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateReviewRequest) => reviewService.createReview(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
    });
}

export function useUpdateReview() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateReviewRequest }) => reviewService.updateReview(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
    });
}

export function useDeleteReview() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => reviewService.deleteReview(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
    });
}
