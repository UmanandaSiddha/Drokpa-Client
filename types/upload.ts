// ──────────────────────────────────────────────
// S3 Upload Types
// ──────────────────────────────────────────────

export enum UploadType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    AVATAR = 'AVATAR',
    HOMESTAY = 'HOMESTAY',
    VEHICLE = 'VEHICLE',
    TOUR = 'TOUR',
    GUIDE = 'GUIDE',
    PERMIT = 'PERMIT',
    MEMORY = 'MEMORY',
    POI = 'POI',
    DOCUMENT = 'DOCUMENT',
}

// ─── Request Types ────────────────────────────

export interface PresignedUrlRequest {
    uploadType: UploadType;
    contextId: string;
    fileName: string;
    fileType: string;
}

export interface PresignedUrlResponse {
    presignedUrl: string;
    publicUrl: string;
}

export interface BulkPresignedUrlRequest {
    uploadType: UploadType;
    contextId: string;
    files: Array<{
        fileName: string;
        fileType: string;
    }>;
}

export type BulkPresignedUrlResponse = PresignedUrlResponse[];

export interface DeleteS3FileRequest {
    key: string;
}
