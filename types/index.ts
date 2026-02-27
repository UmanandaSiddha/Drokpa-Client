// ──────────────────────────────────────────────
// Barrel Exports — All Types
// ──────────────────────────────────────────────

export * from './auth';
export * from './common';
export * from './tour';
export * from './homestay';
export * from './booking';
export * from './coupon';
export * from './provider';
export * from './payment';
export * from './payout';
export * from './review';
export * from './permit';
export * from './vehicle';
export * from './guide';
export * from './bucketlist';
export * from './memories';
export * from './address';
export * from './upload';
export * from './feature-flag';
export * from './community';
export * from './waitlist';
export * from './admin';

// ──────────────────────────────────────────────
// User-specific response types (cross-file)
// ──────────────────────────────────────────────

import type { Booking } from './booking';
import type { Review } from './review';
import type { BucketList } from './bucketlist';
import type { PaginatedResponse } from './common';

export type UserBookingsResponse = PaginatedResponse<Booking>;
export type UserReviewsResponse = Review[];
export type UserBucketListsResponse = BucketList[];
