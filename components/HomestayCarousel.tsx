"use client";
import React from "react";

type Props = {
    images: string[];
    intervalMs?: number;
};

export default function HomestayCarousel({ images, intervalMs = 4000 }: Props) {
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        if (!images || images.length <= 1) return;
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, intervalMs);
        return () => clearInterval(id);
    }, [images, intervalMs]);

    const current = images[index] ?? images[0];

    return (
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={current} alt="Homestay" className="w-full h-full object-cover" />
            {/* Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-(--brand-green)" : "bg-white/70"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
