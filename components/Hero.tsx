"use client";

import { useEffect, useState } from "react";

type Slide = { name: string; image: string; description: string };

type HeroProps = {
    children: React.ReactNode;
    slides?: Slide[];
    intervalMs?: number;
    onSlideChange?: (slide: Slide, index: number) => void;
};

export default function Hero({ children, slides, intervalMs = 8000, onSlideChange }: HeroProps) {
    const defaults: Slide[] = [
        { name: 'TAWANG', image: 'https://images.unsplash.com/photo-1648963799017-e007d04df934?q=80&w=1170&auto=format&fit=crop', description: 'High alpine valleys, monasteries and rugged snowy ridgelines.' },
        { name: 'BOMDILA', image: 'https://images.unsplash.com/photo-1639134956623-0d094b12b0dc?q=80&w=1170&auto=format&fit=crop', description: 'Terraced hills and snow-dusted peaks with rich cultural trails.' },
        { name: 'DIRANG', image: 'https://images.unsplash.com/photo-1668437824006-1be44600774b?q=80&w=1170&auto=format&fit=crop', description: 'River valleys framed by pine forests and snowy summits.' },
        { name: 'DZOUKO', image: 'https://images.unsplash.com/photo-1648963798678-a921079b98b9?q=80&w=1202&auto=format&fit=crop', description: 'Famous high-altitude meadows and cold-weather blooms beneath peaks.' },
        { name: 'TUMJUNG', image: 'https://images.unsplash.com/photo-1672399447224-b63b8f67b44d?q=80&w=1332&auto=format&fit=crop', description: 'Remote snowy passes and wide panoramas for quiet hikes.' },
    ];

    const slidesList = slides && slides.length > 0 ? slides : defaults;
    const [index, setIndex] = useState(0);
    // const [showBanner, setShowBanner] = useState(true);
    // const [bannerVisible, setBannerVisible] = useState(true);


    useEffect(() => {
        onSlideChange?.(slidesList[index], index);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % slidesList.length), intervalMs);
        return () => clearInterval(t);
    }, [slidesList.length, intervalMs]);

    useEffect(() => {
        onSlideChange?.(slidesList[index], index);
    }, [index]);

    // 👀 Hide banner when Hero section is out of view
    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         ([entry]) => setBannerVisible(entry.isIntersecting),
    //         { threshold: 0.4 }
    //     );

    //     const section = document.getElementById("hero-section");
    //     if (section) observer.observe(section);

    //     return () => observer.disconnect();
    // }, []);

    return (
        <section id="hero-section" className="relative min-h-screen w-full overflow-hidden">

            {/* BACKGROUND SLIDES */}
            {slidesList.map((s, i) => (
                <div
                    key={i}
                    aria-hidden
                    style={{ backgroundImage: `url(${s.image})` }}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100 z-0" : "opacity-0 -z-10"
                        }`}
                />
            ))}

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            {/* MAIN CONTENT */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {children}
            </div>


            {/* BOTTOM RIGHT BANNER */}
            {/* {showBanner && bannerVisible && (
                <div
                    className="hidden lg:flex flex-col w-80 bg-white/95 backdrop-blur-xl text-gray-900 
                    fixed right-6 top-1/2 -translate-y-1/2 shadow-2xl rounded-xl border-l-8 border-[#005246]
                    p-5 gap-3 z-20 animate-slideLeft pointer-events-auto"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-[#005246] tracking-wide">
                            Latest Trip 🌄
                        </h3>
                        <button className="p-1 hover:bg-gray-200 rounded-md" onClick={() => setShowBanner(false)}>
                            <X size={20} className="text-gray-700" />
                        </button>
                    </div>

                    <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                            src="/jungwaterfall2.jpg"
                            className="w-full h-full object-cover"
                            alt="Trip Preview"
                        />
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-[#005246]">
                            Drokpa Winter Tour plan
                        </p>
                        <p className="text-sm text-gray-600 font-medium">4 Days - 3 Nights • ₹6,800 per head</p>
                        <p className="text-xs text-gray-500 leading-snug mt-1">
                            {slidesList[index].description}
                        </p>
                    </div>

                    <button className="mt-2 bg-[#005246] text-white text-sm font-bold py-2 rounded-lg hover:opacity-90">
                        View Details
                    </button>
                </div>
            )} */}
        </section>
    );
}
