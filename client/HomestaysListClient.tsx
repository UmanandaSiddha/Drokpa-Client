"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { Search, MapPin, Star, Waves } from "lucide-react";
import { homestayService } from "@/services/homestay.service";
import { LoadingComponent } from "@/components/LoadingComponent";

interface MappedHomestay {
    id: string;
    slug: string;
    name: string;
    image: string;
    location: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
}

export default function HomestaysListClient() {
    const [query, setQuery] = useState("");
    const [homestays, setHomestays] = useState<MappedHomestay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomestays = async () => {
            try {
                setIsLoading(true);
                const response = await homestayService.getHomestays({ limit: 100 });
                const mapped = (response.data || []).map((h: any) => ({
                    id: h.id,
                    slug: h.slug,
                    name: h.name,
                    image: h.imageUrls?.[0] || "",
                    location: [h.address?.city, h.address?.state].filter(Boolean).join(", ") || "Arunachal Pradesh",
                    description: h.description,
                    rating: h.rating || 4.5,
                    reviews: h.totalReviews || 0,
                    price: h.displayPrice || 2000,
                }));
                setHomestays(mapped);
            } catch (error) {
                console.error("Failed to fetch homestays:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomestays();
    }, []);

    const filtered = useMemo(() => {
        const value = query.trim().toLowerCase();
        if (!value) return homestays;
        return homestays.filter(homestay => {
            return (
                homestay.name.toLowerCase().includes(value) ||
                homestay.description.toLowerCase().includes(value) ||
                homestay.location.toLowerCase().includes(value)
            );
        });
    }, [query, homestays]);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 right-0 w-96 h-96 bg-gradient-to-bl from-[#005246]/8 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tl from-[#F2F7F5]/40 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    <div className="max-w-4xl">
                        {/* Tagline */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-8 bg-[#005246] rounded-sm" />
                            <span
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    color: "#005246",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.15em",
                                }}
                            >
                                Authentic Experiences
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                                fontSize: "clamp(44px, 9vw, 96px)",
                                color: "#353030",
                                lineHeight: "clamp(48px, 10vw, 104px)",
                                letterSpacing: "-0.07em",
                            }}
                        >
                            Live with <span className="text-[#005246]">local hearts</span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="mt-6 sm:mt-8 max-w-2xl"
                            style={{
                                fontFamily: "var(--font-mona-sans)",
                                fontWeight: 400,
                                fontSize: "clamp(16px, 3.5vw, 20px)",
                                color: "#686766",
                                lineHeight: "clamp(24px, 5vw, 32px)",
                            }}
                        >
                            Immerse yourself in the warmth of Arunachal Pradesh's communities. Each homestay offers authentic connections, traditional meals, and memories that last a lifetime.
                        </p>
                    </div>

                    {/* Search Bar - Below Hero */}
                    <div className="mt-10 sm:mt-14 md:mt-16 max-w-2xl">
                        <div className="flex gap-2 items-center">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#005246]" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={event => setQuery(event.target.value)}
                                    placeholder="Search properties or locations"
                                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-[#DDE7E0] text-base text-[#353030] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#005246]/20 focus:border-[#005246] transition"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                />
                            </div>
                            <button
                                onClick={() => setQuery("")}
                                className={`hidden sm:block px-6 py-4 rounded-2xl bg-[#005246] text-white font-semibold hover:bg-[#004236] transition ${query ? "" : "opacity-50 cursor-not-allowed"}`}
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                                disabled={!query}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {!isLoading && homestays.length > 0 && (
                <section className="py-12 sm:py-16 border-b border-[#EFEAE0]">
                    <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            <div className="text-center p-4 sm:p-6">
                                <p
                                    className="text-sm sm:text-base text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Properties
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(32px, 6vw, 56px)",
                                        color: "#005246",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {homestays.length}
                                </p>
                            </div>
                            <div className="text-center p-4 sm:p-6 border-l border-r border-[#EFEAE0]">
                                <p
                                    className="text-sm sm:text-base text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Locations
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(32px, 6vw, 56px)",
                                        color: "#005246",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {new Set(homestays.map(h => h.location)).size}
                                </p>
                            </div>
                            <div className="text-center p-4 sm:p-6">
                                <p
                                    className="text-sm sm:text-base text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Avg Rating
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(32px, 6vw, 56px)",
                                        color: "#005246",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {(homestays.reduce((sum, h) => sum + h.rating, 0) / homestays.length).toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Listings Section */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <LoadingComponent message="Discovering homestays..." size="large" />
                        </div>
                    ) : filtered.length > 0 ? (
                        <>
                            <div className="mb-10 flex items-center justify-between">
                                <div>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            fontSize: "clamp(20px, 4vw, 28px)",
                                            color: "#353030",
                                            letterSpacing: "-0.04em",
                                        }}
                                    >
                                        {filtered.length} {filtered.length === 1 ? "Stay" : "Stays"} Found
                                    </p>
                                    <p
                                        className="mt-1 text-sm text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        Hand-picked homestays waiting for you
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                                {filtered.map((homestay, idx) => (
                                    <Link
                                        key={homestay.id}
                                        href={`/homestays/${homestay.slug}`}
                                        className="group flex flex-col h-full rounded-3xl overflow-hidden border border-[#EFEAE0] bg-white hover:border-[#005246]/20 hover:shadow-[0_24px_60px_-35px_rgba(0,82,70,0.25)] transition-all duration-300"
                                    >
                                        {/* Image Container */}
                                        <div className="relative w-full h-72 overflow-hidden bg-gray-100">
                                            <Image
                                                src={homestay.image}
                                                alt={homestay.name}
                                                fill
                                                className="object-cover group-hover:scale-[1.08] transition-transform duration-500"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                                            {/* Rating Badge */}
                                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur px-3.5 py-2 rounded-full shadow-lg">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                <span
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 700,
                                                        fontSize: "14px",
                                                        color: "#353030",
                                                    }}
                                                >
                                                    {homestay.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1 p-6 gap-4">
                                            {/* Location */}
                                            <div className="flex items-center gap-2 text-sm text-[#686766]">
                                                <MapPin className="w-4 h-4 shrink-0 text-[#005246]" />
                                                <span style={{ fontFamily: "var(--font-mona-sans)" }} className="truncate">
                                                    {homestay.location}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3
                                                className="line-clamp-2"
                                                style={{
                                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                                    fontWeight: 700,
                                                    fontSize: "clamp(18px, 4vw, 22px)",
                                                    color: "#353030",
                                                    letterSpacing: "-0.04em",
                                                }}
                                            >
                                                {homestay.name}
                                            </h3>

                                            {/* Description */}
                                            <p
                                                className="text-sm text-[#686766] line-clamp-2 flex-1"
                                                style={{ fontFamily: "var(--font-mona-sans)" }}
                                            >
                                                {homestay.description}
                                            </p>

                                            {/* Footer */}
                                            <div className="pt-4 border-t border-[#EFEAE0] flex items-center justify-between gap-3">
                                                <div>
                                                    <p
                                                        style={{
                                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                                            fontWeight: 700,
                                                            fontSize: "18px",
                                                            color: "#005246",
                                                            letterSpacing: "-0.02em",
                                                        }}
                                                    >
                                                        ₹{homestay.price.toLocaleString()}
                                                    </p>
                                                    <p
                                                        className="text-xs text-[#686766]"
                                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                                    >
                                                        per night
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p
                                                        className="text-xs font-medium text-[#005246]"
                                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                                    >
                                                        {homestay.reviews}
                                                    </p>
                                                    <p
                                                        className="text-xs text-[#686766]"
                                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                                    >
                                                        reviews
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#F5F1E6] flex items-center justify-center mx-auto mb-4">
                                <Waves className="w-8 h-8 text-[#005246]" />
                            </div>
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(22px, 5vw, 32px)",
                                    color: "#353030",
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                No homestays found.
                            </p>
                            <p
                                className="mt-2 text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                Try adjusting your search or browse all properties
                            </p>
                            <button
                                className="mt-6 px-6 py-3 rounded-full bg-[#005246] text-white hover:bg-[#004236] transition font-medium"
                                onClick={() => setQuery("")}
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                View All Properties
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
