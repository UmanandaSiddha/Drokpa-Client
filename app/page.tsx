"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import WeatherCard from "@/components/WeatherCard";
import AboutSection from "@/components/AboutSection";
import ToursSection from "@/components/Tours";
import ActivityCarousel from "@/components/TouristActivity";
import DestinationsCarousel from "@/components/Destination";
import Memories from "@/components/Memories";
// import Footer from "@/components/Footer";
import FacilitiesSection from "@/components/FacilitiesSection";
import Homestays from "@/components/Homestays";
import LetterFromArunachal from "@/components/LetterFromArunachal";
import LetterCTA from "@/components/CTA";
// import Nav from "@/components/Nav";

export default function Home() {
	const [title, setTitle] = useState(slides[0].name);
	const [description, setDescription] = useState(slides[0].description || "");

	return (
		<main className="data-scroll-container overflow-x-hidden">
			<Hero
				slides={slides}
				onSlideChange={(s) => {
					if (s.name === title) return;
					setTitle(s.name);
					setDescription(s.description || "");
				}}
			>
				{/* <Nav transition={true} /> */}

				<div className="flex-1 flex items-center">
					<div className="container-wide mx-auto text-white z-10">
						<div className="max-w-3xl">
							<AnimatePresence mode="wait">
								<motion.h1
									key={title}
									initial={{ opacity: 0, x: -48 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 48 }}
									transition={{ duration: 0.45, ease: "easeInOut" }}
									className="text-5xl md:text-[96px] lg:text-[140px] font-semibold leading-tight tracking-tight drop-shadow-lg"
								>
									{title}
								</motion.h1>
							</AnimatePresence>

							<AnimatePresence mode="wait">
								<motion.p
									key={description}
									initial={{ opacity: 0, x: -24 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 24 }}
									transition={{ duration: 0.35, ease: "easeInOut" }}
									className="mt-3 italic text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-xl"
								>
									{description ||
										"where the first light kisses the mountains and prayers drift with the mist an echo of serenity woven into the heart of the Himalayas"}
								</motion.p>
							</AnimatePresence>

							<div className="mt-8 max-w-lg">
								<div className="flex gap-2 items-center bg-white/10 backdrop-blur rounded-lg p-1">
									<input
										className="flex-1 bg-transparent placeholder-white/80 text-white p-3 rounded-md outline-none"
										placeholder="Search for a place, city or activity"
									/>
									<button className="bg-white text-(--brand-green) px-4 py-2 rounded-md font-semibold">
										Search
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="pb-16 z-5 flex pointer-events-auto">
					<div className="container-wide mx-auto text-white z-10">
						<div className="max-w-3xl">
							<WeatherCard place={title} />
						</div>
					</div>
				</div>
			</Hero>

			<section className="data-scroll-section">
				<AboutSection />
			</section>

			<section className="data-scroll-section">
				<ToursSection />
			</section>

			<ActivityCarousel />

			<Homestays />

			<DestinationsCarousel />

			<FacilitiesSection />

			<Memories />

			<LetterFromArunachal/>

			<LetterCTA/>
			
			{/* <Footer /> */}
		</main>
	);
}
