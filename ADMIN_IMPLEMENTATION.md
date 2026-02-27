# Admin Panel Implementation Status

This document outlines the complete implementation status of the admin panel features for Drokpa.

**Last Updated:** 2024

---

## ✅ Complete Feature Matrix

| Feature | Service | Hooks | UI Page | Role Guard | Status |
|---------|---------|-------|---------|------------|--------|
| **Dashboard** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **Users Management** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **Providers Management** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **Bookings** | ✅ | ✅ | ✅ | ADMIN/Providers | ✅ Complete |
| **Payouts** | ✅ | ✅ | ✅ | ADMIN/Providers | ✅ Complete |
| **Community Requests** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **Provider Onboarding** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **Coupons** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **Permits** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **Tours** | ✅ | ✅ | ✅ | ADMIN | ✅ Complete |
| **My Listings** | ✅ | ✅ | ✅ | HOST/VENDOR/GUIDE | ✅ Complete |

---

## 🎯 Admin Panel Pages

### 1. **Dashboard** - `/admin`
**Role:** ADMIN only  
**Purpose:** Platform overview and statistics

**Features:**
- Total users count (active/inactive/suspended)
- Total providers (HOST/VENDOR/GUIDE breakdown)
- Booking statistics (total/confirmed/pending/awaiting payment)
- Revenue tracking
- Normalized API response handling (flat vs nested)

**Files:**
- Page: `app/admin/page.tsx`
- Service: `services/admin.service.ts` → `getDashboard()`
- Hook: `hooks/admin/index.ts` → `useAdminDashboard()`

---

### 2. **Users Management** - `/admin/users`
**Role:** ADMIN only  
**Purpose:** Manage all platform users

**Features:**
- List all users with search and pagination
- Verify user accounts
- Toggle user status (active/suspended)
- Delete users
- Filter by verification status

**Files:**
- Page: `app/admin/users/page.tsx`
- Service: `services/admin.service.ts` → `getAllUsers()`, `verifyUser()`, `toggleUserStatus()`, `deleteUser()`
- Hooks: `hooks/user/` → `useAdminAllUsers()`, `useAdminVerifyUser()`, `useAdminToggleUserStatus()`, `useAdminDeleteUser()`

---

### 3. **Providers Management** - `/admin/providers`
**Role:** ADMIN only  
**Purpose:** Verify and manage service providers

**Features:**
- List all providers (HOST, VENDOR, GUIDE)
- Verify provider accounts
- Suspend providers
- Filter by status and provider type

**Files:**
- Page: `app/admin/providers/page.tsx`
- Service: `services/provider.service.ts` → `getAllProviders()`, `verifyProvider()`, `suspendProvider()`
- Hooks: `hooks/provider/` → `useAdminProviders()`, `useVerifyProvider()`, `useSuspendProvider()`

---

### 4. **Bookings Management** - `/admin/bookings`
**Role:** ADMIN and all provider roles (HOST, VENDOR, GUIDE)  
**Purpose:** View and manage bookings

**Features:**
- **Dual mode operation:**
  - Admin: See ALL platform bookings
  - Providers: See only their own bookings
- Filter by status (REQUESTED, CONFIRMED, AWAITING_PAYMENT, COMPLETED, CANCELLED)
- Confirm tour bookings with payment window
- Reject bookings with reason
- Pagination support

**Files:**
- Page: `app/admin/bookings/page.tsx`
- Service: `services/admin.service.ts` → `getAllBookings()`, `confirmTourBooking()`, `rejectTourBooking()`
- Service: `services/booking.service.ts` → `getProviderBookings()`
- Hooks: `hooks/admin/index.ts` → `useAdminAllBookings()`, `useAdminConfirmTourBooking()`, `useAdminRejectTourBooking()`
- Hooks: `hooks/booking/` → `useProviderBookings()`

---

### 5. **Payouts Management** - `/admin/payouts`
**Role:** ADMIN and all provider roles  
**Purpose:** Track and manage payouts

