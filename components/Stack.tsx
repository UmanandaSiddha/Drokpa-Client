"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";


function CardRotate({
	children,
	onSendToBack,
	sensitivity,
}: {
	children: React.ReactNode;
	onSendToBack: () => void;
	sensitivity: number;
}) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useTransform(y, [-100, 100], [60, -60]);
	const rotateY = useTransform(x, [-100, 100], [-60, 60]);

	function handleDragEnd(_: any, info: any) {
		if (
			Math.abs(info.offset.x) > sensitivity ||
			Math.abs(info.offset.y) > sensitivity
		) {
			onSendToBack();
		} else {
			x.set(0);
			y.set(0);
		}
	}

	return (
		<motion.div
			className="cursor-grab active:cursor-grabbing"
			style={{ x, y, rotateX, rotateY }}
			drag
			dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
			dragElastic={0.6}
			onDragEnd={handleDragEnd}
		>
			{children}
		</motion.div>
	);
}

interface Card {
	id: number;
	img: string;
}

interface StackProps {
	randomRotation?: boolean;
	sensitivity?: number;
	cardDimensions?: { width: number; height: number };
	cardsData?: Card[];
	animationConfig?: { stiffness: number; damping: number };
	sendToBackOnClick?: boolean;
}

export default function Stack({
	randomRotation = true,
	sensitivity = 200,
	cardDimensions = { width: 300, height: 300 },
	cardsData = [],
	animationConfig = { stiffness: 260, damping: 20 },
	sendToBackOnClick = false,
}: StackProps) {
	const [cards, setCards] = useState(
		cardsData.length
			? cardsData
			: [
				{ id: 1, img: "/twgmonastery2.jpg" },
				{ id: 2, img: "/jungwaterfall2.jpg" },
				{ id: 3, img: "/yakimg.jpeg" },
				{ id: 4, img: "/lake.jpg" },
			]
	);

	const [dimensions, setDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const [rotationOffsets, setRotationOffsets] = useState<number[]>([]);

	
	useEffect(() => {
		function updateDimensions() {
			const width = window.innerWidth;
			if (width < 640) setDimensions({ width: 300, height: 300 });
			else if (width < 1024) setDimensions({ width: 280, height: 360 });
			else setDimensions(cardDimensions);
		}
		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, [cardDimensions]);


	useEffect(() => {
		if (randomRotation) {
			setRotationOffsets(cards.map(() => Math.random() * 10 - 5));
		} else {
			setRotationOffsets(cards.map(() => 0));
		}
	}, [cards, randomRotation]);

	
	if (!dimensions) return null;


	const sendToBack = (id: number) => {
		setCards((prev) => {
			const newCards = [...prev];
			const index = newCards.findIndex((card) => card.id === id);
			const [selected] = newCards.splice(index, 1);
			newCards.unshift(selected);
			return newCards;
		});
	};

	return (
		<div
			className="relative mx-auto mt-10"
			style={{
				width: dimensions.width,
				height: dimensions.height,
				perspective: 600,
			}}
		>
			{cards.map((card, index) => (
				<CardRotate
					key={card.id}
					onSendToBack={() => sendToBack(card.id)}
					sensitivity={sensitivity}
				>
					<motion.div
						className="absolute top-0 left-0 rounded-xl shadow-2xl overflow-hidden bg-amber-400"
						onClick={() => sendToBackOnClick && sendToBack(card.id)}
						animate={{
							rotateZ:
								(cards.length - index - 1) * 5 +
								(rotationOffsets[index] ?? 0),
							scale: 1 + index * 0.06 - cards.length * 0.06,
							transformOrigin: "90% 90%",
							zIndex: index + 1,
						}}
						initial={false}
						transition={{
							type: "spring",
							stiffness: animationConfig.stiffness,
							damping: animationConfig.damping,
						}}
						style={{
							width: dimensions.width,
							height: dimensions.height,
						}}
					>
						<Image
							src={card.img}
							alt={`card-${card.id}`}
							className="w-full h-full object-cover select-none pointer-events-none"
							height={dimensions.height}
							width={dimensions.width}
						/>
					</motion.div>
				</CardRotate>
			))}
		</div>
	);
}