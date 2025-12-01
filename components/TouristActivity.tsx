"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface Activity {
	id: number;
	title: string;
	image: string;
	shortInfo: string;
	details: string;
}

const activities: Activity[] = [
	{
		id: 1,
		title: "Monastery Walk",
		image: "https://images.unsplash.com/photo-1605904583059-7880dad25595?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		shortInfo: "Explore sacred monasteries.",
		details:
			"Experience the peaceful aura of ancient monasteries, interact with monks, and learn about Buddhist philosophy.",
	},
	{
		id: 2,
		title: "Mountain Trek",
		image: "https://plus.unsplash.com/premium_photo-1677002259522-111b3e74786f?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		shortInfo: "Explore scenic trails.",
		details:
			"Journey through breathtaking landscapes, lush forests, and serene mountain paths, perfect for nature lovers.",
	},
	{
		id: 3,
		title: "Traditional Paper Making",
		image: "https://images.unsplash.com/photo-1719563014708-85b38508ee52?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		shortInfo: "Witness local traditions.",
		details:
			"Watch artisans craft handmade paper using ancient techniques passed down through generations.",
	},
	{
		id: 4,
		title: "Cultural Program",
		image: "https://images.unsplash.com/photo-1584137283390-2284026dc0e0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		shortInfo: "Celebrate culture and tradition.",
		details:
			"Enjoy vibrant performances that bring local folklore and traditional costumes to life.",
	},
	{
		id: 5,
		title: "The Mago Trek",
		image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		shortInfo: "Soar above the landscapes.",
		details:
			"Take in panoramic views from above during a peaceful sunrise hot air balloon ride.",
	},
	{
		id: 6,
		title: "Photowalk Through Village",
		image: "https://images.unsplash.com/photo-1745389501846-847843861794?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		shortInfo: "Peaceful and Heart Soothing Villages.",
		details:
			"Navigate exciting Villages and Explore the Things You have never seen.",
	},
	{
		id: 7,
		title: "Local Market Tour",
		image: "https://images.unsplash.com/photo-1728819748487-817bf96f4dba?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		shortInfo: "Taste /Dress and shop Local.",
		details:
			"Explore bustling markets filled with handicrafts, spices, and delicious street local food.",
	},
];

