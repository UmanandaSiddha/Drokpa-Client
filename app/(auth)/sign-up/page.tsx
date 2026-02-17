import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Sign Up | Drokpa",
    description: "Create your Drokpa account",
    alternates: {
        canonical: "https://www.drokpa.in/sign-up",
    },
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Sign Up - Drokpa",
        description: "Create your Drokpa account",
        url: "https://www.drokpa.in/sign-up",
        images: ["https://www.drokpa.in/og.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sign Up - Drokpa",
        description: "Create your Drokpa account",
        images: ["https://www.drokpa.in/og.png"],
    },
};

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthForm defaultMode="sign-up" />
        </Suspense>
    )
}
