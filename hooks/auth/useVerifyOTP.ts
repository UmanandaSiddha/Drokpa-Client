'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "../useToast";
import { useMutation } from "@tanstack/react-query";
import type { VerifyOTPRequest } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { useAuth } from "./useAuth";
import { resetRefreshTokenState } from "@/lib/axiosClient";

export function useVerifyOTP() {
    const router = useRouter();
    const { setUser } = useAuth();
    const { addToast } = useToast();
    const searchParams = useSearchParams();

    const from = (() => {
        const raw = searchParams.get('from')
        return raw?.startsWith('/') ? raw : '/account'
    })()

    return useMutation({
        mutationFn: (data: VerifyOTPRequest) => authService.verifyOTP(data),
        onSuccess: (response) => {
            // Reset refresh token state for new session
            resetRefreshTokenState();

            // Update auth cache with user data
            setUser(response.data.user);

            // Show success message
            addToast({
                title: "Verified!",
                message: response.message || "OTP verified successfully!",
                type: "success",
            });

            router.replace(from);
        },
        onError: (error: any) => {
            addToast({
                title: "Verification Failed",
                message: error.response?.data?.message || "Invalid or expired OTP.",
                type: "error",
            });
        },
    });
}