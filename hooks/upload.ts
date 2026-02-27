'use client'

import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';
import type { PresignedUrlRequest, PresignedUrlResponse, BulkPresignedUrlRequest } from '@/types/upload';
import { useState } from 'react';

export function usePresignedUrl() {
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

    const mutation = useMutation({
        mutationFn: (data: PresignedUrlRequest) => uploadService.getPresignedUrl(data),
    });

    const uploadFile = async (
        request: PresignedUrlRequest,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<PresignedUrlResponse> => {
        const response = await mutation.mutateAsync(request);

        await fetch(response.presignedUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
        });

        return response;
    };

    return {
        ...mutation,
        uploadFile,
        uploadProgress,
    };
}

export function useBulkPresignedUrls() {
    const mutation = useMutation({
        mutationFn: (data: BulkPresignedUrlRequest) => uploadService.getBulkPresignedUrls(data),
    });

    const uploadFiles = async (
        request: BulkPresignedUrlRequest,
        files: File[]
    ): Promise<string[]> => {
        const responses = await mutation.mutateAsync(request);

        const uploadPromises = files.map((file, index) => {
            if (!responses[index]) return Promise.reject('Missing presigned URL');
            return fetch(responses[index].presignedUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });
        });

        await Promise.all(uploadPromises);
        return responses.map((r) => r.publicUrl);
    };

    return {
        ...mutation,
        uploadFiles,
    };
}

/**
 * Simple hook to upload a single file and get the public URL.
 * Handles both getting presigned URL and uploading.
 */
export function useFileUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = async (request: PresignedUrlRequest, file: File): Promise<string | null> => {
        setIsUploading(true);
        setError(null);

        try {
            const presignedUrlResponse = await uploadService.getPresignedUrl(request);

            await fetch(presignedUrlResponse.presignedUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            return presignedUrlResponse.publicUrl;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            setError(message);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        upload,
        isUploading,
        error,
    };
}
