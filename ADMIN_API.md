# Drokpa — Admin Panel API Reference

> **Base URL:** `https://api.drokpa.com/api/v1`
> **Auth:** All admin/provider endpoints require a JWT cookie (`token`) or `Authorization: Bearer <token>` header.

---

## Role Hierarchy

| Role | Access Level | Who |
|------|-------------|-----|
| `ADMIN` | Full platform access + all provider actions on their behalf | Platform operators |
| `HOST` | Own homestays, own bookings, own billing | Homestay Host providers |
| `VENDOR` | Own vehicles, own bookings, own billing | Vehicle Partner providers |
| `GUIDE` | Own guide profile, own bookings, own billing | Local Guide providers |
| `USER` | Own bookings, payments, reviews | Regular travellers |

> **Note:** Tour, Activity, and ILP services are **platform-managed** — only `ADMIN` can create/edit them. Providers with `VENDOR` role may have tour-vendor type product associations but tours are not self-managed.

---

## Role Access Matrix

| Section | ADMIN | HOST | VENDOR | GUIDE |
|---------|-------|------|--------|-------|
| Dashboard stats | ✅ | ❌ | ❌ | ❌ |
| All bookings (any user, any type) | ✅ | ❌ | ❌ | ❌ |
| Tour booking confirm / reject | ✅ | ❌ | ❌ | ❌ |
| Mark booking CONFIRMED → COMPLETED | ✅ | ❌ | ❌ | ❌ |
| Own services' bookings | ✅ | ✅ | ✅ | ✅ |
| Confirm/reject own bookings | ✅ | ✅ HOST only | ✅ VENDOR only | — |
| All providers (list, verify, suspend) | ✅ | ❌ | ❌ | ❌ |
| Assign role to any user | ✅ | ❌ | ❌ | ❌ |
| All users | ✅ | ❌ | ❌ | ❌ |
| Tours CRUD | ✅ | ❌ | ❌ | ❌ |
| Any homestay CRUD | ✅ | — | — | — |
| Own homestay CRUD | — | ✅ | ❌ | ❌ |
| Room availability management (any) | ✅ | — | — | — |
| Room availability management (own) | — | ✅ | ❌ | ❌ |
| Any vehicle CRUD | ✅ | — | — | — |
| Own vehicle CRUD | — | ❌ | ✅ | ❌ |
| Any guide profile CRUD | ✅ | — | — | — |
| Own guide profile CRUD | — | ❌ | ❌ | ✅ |
| All payouts (list, complete, fail) | ✅ | ❌ | ❌ | ❌ |
| Own payouts | ✅ | ✅ | ✅ | ✅ |
| Permits (approve/reject/document) | ✅ | ❌ | ❌ | ❌ |
| Payment analytics | ✅ | ❌ | ❌ | ❌ |
| Issue refund | ✅ | ❌ | ❌ | ❌ |
| Delete any review | ✅ | ❌ | ❌ | ❌ |
| Cancellation policies CRUD | ✅ | ❌ | ❌ | ❌ |
| Coupon CRUD + assignment | ✅ | ❌ | ❌ | ❌ |
| Provider onboarding invites | ✅ | ❌ | ❌ | ❌ |
| Feature flags toggle | ✅ | ❌ | ❌ | ❌ |
| Service waitlist management | ✅ | ❌ | ❌ | ❌ |

> **Admin bypass pattern:** For **creates**, admin passes `?onBehalfOf=<providerUserId>` so the listing is associated with the correct provider. For **updates and deletes**, admin can act on any resource without needing `onBehalfOf` — ownership checks are bypassed automatically.

---

## 1. Admin Dashboard

> **Route prefix:** `/admin` — **Requires:** `ADMIN`

---

### `GET /admin/dashboard`

Platform-wide stats snapshot.

**Response:**
```json
{
  "totalUsers": 1240,
  "totalProviders": 87,
  "totalBookings": 3540,
  "totalPayments": 2100,
  "totalRevenue": 8450000
}
```

**Status:** ✅ Implemented

---

## 2. Bookings

### `GET /admin/bookings` — ADMIN only

List all bookings across all users and product types.

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `BookingStatus` enum | Filter by status |
| `page` | `number` | Default: 1 |
| `limit` | `number` | Default: 10 |
| `sort` | `string` | e.g. `createdAt:desc` |

**`BookingStatus` values:** `REQUESTED` `AWAITING_PAYMENT` `CONFIRMED` `COMPLETED` `REJECTED` `CANCELLED` `EXPIRED` `PAYMENT_FAILED` `REFUNDED`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "status": "REQUESTED",
      "totalAmount": 15000,
      "discountAmount": 500,
      "paidAmount": 0,
      "source": "DROKPA_APP",
      "couponCode": "DROKPA10",
      "createdAt": "2026-02-01T00:00:00Z",
      "user": { "id": "uuid", "email": "user@example.com", "firstName": "Riya", "lastName": "Shah" },
      "items": [ { "productType": "TOUR_VENDOR", "productId": "uuid", "quantity": 2, "unitPrice": 7500 } ],
      "payment": { "id": "uuid", "status": "PENDING", "amount": 14500 }
    }
  ],
  "meta": { "total": 3540, "page": 1, "limit": 10, "totalPages": 354 }
}
```

**Status:** ✅ Implemented

---

### `PATCH /admin/bookings/:id/tour/confirm` — ADMIN only

Confirm a `REQUESTED` tour booking → moves to `AWAITING_PAYMENT`.
Tours are platform-managed; only admin can approve them.

**Body:**
```json
{
  "paymentWindowMinutes": 30
}
```
*(optional — defaults to 30 min)*

**Response:** Updated booking object with `status: "AWAITING_PAYMENT"` and `expiresAt` set.

**Emails triggered:** User receives "Tour Booking Confirmed — Payment Required" with deadline.

**Status:** ✅ Implemented

---

### `PATCH /admin/bookings/:id/tour/reject` — ADMIN only

Reject a `REQUESTED` tour booking.

**Body:**
```json
{
  "reason": "Capacity full for selected date"
}
```
*(optional)*

**Response:** Updated booking object with `status: "REJECTED"`.

**Status:** ✅ Implemented

---

### `GET /booking/provider/bookings` — HOST | VENDOR

Provider views bookings for their own properties/vehicles/guides only.

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `BookingStatus` | Filter by status |
| `page` | `number` | Default: 1 |
| `limit` | `number` | Default: 10 |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "status": "REQUESTED",
      "totalAmount": 8000,
      "user": { "id": "uuid", "email": "guest@example.com", "firstName": "Aman" },
      "items": [ { "productType": "HOMESTAY_HOST", "productId": "uuid", "startDate": "2026-03-10", "endDate": "2026-03-15", "quantity": 1 } ],
      "payment": null
    }
  ],
  "meta": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 }
}
```

