// ──────────────────────────────────────────────
// Homestay Types
// ──────────────────────────────────────────────

export enum BookingCriteria {
    PER_PERSON = 'PER_PERSON',
    PER_NIGHT = 'PER_NIGHT',
    HYBRID = 'HYBRID',
}

// ─── Entities ────────────────────────────────

export interface Tag {
    id: string;
    label: string;
    color: string;
    icon?: string;
    category?: string;
}

export interface Facility {
    id: string;
    name: string;
    icon: string;
    description?: string;
    category?: string;
}

export interface HomestayTag {
    homestayId: string;
    tagId: string;
    tag?: Tag;
}

export interface HomestayFacility {
    homestayId: string;
    facilityId: string;
    facility?: Facility;
}

export interface RoomAvailability {
    id: string;
    roomId: string;
    date: string;
    available: number;
    price?: number;
}

export interface HomestayRoom {
    id: string;
    homestayId: string;
    name: string;
    description?: string;
    capacity: number;
    basePrice: number;
    discount: number;
    finalPrice: number;
    bookingCriteria: BookingCriteria;
    totalRooms: number;
    amenities: string[];
    imageUrls: string[];
    isActive: boolean;
    availability?: RoomAvailability[];
    createdAt: string;
    updatedAt: string;
}

export interface Homestay {
    id: string;
    name: string;
    slug: string;
    description: string;
    houseRules: string[];
    safetyNSecurity: string[];
    imageUrls: string[];
    displayPrice?: number;
    rating?: number;
    totalReviews: number;
    bookingCriteria: BookingCriteria;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    providerId: string;
    addressId?: string;
    rooms?: HomestayRoom[];
    facilities?: HomestayFacility[];
    tags?: HomestayTag[];
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateHomestayRequest {
    name: string;
    description: string;
    houseRules?: string[];
    safetyNSecurity?: string[];
    imageUrls?: string[];
    displayPrice?: number;
    bookingCriteria?: BookingCriteria;
    email: string;
    phoneNumber: string;
    addressId?: string;
    isActive?: boolean;
}

export interface UpdateHomestayRequest extends Partial<CreateHomestayRequest> { }

export interface CreateRoomRequest {
    name: string;
    description?: string;
    capacity: number;
    basePrice: number;
    discount?: number;
    bookingCriteria?: BookingCriteria;
    totalRooms: number;
    amenities?: string[];
    imageUrls?: string[];
    isActive?: boolean;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> { }

export interface SetAvailabilityRequest {
    startDate: string;
    endDate: string;
    available: number;
    priceOverride?: number;
}

export interface UpdateSingleAvailabilityRequest {
    date: string;
    available?: number;
    priceOverride?: number;
}

export interface BlockDatesRequest {
    startDate: string;
    endDate: string;
}

export interface AddTagsRequest {
    tagIds: string[];
}

export interface AddFacilitiesRequest {
    facilityIds: string[];
}

// ─── Query Params ─────────────────────────────

export interface HomestayQueryParams {
    page?: number;
    limit?: number;
    keyword?: string;
    bookingCriteria?: BookingCriteria;
}

export interface AvailabilityQueryParams {
    startDate: string;
    endDate: string;
}

// ─── Response: Homestay availability calendar ─

export interface RoomAvailabilitySummary {
    roomId: string;
    roomName: string;
    availability: { date: string; available: number; priceOverride?: number }[];
}

export interface HomestayAvailabilityResponse {
    homestayId: string;
    period: { startDate: string; endDate: string };
    rooms: RoomAvailabilitySummary[];
}