**Features:**
- **Dual mode operation:**
  - Admin: See ALL payouts across platform
  - Providers: See only their own payouts
- Summary strip showing total earnings, pending, processed amounts
- Filter by status (PENDING, PROCESSING, COMPLETED, FAILED)
- Pagination support

**Files:**
- Page: `app/admin/payouts/page.tsx`
- Service: `services/payout.service.ts` → `getMyPayouts()`, `getAdminPayouts()`
- Hooks: `hooks/payout/` → `useMyPayouts()`, `useAdminPayouts()`

---

### 6. **Community Requests** - `/admin/community`
**Role:** ADMIN only  
**Purpose:** Manage community join requests

**Features:**
- List all community join requests
- View request details (name, email, phone, reason)
- Mark requests as contacted
- Summary statistics (total, uncontacted, contacted)
- Filter by contact status

**Files:**
- Page: `app/admin/community/page.tsx`
- Service: `services/community.service.ts` → `getCommunityRequests()`, `getCommunityStats()`, `markContacted()`
- Hooks: `hooks/misc/` → `useCommunityRequests()`, `useCommunityStats()`, `useMarkCommunityContacted()`

---

### 7. **Provider Onboarding** - `/admin/onboarding`
**Role:** ADMIN only  
**Purpose:** Invite and manage provider onboarding

**Features:**
- List all pending onboarding invitations
- Invite new providers by email with role selection (HOST, VENDOR, GUIDE)
- Revoke pending invitations
- Resend invitation emails
- Filter by provider type

**Files:**
- Page: `app/admin/onboarding/page.tsx`
- Service: `services/admin.service.ts` → `getOnboardings()`, `inviteProvider()`, `revokeOnboarding()`, `resendOnboarding()`
- Hooks: `hooks/admin/index.ts` → `useAdminOnboardings()`, `useInviteProvider()`, `useRevokeOnboarding()`, `useResendOnboarding()`

---

### 8. **Coupons Management** - `/admin/coupons`
**Role:** ADMIN only  
**Purpose:** Create and manage discount coupons

**Features:**
- List all coupons with usage tracking
- Create new coupons (percentage or fixed amount)
- Edit existing coupons
- Delete coupons with confirmation
- Set coupon visibility (PUBLIC or PRIVATE)
- Assign private coupons to specific users
- Set validity periods and usage limits
- Track redemptions (current/max uses)

**Files:**
- Page: `app/admin/coupons/page.tsx`
- Service: `services/coupon.service.ts` → `createCoupon()`, `getAllCoupons()`, `getCouponById()`, `updateCoupon()`, `deleteCoupon()`, `assignCouponToUser()`, `removeCouponFromUser()`, `getCouponAssignments()`, `validateCoupon()`
- Hooks: `hooks/admin/index.ts` → `useAdminCoupons()`, `useAdminCoupon()`, `useCreateCoupon()`, `useUpdateCoupon()`, `useDeleteCoupon()`, `useAssignCouponToUser()`, `useRemoveCouponFromUser()`, `useGetCouponAssignments()`
- Types: `types/coupon.ts` → `Coupon`, `CouponType`, `CouponVisibility`, `CouponApplyTo`, `CreateCouponRequest`, `UpdateCouponRequest`

---

### 9. **Permits Management** - `/admin/permits` ✨ NEW
**Role:** ADMIN only  
**Purpose:** Review and approve ILP permits

**Features:**
- List all permit requests with status
- View permit details (user, permit type, validity dates)
- Approve permits with document attachment
- Reject permits with reason
- Filter by status (SUBMITTED, APPROVED, REJECTED, EXPIRED)
- Pagination support

**Files:**
- Page: `app/admin/permits/page.tsx` ✨ **NEWLY CREATED**
- Service: `services/permit.service.ts` → Complete permit CRUD operations
- Hooks: `hooks/permit/index.ts` → `usePermitsByBooking()`, `useSubmitPermit()`, `useApprovePermit()`, `useRejectPermit()`
- Hooks: `hooks/admin/index.ts` → Re-exports permit hooks ✨ **UPDATED**
- Types: `types/permit.ts` → `Permit`, `PermitStatus`, `SubmitPermitRequest`, `ApprovePermitRequest`, `RejectPermitRequest`

