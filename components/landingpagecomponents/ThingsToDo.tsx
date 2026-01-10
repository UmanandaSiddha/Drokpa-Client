"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  image: string;
  badge?: string;
  type: 'default' | 'center';
}

export default function ThingsToDo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activities: Activity[] = [
    {
      id: 1,
      title: "Trekking",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
      badge: "Adventure",
      type: "default"
    },
    {
      id: 2,
      title: "Explore Spiritual Places",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
      badge: undefined,
      type: "center"
    },
    {
      id: 3,
      title: "Wildlife Safaris",
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop",
      badge: undefined,
      type: "default"
    },
    {
      id: 4,
      title: "River Rafting",
      image: "https://images.unsplash.com/photo-1624714782580-f08a84ad0b2c?w=800&h=600&fit=crop",
      badge: "Adventure",
      type: "default"
    }
  ];

  const handleNext = () => {
    if (currentIndex < activities.length - 2) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl w-[95%] mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Things To Do
          </h1>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= activities.length - 2}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-full shadow-md flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Black Separator Line */}
        <div className="w-full h-[1.5] bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-full mb-8 sm:mb-10 md:mb-12"></div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 50}%)` }}
          >
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`relative flex-shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer ${
                  activity.type === 'center' 
                    ? 'w-[calc(100vw-2rem)] sm:w-[calc(50vw-3rem)] lg:w-[calc(40vw-3rem)]' 
                    : 'w-[calc(100vw-2rem)] sm:w-[calc(50vw-3rem)] lg:w-[calc(30vw-3rem)]'
                }`}
                style={{ minWidth: activity.type === 'center' ? '300px' : '250px' }}
              >
                {/* Image with Overlay */}
                <div className="relative h-64 sm:h-72 md:h-80 lg:h-96">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                    {/* Top Badge */}
                    {activity.badge && (
                      <div className="self-end">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-900">
                          {activity.badge}
                        </span>
                      </div>
                    )}

                    {/* Bottom Title or Center Button */}
                    {activity.type === 'center' ? (
                      <div className="flex-1 flex items-center justify-center">
                        <button className="px-6 py-3 sm:px-8 sm:py-3.5 bg-white/95 backdrop-blur-sm rounded-full text-sm sm:text-base font-semibold text-gray-900 hover:bg-white transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                          {activity.title}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="self-start">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                          {activity.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-10">
          {Array.from({ length: Math.max(1, activities.length - 1) }).map((_, index) => (
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