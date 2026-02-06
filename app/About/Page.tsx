import Image from "next/image";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white text-gray-800" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<Navigation />
			<main className="relative min-h-screen bg-white">
				{/* Hero Section */}
				<section className="relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-b from-[#F5F1E6] via-white to-white" />
					<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-16 sm:py-20 md:py-24 lg:py-28">
						<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
							<div>
								<div className="flex items-center gap-2 mb-4">
									<span className="inline-flex h-3 w-3 rounded-sm bg-[#FC611E]" />
									<p
										className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
									>
										A letter from Arunachal
									</p>
								</div>
								<h1
									className="leading-tight mb-5 sm:mb-6"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										fontSize: "clamp(32px, 6vw, 56px)",
										color: "#353030",
										letterSpacing: "-0.07em",
									}}
								>
									Welcome. <br />
									Arunachal has already called you.
								</h1>
								<p
									className="text-base sm:text-lg leading-relaxed"
									style={{ color: "#686766", fontWeight: 500 }}
								>
									This is not a travel portal born out of convenience.
									It is a quiet collection of stories, homes, routes,
									and traditions — gathered with care, and offered to
									you the way locals welcome a guest.
								</p>
							</div>

							<div className="relative h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl">
								<Image
									src="https://images.unsplash.com/photo-1648963798678-a921079b98b9?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									alt="Arunachal landscape"
									fill
									className="object-cover"
									priority
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/5 to-transparent" />
							</div>
						</div>
					</div>
				</section>

				{/* Body Letter */}
				<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-14 sm:py-16 md:py-20 space-y-12 sm:space-y-14">
					<LetterBlock title="Why this exists">
						Arunachal Pradesh is vast, slow, and deeply personal.
						Planning a journey here often raises more questions than answers.
						Where to stay, which roads to take, which seasons to trust,
						and which customs to respect.
						<br /><br />
						This platform exists to answer those questions the way
						a local would — honestly, patiently, and without exaggeration.
					</LetterBlock>

					<LetterBlock title="Homestays & Hotels">
						The soul of Arunachal lives inside its homes.
						That is why we focus on authentic homestays
						and thoughtfully chosen hotels that respect land,
						people, and tradition.
						<br /><br />
						Here, you will find real descriptions, real expectations,
						and places where hospitality is not scripted —
						it is lived.
					</LetterBlock>

					<LetterBlock title="Routes & Journey Planning">
						In Arunachal, the road is never just a line on a map.
						It is fog, forests, conversations, and pauses.
						<br /><br />
						We help you plan routes that are safe, scenic,
						and sensible — including travel time realities,
						stopovers, and seasonal conditions that matter in the mountains.
					</LetterBlock>

					<LetterBlock title="Travel Guide & Local Insight">
						This is not a checklist of places to tick off.
						Our guides talk about when to go, when to wait,
						what to expect in remote regions,
						and how to travel with respect.
						<br /><br />
						The goal is not speed.
						The goal is understanding.
					</LetterBlock>

					<LetterBlock title="Festivals & Living Culture">
						Festivals here are not performances for visitors.
						They are moments of memory, faith, and community.
						<br /><br />
						We document festivals and traditions with context —
						so you do not merely witness them,
						but understand what they mean to the people who live them.
					</LetterBlock>

					{/* Closing */}
					<div className="pt-10 sm:pt-12 border-t border-gray-200">
						<p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-5 sm:mb-6">
							If you come to Arunachal, come with patience.
							Come with curiosity.
							Come ready to listen.
						</p>
						<p className="text-base sm:text-lg text-gray-700 leading-relaxed">
							If this platform helps you feel even a little more prepared,
							then this letter has served its purpose.
						</p>

						<p
							className="mt-8 sm:mt-10"
							style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#005246" }}
						>
							— From Arunachal, with love
						</p>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}

function LetterBlock({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<h2
				className="text-xl sm:text-2xl mb-3 sm:mb-4"
				style={{
					fontFamily: "var(--font-subjectivity), sans-serif",
					fontWeight: 700,
					color: "#353030",
					letterSpacing: "-0.05em",
				}}
			>
				{title}
			</h2>
			<p className="text-gray-600 leading-relaxed text-base sm:text-lg" style={{ fontWeight: 500 }}>
				{children}
			</p>
		</div>
	);
}
