import AuthForm from "@/components/AuthForm";
import { Suspense } from "react";

export const metadata = {
    title: "Sign Up | Drokpa",
    description: "Create your Drokpa account",
};

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthForm defaultMode="signup" />;
        </Suspense>
    )
}