**Backend Requirements:**
- ⚠️ `GET /admin/permits` endpoint needs to be implemented (currently using direct fetch)

---

### 10. **Tours Management** - `/admin/tours` ✨ NEW
**Role:** ADMIN only  
**Purpose:** Create and manage platform tours

**Features:**
- List all tours with key details
- Create new tours with form validation
- Edit existing tour details
- Delete tours with confirmation
- Set tour status (active/inactive)
- Configure pricing (base price, discount, final price)
- Set duration and capacity limits
- Track booking statistics

**Files:**
- Page: `app/admin/tours/page.tsx` ✨ **NEWLY CREATED**
- Service: `services/tour.service.ts` → Complete tour CRUD + itinerary + POI operations
- Hooks: `hooks/tours/index.ts` → `useTours()`, `useTour()`, `useCreateTour()`, `useUpdateTour()`, `useDeleteTour()`, `useAddItineraryDay()`, `useLinkPOIToItinerary()`, `usePOIs()`, `usePOI()`, `useCreatePOI()`, `useUpdatePOI()`, `useDeletePOI()`
- Hooks: `hooks/admin/index.ts` → Re-exports tour hooks ✨ **UPDATED**
- Types: `types/tour.ts` → `Tour`, `TourType`, `TourItinerary`, `TourItineraryPOI`, `POI`, various request types

---

### 11. **My Listings** - `/admin/my-listings`
**Role:** HOST, VENDOR, GUIDE (providers only)  
**Purpose:** Manage provider's own listings

**Features:**
- **Role-based sections:**
  - HOST: Manage homestays
  - VENDOR: Manage vehicles
  - GUIDE: Manage guide profile
- View all own listings in grid layout
- Quick stats for each listing
- Links to edit individual listings

**Files:**
- Page: `app/admin/my-listings/page.tsx`
- Service: Multiple services (homestay, vehicle, guide)
- Hooks: `hooks/homestays/`, `hooks/vehicle/`, `hooks/guide/` → `useMyHomestays()`, `useMyVehicles()`, `useMyGuides()`

---

## 🔐 Role-Based Access Control Summary

### ADMIN Role
✅ Dashboard  
✅ Users Management  
✅ Providers Management  
✅ Bookings (all)  
✅ Payouts (all)  
✅ Community Requests  
✅ Provider Onboarding  
✅ Coupons Management  
✅ Permits Management ✨ NEW  
✅ Tours Management ✨ NEW  

### Provider Roles (HOST, VENDOR, GUIDE)
✅ Bookings (own only)  
✅ Payouts (own only)  
✅ My Listings  

### All Pages Protected
Every admin page uses `<RoleGuard allowedRoles={[...roles]}>` component for client-side access control.

---

## 🎨 UI Components & Styling

### Admin Sidebar Navigation
**File:** `components/admin/AdminSidebar.tsx`

**Sections:**
1. **Admin** (ADMIN only)
   - Overview (Dashboard)
   - Users
   - Providers
   - Onboarding
   - Permits ✨ NEW
   - Community
   - Coupons

2. **Bookings & Finance** (all roles)
   - Bookings (dual-mode)
   - Payouts (dual-mode)
   - Tours (ADMIN only) ✨ NEW

3. **My Provider Panel** (providers only)
   - My Homestays (HOST)
   - My Vehicles (VENDOR)
   - My Guide Profile (GUIDE)
   - My Listings (all providers)

**Features:**
- Dynamic visibility based on user role
- Active link highlighting
- User info footer with avatar
- Logout button
- "Back to Site" link

---

### Admin CSS (app/admin/admin.css)
**Lines:** 1126 total

