"use client";

import { useEffect, useState } from "react";
import { HeroBg2 } from "@/assets";
import TrekCard from "./TrekCard";
import WeatherWidget from "./WeatherWidget";
import InnerLinePermitWidget from "./InnerLinePermitWidget";

const HeroSection = () => {
	const heroImages = [HeroBg2.src];
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
							key={index}
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
				<InnerLinePermitWidget className="hidden lg:block absolute top-8 left-8" />
				<WeatherWidget className="hidden lg:block absolute top-8 right-8" />
				<TrekCard className="hidden lg:block absolute bottom-8 right-8 w-80" />
				<div className="absolute top-6 right-4 z-30 hidden md:flex lg:hidden flex-col gap-4 w-[320px]">
					<WeatherWidget className="w-full" />
					<TrekCard className="w-full" />
				</div>
				<WeatherWidget className="absolute top-6 inset-x-4 z-30 md:hidden" />

				{/* Hero text */}
				<div className="relative z-20 h-full flex flex-col justify-end px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
					<h1
						className="text-[46px] sm:text-[52px] md:text-[56px] lg:text-[64px] xl:text-[76px] leading-[1.12] md:leading-[1.08] lg:leading-[1.05] tracking-[-0.06em] text-[#F6F6F6] font-bold"
						style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}
					>
						<span className="hidden lg:block">
							Journeys Designed For
							<br />
							Comfort And Connection.
						</span>
						<span className="hidden md:block lg:hidden">
							Journeys
							<br />
							Designed For Comfort
							<br />
							And Connection.
						</span>
						<span className="md:hidden">
							Journeys
							<br />
							Designed For
							<br />
							Comfort And
							<br />
							Connection.
						</span>
					</h1>
				</div>
			</div>
		</div>
	);
};
export default HeroSection