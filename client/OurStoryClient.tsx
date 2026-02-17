"use client";

import { Handshake, Map, ShieldCheck } from "lucide-react";

export default function OurStoryPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
            <main className="pt-24 pb-16">
                <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1400px] mx-auto">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-[#FC611E]/15 blur-3xl" />
                        <div className="absolute top-24 -left-10 h-72 w-72 rounded-full bg-[#4F87C7]/12 blur-3xl" />
                        <div className="absolute bottom-0 right-12 h-80 w-80 rounded-full bg-[#005246]/10 blur-3xl" />
                    </div>

                    <section className="mb-14">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#686766]" style={{ fontWeight: 700 }}>
                            Our Story
                        </p>
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl mt-3"
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                                color: "#27261C",
                                letterSpacing: "-0.06em",
                            }}
                        >
                            How Drokpa began
                        </h1>
                        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
                            <p className="text-base sm:text-lg text-[#686766]" style={{ fontWeight: 500, lineHeight: "1.8" }}>
                                We started Drokpa after watching friends and family struggle to plan meaningful trips to the
                                mountains. It was not a lack of interest, it was the uncertainty: permits, local transport,
                                seasonal closures, and a lot of broken information. Our founders wanted a place that felt
                                like a trusted local friend, not a generic booking engine.
                            </p>
                            <div className="rounded-3xl border border-[#DDE7E0]/70 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)]">
                                <p className="text-sm text-[#27261C]" style={{ fontWeight: 700 }}>
                                    What we heard most
                                </p>
                                <div className="mt-4 space-y-3 text-sm text-[#686766]" style={{ fontWeight: 500 }}>
                                    <p>"Where do we start the permit process?"</p>
                                    <p>"Which homestays are actually verified?"</p>
                                    <p>"What is open this season, and what is not?"</p>
                                </div>
                                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#F5F1E6] px-3 py-1 text-xs text-[#27261C]" style={{ fontWeight: 700 }}>
                                    Trusted info, local insights
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-3xl border border-[#DDE7E0]/70 bg-[#F5F1E6]/40 p-6">
                            <h2
                                className="text-xl sm:text-2xl"
                                style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#27261C" }}
                            >
                                The inspiration
                            </h2>
                            <p className="text-sm sm:text-base text-[#686766] mt-3" style={{ fontWeight: 500, lineHeight: "1.7" }}>
                                We grew up seeing how travel could bring livelihoods to remote communities. But the experience
                                for visitors was fragmented, and the value rarely reached locals fairly. Drokpa was born from
                                the idea that travel should be easier to plan, more honest in pricing, and more respectful to
                                places that host us.
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-[#27261C]" style={{ fontWeight: 700 }}>
                                <span className="rounded-full bg-white px-3 py-1 text-center">Local-first</span>
                                <span className="rounded-full bg-white px-3 py-1 text-center">Transparent</span>
                                <span className="rounded-full bg-white px-3 py-1 text-center">Season-ready</span>
                                <span className="rounded-full bg-white px-3 py-1 text-center">Respectful</span>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#DDE7E0]/70 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.2)]">
                            <h2
                                className="text-xl sm:text-2xl"
                                style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#27261C" }}
                            >
                                The problems we faced
                            </h2>
                            <ul className="mt-4 space-y-3 text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
                                <li>Unclear permit steps and unclear timelines for approvals.</li>
                                <li>Scattered homestay and tour information with inconsistent quality.</li>
                                <li>No single place to compare stays, treks, and experiences.</li>
                                <li>Last minute cancellations with no transparent alternatives.</li>
                                <li>Local hosts not getting the tools to manage availability fairly.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mt-12 rounded-3xl border border-[#DDE7E0]/70 bg-white p-6 sm:p-8 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.25)]">
                        <h2
                            className="text-xl sm:text-2xl"
                            style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#27261C" }}
                        >
                            How the platform solves it
                        </h2>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-[#F5F1E6] p-4">
                                <p className="text-sm text-[#27261C]" style={{ fontWeight: 700 }}>
                                    One place to plan
                                </p>
                                <p className="text-sm text-[#686766] mt-2" style={{ fontWeight: 500 }}>
                                    All stays, tours, treks, and experiences curated together so you can compare with confidence.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#F5F1E6] p-4">
                                <p className="text-sm text-[#27261C]" style={{ fontWeight: 700 }}>
                                    Permit clarity
                                </p>
                                <p className="text-sm text-[#686766] mt-2" style={{ fontWeight: 500 }}>
                                    We guide travelers through ILP steps with clear timelines and status updates.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#F5F1E6] p-4">
                                <p className="text-sm text-[#27261C]" style={{ fontWeight: 700 }}>
                                    Local-first network
                                </p>
                                <p className="text-sm text-[#686766] mt-2" style={{ fontWeight: 500 }}>
                                    Tools for hosts and guides to manage bookings, availability, and fair pricing.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#F5F1E6] p-4">
                                <p className="text-sm text-[#27261C]" style={{ fontWeight: 700 }}>
                                    Bucket planning
                                </p>
                                <p className="text-sm text-[#686766] mt-2" style={{ fontWeight: 500 }}>
                                    Save rooms, tours, and treks in your bucket to plan with friends or revisit later.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="relative mt-12 overflow-hidden rounded-3xl bg-[#005246] text-white p-6 sm:p-8">
                        <div className="absolute inset-0">
                            <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#FC611E]/20 blur-3xl" />
                            <div className="absolute -bottom-20 left-12 h-64 w-64 rounded-full bg-[#4F87C7]/20 blur-3xl" />
                        </div>
                        <div className="relative">
                            <h2
                                className="text-xl sm:text-2xl"
                                style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                            >
                                The road ahead
                            </h2>
                            <p className="text-sm sm:text-base mt-3" style={{ fontWeight: 500, lineHeight: "1.7" }}>
                                We are building a platform that honors the land and people who host us. As we grow, we want
                                travelers to feel prepared, locals to feel respected, and every journey to feel grounded in
                                trust.
                            </p>
                            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-xs" style={{ fontWeight: 700 }}>
                                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                                    <span className="inline-flex items-center gap-2">
                                        <Handshake className="h-4 w-4" />
                                        Local partnerships
                                    </span>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                                    <span className="inline-flex items-center gap-2">
                                        <Map className="h-4 w-4" />
                                        Smarter ILP flow
                                    </span>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                                    <span className="inline-flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        Community trust
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