**Status:** ✅ Implemented

---

### `POST /booking/:id/confirm` — HOST | VENDOR

Provider confirms a `REQUESTED` booking for their own property/vehicle.

**Body:**
```json
{
  "paymentWindowMinutes": 60
}
```
*(optional — defaults to configured value)*

**Response:** Updated booking object with `status: "AWAITING_PAYMENT"` and `expiresAt`.

**Status:** ✅ Implemented

---

### `POST /booking/:id/reject` — HOST | VENDOR

Provider rejects a `REQUESTED` booking for their own property/vehicle.

**Body:**
```json
{
  "reason": "Dates unavailable"
}
```
*(optional)*

**Response:** Updated booking object with `status: "REJECTED"`. Room availability re-incremented automatically for homestay rejections.

**Status:** ✅ Implemented

---

### `GET /booking/:id` — Any authenticated user (own booking) | ADMIN (any)

**Response:**
```json
{
  "id": "uuid",
  "status": "CONFIRMED",
  "totalAmount": 15000,
  "discountAmount": 500,
  "paidAmount": 14500,
  "couponCode": "DROKPA10",
  "items": [
    {
      "productType": "HOMESTAY_HOST",
      "productId": "uuid",
      "startDate": "2026-03-10T00:00:00Z",
      "endDate": "2026-03-15T00:00:00Z",
      "quantity": 2,
      "unitPrice": 3000,
      "guests": [ { "fullName": "Riya Shah", "age": 28 } ],
      "rooms": [],
      "permits": []
    }
  ],
  "payment": { "id": "uuid", "status": "CAPTURED", "amount": 14500 },
  "user": { "id": "uuid", "email": "user@example.com", "firstName": "Riya" }
}
```

**Status:** ✅ Implemented

---

### `PATCH /admin/bookings/:id/complete` — ADMIN only

Transition a `CONFIRMED` booking to `COMPLETED`. Required before a payout can be created.
Sends the user a completion email.

**Response:** Updated booking with `status: "COMPLETED"` and `completedAt`.

**Status:** ✅ Implemented

---

## 3. Providers

> All under `/admin` — **Requires:** `ADMIN`

---

### `GET /admin/providers`

List all providers with optional filters.

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `ProviderStatus` | `PENDING` `ACTIVE` `SUSPENDED` `REJECTED` |
| `verified` | `"true"` \| `"false"` | Filter by verification status |
| `page` | `number` | |
| `limit` | `number` | |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "HOMESTAY_HOST",
      "status": "ACTIVE",
      "verified": true,
      "user": { "id": "uuid", "email": "host@example.com", "firstName": "Tenzin" },
      "createdAt": "2026-01-15T00:00:00Z"
    }
  ],
  "meta": { "total": 87, "page": 1, "limit": 10, "totalPages": 9 }
}
```

**Status:** ✅ Implemented

---

### `PATCH /admin/provider/:id/verify` — ADMIN only

Mark a provider as verified.

**Response:**
```json
{
  "id": "uuid",
  "verified": true,
  "status": "ACTIVE"
}
```

**Status:** ✅ Implemented

---

### `PATCH /admin/provider/:id/suspend` — ADMIN only

Suspend a provider account.

**Response:**
```json
{
  "id": "uuid",
  "status": "SUSPENDED"
}
```

**Status:** ✅ Implemented

---

## 4. Users

### `GET /admin/users` — ADMIN only

List all registered users.

**Query Params:** `page`, `limit`, `sort`, `search`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Aman",
      "lastName": "Rawat",
      "isDeleted": false,
      "roles": [ { "role": "USER" } ],
      "createdAt": "2026-01-10T00:00:00Z"
    }
  ],
  "meta": { "total": 1240, "page": 1, "limit": 10, "totalPages": 124 }
}
```

**Status:** ✅ Implemented

---

### `PATCH /admin/user/:id/assign-role` — ADMIN only

Assign `HOST`, `VENDOR`, or `GUIDE` role to a user. Also atomically creates or updates their `Provider` record with the correct provider type. No-op if the user already has the role.

**Body:**
```json
{
  "role": "HOST",
  "providerTypes": ["HOMESTAY_HOST"]
}
```

`providerTypes` is optional. If omitted, a sensible default is used:
- `HOST` → `HOMESTAY_HOST`
- `VENDOR` → `VEHICLE_PARTNER`
- `GUIDE` → `LOCAL_GUIDE`

**Response:** Updated user object with `roles[]` and `provider { id, name, type[] }`.

**Status:** ✅ Implemented

---

## 5. Tours (Platform-Managed)

> **Requires:** `ADMIN` — Tour Vendors are platform-managed. Providers cannot self-list tours.

---

### `POST /tours` — ADMIN only

Create a new tour listing.

**Body:**
```json
{
  "title": "Chadar Trek",
  "description": "Frozen river trek in Ladakh",
  "price": 25000,
  "duration": 9,
  "durationType": "DAYS",
  "maxCapacity": 20,
  "difficulty": "HARD",
  "imageUrls": ["https://..."],
  "location": "Ladakh",
  "latitude": 34.1526,
  "longitude": 77.5771,
  "tagIds": ["uuid1", "uuid2"],
  "isActive": true
}
```

**Response:** Full tour object with `id`, `availableSpots`, `rating`, `totalReviews`.

**Status:** ✅ Implemented

---

### `GET /tours` — Public

List all active tours.

**Query Params:** `page`, `limit`, `sort`, `difficulty`, `search`

**Status:** ✅ Implemented

---

### `GET /tours/:id` — Public

**Response:** Tour with itinerary, tags, reviews summary, available spots.

**Status:** ✅ Implemented

---

### `PATCH /tours/:id` — ADMIN only

