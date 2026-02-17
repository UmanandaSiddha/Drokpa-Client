import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
    title: "Sign In | Drokpa",
    description: "Access your Drokpa account",
    alternates: {
        canonical: "https://www.drokpa.in/sign-in",
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Sign In - Drokpa",
        description: "Access your Drokpa account",
        url: "https://www.drokpa.in/sign-in",
        images: ["https://www.drokpa.in/og.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sign In - Drokpa",
        description: "Access your Drokpa account",
        images: ["https://www.drokpa.in/og.png"],
    },
};

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthForm defaultMode="sign-in" />
        </Suspense>
    );
}
