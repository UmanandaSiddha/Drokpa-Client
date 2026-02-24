import { apiClient } from "@/lib/axiosClient";
import type {
    SignUpRequest,
    SignInRequest,
    RequestOTPRequest,
    VerifyOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    OTPResponse,
    MessageResponse,
    RefreshTokenResponse,
    GoogleAuthResponse,
} from "@/types/auth";
import { AxiosResponse } from "axios";

// ──────────────────────────────────────────────
// Auth Service - All authentication API calls
// ──────────────────────────────────────────────

class AuthService {
    /**
     * Sign up a new user
     */
    async signUp(data: SignUpRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/sign-up", data);
        return response.data;
    }

    /**
     * Sign in an existing user
     */
    async signIn(data: SignInRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/sign-in", data);
        return response.data;
    }

    /**
     * Request OTP for email login
     */
    async requestOTP(data: RequestOTPRequest): Promise<OTPResponse> {
        const response = await apiClient.post<OTPResponse>("/auth/request-otp", data);
        return response.data;
    }

    /**
     * Verify OTP and login
     */
    async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/auth/verify-otp", data);
        return response.data;
    }

    /**
     * Request password reset
     */
    async forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
        const response = await apiClient.post<MessageResponse>("/auth/forgot-password", data);
        return response.data;
    }

    /**
     * Reset password with token
     */
    async resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
        const response = await apiClient.post<MessageResponse>("/auth/reset-password", data);
        return response.data;
    }

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<RefreshTokenResponse> {
        const response = await apiClient.post<RefreshTokenResponse>("/auth/refresh-token");
        return response.data;
    }

    /**
     * Logout current user
     */
    async logout(): Promise<MessageResponse> {
        const response = await apiClient.post<MessageResponse>("/auth/logout");
        return response.data;
    }

    async googleAuth(idToken: string, firstName?: string, lastName?: string): Promise<AxiosResponse<GoogleAuthResponse>> {
        const response = apiClient.post('/auth/google', { idToken, firstName, lastName })
        return response;
    }
}

// Export singleton instance
export const authService = new AuthService();
