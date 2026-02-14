"use client";

import { useState } from "react";
import { ArrowRight, Calendar, MapPin, Zap, Clock, Route, Timer, Wallet } from "lucide-react";
import NotifyModal from "@/components/NotifyModal";

export default function RoutePlannerPage() {
	const [notifyOpen, setNotifyOpen] = useState(false);
	return (
		<div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<main className="relative min-h-screen bg-white pt-16">
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-linear-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white">
					<div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
					<div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />

					<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
						<div className="max-w-3xl">
							<div className="flex items-center gap-2 mb-5 sm:mb-6">
								<span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#FC611E]" />
								<p
									className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
									style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
								>
									Coming Soon
								</p>
							</div>
							<h1
								className="leading-[1.1] mb-6"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									fontSize: "clamp(36px, 7vw, 64px)",
									color: "#27261C",
									letterSpacing: "-0.06em",
								}}
							>
								Smart Route Planner
							</h1>
							<p
								className="text-base sm:text-lg md:text-xl text-[#686766]"
								style={{ fontWeight: 500, lineHeight: "1.7" }}
							>
								Plan your perfect journey across Arunachal Pradesh with our intelligent route planning tool. Discover scenic routes, optimize travel times, and explore hidden gems along the way.
							</p>
						</div>
					</div>
				</section>

				{/* Features Preview Section */}
				<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						<FeatureCard
							icon={<MapPin className="w-6 h-6 sm:w-7 sm:h-7" />}
							title="Route Optimization"
							description="Find the most efficient routes between destinations"
							color="#FC611E"
						/>
						<FeatureCard
							icon={<Calendar className="w-6 h-6 sm:w-7 sm:h-7" />}
							title="Itinerary Planning"
							description="Create detailed day-by-day travel plans"
							color="#4F87C7"
						/>
						<FeatureCard
							icon={<Clock className="w-6 h-6 sm:w-7 sm:h-7" />}
							title="Real-Time Updates"
							description="Get live traffic and weather information"
							color="#2D7A3E"
						/>
						<FeatureCard
							icon={<Zap className="w-6 h-6 sm:w-7 sm:h-7" />}
							title="Smart Suggestions"
							description="Discover must-see stops and local experiences"
							color="#005246"
						/>
					</div>
				</section>

				{/* Coming Soon Details Section */}
				<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1200px] mx-auto py-12 sm:py-16 md:py-20">
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
						{/* Left Content */}
						<div>
							<h2
								className="text-2xl sm:text-3xl md:text-4xl mb-5 sm:mb-6"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									color: "#27261C",
									letterSpacing: "-0.04em",
								}}
							>
								What's Coming
							</h2>
							<p
								className="text-base sm:text-lg text-[#686766] mb-6 leading-relaxed"
								style={{ fontWeight: 500, lineHeight: "1.8" }}
							>
								We're crafting the ultimate route planning experience for explorers. Our intelligent system will analyze multiple factors to create your perfect journey.
							</p>

							<div className="space-y-4">
								<CheckItem text="Multi-destination route optimization" />
								<CheckItem text="Real-time traffic and weather data" />
								<CheckItem text="Curated stops and hidden gems" />
								<CheckItem text="Offline route maps" />
								<CheckItem text="Detailed travel guides" />
								<CheckItem text="Budget and time planning tools" />
							</div>
						</div>

						{/* Right Visual */}
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-br from-[#FC611E]/10 via-[#4F87C7]/10 to-[#2D7A3E]/10 rounded-3xl" />
							<div className="relative bg-white border-2 border-[#DDE7E0] rounded-3xl p-8 sm:p-10">
								<div className="space-y-6">
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-2xl bg-[#FC611E]/10 flex items-center justify-center flex-shrink-0">
											<Route className="w-6 h-6 text-[#FC611E]" />
										</div>
										<div>
											<h3
												className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
												style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
											>
												Intelligent Navigation
											</h3>
											<p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
												Advanced algorithms to find your ideal path
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-2xl bg-[#4F87C7]/10 flex items-center justify-center flex-shrink-0">
											<Timer className="w-6 h-6 text-[#4F87C7]" />
										</div>
										<div>
											<h3
												className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
												style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
											>
												Time Planning
											</h3>
											<p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
												Estimate durations with real-world conditions
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-2xl bg-[#2D7A3E]/10 flex items-center justify-center flex-shrink-0">
											<Wallet className="w-6 h-6 text-[#2D7A3E]" />
										</div>
										<div>
											<h3
												className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
												style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
											>
												Budget Tracking
											</h3>
											<p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
												Plan your trip within your budget
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Notification Section */}
				<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[900px] mx-auto py-12 sm:py-16 md:py-20">
					<div className="bg-gradient-to-r from-[#FC611E]/10 via-[#4F87C7]/10 to-[#2D7A3E]/10 border-2 border-[#DDE7E0] rounded-3xl p-8 sm:p-12 text-center">
						<h3
							className="text-xl sm:text-2xl md:text-3xl mb-4"
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								color: "#27261C",
								letterSpacing: "-0.04em",
							}}
						>
							Be the First to Know
						</h3>
						<p className="text-base sm:text-lg text-[#686766] mb-6" style={{ fontWeight: 500, lineHeight: "1.7" }}>
							We're working hard to bring this feature to you. Sign up for early access and be notified when it launches.
						</p>
						<button
							className="bg-[#FC611E] hover:bg-[#f46a2f] text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
							style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700 }}
							onClick={() => setNotifyOpen(true)}
						>
							Get Notified
							<ArrowRight className="w-4 h-4" />
						</button>
					</div>
				</section>
			</main>
			<NotifyModal
				open={notifyOpen}
				feature="Smart Route Planner"
				onClose={() => setNotifyOpen(false)}
			/>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
	color,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	color: string;
}) {
	return (
		<div className="group bg-white border-2 border-[#DDE7E0] rounded-2xl p-6 sm:p-7 hover:shadow-xl hover:border-[#FC611E] transition-all duration-300">
			<div
				className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
				style={{ backgroundColor: `${color}20`, color: color }}
			>
				{icon}
			</div>
			<h3
				className="text-lg sm:text-xl font-semibold text-[#27261C] mb-2"
				style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
			>
				{title}
			</h3>
			<p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
				{description}
			</p>
		</div>
	);
}

function CheckItem({ text }: { text: string }) {
	return (
		<div className="flex items-center gap-3">
			<div className="w-5 h-5 rounded-full bg-[#2D7A3E] flex items-center justify-center flex-shrink-0">
				<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<span className="text-base sm:text-lg text-[#27261C]" style={{ fontWeight: 500 }}>
				{text}
			</span>
		</div>
	);
}