Update any tour field. Partial update.

**Body:** Any fields from `CreateTourDto` (all optional).

**Status:** ✅ Implemented

---

### `DELETE /tours/:id` — ADMIN only

Soft-deactivates the tour (`isActive: false`). Does not delete records.

**Status:** ✅ Implemented

---

### `POST /tours/:id/itinerary` — ADMIN only

Add a day to the tour itinerary.

**Body:**
```json
{
  "day": 1,
  "title": "Arrival at Leh",
  "description": "Acclimatization day",
  "distance": 0,
  "accommodation": "Leh Hotel"
}
```

**Status:** ✅ Implemented

---

### `POST /tours/itinerary/:itineraryId/poi/:poiId` — ADMIN only

Add a Point of Interest to an itinerary day.

**Body:**
```json
{ "order": 1 }
```

**Status:** ✅ Implemented

---

### `PATCH /tours/itinerary/:itineraryId/reorder` — ADMIN only

Reorder POIs within an itinerary day.

**Body:**
```json
{ "poiIds": ["uuid1", "uuid2", "uuid3"] }
```

**Status:** ✅ Implemented

---

## 6. Homestays

> **ADMIN can do everything. HOST can only manage their own homestays.**

---

### `POST /homestay` — HOST | (ADMIN can act as HOST via onboarding)

Create a new homestay listing.

**Body:**
```json
{
  "name": "Tenzin Homestay",
  "description": "Traditional Ladakhi home stay",
  "location": "Leh",
  "latitude": 34.1526,
  "longitude": 77.5771,
  "imageUrls": ["https://..."],
  "checkInTime": "12:00",
  "checkOutTime": "11:00",
  "houseRules": "No smoking inside"
}
```

**Response:** Full homestay object with `id`, `providerId`, `rooms: []`.

**Status:** ✅ Implemented

> ⚠️ **Gap:** ADMIN cannot currently create a homestay on behalf of a HOST via a proxy endpoint. The `POST /homestay` endpoint reads `userId` from the JWT and resolves to that user's provider profile. An **admin-bypass endpoint** (e.g. `POST /admin/homestay/:providerId`) is **not yet implemented**.

---

### `GET /homestay` — Public

**Query Params:** `page`, `limit`, `sort`, `search`

**Status:** ✅ Implemented

---

### `GET /homestay/nearby` — Public

**Query Params:** `latitude` (required), `longitude` (required), `radius` (km, default 20)

**Status:** ✅ Implemented

---

### `GET /homestay/provider/my-homestays` — HOST

Returns all homestays belonging to the authenticated HOST's provider profile.

**Status:** ✅ Implemented

---

### `GET /homestay/:id` — Public

**Query Params:** `checkIn`, `checkOut` (ISO date — returns available rooms for dates)

**Status:** ✅ Implemented

---

### `PATCH /homestay/:id` — HOST (own)

Partial update. Ownership enforced in service layer.

**Body:** Any fields from `CreateHomestayDto` (all optional).

**Status:** ✅ Implemented

---

### `POST /homestay/:id/tags` — HOST (own)

**Body:**
```json
{ "tagIds": ["uuid1", "uuid2"] }
```

**Status:** ✅ Implemented

---

### `DELETE /homestay/:id/tags/:tagId` — HOST (own)

**Status:** ✅ Implemented

---

### `POST /homestay/:id/facilities` — HOST (own)

**Body:**
```json
{ "facilityIds": ["uuid1", "uuid2"] }
```

**Status:** ✅ Implemented

---

### `DELETE /homestay/:id/facilities/:facilityId` — HOST (own)

**Status:** ✅ Implemented

---

### `POST /homestay/:id/room` — HOST (own) | ADMIN (any with onBehalfOf)

Create a room for a homestay.

**Body:**
```json
{
  "name": "Deluxe Room",
  "description": "Spacious room with mountain view",
  "capacity": 2,
  "basePrice": 2500,
  "discount": 0,
  "finalPrice": 2500,
  "totalRooms": 3,
  "amenities": ["WiFi", "AC", "TV"],
  "imageUrls": ["https://..."],
  "bookingCriteria": "PER_NIGHT"
}
```

**Response:** Full room object with `id`, `homestayId`, `name`, `capacity`, `basePrice`, `totalRooms`.

**Status:** ❌ Not Implemented — DTO exists but no controller endpoint

---

### `GET /homestay/:id/rooms` — Public

Get all active rooms for a homestay.

**Status:** ❌ Not Implemented

---

### `PATCH /homestay/:homestayId/room/:roomId` — HOST (own) | ADMIN (any)

Update a room's details (price, amenities, capacity, etc.).

**Body:** Partial room update (all fields optional).

**Status:** ❌ Not Implemented

---

### `DELETE /homestay/:homestayId/room/:roomId` — HOST (own) | ADMIN (any)

Delete a room (blocked if room has active bookings).

**Status:** ❌ Not Implemented

---

## 7. Room Availability

> **Requires:** `HOST` — Homestay hosts manage availability calendars for their rooms.

---

### `POST /room-availability/:roomId` — HOST (own room)

Set or update availability for a date range (upsert — safe to call multiple times).

**Body:**
```json
{
  "startDate": "2026-03-01",
  "endDate": "2026-03-31",
  "available": 2,
  "price": 2500
}
```

**Response:** Array of upserted `RoomAvailability` records.

**Status:** ✅ Implemented

---

### `PATCH /room-availability/:roomId/date` — HOST (own room)

Update a single date's availability count or price.

**Body:**
```json
{
  "date": "2026-03-15",
  "available": 0,
  "price": 3000
}
```

**Status:** ✅ Implemented

---

### `POST /room-availability/:roomId/block` — HOST (own room)

Block a date range — sets `available = 0` for all dates in range.

**Body:**
```json
{
  "startDate": "2026-03-20",
  "endDate": "2026-03-25",
  "price": 2500
}
```

**Status:** ✅ Implemented

---

### `DELETE /room-availability/:roomId?startDate=&endDate=` — HOST (own room)

Completely removes availability records for the date range (not just blocks them).

**Status:** ✅ Implemented

---

### `GET /room-availability/homestay/:homestayId?startDate=&endDate=` — HOST (own)

Calendar summary view — returns per-room availability across the date range.

