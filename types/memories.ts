// ──────────────────────────────────────────────
// Memories Types
// ──────────────────────────────────────────────

// ─── Entities ────────────────────────────────

export interface Memory {
    id: string;
    title: string;
    description?: string;
    imageUrls: string[];
    userId: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateMemoryRequest {
    title: string;
    description?: string;
    imageUrls: string[];
    location?: string;
}

export interface UpdateMemoryRequest extends Partial<CreateMemoryRequest> { }

// ─── Query Params ─────────────────────────────

export interface MemoryQueryParams {
    userId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
