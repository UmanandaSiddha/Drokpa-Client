"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { Tour } from "@/data/tours";
import { GreenStar } from "@/assets";
import Image from "next/image";

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

	const handleNext = () => {
		if (currentIndex < tours.length - 4) {
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

	return (
		<div className="pt-18" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<div className="mx-auto">

				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<h1 
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							fontSize: "32px",
							color: "#353030"
						}}
					>
						{title}
					</h1>

					<div className="flex gap-2">
						<button
							onClick={handlePrev}
							disabled={currentIndex === 0}
							className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
							style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
						>
							<ChevronLeft className="w-5 h-5 text-gray-700" />
						</button>

						<button
							onClick={handleNext}
							disabled={currentIndex >= tours.length - 4}
							className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-50"
							style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
						>
							<ChevronRight className="w-5 h-5 text-white" />
						</button>
					</div>
				</div>

				{/* Horizontal Line */}
				<div className="border-t border-gray-200 mb-4"></div>

				{/* Carousel */}
				<div className="relative overflow-hidden">
					<div
						className="flex gap-6"
						style={{ 
							transform: `translateX(calc(-${currentIndex} * ((100% - 4.5rem) / 4 + 1.5rem)))`,
							transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
							willChange: "transform"
						}}
					>
						{tours.map((tour) => (
							<div
								key={tour.id}
								className="flex-shrink-0 bg-white overflow-hidden"
								style={{ width: "calc((100% - 4.5rem) / 4)" }}
							>
								{/* Image */}
								<div className="relative h-56 overflow-hidden">
									<img
										src={tour.image}
										alt={tour.title}
										className="w-full h-full object-cover rounded-xl"
									/>

									{/* Duration Tag */}
									<div 
										className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-medium"
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
								<div className="pt-3 px-1" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}>
									{/* Title and Rating */}
									<div className="flex items-start justify-between mb-3 gap-2">
										<h3 
											className="text-xl font-bold flex-1"
											style={{ 
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 700,
												color: "#353030"
											}}
										>
											{tour.title}
										</h3>
										<div className="flex items-center gap-1 flex-shrink-0">
											<Image src={GreenStar} alt="Green Star" className="w-4 h-4" width={16} height={16} />
											<span 
												className="text-sm font-semibold"
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
										className="text-sm mb-4"
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
									<div className="flex flex-wrap gap-2 mb-4">
										{tour.features.map((feature, i) => (
											<span
												key={i}
												className="px-3 py-1 rounded-lg text-xs font-medium"
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
									<div className="flex items-baseline relative">
										<span 
											className="text-xl"
											style={{
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 500,
												color: "#27261C"
											}}
										>
											₹{tour.price.toLocaleString("en-IN")}/
										</span>
										<span 
											className="text-lg"
											style={{
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 500,
												color: "#27261C"
											}}
										>
											person
										</span>
										<span 
											className="text-md line-through ml-2"
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
												className="ml-2 px-2 py-1 rounded-sm text-sm font-normal text-white"
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
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
