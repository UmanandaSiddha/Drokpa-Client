"use client";

import Stack from "./Stack";

export default function AboutSection() {
  return (
    <section className="py-20 bg-linear-to-b from-white via-emerald-50 to-white dark:bg-black overflow-hidden">
      <div className="container-wide mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">

          {/* Image Stack Column */}
          <div className="flex justify-center md:justify-start mt-2 md:mt-0 mr-10">
            <Stack
              randomRotation={true}
              sensitivity={180}
              cardDimensions={{ width: 400, height: 400 }}
              animationConfig={{ stiffness: 260, damping: 20 }}
              sendToBackOnClick={true}
            />
          </div>

          {/* Content column */}
          <div className="px-2 md:px-0">
            <h4 className="text-sm uppercase tracking-wide text-(--brand-green) font-semibold">
              DROKPA
            </h4>

            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-linear-to-r from-[#0f5132] to-[#2aa66a]">
                Everything Arunachal, thoughtfully curated
            </h2>

            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-prose ">
                We make travel effortless by bringing everything you need to one place — stays, food, vehicles,
                permits, and local insights. Explore authentic experiences across the NorthEast with curated
                itineraries and trusted local guides.
            </p>


            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <button className="inline-flex items-center gap-2 bg-(--brand-green) text-white px-5 py-3 rounded-full text-sm shadow-lg hover:bg-[#004536] transition-colors">
                Book a Trip
              </button>
              <button className="inline-flex items-center gap-2 border border-[#d1e9e0] text-(--brand-green) bg-white/60 px-4 py-2 rounded-full text-sm hover:bg-white transition-colors">
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