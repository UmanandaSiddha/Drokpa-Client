"use client";

export default function AboutSection() {
    return (
        <section className="py-20 bg-white dark:bg-black overflow-hidden">
            <div className="container-wide mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
                    {/* Image / visual column */}
                    <div className="flex justify-center md:justify-start">
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 transform-gpu transition-transform duration-400 hover:scale-105">
                                <img
                                    src="https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="mountain"
                                    className="w-[320px] h-80 md:w-[360px] md:h-[360px] object-cover"
                                />
                            </div>

                            <div className="absolute -left-6 -bottom-6 md:-left-10 md:-bottom-10 bg-linear-to-br from-[#E6F6F0] to-white rounded-full w-24 h-24 md:w-32 md:h-32 opacity-90 shadow-lg pointer-events-none" />

                            <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 bg-[#005246] text-white rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg">
                                <div className="text-center">
                                    <div className="text-sm md:text-base font-semibold">Trusted</div>
                                    <div className="text-xs md:text-sm opacity-90">Local Guides</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content column */}
                    <div className="px-2 md:px-0">
                        <h4 className="text-sm uppercase tracking-wide text-[#005246] font-semibold">Travel, Simplified</h4>
                        <h2 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-linear-to-r from-[#0f5132] to-[#2aa66a]">
                            DROKPA
                        </h2>

                        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-prose">
                            We make travel effortless by bringing everything you need to one place — stays, food, vehicles,
                            permits, and local insights. Explore authentic experiences across the NorthEast with curated
                            itineraries and trusted local guides.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <button className="inline-flex items-center gap-2 bg-[#005246] text-white px-5 py-3 rounded-full text-sm shadow-lg hover:bg-[#004536] transition-colors">
                                Book a Trip
                            </button>
                            <button className="inline-flex items-center gap-2 border border-[#d1e9e0] text-[#005246] bg-white/60 px-4 py-2 rounded-full text-sm hover:bg-white transition-colors">
                                Learn More
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm">
                            <div className="bg-white/80 dark:bg-black/40 rounded-lg p-3 text-center shadow-sm">
                                <div className="text-xl font-bold">250+</div>
                                <div className="text-xs text-muted-foreground">Experiences</div>
                            </div>
                            <div className="bg-white/80 dark:bg-black/40 rounded-lg p-3 text-center shadow-sm">
                                <div className="text-xl font-bold">120+</div>
                                <div className="text-xs text-muted-foreground">Local Guides</div>
                            </div>
                            <div className="bg-white/80 dark:bg-black/40 rounded-lg p-3 text-center shadow-sm">
                                <div className="text-xl font-bold">4.9</div>
                                <div className="text-xs text-muted-foreground">Avg. Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
