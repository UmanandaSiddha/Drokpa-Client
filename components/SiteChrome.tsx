"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/landingpagecomponents/Navigation";
import MobileMenu from "@/components/MobileMenu";
import Footer from "@/components/landingpagecomponents/Footer";
import DevBanner from "@/components/DevBanner";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import { DevBannerProvider } from "@/context/DevBannerContext";

const showCtaRoutes = new Set([
    "/",
    "/about",
    "/account",
    "/activities",
    "/articles",
    "/company-details",
    "/contact",
    "/ilp",
    "/privacy",
    "/route-planner",
    "/terms",
]);

const authRoutes = new Set([
    "/sign-in",
    "/sign-up",
    "/otp-verification",
    "/reset-password",
]);

function shouldShowCta(pathname: string | null): boolean {
    if (!pathname) return false;
    if (showCtaRoutes.has(pathname)) return true;
    return pathname.startsWith("/articles/");
}

function shouldHideChrome(pathname: string | null): boolean {
    if (!pathname) return false;
    if (authRoutes.has(pathname)) return true;
    for (const route of authRoutes) {
        if (pathname.startsWith(`${route}/`)) return true;
    }
    return false;
}

type SiteChromeProps = {
    children: ReactNode;
};

export default function SiteChrome({ children }: SiteChromeProps) {
    const pathname = usePathname();
    const showCta = shouldShowCta(pathname);
    const hideChrome = shouldHideChrome(pathname);

    return (
        <DevBannerProvider>
            <MobileMenuProvider>
                <div className="min-h-screen bg-white">
                    <DevBanner />
                    {!hideChrome && <Navigation />}
                    {!hideChrome && <MobileMenu />}
                    {children}
                    {!hideChrome && <Footer showCta={showCta} />}
                </div>
            </MobileMenuProvider>
        </DevBannerProvider>
    );
}
