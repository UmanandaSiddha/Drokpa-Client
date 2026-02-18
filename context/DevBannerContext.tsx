"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface DevBannerContextType {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
    bannerHeight: number;
}

const DevBannerContext = createContext<DevBannerContextType | undefined>(undefined);

export function DevBannerProvider({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState(true);
    const bannerHeight = 44; // Approximate height in pixels

    return (
        <DevBannerContext.Provider value={{ isVisible, setIsVisible, bannerHeight }}>
            {children}
        </DevBannerContext.Provider>
    );
}

export function useDevBanner() {
    const context = useContext(DevBannerContext);
    if (context === undefined) {
        throw new Error("useDevBanner must be used within a DevBannerProvider");
    }
    return context;
}
