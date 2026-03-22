"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Star, Calendar, Mountain } from "lucide-react";
import { tourService } from "@/services/tour.service";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useDebounce } from "@/hooks/useDebounce";
import { TourType } from "@/types/tour";
import { buildQueryString, parseEnumParam, parsePositivePageParam, parseStringParam } from "@/lib/urlQuery";

type TourFilter = "ALL" | TourType;
const TOUR_FILTER_VALUES = ["ALL", TourType.TREK, TourType.TOUR] as const;

interface MappedTour {
    id: string;
    slug: string;
    title: string;
    image: string;
    location: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
    duration: string;
    type: TourType;
}

interface ToursListClientProps {
    forcedType?: TourType;
}

export default function ToursListClient({ forcedType }: ToursListClientProps = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const PAGE_SIZE = 12;
    const [query, setQuery] = useState(() => parseStringParam(searchParams.get("q"), ""));
    const [typeFilter, setTypeFilter] = useState<TourFilter>(() => {
        if (forcedType) return forcedType;
        return parseEnumParam(searchParams.get("type"), TOUR_FILTER_VALUES, "ALL");
    });
    const [tours, setTours] = useState<MappedTour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(() => parsePositivePageParam(searchParams.get("page")));
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const debouncedQuery = useDebounce(query, 400);
    const effectiveTypeFilter: TourFilter = forcedType ?? typeFilter;
    const canChangeType = !forcedType;

    useEffect(() => {
        const nextQuery = parseStringParam(searchParams.get("q"), "");
        const nextType = forcedType
            ? forcedType
            : parseEnumParam(searchParams.get("type"), TOUR_FILTER_VALUES, "ALL");
        const nextPage = parsePositivePageParam(searchParams.get("page"));

        setQuery(prev => (prev === nextQuery ? prev : nextQuery));
        setTypeFilter(prev => (prev === nextType ? prev : nextType));
        setPage(prev => (prev === nextPage ? prev : nextPage));
    }, [forcedType, searchParams]);

    useEffect(() => {
        const normalizedQuery = query.trim();
        const nextQueryString = buildQueryString(searchParams, {
            q: normalizedQuery || undefined,
            type: !forcedType && effectiveTypeFilter !== "ALL" ? effectiveTypeFilter : undefined,
            page: page > 1 ? String(page) : undefined,
        });
        const currentQueryString = searchParams.toString();
        if (nextQueryString === currentQueryString) return;

        router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, { scroll: false });
    }, [query, effectiveTypeFilter, forcedType, page, pathname, router, searchParams]);

    useEffect(() => {
        let isCancelled = false;

        const fetchTours = async () => {
            try {
                setIsLoading(true);
                const response = await tourService.getTours({
                    page,
                    limit: PAGE_SIZE,
                    keyword: debouncedQuery.trim() || undefined,
                    type: effectiveTypeFilter === "ALL" ? undefined : effectiveTypeFilter,
                });
                const mapped = (response.data || []).map((t: any) => {
                    const days = parseInt(String(t.duration ?? "0"), 10) || 0;
                    const nights = Math.max(0, days - 1);
                    const durationLabel = days > 1 ? `${days} Days - ${nights} Nights` : `${days} Day`;

                    return {
                        id: t.id,
                        slug: t.slug,
                        title: t.title,
                        image: t.imageUrls?.[0] || "",
                        location: [t.address?.city, t.address?.state].filter(Boolean).join(", ") || "Arunachal Pradesh",
                        description: t.description,
                        rating: t.rating || 4.5,
                        reviews: t.totalReviews || 0,
                        price: Number(t.finalPrice ?? t.displayPrice ?? t.basePrice ?? 5000),
                        duration: durationLabel,
                        type: t.type === TourType.TREK ? TourType.TREK : TourType.TOUR,
                    };
                });

                if (isCancelled) return;

                setTours(mapped);
                setTotal(response.meta?.total || 0);
                setTotalPages(response.meta?.totalPages || 1);
            } catch (error) {
                if (isCancelled) return;
                console.error("Failed to fetch tours:", error);
                setTours([]);
                setTotal(0);
                setTotalPages(1);
            } finally {
                if (isCancelled) return;
                setIsLoading(false);
            }
        };

        fetchTours();

        return () => {
            isCancelled = true;
        };
    }, [page, debouncedQuery, effectiveTypeFilter]);

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

    const averageRating = useMemo(() => {
        if (tours.length === 0) return "0.0";
        return (tours.reduce((sum, tour) => sum + tour.rating, 0) / tours.length).toFixed(1);
    }, [tours]);

    const treksOnPage = useMemo(() => tours.filter(tour => tour.type === TourType.TREK).length, [tours]);
    const toursOnPage = useMemo(() => tours.filter(tour => tour.type === TourType.TOUR).length, [tours]);
    const isSearching = debouncedQuery.trim().length > 0;
    const visibleStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const visibleEnd = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section with Split Layout */}
            <section className="relative pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FC611E]/12 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 -left-40 w-80 h-80 bg-[#005246]/8 rounded-full blur-3xl" />
                </div>

                <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                        {/* Left side - Content */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Mountain className="w-5 h-5 text-[#FC611E]" />
                                <span
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(12px, 2.5vw, 14px)",
                                        color: "#FC611E",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.15em",
                                    }}
                                >
                                    Treks & Tours
                                </span>
                            </div>

                            <h1
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(42px, 8vw, 88px)",
                                    color: "#353030",
                                    lineHeight: "clamp(46px, 9vw, 96px)",
                                    letterSpacing: "-0.07em",
                                }}
                            >
                                Elevate your adventure
                            </h1>

                            <p
                                className="mt-6 sm:mt-8 max-w-xl"
                                style={{
                                    fontFamily: "var(--font-mona-sans)",
                                    fontWeight: 400,
                                    fontSize: "clamp(16px, 3.5vw, 20px)",
                                    color: "#686766",
                                    lineHeight: "clamp(24px, 5vw, 32px)",
                                }}
                            >
                                From misty mountain peaks to verdant valleys, explore curated expeditions led by local experts who know every trail intimately.
                            </p>
                        </div>

                        {/* Right side - Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-5">
                            <div className="rounded-3xl bg-linear-to-br from-[#FC611E]/8 to-transparent border border-[#FC611E]/20 p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Adventures Found
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(28px, 5vw, 48px)",
                                        color: "#FC611E",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {isLoading ? "—" : total}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-linear-to-br from-[#005246]/8 to-transparent border border-[#005246]/20 p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Avg Rating This Page
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
                                    {isLoading ? "—" : averageRating}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-linear-to-br from-[#FC611E]/8 to-transparent border border-[#FC611E]/20 p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Treks On Page
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(28px, 5vw, 48px)",
                                        color: "#FC611E",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    {isLoading ? "—" : treksOnPage}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-linear-to-br from-[#005246]/8 to-transparent border border-[#005246]/20 p-5 sm:p-6">
                                <p
                                    className="text-xs sm:text-sm text-[#686766] mb-2"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Tours On Page
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
                                    {isLoading ? "—" : toursOnPage}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="py-8 sm:py-12 border-b border-[#EFEAE0]">
                <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FC611E]" />
                            <input
                                type="text"
                                value={query}
                                onChange={event => {
                                    setQuery(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by title or location..."
                                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white rounded-2xl border border-[#DDE7E0] text-base text-[#353030] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#FC611E]/20 focus:border-[#FC611E] transition"
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            />
                        </div>

                        {/* Type Filters */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span
                                className="text-sm text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                            >
                                Filter by type:
                            </span>
                            {canChangeType ? (
                                TOUR_FILTER_VALUES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setTypeFilter(type);
                                            setPage(1);
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${effectiveTypeFilter === type
                                            ? type === TourType.TREK
                                                ? "bg-[#FC611E] text-white"
                                                : type === TourType.TOUR
                                                    ? "bg-[#005246] text-white"
                                                    : "bg-[#353030] text-white"
                                            : "bg-[#F5F1E6] text-[#353030] hover:bg-[#E9E2D6]"
                                            }`}
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        {type === "ALL" ? "All Experiences" : type}
                                    </button>
                                ))
                            ) : (
                                <span
                                    className="px-4 py-2 rounded-full text-sm font-medium bg-[#EAF4F1] text-[#005246]"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    {forcedType === TourType.TREK ? "Treks Only" : "Tours Only"}
                                </span>
                            )}
                            {(isSearching || (canChangeType && effectiveTypeFilter !== "ALL")) && (
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        if (canChangeType) {
                                            setTypeFilter("ALL");
                                        }
                                        setPage(1);
                                    }}
                                    className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-[#DDE7E0] text-[#353030] hover:border-[#FC611E]/40"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                        {!canChangeType && (
                            <p className="text-xs text-[#005246]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                Showing {forcedType === TourType.TREK ? "Treks only" : "Tours only"}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Listings Section */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <LoadingComponent message="Mapping adventures..." size="large" />
                        </div>
                    ) : total > 0 ? (
                        <>
                            <div className="mb-10">
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(20px, 4vw, 28px)",
                                        color: "#353030",
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    {total} {total === 1 ? "Experience" : "Experiences"}
                                </p>
                                <p className="mt-1 text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                    Showing {visibleStart}-{visibleEnd} of {total}
                                </p>
                                {isSearching && (
                                    <p className="mt-2 text-xs text-[#FC611E]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                        Showing results for: "{debouncedQuery.trim()}"
                                    </p>
                                )}
                                {effectiveTypeFilter !== "ALL" && (
                                    <p className="mt-1 text-xs text-[#005246]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                        Filtered by type: {effectiveTypeFilter}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                                {tours.map(tour => {
                                    const isTrek = tour.type === TourType.TREK;
                                    const accentColor = isTrek ? "#FC611E" : "#005246";

                                    return (
                                        <Link
                                            key={tour.id}
                                            href={
                                                isTrek
                                                    ? `/treks/${tour.slug}`
                                                    : `/tours/${tour.slug}`
                                            }
                                            className="group flex flex-col h-full rounded-3xl overflow-hidden border border-[#EFEAE0] bg-white hover:border-[opacity]/20"
                                            style={{
                                                "--hover-color": accentColor,
                                            } as any}
                                        >
                                            {/* Image with Type Badge */}
                                            <div className="relative w-full h-72 overflow-hidden bg-gray-100">
                                                <Image
                                                    src={tour.image}
                                                    alt={tour.title}
                                                    fill
                                                    className="object-cover group-hover:scale-[1.08] transition-transform duration-500"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

                                                {/* Type Badge */}
                                                <div
                                                    className="absolute top-0 right-0 px-4 py-3 rounded-bl-2xl text-xs font-bold text-white"
                                                    style={{
                                                        backgroundColor: accentColor,
                                                        fontFamily: "var(--font-mona-sans)",
                                                        letterSpacing: "0.08em",
                                                    }}
                                                >
                                                    {isTrek ? "TREK" : "TOUR"}
                                                </div>

                                                {/* Rating Badge */}
                                                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur px-3.5 py-2 rounded-full">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span
                                                        style={{
                                                            fontFamily: "var(--font-mona-sans)",
                                                            fontWeight: 700,
                                                            fontSize: "14px",
                                                            color: "#353030",
                                                        }}
                                                    >
                                                        {tour.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col flex-1 p-6 gap-4">
                                                {/* Location & Duration */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-[#686766]">
                                                        <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                                                        <span style={{ fontFamily: "var(--font-mona-sans)" }} className="truncate">
                                                            {tour.location}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-[#686766]">
                                                        <Calendar className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                                                        <span style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                            {tour.duration}
                                                        </span>
                                                    </div>
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
                                                    {tour.title}
                                                </h3>

                                                {/* Description */}
                                                <p
                                                    className="text-sm text-[#686766] line-clamp-2 flex-1"
                                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                                >
                                                    {tour.description}
                                                </p>

                                                {/* Footer */}
                                                <div className="pt-4 border-t border-[#EFEAE0] flex items-center justify-between gap-3">
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                                fontWeight: 700,
                                                                fontSize: "18px",
                                                                color: accentColor,
                                                                letterSpacing: "-0.02em",
                                                            }}
                                                        >
                                                            ₹{tour.price.toLocaleString()}
                                                        </p>
                                                        <p
                                                            className="text-xs text-[#686766]"
                                                            style={{ fontFamily: "var(--font-mona-sans)" }}
                                                        >
                                                            per person
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p
                                                            className="text-xs font-medium"
                                                            style={{ color: accentColor, fontFamily: "var(--font-mona-sans)" }}
                                                        >
                                                            {tour.reviews}
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
                                    );
                                })}
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
                                            className="px-3.5 py-2 rounded-xl border border-[#DDE7E0] text-sm text-[#353030] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#FC611E]/40"
                                            style={{ fontFamily: "var(--font-mona-sans)" }}
                                        >
                                            Previous
                                        </button>

                                        {visiblePages.map(pageNumber => (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setPage(pageNumber)}
                                                className={`min-w-9 px-3 py-2 rounded-xl text-sm border transition ${pageNumber === page
                                                    ? "border-[#FC611E] bg-[#FC611E] text-white"
                                                    : "border-[#DDE7E0] text-[#353030] hover:border-[#FC611E]/40"
                                                    }`}
                                                style={{ fontFamily: "var(--font-mona-sans)" }}
                                            >
                                                {pageNumber}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={page === totalPages}
                                            className="px-3.5 py-2 rounded-xl border border-[#DDE7E0] text-sm text-[#353030] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#FC611E]/40"
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
                                <Mountain className="w-8 h-8 text-[#FC611E]" />
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
                                No adventures found.
                            </p>
                            <p
                                className="mt-2 text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                Try adjusting your search or filters
                            </p>
                            <button
                                className="mt-6 px-6 py-3 rounded-full bg-[#FC611E] text-white hover:bg-[#E55100] transition font-medium"
                                onClick={() => {
                                    setQuery("");
                                    if (canChangeType) {
                                        setTypeFilter("ALL");
                                    }
                                    setPage(1);
                                }}
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                Explore All Experiences
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
