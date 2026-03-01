import { useState, useCallback } from 'react';
import { s3Service, PresignedUrlResponse } from '@/services/s3.service';

interface UploadProgress {
    fileName: string;
    progress: number;
}

export function useS3Upload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [error, setError] = useState<string | null>(null);

    /**
     * Upload a single file to S3
     */
    const uploadFile = useCallback(
        async (
            file: File,
            uploadType: string,
            contextId: string
        ): Promise<string | null> => {
            try {
                setIsUploading(true);
                setError(null);

                // Get presigned URL
                const { presignedUrl, publicUrl } = await s3Service.getPresignedUrl(
                    uploadType,
                    contextId,
                    file.name,
                    file.type
                );

                // Upload file to S3
                await s3Service.uploadFileToS3(presignedUrl, file, (progress) => {
                    setUploadProgress((prev) => [
                        ...prev.filter((p) => p.fileName !== file.name),
                        { fileName: file.name, progress },
                    ]);
                });

                setUploadProgress((prev) => prev.filter((p) => p.fileName !== file.name));
                return publicUrl;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Upload failed';
                setError(errorMessage);
                return null;
            } finally {
                setIsUploading(false);
            }
        },
        []
    );

    /**
     * Upload multiple files to S3
     */
    const uploadFiles = useCallback(
        async (
            files: File[],
            uploadType: string,
            contextId: string
        ): Promise<string[]> => {
            try {
                setIsUploading(true);
                setError(null);
                const publicUrls: string[] = [];

                for (const file of files) {
                    const { presignedUrl, publicUrl } = await s3Service.getPresignedUrl(
                        uploadType,
                        contextId,
                        file.name,
                        file.type
                    );

                    await s3Service.uploadFileToS3(presignedUrl, file, (progress) => {
                        setUploadProgress((prev) => [
                            ...prev.filter((p) => p.fileName !== file.name),
                            { fileName: file.name, progress },
                        ]);
                    });

                    setUploadProgress((prev) => prev.filter((p) => p.fileName !== file.name));
                    publicUrls.push(publicUrl);
                }

                setUploadProgress([]);
                return publicUrls;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Upload failed';
                setError(errorMessage);
                return [];
            } finally {
                setIsUploading(false);
            }
        },
        []
    );

    /**
     * Delete a file from S3
     */
    const deleteFile = useCallback(async (key: string): Promise<boolean> => {
        try {
            setError(null);
            await s3Service.deleteObject(key);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Delete failed';
            setError(errorMessage);
            return false;
        }
    }, []);

    return {
        isUploading,
        uploadProgress,
        error,
        uploadFile,
        uploadFiles,
        deleteFile,
    };
}