**Response:**
```json
[
  {
    "roomId": "uuid",
    "roomName": "Deluxe Room",
    "availability": [
      { "date": "2026-03-01", "available": 2, "price": 2500 },
      { "date": "2026-03-02", "available": 1, "price": 2500 }
    ]
  }
]
```

**Status:** ✅ Implemented

---

### `GET /room-availability/:roomId?startDate=&endDate=` — Public

Used by the booking flow.

**Status:** ✅ Implemented

---

## 8. Vehicles

> **ADMIN can manage all. VENDOR manages own only.**

---

### `POST /vehicle` — VENDOR

Create a vehicle listing.

**Body:**
```json
{
  "registrationNumber": "HP-01-AB-1234",
  "make": "Toyota",
  "model": "Innova Crysta",
  "year": 2022,
  "type": "SUV",
  "capacity": 7,
  "pricePerDay": 4000,
  "imageUrls": ["https://..."],
  "latitude": 34.1526,
  "longitude": 77.5771,
  "isActive": true,
  "features": ["AC", "4WD"]
}
```

**Response:** Full vehicle object with `id`, `providerId`.

**Status:** ✅ Implemented

---

### `GET /vehicle` — Public

**Query Params:** `type` (`VehicleType` enum), `isActive`, `page`, `limit`

**`VehicleType` values:** `SEDAN` `SUV` `TEMPO_TRAVELLER` `BUS` `MINIBUS` `MOTORCYCLE` `OTHER`

**Status:** ✅ Implemented

---

### `GET /vehicle/nearby` — Public

**Query Params:** `latitude` (required), `longitude` (required), `radius` (km, default 20)

**Status:** ✅ Implemented

---

### `GET /vehicle/provider/my-vehicles` — VENDOR

**Status:** ✅ Implemented

---

### `GET /vehicle/:id` — Public

**Status:** ✅ Implemented

---

### `PATCH /vehicle/:id` — VENDOR (own)

Partial update. Ownership enforced in service.

**Status:** ✅ Implemented

---

### `DELETE /vehicle/:id` — VENDOR (own)

Hard delete. Blocked if vehicle has active bookings.

**Status:** ✅ Implemented

---

## 9. Local Guides

> **ADMIN can manage any. GUIDE manages own profile.**

---

### `POST /local-guide` — GUIDE

Create guide profile.

**Body:**
```json
{
  "name": "Stanzin Dorje",
  "bio": "Expert trekking guide with 10 years experience",
  "languages": ["Hindi", "English", "Ladakhi"],
  "specializations": ["TREKKING", "CULTURAL"],
  "pricePerDay": 2000,
  "imageUrl": "https://...",
  "latitude": 34.1526,
  "longitude": 77.5771,
  "isAvailable": true
}
```

**Status:** ✅ Implemented

---

### `GET /local-guide` — Public

**Query Params:** `page`, `limit`, `sort`

**Status:** ✅ Implemented

---

### `GET /local-guide/nearby` — Public

**Query Params:** `latitude`, `longitude`, `radius` (default 30 km)

**Status:** ✅ Implemented

---

### `GET /local-guide/provider/my-guides` — GUIDE

**Status:** ✅ Implemented

---

### `GET /local-guide/:id` — Public

**Status:** ✅ Implemented

---

### `PATCH /local-guide/:id` — GUIDE (own)

**Status:** ✅ Implemented

---

### `DELETE /local-guide/:id` — GUIDE (own)

Blocked if guide has active/upcoming bookings.

**Status:** ✅ Implemented

---

## 10. Payouts

---

### `POST /payout` — ADMIN only

Create a payout record for a completed booking item.

**Requirements:**
- Booking must be in `COMPLETED` status
- Booking must have a `CAPTURED` payment
- No existing payout for this `bookingItemId`

**Body:**
```json
{
  "bookingItemId": "uuid",
  "providerId": "uuid",
  "amount": 12000,
  "notes": "March 2026 payout"
}
```

**Response:**
```json
{
  "id": "uuid",
  "bookingItemId": "uuid",
  "providerId": "uuid",
  "amount": 12000,
  "status": "PENDING",
  "notes": "March 2026 payout",
  "createdAt": "2026-03-01T00:00:00Z"
}
```

**Status:** ✅ Implemented

---

### `GET /payout/admin/all` — ADMIN only

**Query Params:** `status` (`PayoutStatus`), `page`, `limit`

**`PayoutStatus` values:** `PENDING` `PROCESSING` `COMPLETED` `FAILED`

**Response:**
```json
{
  "data": [ { "id": "uuid", "amount": 12000, "status": "PENDING", "provider": { "id": "uuid" } } ],
  "meta": { "total": 45, "page": 1, "limit": 10, "totalPages": 5 }
}
```

**Status:** ✅ Implemented

---

### `GET /payout/admin/provider/:providerId` — ADMIN only

All payouts for a specific provider.

**Status:** ✅ Implemented

---

### `PATCH /payout/:id/complete` — ADMIN only

Mark payout as `COMPLETED` (after bank transfer).

**Response:** Updated payout with `status: "COMPLETED"`, `completedAt`.

**Status:** ✅ Implemented

---

### `PATCH /payout/:id/fail` — ADMIN only

Mark payout as `FAILED`.

**Status:** ✅ Implemented

---

### `GET /payout/my-payouts` — HOST | VENDOR | GUIDE

Provider views own payouts with summary stats.

**Response:**
```json
{
  "data": [ { "id": "uuid", "amount": 12000, "status": "COMPLETED" } ],
  "meta": { "total": 8, "totalEarnings": 96000, "pendingAmount": 12000 }
}
```

**Status:** ✅ Implemented

---

### `GET /payout/:id` — HOST | VENDOR | GUIDE (own) | ADMIN (any)

Service enforces ownership: providers can only see their own payouts.

**Status:** ✅ Implemented

---

## 11. Payments

---

### `POST /payment/create` — Any authenticated user

Initiate a Razorpay order for a booking. Amount is validated server-side against booking total minus discount.

**Body:**
```json
{
  "bookingId": "uuid",
  "amount": 14500
}
```

**Response:**
```json
{
  "orderId": "order_xxx",
  "amount": 14500,
  "currency": "INR",
  "key": "rzp_live_xxx",
  "couponApplied": true,
  "couponCode": "DROKPA10",
  "discountAmount": 500,
  "grossAmount": 15000
}
```

