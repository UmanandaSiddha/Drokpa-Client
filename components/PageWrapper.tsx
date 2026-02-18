"use client";

import { useDevBanner } from "@/context/DevBannerContext";
import { ReactNode } from "react";

interface PageWrapperProps {
    children: ReactNode;
    className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
    const { isVisible: bannerVisible, bannerHeight } = useDevBanner();
    const topPadding = bannerVisible ? bannerHeight + 64 : 64; // 64px is pt-16

    return (
        <main 
            className={`relative min-h-screen bg-white ${className}`}
            style={{ paddingTop: `${topPadding}px` }}
        >
            {children}
        </main>
    );
}
