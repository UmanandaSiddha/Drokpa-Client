"use client";

import { useEffect, useState } from "react";

type Slide = { name: string; image: string; description: string };

type HeroProps = {
  children: React.ReactNode;
  slides?: Slide[];
  intervalMs?: number;
  onSlideChange?: (slide: Slide, index: number) => void;
};

export default function Hero({
  children,
  slides,
  intervalMs = 8000,
  onSlideChange,
}: HeroProps) {
  const defaults: Slide[] = [
    {
      name: "Tawang",
      image:
        "https://images.unsplash.com/photo-1648963799017-e007d04df934?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "High alpine valleys and ancient monasteries set against vast snowy ridgelines. " +
        "Tawang blends spiritual calm with dramatic mountain landscapes that shift with every season. " +
        "Prayer flags flutter over deep gorges carved through ice and stone. " +
        "Clear winter air reveals peaks layered endlessly into the horizon. " +
        "A place where silence feels sacred and the mountains seem to breathe.",
    },
    {
      name: "Bomdila",
      image:
        "https://images.unsplash.com/photo-1639134956623-0d094b12b0dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Terraced hills wrap around snow-dusted peaks that rise sharply above quiet valleys. " +
        "Bomdila is known for its cool air, Buddhist cultural spaces and peaceful walking trails. " +
        "Villages cling to slopes lit by soft mountain sun. " +
        "The landscape shifts from green forests to open views of distant white summits. " +
        "A gentle mix of nature, culture and crisp high-altitude calm.",
    },
    {
      name: "Dirang",
      image:
        "https://images.unsplash.com/photo-1668437824006-1be44600774b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "River valleys wind between pine-lined slopes as snowy summits rise in the distance. " +
        "Dirang feels like a warm pocket of life in the middle of high mountains. " +
        "Stone houses, hot springs and soft morning fog create a calm village rhythm. " +
        "The cold rivers sparkle under narrow wooden bridges. " +
        "A serene mix of adventure, nature and everyday mountain charm.",
    },
    {
      name: "Dzuko",
      image:
        "https://images.unsplash.com/photo-1648963798678-a921079b98b9?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Sweeping high-altitude meadows stretch like a green ocean beneath distant peaks. " +
        "Dzuko is famous for cold-season blooms and an otherworldly calm that blankets the valley. " +
        "Rolling slopes glow under soft sunlight and silence carries far across the grasslands. " +
        "The trails curve gently over ridges that reveal new layers of mountains. " +
        "A landscape that feels untouched, quiet and endlessly open.",
    },
    {
      name: "Tumjang",
      image:
        "https://images.unsplash.com/photo-1672399447224-b63b8f67b44d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Remote snowy passes rise above forests that fade softly into rolling hills. " +
        "Tumjang offers wide, peaceful panoramas and quiet winter pathways. " +
        "The air is cool, and the landscapes feel untouched by noise or crowds. " +
        "Hikers follow gentle ridgelines opening toward pale blue horizons. " +
        "A perfect place for slow, reflective travel through open mountain silence.",
    },
  ];

  const slidesList = slides && slides.length > 0 ? slides : defaults;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    onSlideChange?.(slidesList[index], index);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slidesList.length),
      intervalMs
    );
    return () => clearInterval(t);
  }, [slidesList.length, intervalMs]);

  useEffect(() => {
    onSlideChange?.(slidesList[index], index);
  }, [index]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {slidesList.map((s, i) => (
        <div
          key={i}
          aria-hidden
          style={{ backgroundImage: `url(${s.image})` }}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </section>
  );
}
