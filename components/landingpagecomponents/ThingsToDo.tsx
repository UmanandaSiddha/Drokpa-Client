"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Activity {
  id: number;
  title: string;
  image: string;
  badge?: string;
}

export default function ThingsToDo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const activities: Activity[] = [
    {
      id: 1,
      title: "Trekking",
      image:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
      badge: "Adventure",
    },
    {
      id: 2,
      title: "Spiritual Places",
      image:
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
        badge: "Adventure",
    },
    {
      id: 3,
      title: "Wildlife Safaris",
      image:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop",
        badge: "Adventure",
    },
    {
      id: 4,
      title: "River Rafting",
      image:
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
      badge: "Adventure",
    },
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
    <div className="py-12 px-6">
      <div className="max-w-8xl w-[95%] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Things To Do</h1>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= activities.length - 2}
              className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center shadow disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-900 mb-10"></div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 50}%)` }}
          >
            {activities.map((activity) => {
              const isHovered = hoveredId === activity.id;

              return (
                <div
                  key={activity.id}
                  onMouseEnter={() => setHoveredId(activity.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[calc(50vw-3rem)] lg:w-[calc(30vw-3rem)] rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
                  style={{ minWidth: "260px" }}
                >
                  {/* Image */}
                  <div className="relative h-80">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6">

                      {/* Badge */}
                      {activity.badge && (
                        <div className="self-end">
                          <span className="px-4 py-2 bg-white/90 rounded-full text-xs font-semibold text-gray-900">
                            {activity.badge}
                          </span>
                        </div>
                      )}

                      {/* Center Hover Button */}
                      <div className="flex-1 flex items-center justify-center">
                        <button
                          className={`px-6 py-3 bg-white/95 rounded-full text-sm font-semibold text-gray-900 shadow-lg flex items-center gap-2 transition-all duration-300
                            ${
                              isHovered
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none"
                            }
                          `}
                        >
                          Explore {activity.title}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Default Title */}
                      <div
                        className={`transition-all duration-300 ${
                          isHovered
                            ? "opacity-0 translate-y-2"
                            : "opacity-100"
                        }`}
                      >
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                          {activity.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: Math.max(1, activities.length - 1) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? "w-8 bg-gray-900"
                    : "w-2 bg-gray-300"
                }`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
