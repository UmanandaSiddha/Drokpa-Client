// ──────────────────────────────────────────────
// Tour Types
// ──────────────────────────────────────────────

export enum TourType {
    TOUR = 'TOUR',
    TREK = 'TREK',
}

// ─── Entities ────────────────────────────────

export interface POI {
    id: string;
    name: string;
    description?: string;
    specialty: string[];
    imageUrls: string[];
    latitude: number;
    longitude: number;
    addressId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TourItineraryPOI {
    id: string;
    itineraryId: string;
    poiId: string;
    order: number;
    poi?: POI;
}

export interface TourItinerary {
    id: string;
    tourId: string;
    dayNumber: number;
    title: string;
    details?: Record<string, unknown>;
    pois: TourItineraryPOI[];
}

export interface TourTag {
    tourId: string;
    tagId: string;
    tag?: {
        id: string;
        label: string;
        color: string;
        icon?: string;
        category?: string;
    };
}

export interface Tour {
    id: string;
    title: string;
    description: string;
    type: TourType;
    basePrice: number;
    discount: number;
    finalPrice: number;
    duration: number;
    imageUrls: string[];
    maxCapacity: number;
    availableSpots?: number;
    rating?: number;
    totalReviews: number;
    isActive: boolean;
    about?: string;
    included: string[];
    notIncluded: string[];
    highlights: string[];
    brochure?: string;
    addressId?: string;
    providerId?: string;
    guideId?: string;
    itinerary?: TourItinerary[];
    tags?: TourTag[];
    createdAt: string;
    updatedAt: string;
}

// ─── Request Types ────────────────────────────

export interface CreateTourRequest {
    title: string;
    description: string;
    type?: TourType;
    basePrice: number;
    discount?: number;
    duration: number;
    imageUrls?: string[];
    maxCapacity?: number;
    about?: string;
    included?: string[];
    notIncluded?: string[];
    highlights?: string[];
    brochure?: string;
    addressId?: string;
    providerId?: string;
    guideId?: string;
    tags?: string[];
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> { }

export interface AddItineraryDayRequest {
    dayNumber: number;
    title: string;
    details?: Record<string, unknown>;
}

export interface LinkPOIToItineraryRequest {
    order: number;
}

export interface ReorderPOIsRequest {
    poiIds: string[];
}

// ─── POI Request Types ────────────────────────

export interface CreatePOIRequest {
    name: string;
    description?: string;
    specialty?: string[];
    imageUrls?: string[];
    latitude?: number;
    longitude?: number;
    addressId?: string;
}

export interface UpdatePOIRequest extends Partial<CreatePOIRequest> { }

// ─── Query Params ─────────────────────────────

export interface TourQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: TourType;
}
