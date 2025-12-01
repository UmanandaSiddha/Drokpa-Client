"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";

type Tour = {
    id: number;
    title: string;
    image: string;
    duration: string;
    price: string;
    blurb: string;
    rating?: number;
    highlights?: string[];
};

const tours: Tour[] = [
    {
        id: 1,
        title: "Tawang Cultural Circuit",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
        duration: "4 days",
        price: "₹12,000",
        blurb: "Monasteries, homestays and curated cultural visits — perfect for first-time visitors.",
        rating: 4.8,
        highlights: ["Monasteries", "Local Food", "Guided Tours"],
    },
    {
        id: 2,
        title: "Sela Pass Snow Trek",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
        duration: "3 days",
        price: "₹9,500",
        blurb: "A short high-altitude trek to snowy ridgelines — crisp air and big views.",
        rating: 4.9,
        highlights: ["Snow Views", "Short Trek", "Panoramas"],
    },
    {
        id: 3,
        title: "Dirang Valley Retreat",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
        duration: "5 days",
        price: "₹15,000",
        blurb: "Relaxed valley itinerary with hot springs, orchards and community stays.",
        rating: 4.7,
        highlights: ["Hot Springs", "Village Walks", "Apple Orchards"],
    },
    {
        id: 4,
        title: "Mago Monastery Day Trip",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
        duration: "1 day",
        price: "₹2,500",
        blurb: "A focused cultural visit to Mago Monastery with riverside views and short walks.",
        rating: 4.6,
        highlights: ["Monastery", "Scenic Views", "Short Walks"],
    },
];

export default function ToursSection() {
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animatePhase, setAnimatePhase] = useState(false);
    const ANIM_DUR = 700; // ms
    const timer = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, [index]);

    function startAutoplay() {
        stopAutoplay();
        timer.current = window.setTimeout(() => {
            goTo((index + 1) % tours.length);
        }, 6000) as unknown as number;
    }

    function stopAutoplay() {
        if (timer.current) {
            clearTimeout(timer.current as unknown as number);
            timer.current = null;
        }
    }

    function goTo(i: number) {
        stopAutoplay();
        setPrevIndex(index);
        setIndex(i);
        setIsAnimating(true);
        // ensure the DOM paints initial state (prev visible, curr hidden), then flip
        setAnimatePhase(false);
        requestAnimationFrame(() => requestAnimationFrame(() => setAnimatePhase(true)));
        window.setTimeout(() => {
            setIsAnimating(false);
            setAnimatePhase(false);
        }, ANIM_DUR);
    }

    return (
        <section id="tours" className="py-12 lg:py-16 bg-white dark:bg-black" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-[#005246]">Featured Tours</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 max-w-xl">One curated experience at a time — highlighted for quick booking.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => { stopAutoplay(); setIndex((i) => (i - 1 + tours.length) % tours.length); }}
                            aria-label="Previous tour"
                            className="bg-white/90 p-2 rounded-full shadow-sm hover:scale-105 transition-transform"
                        >
                            <ChevronLeft className="w-5 h-5 text-[#005246]" />
                        </button>
                        <button
                            onClick={() => { stopAutoplay(); setIndex((i) => (i + 1) % tours.length); }}
                            aria-label="Next tour"
                            className="bg-white/90 p-2 rounded-full shadow-sm hover:scale-105 transition-transform"
                        >
                            <ChevronRight className="w-5 h-5 text-[#005246]" />
                        </button>
                    </div>
                </div>

                <div
                    className="relative bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg"
                    onMouseEnter={() => stopAutoplay()}
                    onMouseLeave={() => startAutoplay()}
                >
                    {/* Large feature area - fixed height to keep it one view */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                        <div className="relative h-72 lg:h-[420px] bg-black">
                            {/* Cross-fade previous and current images (two-layer) */}
                            <img
                                src={tours[prevIndex].image}
                                alt={tours[prevIndex].title}
                                className="w-full h-full object-cover absolute inset-0"
                                loading="lazy"
                                style={{
                                    opacity: isAnimating ? (animatePhase ? 0 : 1) : (index === prevIndex ? 1 : 0),
                                    transition: `opacity ${ANIM_DUR}ms ease-in-out`,
                                }}
                            />

                            <img
                                src={tours[index].image}
                                alt={tours[index].title}
                                className="w-full h-full object-cover absolute inset-0"
                                loading="lazy"
                                style={{
                                    opacity: isAnimating ? (animatePhase ? 1 : 0) : (index === prevIndex ? 0 : 1),
                                    transition: `opacity ${ANIM_DUR}ms ease-in-out`,
                                }}
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <div className="absolute left-6 bottom-6 text-white">
                                <div className="text-xs bg-[#005246] bg-opacity-95 rounded-full px-3 py-1 font-semibold">{tours[index].duration}</div>
                            </div>
                        </div>

                        <div className="p-6 lg:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-black/20 rounded-full px-3 py-1">
                                    <Star className="w-4 h-4 text-amber-400" />
                                    <span className="font-semibold">{tours[index].rating}</span>
                                </div>

                                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                                    <Clock className="w-4 h-4 text-[#005246]" />
                                    <span className="font-medium">{tours[index].duration}</span>
                                </div>
                            </div>

                            <h3 className="mt-4 text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">{tours[index].title}</h3>
                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-prose">{tours[index].blurb}</p>

                            {tours[index].highlights && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {tours[index].highlights.map((h, i) => (
                                        <span key={i} className="text-xs bg-white/10 dark:bg-white/5 px-2 py-1 rounded-full text-gray-800 dark:text-gray-200">{h}</span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 flex items-center gap-4">
                                <div className="text-2xl font-bold text-[#005246]">{tours[index].price}</div>
                                <div className="flex items-center gap-2">
                                    <Link href="#">
                                        <p className="inline-flex items-center gap-2 bg-[#005246] text-white px-4 py-2 rounded-full text-sm hover:bg-[#044036] transition-colors shadow">Book now</p>
                                    </Link>
                                    <Link href="#">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Details</p>
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                                <strong className="text-gray-700 dark:text-gray-200">Included:</strong> local guide, accommodation, selected meals and ground transfers.
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails / pager */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex items-center gap-3">
                        {tours.map((t, i) => (
                            <button
                                key={t.id}
                                onClick={() => { goTo(i); }}
                                aria-label={`Show ${t.title}`}
                                className={`w-14 h-10 rounded-md overflow-hidden border-2 ${i === index ? 'border-[#005246]' : 'border-white/30'} shadow-sm`}
                                style={{ boxShadow: '0 4px 14px rgba(2,6,23,0.12)' }}
                            >
                                <img src={t.image} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
