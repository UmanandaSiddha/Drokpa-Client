import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Home, Leaf, Users } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = {
	title: "About Us - Drokpa's Story and Vision",
	description: "Learn about Drokpa, a curated collection of authentic stories, homes, routes, and traditions in Arunachal Pradesh. Discover how we're revolutionizing local travel experiences.",
	alternates: {
		canonical: "https://www.drokpa.in/about",
	},
	openGraph: {
		title: "About Drokpa - Your Local Travel Buddy",
		description: "Learn about Drokpa's mission to showcase authentic travel experiences in Arunachal Pradesh",
		url: "https://www.drokpa.in/about",
	},
};

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white text-gray-800" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<PageWrapper>
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white">
					<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20 lg:py-24">
						<div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-center">
							<div>
								<div className="flex items-center gap-2 mb-5 sm:mb-6">
									<span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#FC611E]" />
									<p
										className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
										style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
									>
										A letter from Arunachal
									</p>
								</div>
								<h1
									className="leading-[1.1] mb-6 sm:mb-7"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										fontSize: "clamp(36px, 7vw, 72px)",
										color: "#27261C",
										letterSpacing: "-0.06em",
									}}
								>
									Welcome. <br />
									Arunachal has already called you.
								</h1>
								<p
									className="text-base sm:text-lg md:text-xl leading-relaxed mb-6"
									style={{ color: "#686766", fontWeight: 500, lineHeight: "1.7" }}
								>
									This is not a travel portal born out of convenience.
									It is a quiet collection of stories, homes, routes,
									and traditions — gathered with care, and offered to
									you the way locals welcome a guest.
								</p>
								<div className="flex flex-wrap gap-3">
									<div className="px-4 py-2 bg-white border-2 border-[#DDE7E0] rounded-full">
										<span className="text-sm font-semibold" style={{ color: "#27261C" }}>Authentic Stays</span>
									</div>
									<div className="px-4 py-2 bg-white border-2 border-[#DDE7E0] rounded-full">
										<span className="text-sm font-semibold" style={{ color: "#27261C" }}>Local Insights</span>
									</div>
									<div className="px-4 py-2 bg-white border-2 border-[#DDE7E0] rounded-full">
										<span className="text-sm font-semibold" style={{ color: "#27261C" }}>Real Stories</span>
									</div>
								</div>
							</div>

							<div className="relative h-[320px] sm:h-[380px] md:h-[440px] lg:h-[520px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
								<Image
									src="https://images.unsplash.com/photo-1648963798678-a921079b98b9?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="Arunachal landscape"
									fill
									className="object-cover"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#27261C]/40 via-transparent to-transparent" />
							</div>
						</div>
					</div>
				</section>

				{/* Values Cards Section */}
				<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
					<div className="text-center mb-10 sm:mb-14">
						<h2
							className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4"
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								color: "#27261C",
								letterSpacing: "-0.05em",
							}}
						>
							What We Stand For
						</h2>
						<p className="text-base sm:text-lg text-[#686766] max-w-2xl mx-auto" style={{ fontWeight: 500 }}>
							Our core principles that guide every recommendation and story we share
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
						<ValueCard
							icon={<Home className="h-7 w-7" />}
							title="Authenticity"
							description="Real homes, real people, real experiences. No staged tourism."
							color="#FC611E"
						/>
						<ValueCard
							icon={<Leaf className="h-7 w-7" />}
							title="Sustainability"
							description="Protecting the land and culture for generations to come."
							color="#4F87C7"
						/>
						<ValueCard
							icon={<Users className="h-7 w-7" />}
							title="Community"
							description="Supporting local families and their way of life."
							color="#2D7A3E"
						/>
						<ValueCard
							icon={<BookOpen className="h-7 w-7" />}
							title="Knowledge"
							description="Deep insights gathered with patience and respect."
							color="#8B5CF6"
						/>
					</div>
				</section>

				{/* Body Letter */}
				<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20 space-y-6 sm:space-y-8">
					<LetterBlock
						title="Why Drokpa exists"
						accentColor="#FC611E"
					>
						Arunachal Pradesh is vast, slow, and deeply personal.
						Planning a journey here often raises more questions than answers.
						Where to stay, which roads to take, which seasons to trust,
						and which customs to respect.
						<br /><br />
						This platform exists to answer those questions the way
						a local would — honestly, patiently, and without exaggeration.
					</LetterBlock>

					<LetterBlock
						title="Homestays & Hotels"
						accentColor="#4F87C7"
					>
						The soul of Arunachal lives inside its homes.
						That is why we focus on authentic homestays
						and thoughtfully chosen hotels that respect land,
						people, and tradition.
						<br /><br />
						Here, you will find real descriptions, real expectations,
						and places where hospitality is not scripted —
						it is lived.
					</LetterBlock>

					<LetterBlock
						title="Routes & Journey Planning"
						accentColor="#2D7A3E"
					>
						In Arunachal, the road is never just a line on a map.
						It is fog, forests, conversations, and pauses.
						<br /><br />
						We help you plan routes that are safe, scenic,
						and sensible — including travel time realities,
						stopovers, and seasonal conditions that matter in the mountains.
					</LetterBlock>

					<LetterBlock
						title="Travel Guide & Local Insight"
						accentColor="#8B5CF6"
					>
						This is not a checklist of places to tick off.
						Our guides talk about when to go, when to wait,
						what to expect in remote regions,
						and how to travel with respect.
						<br /><br />
						The goal is not speed.
						The goal is understanding.
					</LetterBlock>

					<LetterBlock
						title="Festivals & Living Culture"
						accentColor="#F59E0B"
					>
						Festivals here are not performances for visitors.
						They are moments of memory, faith, and community.
						<br /><br />
						We document festivals and traditions with context —
						so you do not merely witness them,
						but understand what they mean to the people who live them.
					</LetterBlock>

					{/* Closing */}
					<div className="pt-12 sm:pt-16 mt-8 sm:mt-12">
						<div className="bg-gradient-to-br from-[#F5F1E6] to-[#DDE7E0]/40 rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#DDE7E0]">
							<p className="text-lg sm:text-xl md:text-2xl text-[#27261C] leading-relaxed mb-6 sm:mb-7" style={{ fontWeight: 600 }}>
								If you come to Arunachal, come with patience.
								Come with curiosity.
								Come ready to listen.
							</p>
							<p className="text-base sm:text-lg md:text-xl text-[#686766] leading-relaxed mb-8 sm:mb-10" style={{ fontWeight: 500 }}>
								If this platform helps you feel even a little more prepared,
								then this letter has served its purpose.
							</p>

							<div className="flex items-center gap-3">
								<div className="h-1 w-12 bg-[#FC611E] rounded-full" />
								<p
									className="text-lg sm:text-xl"
									style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#27261C" }}
								>
									From Arunachal, with love
								</p>
							</div>
						</div>
					</div>
				</section>
			</PageWrapper>		</div>
	);
}

