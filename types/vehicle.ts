// ──────────────────────────────────────────────
// Vehicle Types
// ──────────────────────────────────────────────

export enum VehicleType {
    BIKE = 'BIKE',
    SCOOTY = 'SCOOTY',
    CAR = 'CAR',
    SUV = 'SUV',
    TEMPO = 'TEMPO',
}

export enum VehicleBookingMode {
    SELF_DRIVE = 'SELF_DRIVE',
    WITH_DRIVER = 'WITH_DRIVER',
}

// ─── Entities ────────────────────────────────

export interface Vehicle {
    id: string;
    name: string;
    type: VehicleType;
    brand?: string;
    model?: string;
    registrationNo: string;
    imageUrls: string[];
    basePricePerDay: number;
    bookingMode: VehicleBookingMode[];
    isActive: boolean;
    providerId: string;
    addressId?: string;
    provider?: {
        id: string;
        name: string;
    };
    address?: {
        city: string;
        state: string;
    };
    rating?: number;
    totalReviews?: number;
    distanceKm?: number;
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateVehicleRequest {
    name: string;
    type: VehicleType;
    brand?: string;
    model?: string;
    registrationNo: string;
    imageUrls?: string[];
    basePricePerDay: number;
    bookingMode: VehicleBookingMode[];
    isActive?: boolean;
    addressId?: string;
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> { }

// ─── Query Params ─────────────────────────────

export interface VehicleQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: VehicleType;
    isActive?: boolean;
}
