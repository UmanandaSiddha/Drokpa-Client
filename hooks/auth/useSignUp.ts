'use client'

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "../useToast";
import type { SignUpRequest } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { useAuth } from "./useAuth";
import { resetRefreshTokenState } from "@/lib/axiosClient";

export function useSignUp() {
    const router = useRouter();
    const { setUser } = useAuth();
    const { addToast } = useToast();
    const searchParams = useSearchParams();

    const from = (() => {
        const raw = searchParams.get('from')
        return raw?.startsWith('/') ? raw : '/account'
    })()

    return useMutation({
        mutationFn: (data: SignUpRequest) => authService.signUp(data),
        onSuccess: (response, variables) => {
            // Reset refresh token state for new session
            resetRefreshTokenState();

            // Update auth cache with user data
            setUser(response.data.user);

            // Show success message
            addToast({
                title: "Success",
                message: response.message || "Account created successfully!",
                type: "success",
            });

            router.push(`/otp-verification?email=${encodeURIComponent(variables.email)}&from=${encodeURIComponent(from)}`);
        },
        onError: (error: any) => {
            addToast({
                title: "Sign Up Failed",
                message: error.response?.data?.message || "Failed to create account. Please try again.",
                type: "error",
            });
        },
    });
}