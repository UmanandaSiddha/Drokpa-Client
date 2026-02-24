'use client'

// import { useRouter } from "next/navigation";
import { useToast } from "../useToast";
import { useMutation } from "@tanstack/react-query";
import { RequestOTPRequest } from "@/types/auth";
import { authService } from "@/services/auth.service";

export function useRequestOTP() {
    const { addToast } = useToast();
    // const router = useRouter();

    return useMutation({
        mutationFn: (data: RequestOTPRequest) => authService.requestOTP(data),
        onSuccess: (response, variables) => {
            addToast({
                title: "OTP Sent",
                message: response.message || "Check your email for the OTP code.",
                type: "success",
            });

            // Redirect to OTP verification page with email
            // router.push(`/otp-verification?email=${encodeURIComponent(variables.email)}`);
        },
        onError: (error: any) => {
            addToast({
                title: "Failed to Send OTP",
                message: error.response?.data?.message || "Could not send OTP. Please try again.",
                type: "error",
            });
        },
    });
}