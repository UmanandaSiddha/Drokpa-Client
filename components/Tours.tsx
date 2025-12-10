"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        title: "Drokpa Expedation",
        image: "/Drokpaimg.jpg",
        duration: "4 days",
        price: "₹6,800",
        blurb: "Monasteries, homestays and curated cultural visits — perfect for first-time visitors. efdasfrds",
        rating: 4.8,
        highlights: ["Monasteries", "Local Food", "Guided Tours", "WaterFalls", "Lakes", "Snow Views"],
    },
];

export default function ToursSection() {
    const [index, setIndex] = useState(0);
    const hasMultiple = tours.length > 1;
    const ANIM_DUR = 700;
    const AUTOPLAY_MS = 6000;
    const timer = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, [index, hasMultiple]);

    function startAutoplay() {
        if (!hasMultiple) return;
        stopAutoplay();
        timer.current = window.setTimeout(() => {
            goTo((index + 1) % tours.length);
        }, AUTOPLAY_MS) as unknown as number;
    }

    function stopAutoplay() {
        if (timer.current) {
            clearTimeout(timer.current as unknown as number);
            timer.current = null;
        }
    }

    function goTo(i: number) {
        stopAutoplay();
        setIndex(i);
    }

    return (
        <section
            id="tours"
            className="py-12 lg:py-16 bg-linear-to-b from-white via-emerald-50 to-white dark:bg-black"
            ref={containerRef}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--brand-green)">
                            Featured Tours
                        </h2>
                        <p className="mt-1 text-md text-gray-600 dark:text-gray-300 max-w-xl">
                            One curated experience at a time — highlighted for quick booking.
                        </p>
                    </div>
                </div>

                <div
                    className="relative bg-linear-to-b from-white via-emerald-50 to-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg"
                    onMouseEnter={() => stopAutoplay()}
                    onMouseLeave={() => startAutoplay()}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                        <div className="relative h-72 lg:h-[420px] bg-black">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={index}
                                    src={tours[index].image}
                                    alt={tours[index].title}
                                    className="w-full h-full object-cover absolute inset-0"
                                    loading="lazy"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: ANIM_DUR / 1000, ease: "easeInOut" }}
                                />
                            </AnimatePresence>

                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <div className="absolute left-6 bottom-6 text-white">
                                <div className="text-xs bg-(--brand-green) bg-opacity-95 rounded-full px-3 py-1 font-semibold">
                                    {tours[index].duration}
                                </div>
                            </div>
                        </div>

                        <div className="relative p-6 lg:p-10 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={index}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: ANIM_DUR / 1000, ease: "easeInOut" }}
                                >
                                    <div className="flex items-center gap-3 text-sm text-(--brand-green) dark:text-gray-300">
                                        <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-black/20 shadow-2xl shadow-black rounded-full px-3 py-1">
                                            <Star className="w-4 h-4 text-amber-400" />
                                            <span className="font-semibold">
                                                {tours[index].rating}
                                            </span>
                                        </div>

                                        <div className="inline-flex items-center gap-2 bg-white/90 rounded-full shadow-2xl shadow-black px-3 py-1">
                                            <Clock className="w-4 h-4 text-(--brand-green)" />
                                            <span className="font-medium">
                                                {tours[index].duration}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="mt-2 text-2xl lg:text-4xl font-extrabold text-(--brand-green) dark:text-white">
                                        {tours[index].title}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-prose">
                                        {tours[index].blurb}
                                    </p>

                                    {tours[index].highlights && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {tours[index].highlights.map((h, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-white/10 dark:bg-white/5 px-2 py-1 rounded-full border border-(--brand-green) text-(--brand-green) dark:text-gray-200"
                                                >
                                                    {h}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* 🔥 Updated Booking section below */}
                                    <div className="mt-6 flex items-center gap-4">
                                        <div className="text-2xl font-bold text-(--brand-green)">
                                            {tours[index].price}
                                        </div>

                                        {tours[index].id === 1 ? (
                                            <div className="flex items-center gap-2">
                                                <Link href={`/tours/${tours[index].id}`}>
                                                    <p className="inline-flex items-center gap-2 bg-(--brand-green) text-white px-4 py-2 rounded-full text-sm hover:bg-[#044036] transition-colors shadow">
                                                        Book now
                                                    </p>
                                                </Link>

                                                <Link href={`/tours/${tours[index].id}`}>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                                                        Details
                                                    </p>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled
                                                    className="inline-flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-full text-sm opacity-60 cursor-not-allowed"
                                                >
                                                    Coming Soon
                                                </button>

                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Details unavailable
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {/* 🔥 End updated section */}

                                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                                        <strong className="text-gray-700 dark:text-gray-200">
                                            Included:
                                        </strong>{" "}
                                        local guide, accommodation, selected meals and ground transfers.
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
                                        <button
                                            onClick={() => {
                                                if (!hasMultiple) return;
                                                goTo((index - 1 + tours.length) % tours.length);
                                            }}
                                            aria-label="Previous tour"
                                            disabled={!hasMultiple}
                                            className={`p-2 rounded-full shadow transition-transform ${hasMultiple
                                                    ? "bg-white/90 hover:scale-105"
                                                    : "bg-gray-200 dark:bg-gray-700 opacity-60 cursor-not-allowed"
                                                }`}
                                        >
                                            <ChevronLeft className="w-6 h-6 text-(--brand-green)" />
                                        </button>

                                        <div className="px-3 text-sm font-semibold text-(--brand-green) dark:text-gray-300">
                                            {tours[index].title}
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (!hasMultiple) return;
                                                goTo((index + 1) % tours.length);
                                            }}
                                            aria-label="Next tour"
                                            disabled={!hasMultiple}
                                            className={`p-2 rounded-full shadow transition-transform ${hasMultiple
                                                    ? "bg-white/90 hover:scale-105"
                                                    : "bg-gray-200 dark:bg-gray-700 opacity-60 cursor-not-allowed"
                                                }`}
                                        >
                                            <ChevronRight className="w-6 h-6 text-(--brand-green)" />
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
