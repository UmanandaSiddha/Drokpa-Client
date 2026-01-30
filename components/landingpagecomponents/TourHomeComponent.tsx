"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { Tour } from "@/data/tours";
import { GreenStar } from "@/assets";
import Image from "next/image";
import Link from "next/link";

interface TourHomeComponentProps {
	tours: Tour[];
	title?: string;
}

export default function TourHomeComponent({
	tours,
	title,
}: TourHomeComponentProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [favorites, setFavorites] = useState<Set<number>>(new Set());
	const [itemsPerView, setItemsPerView] = useState(4);

	useEffect(() => {
		const updateItemsPerView = () => {
			if (typeof window !== "undefined") {
				const width = window.innerWidth;
				if (width < 768) {
					setItemsPerView(1); // Mobile
				} else if (width < 1024) {
					setItemsPerView(2); // Tablet
				} else {
					setItemsPerView(4); // Desktop
				}
			}
		};

		updateItemsPerView();
		window.addEventListener("resize", updateItemsPerView);
		return () => window.removeEventListener("resize", updateItemsPerView);
	}, []);

	const handleNext = () => {
		if (currentIndex < tours.length - itemsPerView) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const toggleFavorite = (id: number) => {
		setFavorites((prev) => {
			const updated = new Set(prev);
			updated.has(id) ? updated.delete(id) : updated.add(id);
			return updated;
		});
	};

	if (!tours?.length) return null;

	const gap = 1.5; // 1.5rem = 24px = gap-6
	const gapTotal = gap * (itemsPerView - 1);
	const cardWidthPercent = `calc((100% - ${gapTotal}rem) / ${itemsPerView})`;
	const translateX = `calc(-${currentIndex} * (${cardWidthPercent} + ${gap}rem))`;

	return (
		<div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 md:pb-16" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<div className="mx-auto px-4 sm:px-6 md:px-8">

				{/* Header */}
				<div className="flex items-center justify-between mb-4 sm:mb-6">
					<h1 
						className="text-xl sm:text-2xl md:text-3xl lg:text-[32px]"
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							color: "#353030"
						}}
					>
						{title}
					</h1>

					<div className="flex gap-2">
						<button
							onClick={handlePrev}
							disabled={currentIndex === 0}
							className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
							style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
						>
							<ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
						</button>

						<button
							onClick={handleNext}
							disabled={currentIndex >= tours.length - itemsPerView}
							className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-50"
							style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
						>
							<ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
						</button>
					</div>
				</div>

				{/* Horizontal Line */}
				<div className="border-t border-gray-200 mb-4 sm:mb-6"></div>

				{/* Carousel */}
				<div className="relative overflow-hidden">
					<div
						className="flex gap-6"
						style={{ 
							transform: translateX,
							transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
							willChange: "transform"
						}}
					>
						{tours.map((tour) => (
							<Link
								key={tour.id}
								href={title === "HomeStays" ? `/homestays/${tour.id}` : `/tours/${tour.id}`}
								className="flex-shrink-0 bg-white overflow-hidden"
								style={{ width: cardWidthPercent }}
							>
								{/* Image */}
								<div className="relative h-48 md:h-56 overflow-hidden">
									<img
										src={tour.image}
										alt={tour.title}
										className="w-full h-full object-cover rounded-xl"
									/>

									{/* Duration Tag */}
									<div 
										className="absolute top-3 left-3 md:top-4 md:left-4 px-2 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-xs font-medium"
										style={{
											backgroundColor: "rgba(255, 255, 255, 0.9)",
											fontFamily: "var(--font-mona-sans), sans-serif",
											fontWeight: 500,
											color: "#27261C"
										}}
									>
										{tour.duration}
									</div>

									{/* Heart Icon */}
									<button
										onClick={() => toggleFavorite(tour.id)}
										className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center hover:scale-110 transition"
									>
										<Heart
											className={`w-6 h-6 ${favorites.has(tour.id)
													? "fill-red-500 text-red-500"
													: "fill-gray-500 text-gray-400"
												}`}
										/>
									</button>
								</div>

								{/* Content */}
								<div className="pt-2 md:pt-3 px-1" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}>
									{/* Title and Rating */}
									<div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
										<h3 
											className="text-base md:text-lg lg:text-xl font-bold flex-1"
											style={{ 
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 700,
												color: "#353030"
											}}
										>
											{tour.title}
										</h3>
										<div className="flex items-center gap-1 flex-shrink-0">
											<Image src={GreenStar} alt="Green Star" className="w-3 h-3 md:w-4 md:h-4" width={16} height={16} />
											<span 
												className="text-xs md:text-sm font-semibold"
												style={{ 
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 600,
													color: "#686766"
												}}
											>
												{tour.rating}
											</span>
										</div>
									</div>

									{/* Description */}
									<p 
										className="text-xs md:text-sm mb-3 md:mb-4 line-clamp-2"
										style={{ 
											fontFamily: "var(--font-mona-sans), sans-serif",
											fontWeight: 400,
											color: "#686766",
											lineHeight: "20px"
										}}
									>
										{tour.description}
									</p>

									{/* Activity Tags */}
									<div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
										{tour.features.map((feature, i) => (
											<span
												key={i}
												className="px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[10px] md:text-xs font-medium"
												style={{
													backgroundColor: "#F5F5F5",
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 500,
													color: "#686766"
												}}
											>
												{feature}
											</span>
										))}
									</div>

									{/* Price Section */}
									<div className="flex items-baseline relative flex-wrap gap-1">
										<span 
											className="text-lg md:text-xl"
											style={{
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 500,
												color: "#27261C"
											}}
										>
											₹{tour.price.toLocaleString("en-IN")}/
										</span>
										<span 
											className="text-sm md:text-lg"
											style={{
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 500,
												color: "#27261C"
											}}
										>
											person
										</span>
										<span 
											className="text-xs md:text-base line-through ml-1 md:ml-2"
											style={{
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 400,
												color: "#27261C"
											}}
										>
											₹{tour.originalPrice.toLocaleString("en-IN")}
										</span>
										{tour.discount && (
											<div 
												className="ml-1 md:ml-2 px-1.5 py-0.5 md:px-2 md:py-1 rounded-sm text-xs md:text-sm font-normal text-white"
												style={{
													backgroundColor: "#008C4D",
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 700
												}}
											>
												{tour.discount}
											</div>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
