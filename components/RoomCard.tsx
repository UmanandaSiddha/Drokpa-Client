"use client";
import React from "react";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Star } from "lucide-react";
import GalleryLightbox from "@/components/GalleryLightbox";

type Room = {
    id: string;
    name: string;
    price: number;
    likedPercent: number; // 0-100
    recommended: boolean;
    capacity: number;
    beds: number;
    baths: number;
    features: string[];
    images: string[];
};

export default function RoomCard({ room }: { room: Room }) {
    const [open, setOpen] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);
    const rating = Math.max(3.5, Math.min(5, room.likedPercent / 20));

    const imageCount = room.images.length;
    const goNext = () => {
        setCurrentImage((prev) => (prev + 1) % imageCount);
    };
    const goPrev = () => {
        setCurrentImage((prev) => (prev - 1 + imageCount) % imageCount);
    };
    return (
        <div className="group bg-white rounded-2xl border border-[#DDE7E0]/70 shadow-[0_18px_45px_-35px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_55px_-35px_rgba(0,0,0,0.45)] transition-all overflow-hidden">
            <div className="relative">
                <img
                    src={room.images[currentImage]}
                    alt={room.name}
                    className="w-full h-56 object-cover cursor-pointer group-hover:scale-[1.02] transition-transform"
                    onClick={() => setOpen(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                {room.recommended && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#005246] text-white text-xs px-3 py-1 rounded-full shadow">
                        <Sparkles className="w-3.5 h-3.5" />
                        Recommended
                    </span>
                )}
                {room.likedPercent > 0 && (
                    <button
                        type="button"
                        aria-label="Like this room"
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border border-white/60 flex items-center justify-center text-[#FC611E] hover:bg-white transition"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                )}
                {imageCount > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                goPrev();
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                goNext();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
                            {room.images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all ${i === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#353030]">{room.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-[#686766]">
                            <span className="inline-flex items-center gap-1">
                                <Star className="w-4 h-4 text-[#005246]" style={{ fill: "#005246" }} />
                                {rating.toFixed(1)}
                            </span>
                            <span className="text-[#DDE7E0]">|</span>
                            <span>{room.likedPercent}% liked</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-[#005246]">₹{room.price.toLocaleString()}</div>
                        <div className="text-xs text-[#686766]">per night</div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-[#F5F1E6]/70 border border-[#DDE7E0]/70 text-[#353030]">{room.capacity} guests</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#F5F1E6]/70 border border-[#DDE7E0]/70 text-[#353030]">{room.beds} beds</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#F5F1E6]/70 border border-[#DDE7E0]/70 text-[#353030]">{room.baths} baths</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {room.features.map((f) => (
                        <span key={f} className="text-xs bg-white text-[#005246] px-2.5 py-1 rounded-full border border-[#005246]/40">{f}</span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#686766]">Instant confirmation</span>
                    <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-[#FC611E] text-white text-xs font-semibold hover:bg-[#f46a2f] transition"
                    >
                        Book now
                    </button>
                </div>
            </div>
            <GalleryLightbox
                images={room.images}
                open={open}
                initialIndex={currentImage}
                onClose={() => setOpen(false)}
                showThumbnails={true}
            />
        </div>
    );
}
