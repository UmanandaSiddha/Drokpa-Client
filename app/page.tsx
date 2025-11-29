"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WeatherCard from "@/components/WeatherCard";
import AboutSection from "@/components/AboutSection";
import ActivityCarousel from "@/components/TouristActivity";

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
	const [isFading, setIsFading] = useState(false);

	return (
		<main>
			<Hero slides={slides} onSlideChange={(s) => {
				if (s.name === title) return;
				setIsFading(true);
				setTimeout(() => {
					setTitle(s.name);
					setDescription(s.description || "");
					setIsFading(false);
				}, 350);
			}}>
				<Nav />

				<div className="flex-1 flex items-center">
					<div className="container-wide mx-auto text-white z-10">
						<div className="max-w-3xl">
							<h1 className={`text-5xl md:text-[120px] lg:text-[200px] font-semibold leading-tight drop-shadow-lg transition-transform duration-500 ease-in-out ${isFading ? 'opacity-0 -translate-x-6' : 'opacity-100 translate-x-0'}`}>
								{title}
							</h1>
							<p className={`mt-2 italic text-lg md:text-xl text-white/80 transition-transform duration-500 ease-in-out ${isFading ? 'opacity-0 -translate-x-3' : 'opacity-100 translate-x-0'}`}>
								{description || 'where the first light kisses the mountains and prayers drift with the mist an echo of serenity woven into the heart of the Himalayas'}
							</p>

							<div className="mt-8 max-w-lg">
								<div className="flex gap-2 items-center bg-white/10 backdrop-blur rounded-lg p-1">
									<input
										className="flex-1 bg-transparent placeholder-white/80 text-white p-3 rounded-md outline-none"
										placeholder="Search for a place, city or activity"
									/>
									<button className="bg-white text-black px-4 py-2 rounded-md font-semibold">
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

			<ActivityCarousel />
		</main>
	);
}