import { apiClient } from "@/lib/axiosClient";
import type { MessageResponse } from "@/types/common";
import type {
    Permit,
    SubmitPermitRequest,
    ApprovePermitRequest,
    RejectPermitRequest,
    AttachPermitDocumentRequest,
} from "@/types/permit";

// ──────────────────────────────────────────────
// Permit Service
// ──────────────────────────────────────────────

class PermitService {
    async submitPermit(id: string, data: SubmitPermitRequest): Promise<Permit> {
        const response = await apiClient.post<{ data: Permit }>(`/permit/${id}/submit`, data);
        return response.data.data;
    }

    async getPermitsByBooking(bookingId: string): Promise<Permit[]> {
        const response = await apiClient.get<{ data: Permit[] }>(`/permit/booking/${bookingId}`);
        return response.data.data;
    }

    async getPermit(id: string): Promise<Permit> {
        const response = await apiClient.get<{ data: Permit }>(`/permit/${id}`);
        return response.data.data;
    }

    // ─── Admin actions ────────────────────────────

    async approvePermit(id: string, data: ApprovePermitRequest): Promise<Permit> {
        const response = await apiClient.patch<{ data: Permit }>(`/permit/${id}/approve`, data);
        return response.data.data;
    }

    async rejectPermit(id: string, data: RejectPermitRequest): Promise<Permit> {
        const response = await apiClient.patch<{ data: Permit }>(`/permit/${id}/reject`, data);
        return response.data.data;
    }

    async attachDocument(id: string, data: AttachPermitDocumentRequest): Promise<Permit> {
        const response = await apiClient.post<{ data: Permit }>(`/permit/${id}/document`, data);
        return response.data.data;
    }
}

export const permitService = new PermitService();