**Status:** ✅ Implemented

---

### `POST /payment/verify` — Any authenticated user

Verify Razorpay payment signature after checkout. Atomically updates payment + booking status.

**Body:**
```json
{
  "orderId": "order_xxx",
  "paymentId": "pay_xxx",
  "signature": "hmac_sha256_signature"
}
```

**Response:** Updated payment record with card/UPI/bank details.

**Status:** ✅ Implemented

---

### `GET /payment/booking/:bookingId` — User (own booking) | ADMIN

All payments for a booking.

**Status:** ✅ Implemented

---

### `GET /payment/:id` — User (own) | ADMIN

**Status:** ✅ Implemented

---

### `POST /payment/refund` — ADMIN only

Issue a refund via Razorpay.

**Body:**
```json
{
  "paymentId": "uuid",
  "amount": 14500,
  "reason": "Customer cancellation"
}
```

**Response:** Razorpay refund confirmation + updated `Refund` record.

**Status:** ✅ Implemented

---

### `GET /admin/payments` — ADMIN only

Platform-wide payment analytics.

**Response:**
```json
{
  "totalRevenue": 8450000,
  "capturedCount": 2100,
  "refundedCount": 45,
  "totalRefunded": 320000,
  "byMethod": { "upi": 1200, "card": 700, "netbanking": 200 }
}
```

**Status:** ✅ Implemented

---

## 12. Permits

---

### `POST /permit/:id/submit` — Any authenticated user

User submits documents for a permit created at booking time.

**Body:**
```json
{
  "documentUrls": ["https://s3.../passport.jpg"],
  "notes": "Passport front and back"
}
```

**Status:** ✅ Implemented

---

### `GET /permit/booking/:bookingId` — User (own) | ADMIN

All permits for a booking.

**Status:** ✅ Implemented

---

### `GET /permit/:id` — User (own) | ADMIN

**Status:** ✅ Implemented

---

### `PATCH /permit/:id/approve` — ADMIN only

**Body:**
```json
{
  "permitDocumentId": "uuid"
}
```

**Status:** ✅ Implemented

---

### `PATCH /permit/:id/reject` — ADMIN only

**Body:**
```json
{
  "reason": "Documents unclear — please resubmit"
}
```

**Status:** ✅ Implemented

---

### `POST /permit/:id/document` — ADMIN only

Upload an official permit document after approval (admin uploads the government-issued document).

**Body:**
```json
{
  "documentId": "uuid"
}
```
*(documentId from S3 presigned upload flow)*

**Status:** ✅ Implemented

---

## 13. Coupons

> **Coupon management is ADMIN-only. Users can discover/validate coupons.**

---

### `POST /coupon/admin` — ADMIN only

Create a coupon.

**Body:**
```json
{
  "code": "DROKPA10",
  "description": "10% off all bookings",
  "type": "PERCENTAGE",
  "visibility": "PUBLIC",
  "applyTo": "BOOKING_TOTAL",
  "discountValue": 10,
  "maxDiscountAmount": 1000,
  "minOrderAmount": 5000,
  "validFrom": "2026-03-01T00:00:00Z",
  "validUntil": "2026-05-31T23:59:59Z",
  "maxUsesTotal": 500,
  "maxUsesPerUser": 1,
  "allowedRoles": [],
  "isActive": true,
  "rules": { "minParticipants": 2 }
}
```

**`CouponType`:** `PERCENTAGE` `FIXED_AMOUNT`
**`CouponVisibility`:** `PUBLIC` `PRIVATE`
**`CouponApplyTo`:** `BOOKING_TOTAL`

**Status:** ✅ Implemented

---

### `GET /coupon/admin` — ADMIN only

Paginated coupon list.

**Query Params:** `page`, `limit`, `isActive`, `type`, `visibility`

**Status:** ✅ Implemented

---

### `GET /coupon/admin/:id` — ADMIN only

**Status:** ✅ Implemented

---

### `PATCH /coupon/admin/:id` — ADMIN only

Partial update any coupon field.

**Status:** ✅ Implemented

---

### `DELETE /coupon/admin/:id` — ADMIN only

Fails with `409 Conflict` if coupon has been used in bookings — deactivate instead.

**Status:** ✅ Implemented

---

### `POST /coupon/admin/:id/assign` — ADMIN only

Assign a coupon to specific users (for PRIVATE coupons).

**Body:**
```json
{
  "userIds": ["uuid1", "uuid2"],
  "note": "Loyalty reward for repeat customers"
}
```

**Status:** ✅ Implemented

---

### `DELETE /coupon/admin/:id/assign/:userId` — ADMIN only

Revoke a user's coupon assignment.

**Status:** ✅ Implemented

---

### `GET /coupon/admin/:id/usages` — ADMIN only

Coupon redemption history.

**Response:**
```json
[
  { "id": "uuid", "userId": "uuid", "bookingId": "uuid", "discountAmount": 500, "redeemedAt": "2026-03-05T00:00:00Z" }
]
```

**Status:** ✅ Implemented

---

### `POST /coupon/validate` — Any authenticated user

Pre-checkout validation (does NOT record usage).

**Body:**
```json
{
  "code": "DROKPA10",
  "orderAmount": 15000,
  "participants": 2
}
```

**Response:**
```json
{
  "valid": true,
  "couponCode": "DROKPA10",
  "discountAmount": 500,
  "finalAmount": 14500
}
```

**Status:** ✅ Implemented

---

### `GET /coupon/public` — Any authenticated user

Discover active public coupons applicable to this user.

**Status:** ✅ Implemented

---

### `GET /coupon/my-coupons` — Any authenticated user

Coupons personally assigned to this user (PRIVATE coupons).

**Status:** ✅ Implemented

---

## 14. Cancellation Policies

> **Requires:** `ADMIN`

---

### `POST /admin/cancellation-policy`

**Body:**
```json
{
  "productType": "TOUR_VENDOR",
  "productId": "uuid",
  "hoursBefore": 48,
  "refundPct": 75
}
```
*Multiple rules per product allowed (e.g. 72h = 100%, 48h = 75%, 24h = 0%).*

**Status:** ✅ Implemented

---

### `GET /admin/cancellation-policy?productId=`

