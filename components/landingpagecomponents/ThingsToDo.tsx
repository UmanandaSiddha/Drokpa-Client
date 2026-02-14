"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Things1, Things2, Things3, Things4 } from "@/assets";

interface Activity {
	id: number;
	title: string;
	image: string;
	badge?: string;
}

export default function ThingsToDo() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hoveredId, setHoveredId] = useState<number | null>(null);
	const [viewMode, setViewMode] = useState<"mobile" | "tablet" | "desktop">("desktop");

	useEffect(() => {
		const updateViewMode = () => {
			if (typeof window !== "undefined") {
				const width = window.innerWidth;
				if (width < 768) {
					setViewMode("mobile");
				} else if (width < 1024) {
					setViewMode("tablet");
				} else {
					setViewMode("desktop");
				}
			}
		};

		updateViewMode();
		window.addEventListener("resize", updateViewMode);
		return () => window.removeEventListener("resize", updateViewMode);
	}, []);

	const activities: Activity[] = [
		{
			id: 1,
			title: "Trekking",
			image: Things1.src,
			badge: "Adventure",
		},
		{
			id: 2,
			title: "Spiritual Places",
			image: Things2.src,
			badge: "Cultural",
		},
		{
			id: 3,
			title: "Wildlife Safaris",
			image: Things3.src,
			badge: "Nature",
		},
		{
			id: 4,
			title: "River Rafting",
			image: Things4.src,
			badge: "Adventure",
		},
	];

	const itemsPerView = viewMode === "desktop" ? 3 : 1;

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
	const translateX = `translateX(calc(-${currentIndex} * (${cardWidthPercent} + ${gap}rem)))`;

	const renderCard = (activity: Activity) => {
		const isHovered = hoveredId === activity.id;

		return (
			<div
				key={activity.id}
				onMouseEnter={() => setHoveredId(activity.id)}
				onMouseLeave={() => setHoveredId(null)}
				className="relative rounded-2xl overflow-hidden cursor-pointer group"
			>
				{viewMode !== "desktop" && (
					<Link
						href={`/activities?activity=${activity.id}`}
						aria-label={`Explore ${activity.title}`}
						className="absolute inset-0 z-10"
					/>
				)}
				{/* Image */}
				<div className="relative h-[280px] sm:h-[320px] md:h-[240px] lg:h-[420px]">
					<img
						src={activity.image}
						alt={activity.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>

					{/* Gradient Overlay (always visible) */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

					{/* Hover Overlay (black/blur) */}
					<div
						className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isHovered && viewMode === "desktop" ? "opacity-60" : "opacity-0"
							}`}
					/>

					{/* Content */}
					<div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-4 lg:p-6">
						{/* Center Hover Button - desktop only */}
						{viewMode === "desktop" && (
							<div className="absolute inset-0 flex items-center justify-center">
								<Link
									href={`/activities?activity=${activity.id}`}
									className={`px-4 sm:px-5 md:px-4 lg:px-6 py-2 sm:py-2.5 bg-white rounded-full text-xs sm:text-sm font-semibold text-gray-900 shadow-lg flex items-center gap-2 transition-all duration-300 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
										}`}
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
								>
									Explore {activity.title}
									<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
								</Link>
							</div>
						)}

						{/* Bottom Content */}
						<div className="flex items-end justify-between w-full">
							{/* Title */}
							<h3
								className={`text-lg sm:text-xl md:text-base lg:text-xl font-semibold text-white drop-shadow-lg transition-all duration-300 ${isHovered && viewMode === "desktop" ? "opacity-0 translate-y-2" : "opacity-100"
									}`}
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 500,
								}}
							>
								{activity.title}
							</h3>

							{/* Badge */}
							{activity.badge && (
								<div
									className={`transition-all duration-300 ${isHovered && viewMode === "desktop" ? "opacity-0 translate-y-2" : "opacity-100"
										}`}
								>
									<span
										className="px-3 md:px-2.5 lg:px-4 py-1.5 md:py-1 lg:py-2 bg-white/90 rounded-full text-xs font-semibold"
										style={{
											fontFamily: "var(--font-mona-sans), sans-serif",
											fontWeight: 600,
											color: "#27261C",
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
	};

	return (
		<div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 md:pb-16" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-0">

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
						Things To Do
					</h1>

					{/* Carousel controls - desktop only */}
					<div className={`flex gap-2 ${viewMode === "desktop" ? "" : "invisible"}`}>
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
				<div className="border-t border-gray-200 mb-4 sm:mb-6"></div>

				{/* Desktop: Carousel */}
				{viewMode === "desktop" && (
					<div className="relative overflow-hidden">
						<div
							className="flex gap-6"
							style={{
								transform: translateX,
								transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
								willChange: "transform",
							}}
						>
							{activities.map((activity) => (
								<div
									key={activity.id}
									className="flex-shrink-0"
									style={{ width: cardWidthPercent }}
								>
									{renderCard(activity)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Tablet: 2x2 Grid */}
				{viewMode === "tablet" && (
					<div className="grid grid-cols-2 gap-4 sm:gap-5">
						{activities.map((activity) => renderCard(activity))}
					</div>
				)}

				{/* Mobile: Vertical Stack */}
				{viewMode === "mobile" && (
					<div className="flex flex-col gap-4">
						{activities.map((activity) => renderCard(activity))}
					</div>
				)}
			</div>
		</div>
	);
}
