"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, Clock } from "lucide-react";

interface Destination {
	id: number;
	name: string;
	location: string;
	image: string;
	rating: number;
	duration: string;
	price: string;
	description: string;
	highlights: string[];
}

const DestinationsCarousel: React.FC = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [internalIndex, setInternalIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const trackRef = React.useRef<HTMLDivElement | null>(null);
	const [isTransitioning, setIsTransitioning] = useState(true);
	const [hoverSide, setHoverSide] = useState<null | "left" | "right">(null);

	const destinations: Destination[] = [
		{
			id: 1,
			name: "Tawang Monastery",
			location: "Tawang, Arunachal Pradesh",
			image:
				"https://as2.ftcdn.net/v2/jpg/02/89/78/09/1000_F_289780977_ddR62UNRz65v851cAlWkISM30XpCSjTv.jpg",
			rating: 4.8,
			duration: "3-4 days",
			price: "₹X,000",
			description:
				"Experience the spiritual serenity of one of India's largest monasteries",
			highlights: [
				"Buddhist Culture",
				"Mountain Views",
				"Ancient Architecture",
			],
		},
		{
			id: 2,
			name: "Sela Pass",
			location: "Tawang, Arunachal Pradesh",
			image:
				"https://as2.ftcdn.net/v2/jpg/07/73/26/11/1000_F_773261187_obGCeDXM5AWGCJVs5Ji0CiXNzMzxPgVo.jpg",
			rating: 4.9,
			duration: "2-3 days",
			price: "₹X,000",
			description: "Journey through breathtaking high-altitude mountain passes",
			highlights: ["Snow Peaks", "Alpine Lakes", "Adventure"],
		},
		{
			id: 3,
			name: "Bumla Pass",
			location: "Tawang, Arunachal Pradesh",
			image:
				"https://as1.ftcdn.net/v2/jpg/03/32/30/44/1000_F_332304458_8BEoi8CzerJDKcFXAvQwh6ccPBgjftRd.jpg",
			rating: 4.7,
			duration: "1-2 days",
			price: "₹X,000",
			description:
				"Visit the historic Indo-China border with stunning valley views",
			highlights: [
				"Border Tourism",
				"Historical Significance",
				"Scenic Beauty",
			],
		},
		{
			id: 4,
			name: "Madhuri Lake",
			location: "Tawang, Arunachal Pradesh",
			image:
				"https://as2.ftcdn.net/v2/jpg/07/38/88/69/1000_F_738886983_YwzBgr7BWErqU5xr3LGaEm7W0aYlYAnn.jpg",
			rating: 4.6,
			duration: "2-3 days",
			price: "₹X,000",
			description:
				"Crystal clear alpine lake surrounded by snow-capped mountains",
			highlights: ["Pristine Nature", "Photography", "Tranquility"],
		},
		{
			id: 5,
			name: "Dirang Valley",
			location: "West Kameng, Arunachal Pradesh",
			image:
				"https://as1.ftcdn.net/v2/jpg/03/31/10/96/1000_F_331109677_ygW0RGH0zNaB2iIrQGrtKXcmqw9nzTOo.jpg",
			rating: 4.5,
			duration: "3-4 days",
			price: "₹X,000",
			description:
				"Explore traditional villages and hot springs in scenic valleys",
			highlights: ["Hot Springs", "Local Culture", "Apple Orchards"],
		},
		{
			id: 6,
			name: "Jung Waterfall",
			location: "Tawang, Arunachal Pradesh",
			image:
				"https://as1.ftcdn.net/v2/jpg/03/05/23/46/1000_F_305234611_W2dYUGyiTeOFgYHTguEZpewbHzHLYTXv.jpg",
			rating: 4.5,
			duration: "1 day",
			price: "₹X,000",
			description:
				"Visit the breathtaking Jung Waterfall, surrounded by lush forests and serene landscapes. Perfect for nature lovers and photography enthusiasts.",
			highlights: ["Scenic Waterfall", "Trekking Trails", "Nature Photography"],
		},
		{
			id: 7,
			name: "Mago",
			location: "Tawang, Arunachal Pradesh",
			image:
				"https://as2.ftcdn.net/v2/jpg/17/72/71/37/1000_F_1772713747_RvLidj3YQSkvhumBb6NyKBzMXUWWQXgA.jpg",
			rating: 4.5,
			duration: "1 day",
			price: "₹X,000",
			description:
				"Explore the serene Mago area, home to the historic Mago Monastery and surrounded by pristine rivers and lush greenery. Ideal for spiritual seekers and nature lovers alike.",
			highlights: ["Mago Monastery", "Riverside Views", "Nature Walks"],
		},
	];

	useEffect(() => {
		if (!isAutoPlaying) return;
		const interval = setInterval(() => {
			setInternalIndex((prev) => prev + 1);
		}, 4000);

		return () => clearInterval(interval);
	}, [isAutoPlaying]);

	const slides = [...destinations, destinations[0]];

	useEffect(() => {
		if (internalIndex < destinations.length) {
			setCurrentIndex(internalIndex);
		}
	}, [internalIndex, destinations.length]);

	useEffect(() => {
		const node = trackRef.current;
		if (!node) return;
		const handler = () => {
			if (internalIndex === destinations.length) {
				setIsTransitioning(false);
				setInternalIndex(0);
				requestAnimationFrame(() => {
					requestAnimationFrame(() => setIsTransitioning(true));
				});
			}
		};
		node.addEventListener("transitionend", handler);
		return () => node.removeEventListener("transitionend", handler);
	}, [internalIndex, destinations.length]);

	const goToSlide = (index: number) => {
		setInternalIndex(index);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	const goToPrevious = () => {
		const next =
			currentIndex === 0 ? destinations.length - 1 : currentIndex - 1;
		setInternalIndex(next);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	const goToNext = () => {
		setInternalIndex((prev) => prev + 1);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = e.currentTarget as HTMLDivElement;
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		setHoverSide(x < rect.width / 2 ? "left" : "right");
	};

	const onMouseLeaveWrapper = () => setHoverSide(null);

	useEffect(() => {
		const handleVisibility = () => {
			if (document.hidden) {
				setIsAutoPlaying(false);
			} else {
				setIsTransitioning(false);
				setInternalIndex(0);

				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setIsTransitioning(true);
						setIsAutoPlaying(true);
					});
				});
			}
		};

		document.addEventListener("visibilitychange", handleVisibility);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibility);
	}, []);

	useEffect(() => {
		if (internalIndex > destinations.length) {
			setInternalIndex(0);
		}
	}, [internalIndex]);

	useEffect(() => {
		const onFocus = () => {
			setIsTransitioning(false);
			setTimeout(() => setIsTransitioning(true), 50);
		};

		window.addEventListener("focus", onFocus);
		return () => window.removeEventListener("focus", onFocus);
	}, []);

	return (
		<section className="w-full py-12 lg:py-16 relative overflow-hidden bg-linear-to-b from-white via-[rgba(0,82,70,0.06)] to-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-24">
				{/* Section Header */}
				<div className="text-center mb-8 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						Top <span className="text-(--brand-green)">Destinations</span>
					</h2>
					<p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
						Discover the most breathtaking places in Arunachal Pradesh
					</p>
				</div>

				{/* Carousel */}
				<div
					className="relative"
					onMouseMove={onMouseMove}
					onMouseLeave={onMouseLeaveWrapper}
				>
					<div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
						<div
							ref={trackRef}
							className="flex"
							style={{
								transform: `translateX(-${internalIndex * 100}%)`,
								transition: isTransitioning
									? "transform 700ms ease-in-out"
									: "none",
							}}
						>
							{slides.map((destination, idx) => (
								<Slide
									key={idx + "-" + destination.id}
									destination={destination}
									onHoverStart={() => setIsAutoPlaying(false)}
									onHoverEnd={() => setIsAutoPlaying(true)}
								/>
							))}
						</div>
					</div>

					{/* Arrows */}
					<button
						onClick={goToPrevious}
						className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white transition-transform duration-300 hover:scale-125 opacity-100 pointer-events-auto"
						aria-label="Previous destination"
					>
						<span className="bg-black/40 p-2 rounded-full inline-flex">
							<ChevronLeft
								className="w-6 h-6 sm:w-7 sm:h-7 text-white"
								strokeWidth={2.5}
							/>
						</span>
					</button>

					<button
						onClick={goToNext}
						className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white transition-transform duration-300 hover:scale-125 opacity-100 pointer-events-auto"
						aria-label="Next destination"
					>
						<span className="bg-black/40 p-2 rounded-full inline-flex">
							<ChevronRight
								className="w-6 h-6 sm:w-7 sm:h-7 text-white"
								strokeWidth={2.5}
							/>
						</span>
					</button>

					{/* Dots */}
					<div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex gap-2">
						{destinations.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								aria-label={`Go to slide ${index + 1}`}
								style={{ width: 6, height: 6 }}
								className={`rounded-full transition-all duration-300 ${index === currentIndex
									? "bg-(--brand-green) scale-110"
									: "bg-white/60 hover:bg-white"
									}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

type SlideProps = {
	destination: Destination;
	onHoverStart?: () => void;
	onHoverEnd?: () => void;
};

const Slide: React.FC<SlideProps> = ({
	destination,
	onHoverStart,
	onHoverEnd,
}) => {
	const [showDescription, setShowDescription] = useState(false);

	return (
		<div
			className="w-full shrink-0 relative group"
			onMouseEnter={() => onHoverStart && onHoverStart()}
			onMouseLeave={() => onHoverEnd && onHoverEnd()}
		>
			<div className="relative h-100 sm:h-125 lg:h-150 overflow-hidden rounded-2xl bg-[#05231e]">
				<img
					src={destination.image}
					alt={destination.name}
					loading="lazy"
					className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
			</div>

			<div
				className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-12 text-white"
				onClick={() => {
					if (window.innerWidth < 640) setShowDescription(!showDescription);
				}}
			>
				<div className="max-w-2xl">
					<div className="transform transition-transform duration-700 ease-in-out group-hover:delay-100">
						<h3 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
							{destination.name}
						</h3>

						<p className="text-sm sm:text-xl mb-3 sm:mb-4 leading-relaxed opacity-90 truncate">
							{destination.description}
						</p>
					</div>

					<div
						className={`${showDescription
							? "max-h-200 opacity-100 translate-y-0"
							: "max-h-0 opacity-0 translate-y-3"
							} group-hover:max-h-200 group-hover:opacity-100 group-hover:translate-y-0 overflow-hidden transition-all duration-700 ease-in-out`}
					>
						<div
							className={`${showDescription
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-3"
								} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-in-out flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4`}
						>
							<div className="flex items-center gap-1 bg-white/20 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
								<Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
								<span className="font-semibold">{destination.rating}</span>
							</div>

							<div className="flex items-center gap-1 bg-white/20 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
								<Clock className="w-3 h-3 sm:w-4 sm:h-4" />
								<span>{destination.duration}</span>
							</div>

							<div className="bg-(--brand-green) rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold">
								{destination.price}
							</div>
						</div>

						<div
							className={`${showDescription
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-3"
								} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-in-out flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6`}
						>
							{destination.highlights.map((highlight, index) => (
								<span
									key={index}
									className="bg-white/10 border border-white/20 rounded-full px-2 py-0.5 text-xs sm:text-sm"
								>
									{highlight}
								</span>
							))}
						</div>

						<button
							className={`${showDescription
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-3"
								} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-in-out bg-white text-(--brand-green) font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-100 transform hover:scale-105 shadow-lg text-sm sm:text-base`}
						>
							Explore Now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DestinationsCarousel;
