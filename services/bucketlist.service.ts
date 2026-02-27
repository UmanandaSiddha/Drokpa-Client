import { apiClient } from "@/lib/axiosClient";
import type { MessageResponse } from "@/types/common";
import type {
    BucketList,
    BucketListItem,
    CreateBucketListRequest,
    AddBucketListItemRequest,
    UpdateBucketListItemRequest,
    BucketListQueryParams,
} from "@/types/bucketlist";

// ──────────────────────────────────────────────
// Bucket List Service
// ──────────────────────────────────────────────

class BucketListService {
    async getBucketLists(params?: BucketListQueryParams): Promise<BucketList[]> {
        const response = await apiClient.get<{ data: BucketList[] }>("/bucketlist", { params });
        return response.data.data;
    }

    async getBucketList(id: string): Promise<BucketList> {
        const response = await apiClient.get<{ data: BucketList }>(`/bucketlist/${id}`);
        return response.data.data;
    }

    async createBucketList(data: CreateBucketListRequest): Promise<BucketList> {
        const response = await apiClient.post<{ data: BucketList }>("/bucketlist", data);
        return response.data.data;
    }

    async checkout(id: string): Promise<BucketList> {
        const response = await apiClient.post<{ data: BucketList }>(`/bucketlist/${id}/checkout`);
        return response.data.data;
    }

    async deleteBucketList(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/bucketlist/${id}`);
        return response.data;
    }

    async addItem(bucketListId: string, data: AddBucketListItemRequest): Promise<BucketListItem> {
        const response = await apiClient.post<{ data: BucketListItem }>(`/bucketlist/${bucketListId}/item`, data);
        return response.data.data;
    }

    async updateItem(bucketListId: string, itemId: string, data: UpdateBucketListItemRequest): Promise<BucketListItem> {
        const response = await apiClient.patch<{ data: BucketListItem }>(`/bucketlist/${bucketListId}/item/${itemId}`, data);
        return response.data.data;
    }

    async removeItem(bucketListId: string, itemId: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/bucketlist/${bucketListId}/item/${itemId}`);
        return response.data;
    }
}

export const bucketListService = new BucketListService();
