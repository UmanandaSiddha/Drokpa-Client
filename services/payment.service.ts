import { apiClient } from "@/lib/axiosClient";
import type { MessageResponse } from "@/types/common";
import type {
    Payment,
    Refund,
    CreatePaymentRequest,
    CreatePaymentResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    RefundRequest,
} from "@/types/payment";

// ──────────────────────────────────────────────
// Payment Service
// ──────────────────────────────────────────────

class PaymentService {
    async createPaymentOrder(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        const response = await apiClient.post<CreatePaymentResponse>("/payment/create", data);
        return response.data;
    }

    async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
        const response = await apiClient.post<VerifyPaymentResponse>("/payment/verify", data);
        return response.data;
    }

    async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
        const response = await apiClient.get<{ data: Payment[] }>(`/payment/booking/${bookingId}`);
        return response.data.data;
    }

    async getPayment(id: string): Promise<Payment> {
        const response = await apiClient.get<{ data: Payment }>(`/payment/${id}`);
        return response.data.data;
    }

    async refundPayment(data: RefundRequest): Promise<Refund> {
        const response = await apiClient.post<{ data: Refund }>("/payment/refund", data);
        return response.data.data;
    }
}

export const paymentService = new PaymentService();
