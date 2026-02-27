// ──────────────────────────────────────────────
// Common / Shared Types
// ──────────────────────────────────────────────

export interface PageMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PageMeta;
}

export interface ApiErrorResponse {
    statusCode: number;
    timestamp: string;
    path: string;
    error: string;
    message?: string;
}

export interface MessageResponse {
    success?: boolean;
    message: string;
}

export interface NearbyQueryParams {
    latitude: number;
    longitude: number;
    radius?: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}
