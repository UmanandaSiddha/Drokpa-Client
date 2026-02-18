"use client";

import Link from "next/link";

export default function CompanyDetailsPage() {
    return (
        <main className="min-h-screen bg-white">
            <section className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 bg-white">
                <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
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
                            COMPANY DETAILS.
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
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
                                Drokpa is a high-altitude travel studio rooted in the Eastern Himalayas.
                            </h1>
                            <p
                                className="mt-4 text-base sm:text-lg text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)" }}
                            >
                                We design slow, meaningful journeys across Arunachal and the Himalayan frontier, blending local knowledge, thoughtful logistics, and time for the unexpected.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E9E2D6] bg-gradient-to-br from-[#FDFBF6] via-[#F5F1E6] to-[#F2F7F5] p-6 relative overflow-hidden">
                            <div className="absolute -top-12 -right-16 h-36 w-36 rounded-full bg-[#4F87C7]/20 blur-2xl" />
                            <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#FC611E]/20 blur-2xl" />
                            <div className="relative">
                                <p
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(18px, 4vw, 26px)",
                                        color: "#353030",
                                        letterSpacing: "-0.05em",
                                    }}
                                >
                                    At a glance
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                    <div className="rounded-xl bg-white/80 px-4 py-3">
                                        <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">Founded</p>
                                        <p className="mt-1 text-[#353030] font-medium">2022</p>
                                    </div>
                                    <div className="rounded-xl bg-white/80 px-4 py-3">
                                        <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">Base</p>
                                        <p className="mt-1 text-[#353030] font-medium">Itanagar</p>
                                    </div>
                                    <div className="rounded-xl bg-white/80 px-4 py-3">
                                        <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">Focus</p>
                                        <p className="mt-1 text-[#353030] font-medium">Tailor-made travel</p>
                                    </div>
                                    <div className="rounded-xl bg-white/80 px-4 py-3">
                                        <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">Team</p>
                                        <p className="mt-1 text-[#353030] font-medium">Local specialists</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-[#EFEAE0] bg-white p-6 shadow-sm">
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(20px, 4vw, 28px)",
                                    color: "#353030",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                What we do
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                <li>Craft bespoke itineraries across the Eastern Himalayas.</li>
                                <li>Partner with homestays and local guides for authentic stays.</li>
                                <li>Handle permits, logistics, and thoughtful route planning.</li>
                                <li>Offer themed journeys: trekking, culture, wildlife, and slow travel.</li>
                            </ul>
                        </div>
                        <div className="rounded-2xl border border-[#EFEAE0] bg-white p-6 shadow-sm">
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(20px, 4vw, 28px)",
                                    color: "#353030",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                How we work
                            </p>
                            <ul className="mt-4 space-y-3 text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                <li>Start with a discovery call to learn your travel pace.</li>
                                <li>Build routes with buffer days for weather and exploration.</li>
                                <li>Share clear, transparent pricing before confirmation.</li>
                                <li>Stay in touch throughout your journey with local support.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-[0.7fr_0.3fr] gap-6">
                        <div className="rounded-2xl border border-[#EFEAE0] bg-white p-6 shadow-sm">
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(20px, 4vw, 28px)",
                                    color: "#353030",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                Credentials
                            </p>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                <div className="rounded-xl border border-[#EFEAE0] bg-[#FDFBF6] px-4 py-3">
                                    <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">License</p>
                                    <p className="mt-1 text-[#353030] font-medium">Tour Operator (TBA)</p>
                                </div>
                                <div className="rounded-xl border border-[#EFEAE0] bg-[#FDFBF6] px-4 py-3">
                                    <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">GST</p>
                                    <p className="mt-1 text-[#353030] font-medium">Pending registration</p>
                                </div>
                                <div className="rounded-xl border border-[#EFEAE0] bg-[#FDFBF6] px-4 py-3">
                                    <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">Insurance</p>
                                    <p className="mt-1 text-[#353030] font-medium">Liability coverage</p>
                                </div>
                                <div className="rounded-xl border border-[#EFEAE0] bg-[#FDFBF6] px-4 py-3">
                                    <p className="text-xs uppercase tracking-wide text-[#9A9A9A]">Support</p>
                                    <p className="mt-1 text-[#353030] font-medium">24/7 on-ground team</p>
                                </div>
                            </div>
                        </div>

                        <aside className="rounded-2xl border border-[#E9E2D6] bg-[#F5F1E6] p-6 shadow-sm h-fit">
                            <p
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(18px, 4vw, 24px)",
                                    color: "#353030",
                                    letterSpacing: "-0.05em",
                                }}
                            >
                                Contact
                            </p>
                            <div className="mt-4 space-y-3 text-sm text-[#686766]" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                <p>drokpa.contact@gmail.com</p>
                                <p>+91 00000 00000</p>
                                <p>Itanagar, Arunachal Pradesh</p>
                                <p>Mon - Sat, 10:00 - 18:00</p>
                            </div>
                            <Link
                                href="/contact"
                                className="mt-5 inline-flex items-center rounded-full bg-[#353030] px-4 py-2 text-xs text-white"
                            >
                                Start a conversation
                            </Link>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
