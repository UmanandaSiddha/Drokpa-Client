import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found | Drokpa",
    description: "The page you're looking for doesn't exist. Let's get you back on track.",
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <main className="pt-24 pb-16">
                {/* Decorative blobs */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
                    <div className="w-full max-w-2xl">
                        {/* 404 Number */}
                        <div className="text-center mb-8 md:mb-12">
                            <h1
                                className="text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none mb-4"
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    color: "#27261C",
                                    letterSpacing: "-0.06em",
                                    textShadow: "0 10px 30px rgba(252, 97, 30, 0.1)",
                                }}
                            >
                                404
                            </h1>

                            {/* Yellow accent line */}
                            <div className="h-1 w-20 bg-[#FC611E] mx-auto mb-6 rounded-full" />
                        </div>

                        {/* Headings */}
                        <div className="text-center mb-8 md:mb-10">
                            <h2
                                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    color: "#27261C",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                Lost in the Mountains?
                            </h2>
                            <p
                                className="text-base sm:text-lg md:text-xl text-[#686766] max-w-xl mx-auto"
                                style={{
                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                    fontWeight: 500,
                                    lineHeight: "1.6",
                                }}
                            >
                                The page you're searching for seems to have wandered off into the Arunachali forests. Let us help you find your way back.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
                            <Link href="/">
                                <button
                                    className="w-full sm:w-auto px-8 py-4 bg-[#FC611E] hover:bg-[#f46a2f] text-[#27261C] font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                >
                                    <Home className="w-5 h-5" />
                                    Back to Home
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>

                            <Link href="/activities">
                                <button
                                    className="w-full sm:w-auto px-8 py-4 border-2 border-[#DDE7E0] text-[#27261C] font-semibold rounded-full hover:border-[#FC611E] hover:bg-[#F5F1E6] transition-all duration-300"
                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                >
                                    Explore Activities
                                </button>
                            </Link>
                        </div>

                        {/* Suggested links */}
                        <div
                            className="bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#DDE7E0]"
                        >
                            <p
                                className="text-sm font-semibold text-[#686766] mb-4 uppercase tracking-widest"
                                style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}
                            >
                                Here's where to go instead
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { label: "Tours & Treks", href: "/tours" },
                                    { label: "Homestays", href: "/homestays" },
                                    { label: "Articles", href: "/articles" },
                                    { label: "Route Planner", href: "/route-planner" },
                                    { label: "About Us", href: "/about" },
                                    { label: "Contact", href: "/contact" },
                                ].map((link) => (
                                    <Link key={link.href} href={link.href}>
                                        <button
                                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-white border border-transparent hover:border-[#DDE7E0] transition-all duration-300"
                                            style={{
                                                fontFamily: "var(--font-mona-sans), sans-serif",
                                                color: "#27261C",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {link.label}
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
