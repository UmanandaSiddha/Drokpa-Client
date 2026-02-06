"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroBg1, HeroBg2 } from "@/assets";
import TrekCard from "./TrekCard";
import WeatherWidget from "./WeatherWidget";

const HeroSection = () => {
	const heroImages = [HeroBg1.src, HeroBg2.src];
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % heroImages.length);
		}, 6000);
		return () => clearInterval(interval);
	}, [heroImages.length]);

	return (
		<div className="flex justify-center h-full w-full">
			<div className="relative h-full w-full overflow-hidden rounded-[12px]">

				{/* Background */}
				<div className="absolute inset-0 z-0">
					{heroImages.map((img, index) => (
						<img
							key={img}
							src={img}
							alt="Hero Background"
							width={1000}
							height={1000}
							className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
								}`}
						/>
					))}
				</div>

				{/* Overlay */}
				<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40 z-10" />

				{/* Floating widgets */}
				<div
					className="absolute top-6 left-4 sm:top-8 sm:left-8 z-30 bg-white/85 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-white/60 w-[240px] sm:w-[260px]"
					style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#27261C" }}
				>
					<div className="flex items-center gap-2">
						<span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#FC611E]" />
						<p
							className="text-[11px] uppercase tracking-wider text-[#686766]"
							style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
						>
							Inner Line Permit
						</p>
					</div>
					<p
						className="mt-2 text-sm leading-snug"
						style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#353030" }}
					>
						Apply fast and travel with ease in Arunachal.
					</p>
					<p
						className="mt-1 text-xs text-[#686766]"
						style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
					>
						Required for entry. Instant guidance.
					</p>
					<Link
						href="/ilp"
						className="inline-flex mt-3 items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold bg-[#FC611E] text-[#27261C] hover:bg-[#f46a2f] transition-colors"
						style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 700 }}
					>
						Start ILP Application
					</Link>
				</div>
				<WeatherWidget />
				<TrekCard />

				{/* Hero text */}
				<div className="relative z-20 h-full flex flex-col justify-end px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
					<h1
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							fontSize: "clamp(32px, 8vw, 68px)",
							lineHeight: "clamp(40px, 9vw, 80px)",
							letterSpacing: "-0.06em",
							color: "#F6F6F6"
						}}
					>
						Journeys Designed For<br />
						Comfort And Connection.
					</h1>
				</div>
			</div>
		</div>
	);
};
export default HeroSection