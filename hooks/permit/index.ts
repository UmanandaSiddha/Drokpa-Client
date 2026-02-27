'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permitService } from '@/services/permit.service';
import type { SubmitPermitRequest, ApprovePermitRequest, RejectPermitRequest } from '@/types/permit';

export const PERMIT_KEYS = {
    byBooking: (bookingId: string) => ['permits', 'booking', bookingId] as const,
    one: (id: string) => ['permits', id] as const,
};

export function usePermitsByBooking(bookingId: string) {
    return useQuery({
        queryKey: PERMIT_KEYS.byBooking(bookingId),
        queryFn: () => permitService.getPermitsByBooking(bookingId),
        enabled: !!bookingId,
    });
}

export function usePermit(id: string) {
    return useQuery({
        queryKey: PERMIT_KEYS.one(id),
        queryFn: () => permitService.getPermit(id),
        enabled: !!id,
    });
}

export function useSubmitPermit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: SubmitPermitRequest }) => permitService.submitPermit(id, data),
        onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: PERMIT_KEYS.one(id) }),
    });
}

export function useApprovePermit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ApprovePermitRequest }) => permitService.approvePermit(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['permits'] }),
    });
}

export function useRejectPermit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RejectPermitRequest }) => permitService.rejectPermit(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['permits'] }),
    });
}
