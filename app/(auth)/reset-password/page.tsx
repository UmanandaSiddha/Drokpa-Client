import type { Metadata } from "next";
import ResetPasswordClient from "../../../client/ResetPasswordClient";

export const metadata: Metadata = {
    title: "Reset Password | Drokpa",
    description: "Set a new password for your Drokpa account",
    alternates: {
        canonical: "https://www.drokpa.in/reset-password",
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Reset Password - Drokpa",
        description: "Set a new password for your Drokpa account",
        url: "https://www.drokpa.in/reset-password",
        images: ["https://www.drokpa.in/og.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Reset Password - Drokpa",
        description: "Set a new password for your Drokpa account",
        images: ["https://www.drokpa.in/og.png"],
    },
};

export default function ResetPasswordPage() {
    return <ResetPasswordClient />;
}
