// ──────────────────────────────────────────────
// Booking Types
// ──────────────────────────────────────────────

import type { Gender } from './auth';
import { ProviderType } from './provider';
import type { Coupon } from './coupon';

export enum BookingStatus {
    REQUESTED = 'REQUESTED',
    REJECTED = 'REJECTED',
    AWAITING_PAYMENT = 'AWAITING_PAYMENT',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    REFUNDED = 'REFUNDED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    EXPIRED = 'EXPIRED',
}

export enum BookingSource {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
}

// ─── Entities ────────────────────────────────

export interface BookingGuest {
    id: string;
    bookingItemId: string;
    fullName: string;
    email?: string;
    age: number;
    contactNumber: string;
    gender: Gender;
    dateOfArrival?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingItem {
    id: string;
    bookingId: string;
    productType: ProviderType;
    productId: string;
    startDate?: string;
    endDate?: string;
    quantity: number;
    basePrice: number;
    discount: number;
    finalPrice: number;
    totalAmount: number;
    permitRequired: boolean;
    metadata?: Record<string, unknown>;
    guests?: BookingGuest[];
}

export interface Booking {
    id: string;
    userId: string;
    status: BookingStatus;
    source: BookingSource;
    totalAmount?: number;
    paidAmount?: number;
    discountAmount?: number;
    couponId?: string;
    confirmedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    completedAt?: string;
    expiresAt?: string;
    metadata?: Record<string, unknown>;
    items?: BookingItem[];
    coupon?: Coupon;
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface RequestTourBookingRequest {
    tourId: string;
    startDate: string;
    endDate: string;
    participants: number;
    specialRequests?: string;
}

export interface RequestHomestayBookingRequest {
    homestayId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
}

export interface RequestVehicleBookingRequest {
    vehicleId: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
}

export interface RequestGuideBookingRequest {
    guideId: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
}

export interface ConfirmBookingRequest {
    paymentWindowMinutes?: number;
}

export interface RejectBookingRequest {
    reason: string;
}

export interface ApplyCouponRequest {
    couponCode: string;
}

// ─── Query Params ─────────────────────────────

export interface BookingQueryParams {
    status?: BookingStatus;
    page?: number;
    limit?: number;
}
