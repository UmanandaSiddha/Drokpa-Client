'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bucketListService } from '@/services/bucketlist.service';
import type { CreateBucketListRequest, AddBucketListItemRequest, UpdateBucketListItemRequest, BucketListQueryParams } from '@/types/bucketlist';

export const BUCKETLIST_KEYS = {
    all: (params?: BucketListQueryParams) => ['bucketlists', params] as const,
    one: (id: string) => ['bucketlists', id] as const,
};

export function useBucketLists(params?: BucketListQueryParams) {
    return useQuery({ queryKey: BUCKETLIST_KEYS.all(params), queryFn: () => bucketListService.getBucketLists(params) });
}

export function useBucketList(id: string) {
    return useQuery({ queryKey: BUCKETLIST_KEYS.one(id), queryFn: () => bucketListService.getBucketList(id), enabled: !!id });
}

export function useCreateBucketList() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBucketListRequest) => bucketListService.createBucketList(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bucketlists'] }),
    });
}

export function useAddBucketListItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bucketListId, data }: { bucketListId: string; data: AddBucketListItemRequest }) =>
            bucketListService.addItem(bucketListId, data),
        onSuccess: (_, { bucketListId }) => qc.invalidateQueries({ queryKey: BUCKETLIST_KEYS.one(bucketListId) }),
    });
}

export function useUpdateBucketListItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bucketListId, itemId, data }: { bucketListId: string; itemId: string; data: UpdateBucketListItemRequest }) =>
            bucketListService.updateItem(bucketListId, itemId, data),
        onSuccess: (_, { bucketListId }) => qc.invalidateQueries({ queryKey: BUCKETLIST_KEYS.one(bucketListId) }),
    });
}

export function useRemoveBucketListItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ bucketListId, itemId }: { bucketListId: string; itemId: string }) =>
            bucketListService.removeItem(bucketListId, itemId),
        onSuccess: (_, { bucketListId }) => qc.invalidateQueries({ queryKey: BUCKETLIST_KEYS.one(bucketListId) }),
    });
}

export function useDeleteBucketList() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bucketListService.deleteBucketList(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bucketlists'] }),
    });
}

export function useCheckoutBucketList() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bucketListService.checkout(id),
        onSuccess: (_, id) => qc.invalidateQueries({ queryKey: BUCKETLIST_KEYS.one(id) }),
    });
}
