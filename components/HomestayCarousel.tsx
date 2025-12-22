"use client";
import React from "react";

type Props = {
  images: string[];
  intervalMs?: number;
};

export default function HomestayCarousel({
  images,
  intervalMs = 4000,
}: Props) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const startX = React.useRef<number | null>(null);

  // Auto slide
  React.useEffect(() => {
    if (!images || images.length <= 1 || paused) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [images, intervalMs, paused]);

  const prev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  /* ---------------- Swipe Handlers ---------------- */

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }

    startX.current = null;
    setPaused(false);
  };

  const current = images[index] ?? images[0];

  return (
    <div
      className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-2xl overflow-hidden shadow-2xl"
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={current}
        alt="Homestay"
        className="w-full h-full object-cover select-none"
        draggable={false}
      />

      {/* Left Button */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
      >
        ❯
      </button>

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-(--brand-green)" : "bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
