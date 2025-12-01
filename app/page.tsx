"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WeatherCard from "@/components/WeatherCard";
import AboutSection from "@/components/AboutSection";
import ToursSection from "@/components/Tours";
import ActivityCarousel from "@/components/TouristActivity";
import DestinationsCarousel from "@/components/Destination";
import Memories from "@/components/Memories";
import Footer from "@/components/Footer";

export default function Home() {
	const weather = {
		location: "Tawang",
		temp: "22°C",
		condition: "Partly Cloudy",
		humidity: "58%",
	};

	const slides = [
		{ name: 'Tawang', image: 'https://images.unsplash.com/photo-1648963799017-e007d04df934?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'High alpine valleys, monasteries and rugged snowy ridgelines.' },
		{ name: 'Bomdila', image: 'https://images.unsplash.com/photo-1639134956623-0d094b12b0dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Terraced hills and snow-dusted peaks with rich cultural trails.' },
		{ name: 'Dirang', image: 'https://images.unsplash.com/photo-1668437824006-1be44600774b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'River valleys framed by pine forests and snowy summits.' },
		{ name: 'Dzuko', image: 'https://images.unsplash.com/photo-1648963798678-a921079b98b9?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Famous high-altitude meadows and cold-weather blooms beneath peaks.' },
		{ name: 'Tumjang', image: 'https://images.unsplash.com/photo-1672399447224-b63b8f67b44d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Remote snowy passes and wide panoramas for quiet hikes.' },
	];

	const [title, setTitle] = useState(slides[0].name);
	const [description, setDescription] = useState(slides[0].description || "");

	return (
		<main>
			<Hero
				slides={slides}
				onSlideChange={(s) => {
					if (s.name === title) return;
					setTitle(s.name);
					setDescription(s.description || "");
				}}
			>
				<Nav />

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

								<motion.p
									key={description}
									initial={{ opacity: 0, x: -24 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 24 }}
									transition={{ duration: 0.35, ease: "easeInOut" }}
									className="mt-3 italic text-base md:text-lg lg:text-xl text-white/80 leading-relaxed max-w-xl"
								>
									{description || 'where the first light kisses the mountains and prayers drift with the mist an echo of serenity woven into the heart of the Himalayas'}
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

				<div className="pb-16 z-10 flex justify-start pointer-events-auto">
					<div className="w-full container-wide">
						<WeatherCard
							weather={{
								location: weather.location,
								temp: weather.temp,
								condition: weather.condition,
								humidity: weather.humidity,
								wind: "5 kph",
								rain: "0%",
								aqi: "73",
							}}
						/>
					</div>
				</div>
			</Hero>

			<AboutSection />

			<ToursSection />

			<ActivityCarousel />

			<DestinationsCarousel />

			<Memories />

			<Footer />

		</main>
	);
}