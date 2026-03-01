import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/axiosClient';
import type { User } from '@/types/auth';

interface HostVerificationResult {
    isValid: boolean;
    user?: User;
    error?: string;
}

export function useHostVerification() {
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Verify if a user ID exists and has HOST role
     */
    const verifyHostId = useCallback(async (userId: string): Promise<HostVerificationResult> => {
        try {
            if (!userId || userId.trim() === '') {
                return { isValid: false, error: 'User ID cannot be empty' };
            }

            // Basic UUID validation
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(userId)) {
                return { isValid: false, error: 'Invalid user ID format' };
            }

            setIsVerifying(true);
            setError(null);

            // Fetch user details from backend
            const response = await apiClient.get<{ data: User }>(`/users/${userId}`);
            const user = response.data.data;

            // Check if user has HOST role
            const hasHostRole = user.roles?.some((r) => r.role === 'HOST');

            if (!hasHostRole) {
                return {
                    isValid: false,
                    error: 'User does not have HOST role',
                };
            }

            return {
                isValid: true,
                user,
            };
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to verify host ID';
            setError(errorMessage);
            return { isValid: false, error: errorMessage };
        } finally {
            setIsVerifying(false);
        }
    }, []);

    return {
        isVerifying,
        error,
        verifyHostId,
    };
}
