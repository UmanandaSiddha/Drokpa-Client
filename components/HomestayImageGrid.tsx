"use client";
import React from "react";

type Props = {
  images: string[];
};

export default function HomestayImageGrid({ images }: Props) {
  const [open, setOpen] = React.useState(false);

  const visibleImages = images.slice(0, 5);
  const hasMore = images.length > 5;

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* IMAGE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {/* LEFT - MAIN IMAGE */}
        <div className="relative aspect-[4/3] w-full">
          <img
            src={visibleImages[0]}
            alt="Main homestay"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT - 4 IMAGES */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {visibleImages.slice(1, 5).map((img, i) => (
            <div key={i} className="relative aspect-[4/3] w-full">
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />

              {/* SHOW ALL OVERLAY */}
              {hasMore && i === 3 && (
                <button
                  onClick={() => setOpen(true)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold"
                >
                  +{images.length - 5} more
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90">
          <div className="relative max-w-6xl mx-auto p-6 h-full overflow-y-auto">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="fixed top-6 right-6 text-white text-3xl font-bold"
            >
              ✕
            </button>

            {/* ALL IMAGES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-16">
              {images.map((img, i) => (
                <div key={i} className="aspect-[4/3]">
                  <img
                    src={img}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
