"use client";
import React from "react";
import RoomGalleryModal from "./RoomGalleryModal";

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
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <div className="relative">
                <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-56 object-cover cursor-pointer"
                    onClick={() => setOpen(true)}
                />
                {room.recommended && (
                    <span className="absolute top-3 left-3 bg-(--brand-green) text-white text-xs px-3 py-1 rounded-full shadow">Recommended</span>
                )}
            </div>
            <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                    <span className="text-(--brand-green) font-bold text-lg">₹{room.price.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                    <span>Capacity: {room.capacity}</span>
                    <span>{room.beds} beds</span>
                    <span>{room.baths} baths</span>
                    <span>{room.likedPercent}% liked</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {room.features.map((f) => (
                        <span key={f} className="text-xs bg-emerald-50 text-(--brand-green) px-2 py-1 rounded-full border border-(--brand-green)">{f}</span>
                    ))}
                </div>
            </div>
            <RoomGalleryModal isOpen={open} onClose={() => setOpen(false)} images={room.images} />
        </div>
    );
}
