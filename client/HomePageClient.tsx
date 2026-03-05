"use client";

import { useQuery } from "@tanstack/react-query";
import GetInspired from "@/components/landing/GetInspired";
import HeroSection from "@/components/landing/HeroSection";
import IlpSection from "@/components/landing/IlpSection";
import ThingsToDo from "@/components/landing/ThingsToDo";
import WhyDroppa from "@/components/landing/WhyDropa";
import { useDevBanner } from "@/context/DevBannerContext";
import { tourService } from "@/services/tour.service";
import { homestayService } from "@/services/homestay.service";
import type { Tour as ApiTour } from "@/types/tour";
import type { Homestay as ApiHomestay } from "@/types/homestay";
import CarouselHomeComponent from "@/components/landing/CarouselHomeComponent";

// Map API Tour to component Tour format
const mapTourFromApi = (tour: ApiTour): any => {
    return {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        image: tour.imageUrls?.[0] || "",
        duration: `${tour.duration} Days`,
        features: tour.highlights || [],
        price: tour.finalPrice || 0,
        originalPrice: tour.basePrice || 0,
        discount: tour.discount ? `${tour.discount}% off` : "",
        description: tour.description,
        rating: tour.rating || 0,
        type: tour.type || "TOUR",
    };
};

// Map API Homestay to component Tour format
const mapHomestayFromApi = (homestay: ApiHomestay): any => {
    const facilityNames = homestay.facilities?.map((f) => f.facility?.name).filter(Boolean) || [];
    const tagLabels = homestay.tags?.map((t) => t.tag?.label).filter(Boolean) || [];
    const features = [...facilityNames, ...tagLabels].slice(0, 3);

    return {
        id: homestay.id,
        slug: homestay.slug,
        title: homestay.name,
        image: homestay.imageUrls?.[0] || "",
        features: features.length > 0 ? features : ["Accommodation", "Stay"],
        price: homestay.displayPrice || 0,
        originalPrice: 0,
        discount: "",
        description: homestay.description,
        rating: homestay.rating || 0,
        type: "HOMESTAY",
        bookingCriteria: homestay.bookingCriteria,
    };
};

export default function HomePageClient() {
    const { isVisible: bannerVisible, bannerHeight } = useDevBanner();
    const topMargin = bannerVisible ? bannerHeight + 100 : 64;

    // Fetch tours from API
    const { data: toursData, isLoading: toursLoading } = useQuery({
        queryKey: ["tours"],
        queryFn: async () => {
            const response = await tourService.getTours({ limit: 20 });
            return (response.data || []).map(mapTourFromApi);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Fetch homestays from API
    const { data: homestaysData, isLoading: homestaysLoading } = useQuery({
        queryKey: ["homestays"],
        queryFn: async () => {
            const response = await homestayService.getHomestays({ limit: 20 });
            return (response.data || []).map(mapHomestayFromApi);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const tours = toursData || [];
    const homestays = homestaysData || [];

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
                    <CarouselHomeComponent data={tours} title="Tours" type="TOUR" />
                    <CarouselHomeComponent data={homestays} title="Homestays" type="HOMESTAY" />
                    <WhyDroppa />
                    <ThingsToDo />
                    <GetInspired />
                </div>
            </main>
        </div>
    );
}
