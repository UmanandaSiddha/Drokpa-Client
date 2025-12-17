"use client";
import React from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex?: number;
};

export default function RoomGalleryModal({ isOpen, onClose, images, initialIndex = 0 }: Props) {
    const [index, setIndex] = React.useState(initialIndex);
    React.useEffect(() => {
        if (isOpen) setIndex(initialIndex);
    }, [isOpen, initialIndex]);

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        if (isOpen) {
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
        }
    }, [isOpen]);

    const next = () => setIndex((i) => (i + 1) % images.length);
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="relative w-[90%] max-w-4xl">
                <img src={images[index]} alt="Room image" className="w-full h-[70vh] object-cover rounded-xl shadow-2xl" />
                {/* Controls */}
                <button aria-label="Prev" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white text-(--brand-green) rounded-full p-3 shadow-lg">‹</button>
                <button aria-label="Next" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-(--brand-green) rounded-full p-3 shadow-lg">›</button>
                <button aria-label="Close" onClick={onClose} className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-full p-2 shadow">✕</button>
            </div>
        </div>
    );
}
