"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { Tour } from "@/data/tours";

interface TourHomeComponentProps {
  tours: Tour[];
  title?: string;
}

export default function TourHomeComponent({
  tours,
  title,
}: TourHomeComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const handleNext = () => {
    if (currentIndex < tours.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  if (!tours?.length) return null;

  return (
    <div className="py-12 px-6">
      <div className="max-w-8xl w-[95%] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= tours.length - 3}
              className="w-10 h-10 bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="min-w-[calc(33.333%-16px)] bg-white rounded-2xl overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full text-xs font-semibold">
                    {tour.duration}
                  </div>

                  <button
                    onClick={() => toggleFavorite(tour.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(tour.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>

                  {tour.discount && (
                    <div className="absolute bottom-4 right-4 bg-emerald-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                      {tour.discount}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between mb-3">
                    <h3 className="text-xl font-bold">{tour.title}</h3>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-700">
                        {tour.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      ₹{tour.price}/
                    </span>
                    <span className="text-sm text-gray-600">person</span>
                    <span className="text-sm text-gray-400 line-through ml-2">
                      ₹{tour.originalPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.max(1, tours.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index
                  ? "w-8 bg-gray-900"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
