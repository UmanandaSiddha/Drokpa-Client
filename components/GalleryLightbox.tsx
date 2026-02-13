"use client";

import React from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryLightboxProps = {
    images: string[];
    open: boolean;
    initialIndex?: number;
    onClose: () => void;
    showThumbnails?: boolean;
};

const SWIPE_THRESHOLD = 40;

export default function GalleryLightbox({
    images,
    open,
    initialIndex = 0,
    onClose,
    showThumbnails = true,
}: GalleryLightboxProps) {
    const [mounted, setMounted] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(initialIndex);
    const touchStartX = React.useRef<number | null>(null);
    const touchEndX = React.useRef<number | null>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!open) return;
        setActiveIndex(initialIndex);
    }, [open, initialIndex]);

    React.useEffect(() => {
        if (!open) return;
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, [open, images]);

    React.useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const next = React.useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prev = React.useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    React.useEffect(() => {
        if (!open) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, next, prev, onClose]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchEndX.current = null;
        touchStartX.current = e.touches[0]?.clientX ?? null;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        touchEndX.current = e.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return;
        const deltaX = touchStartX.current - touchEndX.current;
        if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
        if (deltaX > 0) {
            next();
        } else {
            prev();
        }
    };

    if (!mounted || !open || images.length === 0) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-4 rounded-full hover:bg-black/30 text-white text-3xl font-bold z-10"
            >
                <X size={32} />
            </button>

            <div
                className="flex-1 flex items-center justify-center relative"
                // onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => {
                    touchStartX.current = null;
                    touchEndX.current = null;
                }}
                style={{ touchAction: "pan-y" }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        prev();
                    }}
                    className="absolute left-4 md:left-10 p-4 rounded-full text-white bg-black/50 hover:bg-black/30 text-4xl font-bold"
                >
                    <ChevronLeft size={32} />
                </button>

                <img
                    src={images[activeIndex]}
                    onClick={(e) => e.stopPropagation()}
                    alt={`Photo ${activeIndex + 1}`}
                    className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
                    loading="eager"
                />

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        next();
                    }}
                    className="absolute right-4 md:right-10 p-4 rounded-full text-white bg-black/50 hover:bg-black/30 text-4xl font-bold"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {showThumbnails && (
                <div className="w-full px-6 pb-6">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar justify-center">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    setActiveIndex(i);
                                    e.stopPropagation();
                                }}
                                className={`relative shrink-0 rounded-md overflow-hidden border-2 transition
                                    ${i === activeIndex
                                        ? "border-white"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                    }`
                                }
                            >
                                <img
                                    src={img}
                                    alt={`Thumb ${i + 1}`}
                                    className="w-20 h-14 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}
