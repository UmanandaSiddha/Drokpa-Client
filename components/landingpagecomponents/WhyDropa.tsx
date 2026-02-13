import React from 'react';
import { WhyEat, WhyGuidance, WhyJourney, WhyLocals, WhyPaperwork, WhyRoutes, WhyStay, WhyTransport } from '@/assets';
import Image from 'next/image';

interface Feature {
	id: number;
	icon: React.ReactNode;
	title: string;
	description: string;
}

export default function WhyDroppa() {
	const features: Feature[] = [
		{
			id: 1,
			icon: WhyStay,
			title: "Comfortable Stay",
			description: "Clean and cozy homestays with warm hospitality."
		},
		{
			id: 2,
			icon: WhyEat,
			title: "Eat Like a Local",
			description: "Delicious homemade meals with authentic local flavors."
		},
		{
			id: 3,
			icon: WhyTransport,
			title: "Private Transport",
			description: "Safe and reliable private vehicles for your journey."
		},
		{
			id: 4,
			icon: WhyRoutes,
			title: "Smart Routes",
			description: "Plan efficient routes to explore more in less time."
		},
		{
			id: 5,
			icon: WhyPaperwork,
			title: "No Paperwork",
			description: "Hassle-free digital bookings—no documents required."
		},
		{
			id: 6,
			icon: WhyGuidance,
			title: "Local Guidance",
			description: "Explore hidden gems with our local travel experts."
		},
		{
			id: 7,
			icon: WhyLocals,
			title: "Meet Locals",
			description: "Connect with local communities and culture."
		},
		{
			id: 8,
			icon: WhyJourney,
			title: "Authentic Journeys",
			description: "Discover places the way they truly are."
		}
	];

	return (
		<div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 md:pb-16">
			<div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
				{/* Header */}
				<div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
					<div className="flex items-center gap-2 mb-3 sm:mb-4">
						<div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#FC611E] rounded-sm flex-shrink-0 self-center"></div>
						<span
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								fontSize: "clamp(16px, 4vw, 20px)",
								color: "#353030",
								lineHeight: "20px",
								letterSpacing: "-0.07em",
								display: "flex",
								alignItems: "center",
							}}
						>
							WHY DROKPA?
						</span>
					</div>
					<h1
						className="text-[30px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-tight md:leading-[1.08]"
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							color: "#353030",
							letterSpacing: "-0.07em",
						}}
					>
						We bring perfection to<br />
						your not so perfect plan.
					</h1>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
					{features.map((feature) => (
						<div
							key={feature.id}
							className="group p-5 sm:p-6 md:p-7 flex flex-col gap-2 sm:gap-3 justify-center items-center bg-[#27261C] rounded-2xl sm:rounded-3xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
						>
							<Image src={feature.icon as string} alt={feature.title} width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10" />

							<h3
								className="text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-snug"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 500,
									color: "#FFFFFF",
									letterSpacing: "-0.07em",
								}}
							>
								{feature.title}
							</h3>

							<p
								className="text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed"
								style={{
									fontFamily: "var(--font-mona-sans)",
									fontWeight: 500,
									color: "#FFFFFF",
									letterSpacing: "-0.05em",
									textAlign: "center",
								}}
							>
								{feature.description}
							</p>

							<div className="mt-1 h-1 w-0 bg-orange-500 rounded-full group-hover:w-full transition-all duration-300"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}