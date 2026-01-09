"use client";

import { useEffect, useState } from "react";

const TrekCard = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-8 right-8 z-30 bg-white rounded-xl shadow-2xl overflow-hidden w-80">
      {/* Image Carousel Container */}
      <div className="relative h-44">
        {/* Carousel Images */}
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Trek"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        
        {/* Dots Indicator - Top Right */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === currentImage ? "bg-yellow-400 w-6" : "bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Tagline - Top Right below dots */}
        <div className="absolute top-28 right-0 text-white font-bold px-2.5 py-1.5 text-sm text-right leading-tight">
          Trails That Test.<br />
          Views That Reward.
        </div>

        {/* Price Tag - Bottom Left */}
        <div className="absolute bottom-3 left-0 px-3 text-white font-bold text-bold py-1.5 font-semibold">
          ₹12,999<span className="text-sm font-normal">/Person</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-800 text-base">
            Seven Lakes Trek
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            Arunachal Pradesh
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors">
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default TrekCard