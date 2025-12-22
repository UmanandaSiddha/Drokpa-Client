"use client";
import React from "react";

type Props = {
  images: string[];
};

export default function HomestayImageGrid({ images }: Props) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const visibleImages = images.slice(0, 5);
  const hasMore = images.length > 5;

  if (!images || images.length === 0) return null;

  /* ---------------- BODY SCROLL LOCK ---------------- */
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ---------------- KEYBOARD CONTROLS ---------------- */
  React.useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const openViewer = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* IMAGE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {/* LEFT */}
        <div
          className="relative aspect-[4/3] cursor-pointer group"
          onClick={() => openViewer(0)}
        >
          <img
            src={visibleImages[0]}
            alt="Main homestay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {visibleImages.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] cursor-pointer group"
              onClick={() => openViewer(i + 1)}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

              {hasMore && i === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold pointer-events-none">
                  +{images.length - 5} more
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VIEWER */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl font-bold z-10"
          >
            ✕
          </button>

          {/* MAIN IMAGE */}
          <div className="flex-1 flex items-center justify-center relative">
            <button
              onClick={prev}
              className="absolute left-4 md:left-10 text-white text-4xl font-bold"
            >
              ❮
            </button>

            <img
              src={images[activeIndex]}
              alt={`Photo ${activeIndex + 1}`}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            />

            <button
              onClick={next}
              className="absolute right-4 md:right-10 text-white text-4xl font-bold"
            >
              ❯
            </button>
          </div>

          {/* THUMBNAILS STRIP */}
          <div className="w-full px-6 pb-6">
            <div className="flex gap-3 overflow-x-auto no-scrollbar justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative flex-shrink-0 rounded-md overflow-hidden border-2 transition
                    ${
                      i === activeIndex
                        ? "border-white"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    className="w-20 h-14 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* IMAGE COUNT */}
          <div className="absolute bottom-2 w-full text-center text-white text-sm opacity-80">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
