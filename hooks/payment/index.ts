'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import type { CreatePaymentRequest, VerifyPaymentRequest, RefundRequest } from '@/types/payment';

// ─── Query Keys ───────────────────────────────

export const PAYMENT_KEYS = {
    byBooking: (bookingId: string) => ['payments', 'booking', bookingId] as const,
    one: (id: string) => ['payments', id] as const,
};

// ─── Queries ──────────────────────────────────

export function usePaymentsByBooking(bookingId: string) {
    return useQuery({
        queryKey: PAYMENT_KEYS.byBooking(bookingId),
        queryFn: () => paymentService.getPaymentsByBooking(bookingId),
        enabled: !!bookingId,
    });
}

export function usePayment(id: string) {
    return useQuery({
        queryKey: PAYMENT_KEYS.one(id),
        queryFn: () => paymentService.getPayment(id),
        enabled: !!id,
    });
}

// ─── Mutations ────────────────────────────────

export function useCreatePaymentOrder() {
    return useMutation({
        mutationFn: (data: CreatePaymentRequest) => paymentService.createPaymentOrder(data),
    });
}

export function useVerifyPayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: VerifyPaymentRequest) => paymentService.verifyPayment(data),
        onSuccess: (result) => {
            // Invalidate booking to reflect CONFIRMED status
            if (result.booking?.id) {
                qc.invalidateQueries({ queryKey: ['bookings', result.booking.id] });
                qc.invalidateQueries({ queryKey: ['bookings', 'mine'] });
            }
        },
    });
}

export function useRefundPayment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: RefundRequest) => paymentService.refundPayment(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
    });
}
