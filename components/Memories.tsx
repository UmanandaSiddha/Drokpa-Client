"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const photos = [
    { src: "https://images.unsplash.com/photo-1764377977361-af5592eb0531?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Sunrise over alpine ridges" },
    { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3", caption: "Prayer flags and monastery paths" },
    { src: "https://images.unsplash.com/photo-1764438084831-983ed6b964eb?q=80&w=1182&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Hidden village lanes" },
    { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop", caption: "High meadows in bloom" },
    { src: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1400&auto=format&fit=crop", caption: "Misty valley viewpoint" },
    { src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1400&auto=format&fit=crop", caption: "Evening light on peaks" },
    { src: "https://plus.unsplash.com/premium_photo-1764428580012-eda3df0a6d6b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Some Caption" },
    { src: "https://images.unsplash.com/photo-1764100039100-9c62823c0f5c?q=80&w=1158&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Some Caption" },
    { src: "https://images.unsplash.com/photo-1749731630653-d9b3f00573ed?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Some Caption" }
];

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Memories: React.FC = () => {
    const [selected, setSelected] = useState<number | null>(null);

    const open = (i: number) => setSelected(i);
    const close = () => setSelected(null);
    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected((s) => (s === null ? null : (s - 1 + photos.length) % photos.length));
    };
    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected((s) => (s === null ? null : (s + 1) % photos.length));
    };

    return (
        <section className="w-full py-8 lg:py-16 bg-linear-to-b from-white via-[rgba(0,82,70,0.04)] to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--brand-green)">Memories</h2>
                        <p className="mt-1 text-md sm:text-base text-gray-600">A curated bento-style gallery of moments across the region.</p>
                    </div>
                </div>

                {/* Updated grid for mobile */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2
                    auto-rows-[80px] xs:auto-rows-[100px] sm:auto-rows-[140px] md:auto-rows-[160px]"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {photos.map((p, i) => {
                        let span = "row-span-1";
                        if (i % 7 === 0) span = "row-span-2 col-span-2 md:col-span-2";
                        else if (i % 5 === 0) span = "row-span-2";

                        return (
                            <motion.button
                                key={i}
                                onClick={() => open(i)}
                                className={`${span} group relative overflow-hidden rounded-xl shadow-lg focus:outline-none`}
                                variants={itemVariants}
                                layout
                            >
                                <motion.img
                                    layoutId={`photo-${i}`}
                                    src={p.src}
                                    alt={p.caption}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute left-3 bottom-3 text-white text-xs sm:text-sm font-medium">{p.caption}</div>
                            </motion.button>
                        );
                    })}
                </motion.div>

                <AnimatePresence>
                    {selected !== null && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={close}
                        >
                            <motion.div
                                className="relative max-w-4xl w-full mx-4 sm:mx-6 rounded-lg overflow-hidden bg-black"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 30, opacity: 0 }}
                                transition={{ duration: 0.28 }}
                                onClick={(e) => e.stopPropagation()}
                                layout
                            >
                                {/* Updated image height on mobile */}
                                <motion.img
                                    src={photos[selected].src}
                                    alt={photos[selected].caption}
                                    className="w-full h-[35vh] sm:h-[60vh] md:h-[75vh] object-cover"
                                    layoutId={`photo-${selected}`}
                                />

                                <div className="p-4 bg-linear-to-t from-black/60 to-transparent text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold">{photos[selected].caption}</div>
                                        <button onClick={close} className="p-2 rounded-md bg-white/10 hover:bg-white/20">
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>

                                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20">
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>
                                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20">
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Memories;
