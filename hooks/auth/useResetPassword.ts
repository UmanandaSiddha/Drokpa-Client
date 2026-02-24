'use client'

import { useRouter } from "next/navigation";
import { useToast } from "../useToast";
import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordRequest } from "@/types/auth";
import { authService } from "@/services/auth.service";

export function useResetPassword() {
    const router = useRouter();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
        onSuccess: (response) => {
            addToast({
                title: "Password Reset",
                message: response.message || "Your password has been reset successfully!",
                type: "success",
            });

            // Redirect to sign in page
            router.push("/sign-in");
        },
        onError: (error: any) => {
            addToast({
                title: "Reset Failed",
                message: error.response?.data?.message || "Failed to reset password. Please try again.",
                type: "error",
            });
        },
    });
}