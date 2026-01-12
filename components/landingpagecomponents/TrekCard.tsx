"use client";

import { useEffect, useState } from "react";

const TrekCard = () => {
	const [currentImage, setCurrentImage] = useState(0);

	const images = [
		"https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
		"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
		"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
		"https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800"
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prev) => (prev + 1) % images.length);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="absolute bottom-8 right-8 z-30 overflow-hidden w-80">
			<div className="flex justify-end gap-2 mb-2">
					{images.map((_, i) => (
						<button
							key={i}
							onClick={() => setCurrentImage(i)}
							className={`h-2 w-2 rounded-full transition-all duration-300 ${i === currentImage ? "bg-[#F2BD11] w-6" : "bg-white"
								}`}
						/>
					))}
				</div>
			
			<div className="bg-white p-1 rounded-[8px] shadow-2xl">
				<div className="relative h-35">
					{/* Carousel Images */}
					{images.map((img, i) => (
						<img
							key={i}
							src={img}
							alt="Trek"
							className={`absolute inset-0 w-full h-full rounded-[4px] object-cover transition-opacity duration-1000 ${i === currentImage ? "opacity-100" : "opacity-0"
								}`}
						/>
					))}

					<div
						className="z-30 bottom-0 right-0 absolute text-white font-normal px-2.5 py-1.5 text-sm text-right leading-tight"
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 500,
						}}
					>
						Trails That Test.<br />
						Views That Reward.
					</div>

					<div
						className="z-30 bottom-0 left-0 absolute text-white font-bold px-2.5 py-1.5 text-sm text-right leading-tight"
						style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
					>
						₹12,999 <span className="text-xs font-normal"> / Person</span>
					</div>
				</div>

				{/* Card Footer */}
				<div className="p-1 flex items-center justify-between">
					<div>
						<div
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 500,
								fontSize: "16px",
								color: "#353030"
							}}
						>
							Seven Lakes Trek
						</div>
						<div
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontSize: "12px",
								fontWeight: 500,
								color: "#686766"
							}}
						>
							Arunachal Pradesh
						</div>
					</div>
					<button
						className="bg-[#4F87C7] hover:bg-[#27261C] text-white px-5 py-3 rounded-[4px] text-[14px] font-semibold transition-colors"
						style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
					>
						BOOK NOW
					</button>
				</div>
			</div>
		</div>
	);
};

export default TrekCard