const ActivityCarousel: React.FC = () => {
	const carouselRefDesktop = useRef<HTMLDivElement>(null);
	const carouselRefMobile = useRef<HTMLDivElement>(null);
	const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
	const [isPaused, setIsPaused] = useState(false);
	const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [activeCardId, setActiveCardId] = useState<number | null>(null);

	const [wishlistModal, setWishlistModal] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
		null
	);
	const [wishlistName, setWishlistName] = useState("");

	const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
		if (ref.current) {
			const cardWidth = ref.current.firstElementChild?.clientWidth || 0;
			ref.current.scrollBy({
				left: -cardWidth - 24,
				behavior: "smooth",
			});
			setCurrentIndex((i) => (i - 1 + activities.length) % activities.length);
		}
	};

	const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
		if (ref.current) {
			const cardWidth = ref.current.firstElementChild?.clientWidth || 0;
			ref.current.scrollBy({
				left: cardWidth + 24,
				behavior: "smooth",
			});
			// update index when programmatically scrolling
			setCurrentIndex((i) => (i + 1) % activities.length);
		}
	};

	const openWishlistModal = (activity: Activity) => {
		setSelectedActivity(activity);
		setWishlistModal(true);
	};

	// autoplay logic: scroll every interval unless paused or disabled by manual interaction
	useEffect(() => {
		const intervalMs = 4500;
		if (!isPaused && isAutoplayEnabled) {
			autoplayTimer.current = setInterval(() => {
				// try desktop first, fallback to mobile
				if (carouselRefDesktop.current) scrollRight(carouselRefDesktop);
				else if (carouselRefMobile.current) scrollRight(carouselRefMobile);
			}, intervalMs);
		}

		return () => {
			if (autoplayTimer.current) {
				clearInterval(autoplayTimer.current);
				autoplayTimer.current = null;
			}
		};
	}, [isPaused, isAutoplayEnabled]);

	// update currentIndex based on scroll position (desktop)
	const updateIndexFromScroll = (ref: React.RefObject<HTMLDivElement | null>, isMobile = false) => {
		if (!ref.current) return;
		const el = ref.current;
		const scrollLeftPos = el.scrollLeft;
		if (isMobile) {
			const idx = Math.round(scrollLeftPos / el.clientWidth);
			setCurrentIndex(Math.min(Math.max(idx, 0), activities.length - 1));
		} else {
			const first = el.firstElementChild as HTMLElement | null;
			const cardWidth = first?.clientWidth ?? 0;
			const gap = 24; // matches gap-6
			const step = cardWidth + gap;
			const idx = Math.round(scrollLeftPos / (step || 1));
			setCurrentIndex(Math.min(Math.max(idx, 0), activities.length - 1));
		}
	};

	const handleDesktopScroll = () => updateIndexFromScroll(carouselRefDesktop, false);
	const handleMobileScroll = () => updateIndexFromScroll(carouselRefMobile, true);



	const getActiveCarouselRef = () => {
		if (typeof window === "undefined") return carouselRefDesktop;
		return window.innerWidth >= 640 ? carouselRefDesktop : carouselRefMobile;
	};

	const handleSaveWishlist = () => {
		setWishlistName("");
		setWishlistModal(false);
	};



	return (
		<section id="activities" className="w-full py-12 lg:py-16 relative overflow-hidden bg-linear-to-b from-white via-[rgba(0,82,70,0.06)] to-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--brand-green)">
						Tourist Activities
					</h1>

					{/* Nav buttons moved next to title (visible on all sizes) */}
					<div className="flex items-center gap-2">
						<button
							onClick={() => {
								const ref = getActiveCarouselRef();
								scrollLeft(ref);
								setIsAutoplayEnabled(false);
							}}
							className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
							aria-label="Previous"
						>
							<ChevronLeft size={20} className="text-(--brand-green)" />
						</button>

						<button
							onClick={() => {
								const ref = getActiveCarouselRef();
								scrollRight(ref);
								setIsAutoplayEnabled(false);
							}}
							className="bg-white p-2 rounded-full shadow-md hover:bg-white transition-colors"
							aria-label="Next"
						>
							<ChevronRight size={20} className="text-(--brand-green)" />
						</button>
					</div>
				</div>

				{/* Desktop / Tablet Carousel */}
				<div
					className="hidden sm:block relative items-center"
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
					onFocus={() => setIsPaused(true)}
					onBlur={() => setIsPaused(false)}
				>
					<div
						ref={carouselRefDesktop}
						onScroll={handleDesktopScroll}
						className="flex gap-6 overflow-x-hidden px-2 py-8"
						style={{ scrollSnapType: "x mandatory" }}
					>
						{activities.map((activity) => (
							<motion.div
								key={activity.id}
								className="relative shrink-0 rounded-xl overflow-hidden cursor-pointer group bg-gray-200 snap-start shadow-lg h-[300px] md:h-[360px] lg:h-[420px]"
								style={{ flex: "0 0 calc(25% - 18px)" }}
								whileHover={{ scale: 1.03 }}
								transition={{ type: "spring", stiffness: 220 }}
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										setActiveCardId((prev) => (prev === activity.id ? null : activity.id));
									}
								}}
							>
								<img
									src={activity.image}
									alt={activity.title}
									className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 focus-within:scale-110"
									loading="lazy"
								/>

								<motion.div
									className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex flex-col items-center justify-end text-center px-4 pb-6"
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<h3 className="text-lg font-bold text-white mb-2">
										{activity.title}
									</h3>
									<p className="text-sm text-white mb-2">{activity.shortInfo}</p>
									<p className="text-xs text-white">{activity.details}</p>
								</motion.div>

								<button
									onClick={() => openWishlistModal(activity)}
									className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow hover:bg-white"
									aria-label={`Add ${activity.title} to wishlist`}
								>
									<Heart className="text-(--brand-green)" size={20} />
								</button>
							</motion.div>
						))}
					</div>


				</div>

				{/* Mobile Carousel */}
				<div className="flex sm:hidden relative items-center ">
					<div
						ref={carouselRefMobile}
						onTouchStart={() => {
							setIsPaused(true);
							// stop autoplay permanently on any manual interaction
							setIsAutoplayEnabled(false);
						}}
						onTouchEnd={() => setIsPaused(false)}
						onScroll={handleMobileScroll}
						className="flex overflow-x-auto gap-6 px-4 sm:px-4 py-8 flex-1 scrollbar-hide touch-pan-x snap-x snap-mandatory"
					>
						{activities.map((activity) => (
							<motion.div
								key={activity.id}
								className="relative shrink-0 rounded-xl overflow-hidden cursor-pointer group bg-gray-200 snap-center h-[420px]"
								style={{ flex: '0 0 100%' }}
								whileTap={{ scale: 0.97 }}
								transition={{ type: "spring", stiffness: 200 }}
								onClick={() =>
									setActiveCardId((prev) =>
										prev === activity.id ? null : activity.id
									)
								}
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										setActiveCardId((prev) => (prev === activity.id ? null : activity.id));
									}
								}}
							>
								<img
									src={activity.image}
									alt={activity.title}
									className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 focus-within:scale-110"
									loading="lazy"
								/>

								{/* Description overlay */}
								<motion.div
									className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex flex-col items-center justify-end text-center px-3 pb-6"
									initial={{ opacity: 0 }}
									animate={{ opacity: activeCardId === activity.id ? 1 : 0 }}
									transition={{ duration: 0.3 }}
								>
									<h3 className="text-base font-bold text-white mb-1">
										{activity.title}
									</h3>
									<p className="text-sm text-white mb-1">{activity.shortInfo}</p>
									<p className="text-xs text-white">{activity.details}</p>
								</motion.div>

								<button
									onClick={(e) => {
										e.stopPropagation();
										openWishlistModal(activity);
									}}
									className="absolute top-2 right-2 bg-white/80 p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--brand-green)"
								>
									<Heart className="text-(--brand-green)" size={18} />
								</button>
							</motion.div>
						))}
					</div>
				</div>

				{/* Wishlist Modal */}
				<AnimatePresence>
					{wishlistModal && (
						<motion.div
							className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className="bg-white rounded-xl p-6 w-96 shadow-lg"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.8, opacity: 0 }}
							>
								<h2 className="text-xl font-bold text-(--brand-green) mb-4">
									Save to Wishlist
								</h2>
								<p className="text-gray-600 mb-2">
									Activity:{" "}
									<span className="font-semibold">{selectedActivity?.title}</span>
								</p>
								<input
									type="text"
									placeholder="Enter wishlist name"
									value={wishlistName}
									onChange={(e) => setWishlistName(e.target.value)}
									className="w-full border border-gray-300 rounded-lg p-2 mb-4"
								/>
								<div className="flex justify-end gap-3">
									<button
										onClick={() => setWishlistModal(false)}
										className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
									>
										Cancel
									</button>
									<button
										onClick={handleSaveWishlist}
										className="px-4 py-2 rounded-lg bg-(--brand-green) text-white hover:bg-[#004536]"
									>
										Save
									</button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
};

export default ActivityCarousel;