"use client";

import GetInspired from "@/components/landing/GetInspired";
import HeroSection from "@/components/landing/HeroSection";
import IlpSection from "@/components/landing/IlpSection";
import ThingsToDo from "@/components/landing/ThingsToDo";
import TourHomeComponent from "@/components/landing/TourHomeComponent";
import WhyDroppa from "@/components/landing/WhyDropa";
import { useDevBanner } from "@/context/DevBannerContext";

interface HomePageClientProps {
    tours: any[];
    homestays: any[];
}

export default function HomePageClient({ tours, homestays }: HomePageClientProps) {
    const { isVisible: bannerVisible, bannerHeight } = useDevBanner();
    const topMargin = bannerVisible ? bannerHeight + 100 : 64; // Increased spacing for better visual adjustment

    return (
        <div
            className="min-h-screen bg-white"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
            <main className="relative min-h-screen bg-white">
                {/* Hero Section - Full Viewport Height */}
                <div
                    className="h-screen flex items-center"
                    style={{
                        height: bannerVisible ? `calc(100vh - ${bannerHeight}px)` : '100vh'
                    }}
                >
                    <div
                        className="w-full h-[90%] px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto"
                        style={{ marginTop: `${topMargin}px` }}
                    >
                        <HeroSection />
                    </div>
                </div>
                {/* ILP Section (Mobile/Tablet) */}
                <IlpSection />
                {/* Rest of the content */}
                <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto">
                    <TourHomeComponent tours={tours} title="Tours" type="TOUR" />
                    <TourHomeComponent tours={homestays} title="Homestays" type="HOMESTAY" />
                    <WhyDroppa />
                    <ThingsToDo />
                    <GetInspired />
                </div>
            </main>
        </div>
    );
}
