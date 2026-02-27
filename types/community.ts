// ──────────────────────────────────────────────
// Community Join Request Types
// ──────────────────────────────────────────────

// ─── Entities ────────────────────────────────

export interface CommunityJoinRequest {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    location?: string;
    interests: string[];
    message?: string;
    contacted: boolean;
    contactedAt?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CommunityStats {
    total: number;
    contacted: number;
    pending: number;
}

// ─── Request Types ────────────────────────────

export interface CreateCommunityJoinRequest {
    fullName: string;
    email: string;
    phoneNumber: string;
    location?: string;
    interests?: string[];
    message?: string;
}

export interface UpdateCommunityNotesRequest {
    notes: string;
}

export interface MarkContactedRequest {
    notes?: string;
}

// ─── Query Params ─────────────────────────────

export interface CommunityQueryParams {
    contacted?: boolean;
    page?: number;
    limit?: number;
}
