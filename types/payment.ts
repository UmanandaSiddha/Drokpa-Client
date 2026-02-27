// ──────────────────────────────────────────────
// Payment Types
// ──────────────────────────────────────────────

export enum PaymentStatus {
    CREATED = 'CREATED',
    AUTHORIZED = 'AUTHORIZED',
    CAPTURED = 'CAPTURED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
    RAZORPAY = 'RAZORPAY',
    STRIPE = 'STRIPE',
}

export enum MethodEnum {
    CARD = 'CARD',
    UPI = 'UPI',
    NETBANKING = 'NETBANKING',
    WALLET = 'WALLET',
}

export enum RefundStatus {
    INITIATED = 'INITIATED',
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
}

// ─── Entities ────────────────────────────────

export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    provider: PaymentProvider;
    providerOrderId?: string;
    providerPaymentId?: string;
    notes?: string;
    method?: MethodEnum;
    bookingId?: string;
    failureReason?: string;
    capturedAt?: string;
    failedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Refund {
    id: string;
    paymentId: string;
    amount: number;
    reason?: string;
    status: RefundStatus;
    providerRefundId?: string;
    processedAt?: string;
    failedAt?: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreatePaymentRequest {
    bookingId: string;
    amount: number;
    currency?: string;
    notes?: string;
}

export interface CreatePaymentResponse {
    orderId: string;
    amount: number;
    currency: string;
    paymentId: string;
    keyId: string;
}

export interface VerifyPaymentRequest {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    booking: {
        id: string;
        status: string;
        paidAmount: number;
    };
}

export interface RefundRequest {
    paymentId: string;
    amount: number;
    reason?: string;
}
