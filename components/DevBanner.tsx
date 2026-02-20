"use client";

import { X } from "lucide-react";
import { useDevBanner } from "@/context/DevBannerContext";

export default function DevBanner() {
    const { isVisible, setIsVisible } = useDevBanner();

    if (!isVisible) return null;

    return (
        <div
            className="fixed top-0 left-0 w-full z-[60] bg-[#1EAE6D] py-2.5 px-4 shadow-md"
            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
        >
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                    <p
                        className="text-[#323232] text-xs sm:text-sm md:text-base font-normal"
                        style={{
                            fontFamily: "var(--font-subjectivity), sans-serif",
                            fontWeight: 500
                        }}
                    >
                        We're getting ready for you! Launching February 25, 2026
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 text-[#323232] hover:bg-white/20 rounded-full p-1 transition-colors"
                    aria-label="Close banner"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    );
}