**Status:** ✅ Implemented

---

### `PATCH /admin/cancellation-policy/:id`

**Body:**
```json
{
  "hoursBefore": 24,
  "refundPct": 50
}
```

**Status:** ✅ Implemented

---

### `DELETE /admin/cancellation-policy/:id`

**Status:** ✅ Implemented

---

## 15. Provider Onboarding

> **Requires:** `ADMIN` for invite management. Providers complete onboarding via their unique token link.

---

### `POST /onboarding/admin/invite` — ADMIN only

Create a personalized onboarding invite link for a new provider.

**Body:**
```json
{
  "email": "host@example.com",
  "providerTypes": ["HOMESTAY_HOST"],
  "expiresInDays": 7
}
```

**`ProviderType` values:** `HOMESTAY_HOST` `VEHICLE_PARTNER` `LOCAL_GUIDE` `TOUR_VENDOR` `ACTIVITY_VENDOR` `ILP_VENDOR`

**Response:**
```json
{
  "id": "uuid",
  "token": "secure-random-token",
  "email": "host@example.com",
  "providerTypes": ["HOMESTAY_HOST"],
  "expiresAt": "2026-03-07T00:00:00Z",
  "onboardingUrl": "https://drokpa.com/onboarding?token=secure-random-token"
}
```

**Status:** ✅ Implemented

---

### `GET /onboarding/admin/all` — ADMIN only

All onboarding invites (paginated, filterable).

**Query Params:** `page`, `limit`, `sort`, `status`

**Status:** ✅ Implemented

---

### `GET /onboarding/admin/pending` — ADMIN only

Returns invites that have been sent but not yet completed.

**Status:** ✅ Implemented

---

### `GET /onboarding/admin/provider/:providerId` — ADMIN only

Get the onboarding record for a specific provider.

**Status:** ✅ Implemented

---

### `DELETE /onboarding/admin/:id/revoke` — ADMIN only

Revoke an unused invite immediately.

**Status:** ✅ Implemented

---

### `PATCH /onboarding/admin/:id/resend` — ADMIN only

Regenerate and resend an expired invite.

**Status:** ✅ Implemented

---

### `GET /onboarding/token/:token` — Public

Validates the token and returns onboarding context for the invite page.

**Response:**
```json
{
  "id": "uuid",
  "email": "host@example.com",
  "providerTypes": ["HOMESTAY_HOST"],
  "expiresAt": "2026-03-07T00:00:00Z",
  "completedAt": null
}
```

**Status:** ✅ Implemented

---

### `POST /onboarding/complete` — Authenticated user

Provider completes onboarding by linking their account to the invite. Creates the `Provider` record and assigns roles.

**Body:**
```json
{
  "token": "secure-random-token"
}
```

**Status:** ✅ Implemented

---

## 16. Feature Flags

> Admin can enable/disable entire service types (e.g., disable `VEHICLE_PARTNER` bookings during off-season).

---

### `GET /feature-flag` — Public

All feature flags and their current state.

**Response:**
```json
[
  { "serviceType": "HOMESTAY_HOST", "enabled": true, "message": null },
  { "serviceType": "VEHICLE_PARTNER", "enabled": false, "message": "Vehicle bookings are paused for winter" }
]
```

**Status:** ✅ Implemented

---

### `GET /feature-flag/check/:serviceType` — Public

Quick check of whether a specific service is enabled (used by frontend before showing booking buttons).

**Response:**
```json
{ "enabled": false, "message": "Vehicle bookings are paused for winter" }
```

**Status:** ✅ Implemented

---

### `GET /feature-flag/:serviceType` — Public

Full flag record for a single service type.

**Status:** ✅ Implemented

---

### `PUT /feature-flag/:serviceType` — ADMIN only

Enable or disable a service type.

**Body:**
```json
{
  "enabled": false,
  "message": "Vehicle bookings are paused for winter maintenance"
}
```

**Status:** ✅ Implemented

---

## 17. Service Waitlist

> Potential providers or users can join a waitlist for a service type not yet available in their area.

---

### `POST /waitlist/join` — Public

**Body:**
```json
{
  "email": "host@example.com",
  "name": "Tenzin Dorje",
  "phoneNumber": "+91-9999999999",
  "serviceType": "HOMESTAY_HOST",
  "location": "Kargil",
  "metadata": { "propertyType": "guesthouse" }
}
```

**Response:**
```json
{ "id": "uuid", "email": "host@example.com", "serviceType": "HOMESTAY_HOST", "notified": false }
```

**Status:** ✅ Implemented

---

### `GET /waitlist/admin/:serviceType` — ADMIN only

All waitlist entries for a specific service type.

**Query Params:** `page`, `limit`

**Response:**
```json
{
  "data": [ { "id": "uuid", "email": "host@example.com", "name": "Tenzin", "location": "Kargil", "notified": false } ],
  "meta": { "total": 34, "page": 1, "limit": 20, "totalPages": 2 }
}
```

**Status:** ✅ Implemented

---

### `GET /waitlist/admin/stats` — ADMIN only

Waitlist statistics grouped by service type.

**Response:**
```json
[
  { "serviceType": "HOMESTAY_HOST", "total": 34, "notified": 10, "pending": 24 },
  { "serviceType": "VEHICLE_PARTNER", "total": 12, "notified": 0, "pending": 12 }
]
```

**Status:** ✅ Implemented

---

### `POST /waitlist/admin/:serviceType/notify` — ADMIN only

Sends email notifications to all un-notified waitlist members for a service type and marks them as notified.

**Response:**
```json
{ "notified": 24 }
```

**Status:** ✅ Implemented

---

### `DELETE /waitlist/admin/:id` — ADMIN only

Remove a single entry from the waitlist.

**Status:** ✅ Implemented

---

## 18. Reviews

> Users can create reviews for tours, homestays, vehicles, and guides. Admin can delete any review.

---

### `POST /review` — Any authenticated user

Create a review for a product (tour, homestay, vehicle, guide).

**Body:**
```json
{
  "targetType": "TOUR",
  "targetId": "uuid",
  "rating": 5,
  "comment": "Absolutely amazing trek! Well organized.",
  "images": ["https://..."]
}
```

**`targetType` values:** `TOUR` `HOMESTAY` `VEHICLE` `GUIDE`

