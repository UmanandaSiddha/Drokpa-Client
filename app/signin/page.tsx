import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
    title: "Sign In | Drokpa",
    description: "Access your Drokpa account",
};

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
            <main className="relative min-h-screen bg-white pt-16">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                    <AuthForm defaultMode="signin" />
                </Suspense>
            </main>
        </div>
    );
}
