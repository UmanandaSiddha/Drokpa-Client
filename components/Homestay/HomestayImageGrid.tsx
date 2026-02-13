"use client";

import React from "react";
import GalleryLightbox from "@/components/GalleryLightbox";

type Props = {
	images: string[];
};

export default function HomestayImageGrid({ images }: Props) {
	const [open, setOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState(0);

	const visibleImages = images.slice(0, 5);
	const hasMore = images.length > 5;

	if (!images || images.length === 0) return null;

	const openViewer = (index: number) => {
		setActiveIndex(index);
		setOpen(true);
	};

	return (
		<>
			{/* IMAGE GRID */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden">
				{/* LEFT */}
				<div
					className="relative aspect-4/3 cursor-pointer group"
					onClick={() => openViewer(0)}
				>
					<img
						src={visibleImages[0]}
						alt="Main homestay"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
				</div>

				{/* RIGHT */}
				<div className="grid grid-cols-2 grid-rows-2 gap-2">
					{visibleImages.slice(1, 5).map((img, i) => (
						<div
							key={i}
							className="relative aspect-4/3 cursor-pointer group"
							onClick={() => openViewer(i + 1)}
						>
							<img
								src={img}
								alt={`Gallery ${i + 1}`}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

							{hasMore && i === 3 && (
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold pointer-events-none">
									+{images.length - 5} more
								</div>
							)}
						</div>
					))}
				</div>
			</div>


			{/* MODAL VIEWER */}
			<GalleryLightbox
				images={images}
				open={open}
				initialIndex={activeIndex}
				onClose={() => setOpen(false)}
			/>
		</>
	);
}
