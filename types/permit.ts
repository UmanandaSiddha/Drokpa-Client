// ──────────────────────────────────────────────
// Permit Types
// ──────────────────────────────────────────────

export enum PermitStatus {
    REQUIRED = 'REQUIRED',
    COLLECTING_DOCS = 'COLLECTING_DOCS',
    SUBMITTED = 'SUBMITTED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
}

export enum PermitDocumentType {
    PASSPORT_PHOTO = 'PASSPORT_PHOTO',
    ID_PROOF = 'ID_PROOF',
    SIGNATURE = 'SIGNATURE',
}

// ─── Entities ────────────────────────────────

export interface Permit {
    id: string;
    bookingItemId?: string;
    participantId?: string;
    status: PermitStatus;
    passportPhotoId?: string;
    identityProofId?: string;
    permitDocumentId?: string;
    submittedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    bookingItem?: {
        id: string;
        productType: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface SubmitPermitRequest {
    passportPhotoId: string;
    identityProofId: string;
}

export interface ApprovePermitRequest {
    permitDocumentId?: string;
}

export interface RejectPermitRequest {
    reason: string;
}

export interface AttachPermitDocumentRequest {
    documentId: string;
}
