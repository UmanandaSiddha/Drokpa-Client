import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type {
    Review,
    CreateReviewRequest,
    UpdateReviewRequest,
    ReviewQueryParams,
} from "@/types/review";

// ──────────────────────────────────────────────
// Review Service
// ──────────────────────────────────────────────

class ReviewService {
    async createReview(data: CreateReviewRequest): Promise<Review> {
        const response = await apiClient.post<{ data: Review }>("/review", data);
        return response.data.data;
    }

    async updateReview(id: string, data: UpdateReviewRequest): Promise<Review> {
        const response = await apiClient.patch<{ data: Review }>(`/review/${id}`, data);
        return response.data.data;
    }

    async deleteReview(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/review/${id}`);
        return response.data;
    }

    async getMyReviews(): Promise<Review[]> {
        const response = await apiClient.get<{ data: Review[] }>("/review/my-reviews");
        return response.data.data;
    }

    async getReviewsByTarget(targetType: string, targetId: string, params?: ReviewQueryParams): Promise<PaginatedResponse<Review>> {
        const response = await apiClient.get<PaginatedResponse<Review>>(`/review/${targetType}/${targetId}`, { params });
        return response.data;
    }

    async getReview(id: string): Promise<Review> {
        const response = await apiClient.get<{ data: Review }>(`/review/${id}`);
        return response.data.data;
    }
}

export const reviewService = new ReviewService();
