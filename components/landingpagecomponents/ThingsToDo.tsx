"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Activity {
	id: number;
	title: string;
	image: string;
	badge?: string;
}

export default function ThingsToDo() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hoveredId, setHoveredId] = useState<number | null>(null);
	const [itemsPerView, setItemsPerView] = useState(3);

	useEffect(() => {
		const updateItemsPerView = () => {
			if (typeof window !== "undefined") {
				const width = window.innerWidth;
				if (width < 768) {
					setItemsPerView(1); // Mobile
				} else if (width < 1024) {
					setItemsPerView(2); // Tablet
				} else {
					setItemsPerView(3); // Desktop
				}
			}
		};

		updateItemsPerView();
		window.addEventListener("resize", updateItemsPerView);
		return () => window.removeEventListener("resize", updateItemsPerView);
	}, []);

	const activities: Activity[] = [
		{
			id: 1,
			title: "Trekking",
			image:
				"https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
			badge: "Adventure",
		},
		{
			id: 2,
			title: "Spiritual Places",
			image:
				"https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
			badge: "Adventure",
		},
		{
			id: 3,
			title: "Wildlife Safaris",
			image:
				"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop",
			badge: "Adventure",
		},
		{
			id: 4,
			title: "River Rafting",
			image:
				"https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
			badge: "Adventure",
		},
	];

	const handleNext = () => {
		if (currentIndex < activities.length - itemsPerView) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const gap = 1.5; // 1.5rem = 24px = gap-6
	const gapTotal = gap * (itemsPerView - 1);
	const cardWidthPercent = `calc((100% - ${gapTotal}rem) / ${itemsPerView})`;
	const translateX = `calc(-${currentIndex} * (${cardWidthPercent} + ${gap}rem))`;

	return (
		<div className="pt-16 md:pt-24" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<div className="mx-auto">

				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<h1
						className="text-2xl md:text-3xl lg:text-[32px]"
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							color: "#353030"
						}}
					>
						Things To Do
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
							disabled={currentIndex >= activities.length - itemsPerView}
							className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-50"
							style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
						>
							<ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
							transform: translateX,
							transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
							willChange: "transform"
						}}
					>
						{activities.map((activity) => {
							const isHovered = hoveredId === activity.id;

							return (
								<div
									key={activity.id}
									onMouseEnter={() => setHoveredId(activity.id)}
									onMouseLeave={() => setHoveredId(null)}
									className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
									style={{ width: cardWidthPercent, fontFamily: "var(--font-mona-sans), sans-serif" }}
								>
									{/* Image */}
									<div className="relative h-[300px] md:h-[380px] lg:h-[420px]">
										<img
											src={activity.image}
											alt={activity.title}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>

										{/* Gradient Overlay (always visible) */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

										{/* Hover Overlay (black/blur) */}
										<div 
											className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
												isHovered ? "opacity-60" : "opacity-0"
											}`}
										/>

										{/* Content */}
										<div className="absolute inset-0 flex flex-col justify-end p-6">

											{/* Center Hover Button */}
											<div className="absolute inset-0 flex items-center justify-center">
												<button
													className={`px-6 py-3 bg-white rounded-full text-sm font-semibold text-gray-900 shadow-lg flex items-center gap-2 transition-all duration-300 ${
														isHovered
															? "opacity-100 scale-100"
															: "opacity-0 scale-95 pointer-events-none"
													}`}
													style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
												>
													Explore {activity.title}
													<ChevronRight className="w-4 h-4" />
												</button>
											</div>

											{/* Bottom Content */}
											<div className="flex items-end justify-between w-full">
												{/* Title */}
												<h3 
													className={`text-xl font-semibold text-white drop-shadow-lg transition-all duration-300 ${
														isHovered ? "opacity-0 translate-y-2" : "opacity-100"
													}`}
													style={{ 
														fontFamily: "var(--font-subjectivity), sans-serif",
														fontWeight: 500
													}}
												>
													{activity.title}
												</h3>

												{/* Badge */}
												{activity.badge && (
													<div 
														className={`transition-all duration-300 ${
															isHovered ? "opacity-0 translate-y-2" : "opacity-100"
														}`}
													>
														<span 
															className="px-4 py-2 bg-white/90 rounded-full text-xs font-semibold"
															style={{ 
																fontFamily: "var(--font-mona-sans), sans-serif",
																fontWeight: 600,
																color: "#27261C"
															}}
														>
															{activity.badge}
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
