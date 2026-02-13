"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { articles } from "@/data/articles";

export default function ArticlePage() {
    const params = useParams();
    const articleId = typeof params?.id === "string" ? params.id : undefined;

    if (!articleId || !Array.isArray(articles)) {
        notFound();
    }

    const article = articles.find(item => item.id === articleId);

    if (!article) {
        notFound();
    }

    const related = articles.filter(item => item.id !== article.id).slice(0, 3);

    return (
        <main className="min-h-screen bg-white">
            <section className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 bg-white">
                <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    <Link
                        href="/articles"
                        className="inline-flex items-center text-xs sm:text-sm text-[#686766] hover:text-[#353030]"
                        style={{ fontFamily: "var(--font-mona-sans)" }}
                    >
                        Back to Articles
                    </Link>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F1E6] px-3 py-1 text-xs text-[#686766]">
                                <span className="h-2 w-2 rounded-full bg-[#4F87C7]" />
                                <span style={{ fontFamily: "var(--font-mona-sans)" }}>{article.location}</span>
                                <span className="h-1 w-1 rounded-full bg-[#C7C2B6]" />
                                <span style={{ fontFamily: "var(--font-mona-sans)" }}>{article.readTime}</span>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#686766]">
                                <span className="rounded-full bg-[#F5F1E6] px-3 py-1" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                    {article.location}
                                </span>
                                <span className="rounded-full bg-[#DDE7E0] px-3 py-1" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                    {article.readTime}
                                </span>
                            </div>

                            <h1
                                className="mt-4"
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(34px, 7vw, 66px)",
                                    color: "#353030",
                                    lineHeight: "clamp(38px, 7vw, 72px)",
                                    letterSpacing: "-0.06em",
                                }}
                            >
                                {article.title}
                            </h1>

                            <p
                                className="mt-4 text-base sm:text-lg text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                {article.description}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-[#E4E1D8] bg-white px-3 py-1 text-xs text-[#353030]"
                                        style={{ fontFamily: "var(--font-mona-sans)" }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(29,25,19,0.12)]">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="h-90 sm:h-105 md:h-130 w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0" />
                            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#FC611E]/20 blur-2xl" />
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.7fr_0.3fr] gap-8">
                        <div className="space-y-6">
                            {article.content.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-base sm:text-lg text-[#353030] leading-relaxed"
                                    style={{ fontFamily: "var(--font-mona-sans)" }}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <aside className="rounded-2xl border border-[#E9E2D6] bg-[#F5F1E6] p-5 sm:p-6 h-fit">
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(18px, 4vw, 24px)",
                                    color: "#353030",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                Quick guide
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                <li>Ideal for: slow mornings, soft light, layered landscapes.</li>
                                <li>Best season: October to March for clear skies.</li>
                                <li>Pair with: a short homestay and a day hike.</li>
                            </ul>
                        </aside>
                    </div>

                    {related.length > 0 && (
                        <div className="mt-10">
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(20px, 4vw, 28px)",
                                    color: "#353030",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                More stories to explore
                            </p>
                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                                {related.map(item => (
                                    <Link
                                        key={item.id}
                                        href={`/articles/${item.id}`}
                                        className="group rounded-2xl border border-[#EFEAE0] bg-white p-4 hover:shadow-md transition"
                                    >
                                        <div className="relative overflow-hidden rounded-xl">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                            />
                                        </div>
                                        <p
                                            className="mt-3 text-sm text-[#686766]"
                                            style={{ fontFamily: "var(--font-mona-sans)" }}
                                        >
                                            {item.location}
                                        </p>
                                        <h3
                                            className="mt-2"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                fontSize: "clamp(18px, 4vw, 24px)",
                                                color: "#353030",
                                                letterSpacing: "-0.05em",
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
