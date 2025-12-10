"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	MapPin,
	Star,
	Wifi,
	Car,
	Coffee,
	Mountain,
	Users,
	Phone,
	Mail,
	Heart,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { homestays, locations, HomestayType } from "@/data/homestays";

const Homestays: React.FC = () => {
	const router = useRouter();
	const [selectedLocation, setSelectedLocation] = useState<string>("all");
	const [favorites, setFavorites] = useState<number[]>([]);
	const [mobileIndex, setMobileIndex] = useState(0);
	const [isAutoPlayMobile, setIsAutoPlayMobile] = useState(true);
	const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
	const mobileTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const carouselRefMobile = useRef<HTMLDivElement>(null);

	const getAmenityIcon = (amenity: string) => {
		switch (amenity.toLowerCase()) {
			case "wifi":
				return <Wifi className="w-4 h-4" />;
			case "parking":
			case "car":
				return <Car className="w-4 h-4" />;
			case "meals":
			case "organic food":
			case "local cuisine":
			case "organic meals":
				return <Coffee className="w-4 h-4" />;
			case "mountain view":
			case "valley view":
				return <Mountain className="w-4 h-4" />;
			default:
				return <Users className="w-4 h-4" />;
		}
	};

	const filteredHomestays =
		selectedLocation === "all"
			? homestays
			: homestays.filter((homestay) => homestay.location === selectedLocation);

	const toggleFavorite = (id: number) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
		);
	};

	const handleHomestayClick = (homestayId: number) => {
		router.push(`/homestays/${homestayId}`);
	};

	// Mobile carousel autoplay
	useEffect(() => {
		if (!isAutoPlayMobile || filteredHomestays.length <= 1) {
			if (mobileTimerRef.current) clearInterval(mobileTimerRef.current);
			return;
		}

		if (mobileTimerRef.current) clearInterval(mobileTimerRef.current);
		mobileTimerRef.current = setInterval(() => {
			setMobileIndex((prev) => (prev + 1) % filteredHomestays.length);
		}, 5000);

		return () => {
			if (mobileTimerRef.current) clearInterval(mobileTimerRef.current);
		};
	}, [isAutoPlayMobile, filteredHomestays.length]);

	const handleMobilePrev = () => {
		setIsAutoPlayMobile(false);
		setAnimationDirection('left');
		setMobileIndex((prev) => (prev === 0 ? filteredHomestays.length - 1 : prev - 1));
	};

	const handleMobileNext = () => {
		setIsAutoPlayMobile(false);
		setAnimationDirection('right');
		setMobileIndex((prev) => (prev + 1) % filteredHomestays.length);
	};

	return (
		<div className="w-full bg-linear-to-br from-gray-50 to-white py-12 md:py-16 lg:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-10 md:mb-12">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
						Authentic <span className="text-(--brand-green)">Homestays</span>
					</h2>
					<p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
						Stay with local families and experience the warmth of Arunachal hospitality
					</p>
				</div>

				{/* Desktop Grid */}
				<div className="mt-10 hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					{filteredHomestays.map((homestay) => (
						<div
							key={homestay.id}
							onClick={() => handleHomestayClick(homestay.id)}
							className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 cursor-pointer"
						>
							<div className="relative overflow-hidden">
								<img
									src={homestay.image}
									alt={homestay.name}
									className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
								/>
								{homestay.featured && (
									<div className="absolute top-4 left-4 bg-(--brand-green) text-white px-3 py-1 rounded-full text-xs font-semibold">
										Featured
									</div>
								)}
								<button
									onClick={(e) => {
										e.stopPropagation();
										toggleFavorite(homestay.id);
									}}
									className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300"
								>
									<Heart
										className={`w-5 h-5 ${favorites.includes(homestay.id)
											? "fill-red-500 text-red-500"
											: "text-gray-600"
											}`}
									/>
								</button>
								<div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
									<MapPin className="w-3 h-3" />
									{locations.find((loc) => loc.id === homestay.location)?.name}
								</div>
							</div>

							<div className="p-4 md:p-6">
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-(--brand-green) transition-colors">
										{homestay.name}
									</h3>
									<div className="text-right">
										<div className="text-lg md:text-xl font-bold text-(--brand-green)">
											{homestay.price}
										</div>
										<div className="text-xs text-gray-500">per night</div>
									</div>
								</div>

								<div className="flex items-center gap-2 mb-3">
									<div className="flex items-center gap-1">
										<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
										<span className="font-semibold text-gray-900">
											{homestay.rating}
										</span>
									</div>
									<span className="text-sm text-gray-500">
										({homestay.reviews} reviews)
									</span>
								</div>

								<p className="text-gray-600 text-sm mb-4 leading-relaxed">
									{homestay.description}
								</p>

								<div className="flex flex-wrap gap-2 mb-4">
									{homestay.amenities.slice(0, 4).map((amenity, index) => (
										<div
											key={index}
											className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
										>
											{getAmenityIcon(amenity)}
											<span>{amenity}</span>
										</div>
									))}
								</div>

								<div className="border-t pt-4 mb-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-900">
												Hosted by {homestay.host}
											</p>
											<div className="flex items-center gap-3 mt-1">
												<a
													href={`tel:${homestay.contact.phone}`}
													onClick={(e) => e.stopPropagation()}
													className="flex items-center gap-1 text-xs text-(--brand-green) hover:underline"
												>
													<Phone className="w-3 h-3" />
													Call
												</a>
												<a
													href={`mailto:${homestay.contact.email}`}
													onClick={(e) => e.stopPropagation()}
													className="flex items-center gap-1 text-xs text-(--brand-green) hover:underline"
												>
													<Mail className="w-3 h-3" />
													Email
												</a>
											</div>
										</div>
									</div>
								</div>

								<button
									onClick={(e) => {
										e.stopPropagation();
										handleHomestayClick(homestay.id);
									}}
									className="w-full bg-(--brand-green) text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
								>
									View Details
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Mobile Carousel */}
				<div
					className="mt-10 md:hidden relative"
					onMouseEnter={() => setIsAutoPlayMobile(false)}
					onMouseLeave={() => setIsAutoPlayMobile(true)}
					ref={carouselRefMobile}
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={mobileIndex}
							initial={{
								opacity: 0,
								x: animationDirection === 'left' ? -50 : 50
							}}
							animate={{ opacity: 1, x: 0 }}
							exit={{
								opacity: 0,
								x: animationDirection === 'left' ? 50 : -50
							}}
							transition={{ duration: 0.5 }}
							className="bg-white rounded-2xl shadow-lg overflow-hidden"
						>
							{filteredHomestays.length > 0 && (
								<div>
									<div className="relative">
										<img
											src={filteredHomestays[mobileIndex].image}
											alt={filteredHomestays[mobileIndex].name}
											className="w-full h-48 sm:h-64 object-cover"
										/>
										<button
											onClick={handleMobilePrev}
											className="absolute z-10 top-1/2 left-2 p-2 bg-black/50 rounded-full hover:bg-gray-100 transition-colors"
											aria-label="Previous homestay"
										>
											<ChevronLeft className="w-6 h-6 text-white" />
										</button>
										<button
											onClick={handleMobileNext}
											className="absolute z-10 top-1/2 right-2 p-2 bg-black/50 rounded-full hover:bg-gray-100 transition-colors"
											aria-label="Next homestay"
										>
											<ChevronRight className="w-6 h-6 text-white" />
										</button>
										{filteredHomestays[mobileIndex].featured && (
											<div className="absolute top-3 left-3 bg-(--brand-green) text-white px-3 py-1 rounded-full text-xs font-semibold">
												Featured
											</div>
										)}
										<button
											onClick={() => toggleFavorite(filteredHomestays[mobileIndex].id)}
											className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300"
										>
											<Heart
												className={`w-5 h-5 ${favorites.includes(filteredHomestays[mobileIndex].id)
													? "fill-red-500 text-red-500"
													: "text-gray-600"
													}`}
											/>
										</button>
										<div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
											<MapPin className="w-4 h-4" />
											{locations.find((loc) => loc.id === filteredHomestays[mobileIndex].location)?.name}
										</div>
									</div>
									<div className="p-4">
										<div className="flex justify-between items-start mb-2">
											<h3 className="text-lg font-bold text-gray-900">
												{filteredHomestays[mobileIndex].name}
											</h3>
											<div className="text-right">
												<div className="text-lg font-bold text-(--brand-green)">
													{filteredHomestays[mobileIndex].price}
												</div>
												<div className="text-xs text-gray-500">per night</div>
											</div>
										</div>

										<div className="flex items-center gap-2 mb-2">
											<div className="flex items-center gap-1">
												<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												<span className="font-semibold text-gray-900">
													{filteredHomestays[mobileIndex].rating}
												</span>
											</div>
											<span className="text-sm text-gray-500">
												({filteredHomestays[mobileIndex].reviews} reviews)
											</span>
										</div>

										<p className="text-gray-600 text-sm mb-3 leading-relaxed">
											{filteredHomestays[mobileIndex].description}
										</p>

										<div className="flex flex-wrap gap-2 mb-3">
											{filteredHomestays[mobileIndex].amenities.slice(0, 3).map((amenity, index) => (
												<div
													key={index}
													className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700"
												>
													{getAmenityIcon(amenity)}
													<span>{amenity}</span>
												</div>
											))}
										</div>

										<button
											onClick={() => handleHomestayClick(filteredHomestays[mobileIndex].id)}
											className="w-full bg-(--brand-green) text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 mb-3"
										>
											View Details
										</button>

									</div>
								</div>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default Homestays;
