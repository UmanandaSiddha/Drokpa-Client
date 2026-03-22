"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Star, Waves, Building2, Compass, ArrowUpRight } from "lucide-react";
import { homestayService } from "@/services/homestay.service";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useDebounce } from "@/hooks/useDebounce";
import { buildQueryString, parsePositivePageParam, parseStringParam } from "@/lib/urlQuery";

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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const PAGE_SIZE = 12;
    const [query, setQuery] = useState(() => parseStringParam(searchParams.get("q"), ""));
    const [homestays, setHomestays] = useState<MappedHomestay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(() => parsePositivePageParam(searchParams.get("page")));
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const debouncedQuery = useDebounce(query, 400);

    // Keep local state in sync when user navigates with back/forward buttons.
    useEffect(() => {
        const nextQuery = parseStringParam(searchParams.get("q"), "");
        const nextPage = parsePositivePageParam(searchParams.get("page"));

        setQuery(prev => (prev === nextQuery ? prev : nextQuery));
        setPage(prev => (prev === nextPage ? prev : nextPage));
    }, [searchParams]);

    // Reflect current search/page in the URL without scrolling the page.
    useEffect(() => {
        const normalizedQuery = query.trim();
        const nextQueryString = buildQueryString(searchParams, {
            q: normalizedQuery || null,
            page: page > 1 ? page : null,
        });
        const currentQueryString = searchParams.toString();
        if (nextQueryString === currentQueryString) return;

        router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, { scroll: false });
    }, [query, page, pathname, router, searchParams]);

    useEffect(() => {
        let isCancelled = false;

        const fetchHomestays = async () => {
            try {
                setIsLoading(true);
                const response = await homestayService.getHomestays({
                    page,
                    limit: PAGE_SIZE,
                    keyword: debouncedQuery.trim() || undefined,
                });
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

                if (isCancelled) return;

                setHomestays(mapped);
                setTotal(response.meta?.total || 0);
                setTotalPages(response.meta?.totalPages || 1);
            } catch (error) {
                if (isCancelled) return;
                console.error("Failed to fetch homestays:", error);
                setHomestays([]);
                setTotal(0);
                setTotalPages(1);
            } finally {
                if (isCancelled) return;
                setIsLoading(false);
            }
        };

        fetchHomestays();

        return () => {
            isCancelled = true;
        };
    }, [page, debouncedQuery]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const visiblePages = useMemo(() => {
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const half = Math.floor(maxVisible / 2);
        let start = Math.max(1, page - half);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [page, totalPages]);

    const totalLocations = useMemo(() => new Set(homestays.map(h => h.location)).size, [homestays]);
    const averageRating = useMemo(() => {
        if (homestays.length === 0) return "0.0";
        return (homestays.reduce((sum, h) => sum + h.rating, 0) / homestays.length).toFixed(1);
    }, [homestays]);
    const isSearching = debouncedQuery.trim().length > 0;
    const visibleStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const visibleEnd = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-14 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 right-0 w-96 h-96 bg-linear-to-bl from-[#005246]/8 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-linear-to-tl from-[#F2F7F5]/40 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
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

                            <h1
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(34px, 8vw, 72px)",
                                    color: "#353030",
                                    lineHeight: "clamp(38px, 8.5vw, 80px)",
                                    letterSpacing: "-0.07em",
                                }}
                            >
                                Live with <span className="text-[#005246]">local hearts</span>
                            </h1>

                            <p
                                className="mt-4 sm:mt-6 max-w-2xl"
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

                        <div className="grid grid-cols-2 gap-4 sm:gap-5">
                            <div className="rounded-3xl bg-linear-to-br from-[#005246]/8 to-transparent border border-[#005246]/20 p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Total Stays
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(28px, 5vw, 48px)",
                                        color: "#005246",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {isLoading ? "—" : total}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-linear-to-br from-[#F5F1E6] to-transparent border border-[#E5D8BF] p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Avg Rating
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(28px, 5vw, 48px)",
                                        color: "#8A5A3C",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {isLoading ? "—" : averageRating}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-linear-to-br from-[#005246]/8 to-transparent border border-[#005246]/20 p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Locations This Page
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(28px, 5vw, 48px)",
                                        color: "#005246",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {isLoading ? "—" : totalLocations}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-linear-to-br from-[#F5F1E6] to-transparent border border-[#E5D8BF] p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Showing Now
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(28px, 5vw, 48px)",
                                        color: "#8A5A3C",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {isLoading ? "—" : homestays.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar - Below Hero */}
                    <div className="mt-8 sm:mt-10 md:mt-12 max-w-2xl">
                        <div className="rounded-3xl border border-[#DDE7E0] bg-white/95 p-2 shadow-[0_18px_45px_-30px_rgba(0,82,70,0.45)] backdrop-blur-sm">
                            <div className="flex gap-2 items-center">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#005246]" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={event => {
                                            setQuery(event.target.value);
                                            setPage(1);
                                        }}
                                        placeholder="Search properties or locations"
                                        className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-2xl text-base text-[#353030] placeholder:text-[#9A9A9A] focus:outline-none focus:bg-white"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        setPage(1);
                                    }}
                                    className={`hidden sm:block px-5 py-3.5 rounded-2xl bg-[#005246] text-white font-semibold hover:bg-[#004236] transition ${query ? "" : "opacity-50 cursor-not-allowed"}`}
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                    disabled={!query}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Listings Section */}
            <section className="pt-2 sm:pt-4 md:pt-6 pb-12 sm:pb-16 md:pb-20">
                <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <LoadingComponent message="Discovering homestays..." size="large" />
                        </div>
                    ) : total > 0 ? (
                        <>
                            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
                                        {total} {total === 1 ? "Stay" : "Stays"} Found
                                    </p>
                                    <p
                                        className="mt-1 text-sm text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        Showing {visibleStart}-{visibleEnd} of {total}
                                    </p>
                                    {isSearching && (
                                        <p className="mt-2 text-xs text-[#005246]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                            Showing results for: "{debouncedQuery.trim()}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                                {homestays.map((homestay) => (
                                    <Link
                                        key={homestay.id}
                                        href={`/homestays/${homestay.slug}`}
                                        className="group flex flex-col h-full rounded-[28px] overflow-hidden border border-[#E9E4DA] bg-linear-to-b from-white to-[#FCFBF8] hover:border-[#005246]/25 hover:shadow-[0_26px_60px_-34px_rgba(0,82,70,0.35)] hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* Image Container */}
                                        <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-gray-100">
                                            <Image
                                                src={homestay.image}
                                                alt={homestay.name}
                                                fill
                                                className="object-cover group-hover:scale-[1.08] transition-transform duration-500"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent" />

                                            <div className="absolute top-4 left-4 max-w-[72%] rounded-full bg-black/45 text-white px-3 py-1.5 backdrop-blur-sm">
                                                <p className="text-xs truncate" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                    {homestay.location}
                                                </p>
                                            </div>

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

                                            <div className="absolute left-4 bottom-4 rounded-full bg-white/95 px-3.5 py-2 shadow-md">
                                                <p className="text-sm font-semibold text-[#005246]" style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}>
                                                    From ₹{homestay.price.toLocaleString()}
                                                </p>
                                                <p className="text-[11px] text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                    per night
                                                </p>
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
                                                <div className="flex items-center gap-1.5 text-[#686766]">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                    <p className="text-xs" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                        {homestay.rating.toFixed(1)} • {homestay.reviews} reviews
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#005246]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                    Explore stay
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                                    <p className="text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                        Page {page} of {totalPages}
                                    </p>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                            disabled={page === 1}
                                            className="px-3.5 py-2 rounded-xl border border-[#DDE7E0] text-sm text-[#353030] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#005246]/40"
                                            style={{ fontFamily: "var(--font-mona-sans)" }}
                                        >
                                            Previous
                                        </button>

                                        {visiblePages.map((pageNumber) => (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setPage(pageNumber)}
                                                className={`min-w-9 px-3 py-2 rounded-xl text-sm border transition ${pageNumber === page
                                                    ? "border-[#005246] bg-[#005246] text-white"
                                                    : "border-[#DDE7E0] text-[#353030] hover:border-[#005246]/40"
                                                    }`}
                                                style={{ fontFamily: "var(--font-mona-sans)" }}
                                            >
                                                {pageNumber}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={page === totalPages}
                                            className="px-3.5 py-2 rounded-xl border border-[#DDE7E0] text-sm text-[#353030] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#005246]/40"
                                            style={{ fontFamily: "var(--font-mona-sans)" }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
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
                                onClick={() => {
                                    setQuery("");
                                    setPage(1);
                                }}
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
