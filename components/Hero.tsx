"use client";

import { useEffect, useState } from "react";

type Slide = { name: string; image: string; description: string };

type HeroProps = {
    children: React.ReactNode;
    slides?: Slide[];
    intervalMs?: number;
    onSlideChange?: (slide: Slide, index: number) => void;
};

export default function Hero({ children, slides, intervalMs = 8000, onSlideChange }: HeroProps) {
    const defaults: Slide[] = [
		{ name: 'Tawang', image: 'https://images.unsplash.com/photo-1648963799017-e007d04df934?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'High alpine valleys, monasteries and rugged snowy ridgelines.' },
		{ name: 'Bomdila', image: 'https://images.unsplash.com/photo-1639134956623-0d094b12b0dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Terraced hills and snow-dusted peaks with rich cultural trails.' },
		{ name: 'Dirang', image: 'https://images.unsplash.com/photo-1668437824006-1be44600774b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'River valleys framed by pine forests and snowy summits.' },
		{ name: 'Dzuko', image: 'https://images.unsplash.com/photo-1648963798678-a921079b98b9?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Famous high-altitude meadows and cold-weather blooms beneath peaks.' },
		{ name: 'Tumjang', image: 'https://images.unsplash.com/photo-1672399447224-b63b8f67b44d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Remote snowy passes and wide panoramas for quiet hikes.' },
	];

    const slidesList = slides && slides.length > 0 ? slides : defaults;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        onSlideChange?.(slidesList[index], index);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % slidesList.length), intervalMs);
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
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                        }`}
                />
            ))}

            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
        </section>
    );
}
