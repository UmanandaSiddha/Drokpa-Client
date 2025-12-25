import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
    title: "Sign In | Drokpa",
    description: "Access your Drokpa account",
};

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthForm defaultMode="signin" />
        </Suspense>
    );
}
