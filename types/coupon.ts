// ──────────────────────────────────────────────
// Coupon Types
// ──────────────────────────────────────────────

import type { UserRole } from './auth';

// ─── Enums ───────────────────────────────────

export enum CouponType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum CouponVisibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

export enum CouponApplyTo {
    BOOKING_TOTAL = 'BOOKING_TOTAL',
    PER_PERSON = 'PER_PERSON',
}

// ─── Domain Models ────────────────────────────

export interface Coupon {
    id: string;
    code: string;
    description?: string;
    type: CouponType;
    visibility: CouponVisibility;
    applyTo: CouponApplyTo;
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    validFrom: string;
    validUntil?: string;
    maxUsesTotal?: number;
    maxUsesPerUser?: number;
    currentUses: number;
    allowedRoles: UserRole[];
    // Business rules
    minParticipants?: number;
    applicableProductTypes: string[];
    applicableProductIds: string[];
    firstTimeOnly: boolean;
    rules?: Record<string, any>;
    isActive: boolean;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
    userAssignments?: CouponUserAssignment[];
    usages?: CouponUsage[];
}

export interface CouponUserAssignment {
    id: string;
    couponId: string;
    userId: string;
    note?: string;
    createdAt: string;
}

export interface CouponUsage {
    id: string;
    couponId: string;
    userId: string;
    bookingId: string;
    discountAmount: number;
    redeemedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateCouponRequest {
    code: string;
    description?: string;
    type: CouponType;
    visibility: CouponVisibility;
    applyTo: CouponApplyTo;
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    validFrom: string;
    validUntil?: string;
    maxUsesTotal?: number;
    maxUsesPerUser?: number;
    allowedRoles?: UserRole[];
    // Business rules
    minParticipants?: number;
    applicableProductTypes?: string[];
    applicableProductIds?: string[];
    firstTimeOnly?: boolean;
    rules?: Record<string, any>;
    isActive?: boolean;
}

export interface UpdateCouponRequest {
    description?: string;
    discountValue?: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    validUntil?: string;
    maxUsesTotal?: number;
    maxUsesPerUser?: number;
    allowedRoles?: UserRole[];
    // Business rules
    minParticipants?: number;
    applicableProductTypes?: string[];
    applicableProductIds?: string[];
    firstTimeOnly?: boolean;
    rules?: Record<string, any>;
    isActive?: boolean;
}

export interface AssignCouponUserRequest {
    userId: string;
    note?: string;
}

export interface RemoveCouponUserRequest {
    userId: string;
}

// ─── Query Params ─────────────────────────────

export interface CouponQueryParams {
    visibility?: CouponVisibility;
    isActive?: boolean;
    page?: number;
    limit?: number;
    search?: string;
}

// ─── Response Types ──────────────────────────

export interface ValidateCouponResponse {
    valid: boolean;
    reason?: string;
    coupon?: Coupon;
    discountAmount?: number;
}

export interface ApplyCouponResponse {
    couponId: string;
    discountAmount: number;
    finalAmount: number;
}
