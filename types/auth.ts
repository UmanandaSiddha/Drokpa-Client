// ──────────────────────────────────────────────
// Enums (matching Prisma schema)
// ──────────────────────────────────────────────

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    HOST = "HOST",
    VENDOR = "VENDOR",
    GUIDE = "GUIDE",
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export enum AuthProvider {
    OTP = "OTP",
    PASSWORD = "PASSWORD",
    GOOGLE = "GOOGLE",
}

// ──────────────────────────────────────────────
// Auth Request Types
// ──────────────────────────────────────────────

export interface SignUpRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface RequestOTPRequest {
    email: string;
}

export interface VerifyOTPRequest {
    email: string;
    otpString: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

// ──────────────────────────────────────────────
// User & Auth Response Types
// ──────────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    avatarUrl?: string;
    gender?: Gender;
    dateOfBirth?: string;
    isVerified: boolean;
    isOnline: boolean;
    isDisabled: boolean;
    roles?: UserRole[];
    provider?: {
        id: string;
        name: string;
        type: string;
        status: string;
        verified: boolean;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
}

export interface OTPResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
    };
}

export interface MessageResponse {
    success: boolean;
    message: string;
}

export interface GoogleAuthExistingUserResponse {
    message: string
    isNewUser: false
    data: User
}

export interface GoogleAuthNewUserResponse {
    isNewUser: true
    email: string
    googleUid: string
}

export type GoogleAuthResponse = GoogleAuthExistingUserResponse | GoogleAuthNewUserResponse;

export interface MeResponse {
    message: string;
    data: User;
};

// ──────────────────────────────────────────────
// Profile Update Types
// ──────────────────────────────────────────────

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    phoneNumber?: string;
    gender?: Gender;
    dateOfBirth?: string;
}

export interface UpdateEmailRequest {
    email: string;
    phoneNumber?: string;
}

export interface NotificationPreferences {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
}

export interface UpdateNotificationPreferencesRequest {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
}
