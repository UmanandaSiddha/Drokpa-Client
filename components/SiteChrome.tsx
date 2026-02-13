"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/landingpagecomponents/Navigation";
import MobileMenu from "@/components/MobileMenu";
import Footer from "@/components/landingpagecomponents/Footer";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

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

function shouldShowCta(pathname: string | null): boolean {
    if (!pathname) return false;
    if (showCtaRoutes.has(pathname)) return true;
    return pathname.startsWith("/articles/");
}

type SiteChromeProps = {
    children: ReactNode;
};

export default function SiteChrome({ children }: SiteChromeProps) {
    const pathname = usePathname();
    const showCta = shouldShowCta(pathname);

    return (
        <MobileMenuProvider>
            <div className="min-h-screen bg-white">
                <Navigation />
                <MobileMenu />
                {children}
                <Footer showCta={showCta} />
            </div>
        </MobileMenuProvider>
    );
}