**Updated Styles:**
- ✨ `.admin-badge--approved` - Green badge for approved status
- ✨ `.admin-badge--submitted` - Yellow badge for submitted status
- ✨ `.admin-badge--expired` - Red badge for expired status
- `.admin-badge--inactive` - Gray badge for inactive tours
- `.admin-form` + variants - Form styling
- `.admin-modal` + variants - Modal system
- `.admin-table` + variants - Data tables
- `.admin-pagination` - Pagination controls
- `.admin-filters` + `.admin-filter-chip` - Status filters

---

## 🚀 S3 Presigned URL Implementation (Complete)

### Upload Types

#### Upload Types (`types/upload.ts`)
- `UploadType` enum with categories: AVATAR, HOMESTAY, VEHICLE, TOUR, GUIDE, PERMIT, MEMORY, POI, DOCUMENT
- `PresignedUrlRequest` and `PresignedUrlResponse` types
- Bulk upload support

#### Upload Service (`services/upload.service.ts`)
- `uploadService.getPresignedUrl()` - Get single presigned URL
- `uploadService.getBulkPresignedUrls()` - Get multiple presigned URLs
- `uploadService.deleteFile()` - Delete file from S3
- `uploadService.uploadToS3()` - Direct file upload using presigned URL

#### Upload Hooks (`hooks/upload.ts`)
- `usePresignedUrl()` - Simple mutation for getting presigned URL
- `useBulkPresignedUrls()` - Bulk upload support
- `useFileUpload()` - Complete upload flow (get URL + upload file)
  - Automatic error handling
  - File validation (size, type)
  - Returns public URL on success

#### Image Upload Component (`components/admin/ImageUpload.tsx`)
- Drag-and-drop image upload
- File validation (format, size)
- Preview display
- Remove/replace image
- Upload progress indication
- Error display
- Customizable settings (max size, formats)

### 3. **Booking Type Updates** (`types/booking.ts`)
- Added coupon support to `Booking` interface:
  - `couponId?: string`
  - `discountAmount?: number`
  - `coupon?: Coupon`
- Added `ApplyCouponRequest` type for applying coupons to bookings

### 4. **Admin Sidebar Navigation Update**
- Added "Coupons" link to admin navigation
- Only visible to ADMIN role
- Proper icon (Tag icon from lucide-react)
- Integrated into existing sidebar structure

### 5. **Admin Panel CSS Enhancements** (`app/admin/admin.css`)
- Added form styles:
  - `.admin-form` - Form container
  - `.admin-form__group` - Form field group
  - `.admin-form__label` - Form label
  - `.admin-form__input`, `.admin-form__select`, `.admin-form__textarea`
  - `.admin-form__row` - Two-column grid layout
- Added modal styles:
  - `.admin-modal-overlay` - Backdrop with correct z-index
  - `.admin-modal` - Modal container
  - `.admin-modal__header`, `.admin-modal__title`, `.admin-modal__close`
  - `.admin-modal__body` - Modal content area
- Added badge variants:
  - `.admin-badge--public` - Public coupon badge
  - `.admin-badge--private` - Private coupon badge
  - `.admin-badge--inactive` - Inactive item badge

### 6. **Existing Admin Pages (Already Implemented)**
- ✅ Dashboard (`/admin`) - Platform overview stats
- ✅ Bookings (`/admin/bookings`) - List all bookings, filter by status
- ✅ Users (`/admin/users`) - Manage users, verify, toggle status, delete
- ✅ Providers (`/admin/providers`) - Verify and suspend providers
- ✅ Payouts (`/admin/payouts`) - Payment history and payout management

---

## 🚀 How to Use

### Create a Coupon (Admin Only)
```typescript
const createCoupon = useCreateCoupon();

createCoupon.mutate({
    code: 'SUMMER20',
    type: CouponType.PERCENTAGE,
    discountValue: 20,
    visibility: CouponVisibility.PUBLIC,
    applyTo: CouponApplyTo.BOOKING_TOTAL,
    validFrom: '2026-06-01',
    validUntil: '2026-08-31',
    minOrderAmount: 5000,
    maxUsesTotal: 100,
    maxUsesPerUser: 2,
    isActive: true,
});
```

