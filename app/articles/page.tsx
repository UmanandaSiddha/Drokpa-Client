"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { articles } from "@/data/articles";

export default function ArticlesPage() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const value = query.trim().toLowerCase();
        if (!value) return articles;
        return articles.filter(article => {
            return (
                article.title.toLowerCase().includes(value) ||
                article.description.toLowerCase().includes(value) ||
                article.tags.some(tag => tag.toLowerCase().includes(value)) ||
                article.location.toLowerCase().includes(value)
            );
        });
    }, [query]);

    return (
        <main className="min-h-screen bg-white">
            <section className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 bg-white">
                <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 bg-[#4F87C7] rounded-sm" />
                        <span
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                                fontSize: "clamp(16px, 4vw, 20px)",
                                color: "#353030",
                                letterSpacing: "-0.07em",
                            }}
                        >
                            FIELD NOTES.
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-start">
                        <div>
                            <h1
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(36px, 7vw, 72px)",
                                    color: "#353030",
                                    lineHeight: "clamp(40px, 7vw, 76px)",
                                    letterSpacing: "-0.06em",
                                }}
                            >
                                Stories shaped by wind, weather, and long roads.
                            </h1>
                            <p
                                className="mt-3 sm:mt-4 max-w-2xl"
                                style={{
                                    fontFamily: "var(--font-mona-sans)",
                                    fontWeight: 500,
                                    fontSize: "clamp(16px, 4vw, 20px)",
                                    color: "#686766",
                                    lineHeight: "clamp(20px, 5vw, 26px)",
                                }}
                            >
                                From high passes to quiet valleys, explore writing that captures the pace and poetry of Drokpa journeys.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E9E2D6] bg-gradient-to-br from-[#FDFBF6] via-[#F5F1E6] to-[#F2F7F5] p-5 sm:p-6 relative overflow-hidden">
                            <div className="absolute -top-12 -right-16 h-36 w-36 rounded-full bg-[#4F87C7]/20 blur-2xl" />
                            <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#FC611E]/20 blur-2xl" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(79,135,199,0.08),transparent_45%)]" />
                            <div className="relative">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                fontSize: "clamp(18px, 4vw, 26px)",
                                                color: "#353030",
                                                letterSpacing: "-0.05em",
                                            }}
                                        >
                                            Search the journal
                                        </p>
                                        <p
                                            className="mt-1 text-xs sm:text-sm text-[#7B7773]"
                                            style={{ fontFamily: "var(--font-mona-sans)" }}
                                        >
                                            {filtered.length} stories found
                                        </p>
                                    </div>
                                    <span
                                        className="rounded-full border border-[#E4E1D8] bg-white/70 px-3 py-1 text-xs text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        Updated weekly
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-transparent focus-within:ring-[#4F87C7]/30">
                                    <Search className="h-4 w-4 text-[#4F87C7]" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={event => setQuery(event.target.value)}
                                        placeholder="Search by title, place, or theme"
                                        className="w-full bg-transparent text-sm sm:text-base text-[#353030] placeholder:text-[#9A9A9A] focus:outline-none"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    />
                                    <button
                                        type="button"
                                        className="hidden sm:inline-flex items-center rounded-full bg-[#353030] px-4 py-2 text-xs text-white origin-right scale-110"
                                        onClick={() => setQuery(query.trim())}
                                    >
                                        Search
                                    </button>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {["Lakes", "Winter", "Valley", "Culture"].map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => setQuery(tag)}
                                            className="rounded-full border border-[#E4E1D8] bg-white/70 px-3 py-1 text-xs text-[#353030] hover:border-[#DDE7E0]"
                                            style={{ fontFamily: "var(--font-mona-sans)" }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                        {filtered.map(article => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.id}`}
                                className="group flex flex-col rounded-2xl bg-white border border-[#EFEAE0] hover:border-[#DDE7E0] shadow-sm hover:shadow-md transition"
                            >
                                <div className="relative overflow-hidden rounded-t-2xl">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                    />
                                </div>
                                <div className="p-5 sm:p-6 flex flex-col gap-3">
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#686766]">
                                        <span className="rounded-full bg-[#F5F1E6] px-3 py-1" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                            {article.location}
                                        </span>
                                        <span className="rounded-full bg-[#DDE7E0] px-3 py-1" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                            {article.readTime}
                                        </span>
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            fontSize: "clamp(20px, 4vw, 28px)",
                                            color: "#353030",
                                            letterSpacing: "-0.05em",
                                        }}
                                    >
                                        {article.title}
                                    </h3>
                                    <p
                                        className="text-sm sm:text-base text-[#686766]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        {article.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs text-[#353030]">
                                        {article.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-[#E4E1D8] px-3 py-1"
                                                style={{ fontFamily: "var(--font-mona-sans)" }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="mt-10 rounded-2xl border border-dashed border-[#E4E1D8] bg-[#FDFBF6] p-8 text-center">
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(20px, 4vw, 28px)",
                                    color: "#353030",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                No matches yet.
                            </p>
                            <p
                                className="mt-2 text-sm text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                Try a different keyword or clear the search.
                            </p>
                            <button
                                className="mt-4 inline-flex items-center rounded-full bg-[#353030] px-4 py-2 text-xs sm:text-sm text-white"
                                onClick={() => setQuery("")}
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
