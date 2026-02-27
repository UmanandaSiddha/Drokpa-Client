import { apiClient } from "@/lib/axiosClient";
import type {
    PresignedUrlRequest,
    PresignedUrlResponse,
    BulkPresignedUrlRequest,
    BulkPresignedUrlResponse,
    DeleteS3FileRequest,
} from "@/types/upload";

// ──────────────────────────────────────────────
// S3 Upload Service
// ──────────────────────────────────────────────

class UploadService {
    async getPresignedUrl(data: PresignedUrlRequest): Promise<PresignedUrlResponse> {
        const response = await apiClient.post<PresignedUrlResponse>("/s3/presigned-url", data);
        return response.data;
    }

    async getBulkPresignedUrls(data: BulkPresignedUrlRequest): Promise<BulkPresignedUrlResponse> {
        const response = await apiClient.post<BulkPresignedUrlResponse>("/s3/presigned-urls", data);
        return response.data;
    }

    async deleteFile(data: DeleteS3FileRequest): Promise<{ success: boolean }> {
        const response = await apiClient.delete<{ success: boolean }>("/s3", { data });
        return response.data;
    }

    /**
     * Upload a file directly to S3 using a presigned URL.
     * This is a pure fetch call — does NOT go through our backend API.
     */
    async uploadToS3(presignedUrl: string, file: File): Promise<void> {
        await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
        });
    }
}

export const uploadService = new UploadService();