### Upload an Image with Presigned URL
```typescript
const { upload, isUploading, error } = useFileUpload();

const publicUrl = await upload(
    {
        uploadType: UploadType.HOMESTAY,
        contextId: homestayId,
        fileName: 'my-image.jpg',
        fileType: 'image/jpeg',
    },
    file
);
```

### Use ImageUpload Component
```tsx
<ImageUpload
    uploadType={UploadType.HOMESTAY}
    contextId={homestayId}
    onUpload={(publicUrl) => {
        setImageUrl(publicUrl);
    }}
    maxSizeMB={10}
/>
```

### Validate Coupon Before Applying
```typescript
const response = await couponService.validateCoupon('SUMMER20', 10000);

if (response.valid) {
    // Apply coupon to booking
    applyDiscountAmount(response.discountAmount);
} else {
    showError(response.reason);
}
```

---

## 📋 Checklist for Backend API Endpoints

The following backend endpoints should be implemented to support the frontend:

### Coupon Endpoints
- [ ] `POST /admin/coupons` - Create coupon
- [ ] `GET /admin/coupons` - List coupons (paginated)
- [ ] `GET /admin/coupons/{id}` - Get coupon details
- [ ] `PATCH /admin/coupons/{id}` - Update coupon
- [ ] `DELETE /admin/coupons/{id}` - Delete coupon
- [ ] `POST /admin/coupons/{couponId}/assign-user` - Assign coupon to user
- [ ] `DELETE /admin/coupons/{couponId}/users/{userId}` - Remove user assignment
- [ ] `GET /admin/coupons/{couponId}/assignments` - Get coupon assignments
- [ ] `POST /coupons/validate` - Validate coupon (user-facing)

### S3 Presigned URL Endpoints
- [ ] `POST /s3/presigned-url` - Get single presigned URL
- [ ] `POST /s3/presigned-urls` - Get multiple presigned URLs
- [ ] `DELETE /s3` - Delete file from S3

---

## 🔐 Role-Based Access Control

### Admin Features
- View and manage all coupons
- Create, update, delete coupons
- Assign/remove coupons to/from specific users
- View coupon usage statistics

### Provider Features (Homestay Host, Vehicle Vendor, Guide)
- Upload images for their listings
- View their own bookings
- Access payout information

### User Features
- Validate and apply coupons to bookings
- Upload profile images

---

## 🎨 UI/UX Features

### Coupon Page Features
- **List View**: Table showing all coupons with key metrics
  - Code (monospace font)
  - Type indicator (% or ₹)
  - Discount value with max cap
  - Active/Inactive status badge
  - Usage tracking (current/max)
  - Expiry date
  - Visibility indicator
  - Action buttons (edit, delete)

- **Create/Edit Modal**: Comprehensive form with fields
  - Code (auto-uppercase, disabled on edit)
  - Description (textarea)
  - Discount type (percentage or fixed)
  - Discount value
  - Visibility (public or private)
  - Apply to (booking total or per person)
  - Validity dates (from and optional until)
  - Minimum order amount
  - Maximum discount cap
  - Usage limits (total and per user)
  - Active status toggle

- **Pagination**: Navigate between pages of coupons
- **Search**: Find coupons by code or description
- **Responsive**: Works on mobile and desktop

### Image Upload Component Features
- Drag-and-drop zone
- Click to browse
- Real-time preview
- File size validation
- File type validation
- Remove/replace functionality
- Upload progress indication
- Success/error feedback
- Customizable constraints

---

## 🔗 Type Exports

All types are properly exported from `types/index.ts`:
- Coupon types
- Upload types
- Booking type updates
- All admin types

---

## 🛠 Development Notes

### Fixed Issues
1. **Admin navbar overlap**: Fixed by hiding landing page chrome on `/admin` routes
2. **Dashboard stats error**: Added normalization in service for flat vs nested response shapes
3. **Form styles**: Added comprehensive CSS classes for forms and modals