**Response:** Full review object with `id`, `userId`, `targetType`, `targetId`, `rating`, `comment`, `images[]`, `createdAt`.

**Status:** ✅ Implemented

---

### `GET /review/:targetType/:targetId` — Public

Get all reviews for a specific product.

**Query Params:** `page`, `limit`, `sort`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Amazing experience!",
      "images": ["https://..."],
      "user": { "id": "uuid", "firstName": "Aman", "lastName": "Rawat" },
      "createdAt": "2026-02-15T00:00:00Z"
    }
  ],
  "meta": { "total": 45, "page": 1, "limit": 10, "totalPages": 5 }
}
```

**Status:** ✅ Implemented

---

### `GET /review/my-reviews` — Any authenticated user

Get all reviews written by the authenticated user.

**Status:** ✅ Implemented

---

### `GET /review/:id` — Public

Get a single review by ID.

**Status:** ✅ Implemented

---

### `PATCH /review/:id` — User (own review only)

Update own review. Ownership enforced in service layer.

**Body:** Partial `CreateReviewDto` (all fields optional).

**Status:** ✅ Implemented

---

### `DELETE /review/:id` — User (own) | ADMIN (any)

User can delete their own review. Admin can delete any review and it will re-aggregate product ratings automatically.

**Status:** ✅ Implemented

---

## 19. Points of Interest (POI)

> **Requires:** `ADMIN` — POIs are platform-managed and used to attach locations to tour itineraries.

---

### `POST /poi` — ADMIN only

Create a new Point of Interest.

**Body:**
```json
{
  "name": "Pangong Lake",
  "description": "High-altitude endorheic lake in Ladakh",
  "latitude": 33.7769,
  "longitude": 78.6522,
  "imageUrls": ["https://..."],
  "category": "NATURAL_LANDMARK",
  "tagIds": ["uuid1", "uuid2"]
}
```

**Response:** Full POI object with `id`, `name`, `location`, `tags[]`.

**Status:** ✅ Implemented

---

### `GET /poi` — Public

List all POIs.

**Query Params:** `page`, `limit`, `sort`, `search`

**Status:** ✅ Implemented

---

### `GET /poi/nearby` — Public

Get POIs within a radius of a location.

**Query Params:** `latitude` (required), `longitude` (required), `radius` (km, default 10)

**Status:** ✅ Implemented

---

### `GET /poi/:id` — Public

**Status:** ✅ Implemented

---

### `PATCH /poi/:id` — ADMIN only

Partial update.

**Status:** ✅ Implemented

---

### `DELETE /poi/:id` — ADMIN only

Soft delete (sets `isActive: false` if implemented, or hard deletes).

**Status:** ✅ Implemented

---

### `POST /poi/:id/itinerary/:itineraryId` — ADMIN only

Link a POI to a tour itinerary day.

**Body:**
```json
{ "order": 1 }
```

**Status:** ✅ Implemented

---

## 20. Community Join Requests

> Users can submit requests to join the Drokpa community. Admin reviews and manages these requests.

---

### `POST /community/join` — Public

Submit a request to join the community.

**Body:**
```json
{
  "fullName": "Tenzin Dorje",
  "email": "tenzin@example.com",
  "phoneNumber": "+91-9999999999",
  "location": "Leh",
  "interests": ["Trekking", "Local Culture", "Photography"],
  "message": "I'm a local guide wanting to collaborate"
}
```

**Response:**
```json
{
  "id": "uuid",
  "fullName": "Tenzin Dorje",
  "email": "tenzin@example.com",
  "status": "PENDING",
  "createdAt": "2026-02-28T00:00:00Z"
}
```

**Status:** ✅ Implemented

---

### `GET /community/check/:email` — Public

Check the status of a join request by email.

**Response:**
```json
{
  "id": "uuid",
  "email": "tenzin@example.com",
  "status": "PENDING",
  "contactedAt": null
}
```

**Status:** ✅ Implemented

---

### `GET /community/admin/requests` — ADMIN only

List all community join requests.

**Query Params:** `page`, `limit`, `sort`, `status`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "fullName": "Tenzin Dorje",
      "email": "tenzin@example.com",
      "phoneNumber": "+91-9999999999",
      "location": "Leh",
      "interests": ["Trekking", "Local Culture"],
      "message": "I'm a local guide wanting to collaborate",
      "status": "PENDING",
      "createdAt": "2026-02-28T00:00:00Z"
    }
  ],
  "meta": { "total": 23, "page": 1, "limit": 10, "totalPages": 3 }
}
```

**Status:** ✅ Implemented

---

### `PATCH /community/admin/requests/:id/contact` — ADMIN only

Mark a request as contacted.

**Body:**
```json
{
  "notes": "Called and discussed partnership opportunities"
}
```

**Response:** Updated request with `contactedAt` timestamp and optional `notes`.

**Status:** ✅ Implemented

---

### `DELETE /community/admin/requests/:id` — ADMIN only

Delete a community join request.

**Status:** ✅ Implemented

---

## 21. Memories

> Users can create and share travel memories/photos from their trips. These are public by default.

---

### `POST /memories` — Any authenticated user

Create a new memory.

**Body:**
```json
{
  "title": "Sunset at Pangong Lake",
  "description": "One of the most beautiful sunsets I've ever seen",
  "imageUrls": ["https://...", "https://..."],
  "location": "Pangong Lake, Ladakh",
  "latitude": 33.7769,
  "longitude": 78.6522,
  "visitDate": "2026-02-20T00:00:00Z"
}
```

**Response:** Full memory object with `id`, `userId`, `title`, `imageUrls[]`, `createdAt`.

**Status:** ✅ Implemented

---

### `GET /memories` — Public

Browse all public memories.

**Query Params:** `userId`, `search`, `page`, `limit`

**Status:** ✅ Implemented

---

### `GET /memories/my-memories` — Any authenticated user

Get memories created by the authenticated user.

**Status:** ✅ Implemented

---

### `GET /memories/:id` — Public

Get a single memory by ID.

**Status:** ✅ Implemented

---

### `PUT /memories/:id` — User (own memory only)

Update own memory. Ownership enforced in service layer.

**Body:** Partial `CreateMemoryDto` (all fields optional).

**Status:** ✅ Implemented

---

