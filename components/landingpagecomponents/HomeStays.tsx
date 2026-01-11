"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import tours from '@/data/tours';

export default function HomeStays() {
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
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-8xl w-[95%] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">HomeStays</h1>
          
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-10 h-10 bg-white cursor-pointer rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= tours.length - 3}
                className="w-10 h-10 bg-gray-900 cursor-pointer rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
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
                className="min-w-[calc(33.333%-16px)] bg-white rounded-2xl overflow-hidden transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Duration Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800">
                    {tour.duration}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(tour.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(tour.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Discount Badge */}
                  {tour.discount && (
                    <div className="absolute bottom-4 right-4 bg-emerald-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                      {tour.discount}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{tour.title}</h3>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-700">{tour.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">₹{tour.price}/</span>
                    <span className="text-sm text-gray-600">person</span>
                    <span className="text-sm text-gray-400 line-through ml-2">₹{tour.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.max(1, tours.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}