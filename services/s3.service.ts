import { apiClient } from "@/lib/axiosClient";
import type { MessageResponse } from "@/types/common";

export interface PresignedUrlResponse {
    presignedUrl: string;
    publicUrl: string;
}

export interface UploadUrlRequest {
    uploadType: string;
    contextId: string;
    fileName: string;
    fileType: string;
}

export interface DeleteObjectRequest {
    key: string;
}

class S3Service {
    /**
     * Get a presigned URL for uploading a single file to S3
     */
    async getPresignedUrl(uploadType: string, contextId: string, fileName: string, fileType: string): Promise<PresignedUrlResponse> {
        const response = await apiClient.post<PresignedUrlResponse>("/s3/presigned-url", {
            uploadType,
            contextId,
            fileName,
            fileType,
        });
        return response.data;
    }

    /**
     * Get presigned URLs for uploading multiple files to S3
     */
    async getPresignedUrls(
        uploadType: string,
        contextId: string,
        files: { originalFileName: string; fileType: string }[]
    ): Promise<PresignedUrlResponse[]> {
        const response = await apiClient.post<PresignedUrlResponse[]>("/s3/presigned-urls", {
            uploadType,
            contextId,
            files,
        });
        return response.data;
    }

    /**
     * Upload a file to S3 using a presigned URL
     */
    async uploadFileToS3(presignedUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        onProgress(progress);
                    }
                });
            }

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener("error", () => {
                reject(new Error("Upload failed due to network error"));
            });

            xhr.addEventListener("abort", () => {
                reject(new Error("Upload was cancelled"));
            });

            xhr.open("PUT", presignedUrl, true);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
        });
    }

    /**
     * Delete an object from S3
     */
    async deleteObject(key: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>("/s3", { data: { key } });
        return response.data;
    }
}

export const s3Service = new S3Service();