function ValueCard({
	icon,
	title,
	description,
	color,
}: {	icon: React.ReactNode;
	title: string;
	description: string;
	color: string;
}) {
	return (
		<div className="group bg-white border-2 border-[#DDE7E0] rounded-2xl p-6 hover:shadow-lg hover:border-[#FC611E]/30 transition-all duration-300">
			<div
				className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110"
				style={{ backgroundColor: `${color}20` }}
			>
				{icon}
			</div>
			<h3
				className="text-lg sm:text-xl mb-2"
				style={{
					fontFamily: "var(--font-subjectivity), sans-serif",
					fontWeight: 700,
					color: "#27261C",
				}}
			>
				{title}
			</h3>
			<p className="text-sm sm:text-base text-[#686766] leading-relaxed" style={{ fontWeight: 500 }}>
				{description}
			</p>
		</div>
	);
}

function LetterBlock({
	title,
	children,
	accentColor,
}: {
	title: string;
	children: React.ReactNode;
	accentColor: string;
}) {
	return (
		<div className="bg-white border-2 border-[#DDE7E0] rounded-2xl p-6 sm:p-8 md:p-10 hover:shadow-lg transition-shadow duration-300">
			<div className="flex items-start gap-4 mb-4">
				<div
					className="w-1 h-12 rounded-full flex-shrink-0"
					style={{ backgroundColor: accentColor }}
				/>
				<h2
					className="text-xl sm:text-2xl md:text-3xl"
					style={{
						fontFamily: "var(--font-subjectivity), sans-serif",
						fontWeight: 700,
						color: "#27261C",
						letterSpacing: "-0.04em",
					}}
				>
					{title}
				</h2>
			</div>
			<p className="text-[#686766] leading-relaxed text-base sm:text-lg md:text-xl pl-8" style={{ fontWeight: 500, lineHeight: "1.8" }}>
				{children}
			</p>
		</div>
	);
}