### `DELETE /memories/:id` — User (own memory only)

Delete own memory. Ownership enforced in service layer.

**Status:** ✅ Implemented

---

## 22. Bucket List

> Users can create trip planning bucket lists — collections of tours, homestays, vehicles, and guides they want to book.

---

### `POST /bucketlist` — Any authenticated user

Create a new bucket list.

**Body:**
```json
{
  "name": "Ladakh Summer Trip 2026",
  "description": "My dream Ladakh adventure"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Ladakh Summer Trip 2026",
  "description": "My dream Ladakh adventure",
  "status": "ACTIVE",
  "userId": "uuid",
  "items": [],
  "createdAt": "2026-02-28T00:00:00Z"
}
```

**Status:** ✅ Implemented

---

### `GET /bucketlist` — Any authenticated user

Get all bucket lists for the authenticated user.

**Query Params:** `status` (`BucketListStatus` enum: `ACTIVE` `ARCHIVED` `CHECKED_OUT`)

**Status:** ✅ Implemented

---

### `GET /bucketlist/:id` — Any authenticated user (own bucket list only)

Get a specific bucket list with all items.

**Response:**
```json
{
  "id": "uuid",
  "name": "Ladakh Summer Trip 2026",
  "status": "ACTIVE",
  "items": [
    {
      "id": "uuid",
      "productType": "TOUR",
      "productId": "uuid",
      "quantity": 2,
      "startDate": "2026-06-10T00:00:00Z",
      "endDate": "2026-06-19T00:00:00Z",
      "product": { "id": "uuid", "title": "Chadar Trek", "price": 25000 }
    }
  ]
}
```

**Status:** ✅ Implemented

---

### `POST /bucketlist/:id/item` — Any authenticated user (own bucket list only)

Add an item to a bucket list.

**Body:**
```json
{
  "productType": "TOUR",
  "productId": "uuid",
  "quantity": 2,
  "startDate": "2026-06-10T00:00:00Z",
  "endDate": "2026-06-19T00:00:00Z"
}
```

**Status:** ✅ Implemented

---

### `PATCH /bucketlist/:id/item/:itemId` — Any authenticated user (own bucket list only)

Update bucket list item (e.g., change dates or quantity).

**Body:** Partial `AddBucketListItemDto` (all fields optional).

**Status:** ✅ Implemented

---

### `DELETE /bucketlist/:id/item/:itemId` — Any authenticated user (own bucket list only)

Remove an item from a bucket list.

**Status:** ✅ Implemented

---

### `POST /bucketlist/:id/checkout` — Any authenticated user (own bucket list only)

Convert a bucket list into bookings. Creates booking requests for all items and marks the bucket list as `CHECKED_OUT`.

**Response:** Array of created booking objects.

**Status:** ✅ Implemented

---

### `DELETE /bucketlist/:id` — Any authenticated user (own bucket list only)

Delete a bucket list.

**Status:** ✅ Implemented

---

## 23. File Uploads (S3)

> All authenticated users can request presigned URLs for uploading files to S3. These are used for photos, documents, and other media across the platform.

---

### `POST /s3/presigned-url` — Any authenticated user

Get a presigned S3 URL for uploading a single file.

**Body:**
```json
{
  "uploadType": "TOUR_IMAGE",
  "contextId": "tour-uuid",
  "fileName": "image.jpg",
  "fileType": "image/jpeg"
}
```

**`uploadType` values:** `TOUR_IMAGE` `HOMESTAY_IMAGE` `VEHICLE_IMAGE` `GUIDE_IMAGE` `REVIEW_IMAGE` `MEMORY_IMAGE` `PERMIT_DOCUMENT` `PROFILE_IMAGE` `POI_IMAGE`

**Response:**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "key": "uploads/tours/uuid/filename.jpg",
  "expiresIn": 3600
}
```

**Status:** ✅ Implemented

---

### `POST /s3/presigned-urls` — Any authenticated user

Get multiple presigned URLs for batch upload (e.g., uploading multiple photos at once).

**Body:**
```json
{
  "uploadType": "HOMESTAY_IMAGE",
  "contextId": "homestay-uuid",
  "files": [
    { "fileName": "room1.jpg", "fileType": "image/jpeg" },
    { "fileName": "room2.jpg", "fileType": "image/jpeg" }
  ]
}
```

**Response:** Array of presigned URL objects.

**Status:** ✅ Implemented

---

### `DELETE /s3` — Any authenticated user

Delete an S3 object by key (e.g., removing an uploaded image).

**Body:**
```json
{
  "key": "uploads/tours/uuid/filename.jpg"
}
```

**Status:** ✅ Implemented

---

## 24. Implementation Gaps

All high-severity gaps from the initial audit have been **closed**. The following remain:

| Gap | Severity | Notes |
|-----|----------|-------|
| **Room Management Endpoints** | 🟡 Medium | No controller endpoints exist for creating, updating, or deleting `HomestayRoom` records. DTO exists (`CreateHomestayRoomDto`) but no `POST /homestay/:id/room` endpoint. Hosts cannot add rooms to their homestays. |
| **Activity & ILP Vendor product modules** | 🟡 Medium | `ProviderType` has `ACTIVITY_VENDOR` and `ILP_VENDOR` but no `/activity` or `/ilp` controller, service, or DTOs exist yet. Booking service references these types but no product catalog exists. |
| **Booking cancellation (admin)** | 🟡 Medium | No admin endpoint to cancel a booking on behalf of a user. Users can only cancel via existing user-facing flow (if implemented). |

### Resolved from previous audit

| Gap | Resolution |
|-----|------------|
| ~~Admin proxy for Homestay/Vehicle/Guide mutations~~ | ✅ Fixed — all write endpoints now accept `ADMIN` role. Creates use `?onBehalfOf=<userId>`; updates/deletes bypass ownership check automatically. |
| ~~`CONFIRMED → COMPLETED` booking transition~~ | ✅ Fixed — `PATCH /admin/bookings/:id/complete` implemented. |
| ~~Admin delete any review~~ | ✅ Fixed — `DELETE /admin/review/:id` implemented, re-aggregates product ratings. |
| ~~Assign role to user~~ | ✅ Fixed — `PATCH /admin/user/:id/assign-role` creates Provider record + assigns role atomically. |
