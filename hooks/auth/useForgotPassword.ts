'use client'

import type { ForgotPasswordRequest } from "@/types/auth";
import { useToast } from "../useToast";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export function useForgotPassword() {
    const { addToast } = useToast();

    return useMutation({
        mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
        onSuccess: (response) => {
            addToast({
                title: "Email Sent",
                message: response.message || "Password reset link sent to your email.",
                type: "success",
            });
        },
        onError: (error: any) => {
            addToast({
                title: "Failed",
                message: error.response?.data?.message || "Could not process request. Please try again.",
                type: "error",
            });
        },
    });
}