import type { Metadata } from "next";
import OtpVerificationClient from "../../../client/OtpVerificationClient";

export const metadata: Metadata = {
    title: "OTP Verification | Drokpa",
    description: "Verify your account with a one-time password",
    alternates: {
        canonical: "https://www.drokpa.in/otp-verification",
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "OTP Verification - Drokpa",
        description: "Verify your account with a one-time password",
        url: "https://www.drokpa.in/otp-verification",
        images: ["https://www.drokpa.in/og.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "OTP Verification - Drokpa",
        description: "Verify your account with a one-time password",
        images: ["https://www.drokpa.in/og.png"],
    },
};

export default function OtpVerificationPage() {
    return (
        <OtpVerificationClient />
    );
}
