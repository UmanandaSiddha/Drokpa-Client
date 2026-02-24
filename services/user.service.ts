import { apiClient } from "@/lib/axiosClient";
import type { MeResponse, User } from "@/types/auth";

// ──────────────────────────────────────────────
// User Service - All user API calls
// ──────────────────────────────────────────────

class UserService {
    /**
     * Get current user profile
     */
    async getMe(): Promise<MeResponse> {
        const response = await apiClient.get<MeResponse>("/user/me");
        return response.data;
    }
}

// Export singleton instance
export const userService = new UserService();