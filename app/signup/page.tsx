import AuthForm from "@/components/AuthForm";
import { Suspense } from "react";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";
import MobileMenu from "@/components/MobileMenu";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

export const metadata = {
    title: "Sign Up | Drokpa",
    description: "Create your Drokpa account",
};

export default function SignUpPage() {
    return (
        <MobileMenuProvider>
            <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
                <Navigation />
                <MobileMenu />
                <main className="relative min-h-screen bg-white pt-16">
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                        <AuthForm defaultMode="signup" />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </MobileMenuProvider>
    )
}