### Directory Structure
```
app/admin/
├── coupons/
│   └── page.tsx          (NEW - Coupon management)
├── bookings/
│   └── page.tsx          (List and manage bookings)
├── users/
│   └── page.tsx          (User management)
├── providers/
│   └── page.tsx          (Provider verification)
├── payouts/
│   └── page.tsx          (Payout management)
└── admin.css             (UPDATED - Added form/modal styles)

components/admin/
├── AdminSidebar.tsx      (UPDATED - Added coupons link)
└── ImageUpload.tsx       (NEW - Reusable image upload)

hooks/
├── admin/
│   └── index.ts          (UPDATED - Added coupon hooks)
└── upload.ts             (NEW - S3 presigned URL hooks)

services/
├── coupon.service.ts     (NEW - Coupon API calls)
└── upload.service.ts     (Existing - S3 operations)

types/
├── coupon.ts             (NEW - Coupon types)
├── booking.ts            (UPDATED - Added coupon fields)
└── index.ts              (UPDATED - Export coupons)
```

---

## 📚 API Reference

### CouponService Methods
```typescript
// Create
createCoupon(data: CreateCouponRequest): Promise<Coupon>

// Read
getAllCoupons(params?: CouponQueryParams): Promise<PaginatedResponse<Coupon>>
getCouponById(id: string): Promise<Coupon>

// Update
updateCoupon(id: string, data: UpdateCouponRequest): Promise<Coupon>

// Delete
deleteCoupon(id: string): Promise<{ message: string }>

// User assignments
assignCouponToUser(couponId: string, data: AssignCouponUserRequest): Promise<CouponUserAssignment>
removeCouponFromUser(couponId: string, userId: string): Promise<{ message: string }>
getCouponAssignments(couponId: string): Promise<CouponUserAssignment[]>

// Validation
validateCoupon(code: string, bookingValue?: number): Promise<ValidateCouponResponse>
```

### UploadService Methods
```typescript
// Single file
getPresignedUrl(data: PresignedUrlRequest): Promise<PresignedUrlResponse>
uploadToS3(presignedUrl: string, file: File): Promise<void>

// Bulk files
getBulkPresignedUrls(data: BulkPresignedUrlRequest): Promise<BulkPresignedUrlResponse>

// Delete
deleteFile(data: DeleteS3FileRequest): Promise<{ success: boolean }>
```

---

## 🧪 Testing Checklist

- [ ] Create coupon with all field types
- [ ] Update coupon details
- [ ] Delete coupon
- [ ] List coupons with pagination
- [ ] Filter coupons by status
- [ ] Assign coupon to users (private coupons)
- [ ] Remove user assignments
- [ ] Upload image successfully
- [ ] Validate file size limits
- [ ] Validate file type restrictions
- [ ] Handle upload errors gracefully
- [ ] Validate coupon code before applying
- [ ] Apply coupon to booking
- [ ] Check coupon usage limits

---

## 🚨 Important Notes

1. **S3 Configuration**: Ensure your backend is properly configured to generate presigned URLs with appropriate TTL (Time To Live) and CORS settings
2. **File Upload**: Files are uploaded directly to S3 using presigned URLs (not through your backend)
3. **Coupon Validation**: Backend should validate:
   - Coupon exists and is active
   - Current uses < maxUsesTotal (if set)
   - User's usage < maxUsesPerUser (if set)
   - Booking amount >= minOrderAmount (if set)
   - Current date is between validFrom and validUntil
   - User is eligible (public coupon OR in allowedRoles OR in userAssignments)
4. **Role-Based Features**: Coupon management is ADMIN-only. Ensure proper role guards are in place.

---

## 📞 Support

For issues or questions about the implementation:
1. Check the API_ENDPOINTS.md for endpoint specifications
2. Review the type definitions for correct request/response shapes
3. Ensure backend endpoints are implemented correctly
4. Verify S3 and authentication setup

