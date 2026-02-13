import { activities } from "../../../data/activities";
import { notFound } from "next/navigation";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";
import MobileMenu from "@/components/MobileMenu";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import { Clock, Users, MapPin, Star } from "lucide-react";

export default async function ActivityDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const activity = activities.find((a) => a.id === Number(id));

	if (!activity) return notFound();

	return (
		<MobileMenuProvider>
			<div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
				<Navigation />
				<MobileMenu />
				<main className="relative min-h-screen bg-white pt-20">
					{/* Hero Section with Title and Image Grid */}
					<section className="relative overflow-hidden">
						<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-400 mx-auto pb-8 sm:pb-10 md:pb-12">
							{/* Title Section */}
							<div className="mb-6 sm:mb-8">
								<h1
									className="text-3xl sm:text-4xl md:text-5xl"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										color: "#27261C",
										letterSpacing: "-0.06em",
									}}
								>
									{activity.title}
								</h1>
							</div>

							{/* Image Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
								{/* Main Large Image */}
								<div className="sm:col-span-2 row-span-2 h-[300px] sm:h-[380px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
									<img
										src={activity.image}
										alt={`${activity.title} main`}
										className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
									/>
								</div>

								{/* Secondary Images */}
								{activity.images && activity.images.length > 1 ? (
									<>
										<div className="h-[140px] sm:h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
											<img
												src={activity.images[1]}
												alt={`${activity.title} view 2`}
												className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
											/>
										</div>
										{activity.images.length > 2 && (
											<div className="h-[140px] sm:h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
												<img
													src={activity.images[2]}
													alt={`${activity.title} view 3`}
													className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
												/>
											</div>
										)}
									</>
								) : null}
							</div>
						</div>
					</section>

					{/* Content Section */}
					<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-400 mx-auto py-12 sm:py-16 md:py-20">
						<div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
							{/* Main Content - Left */}
							<div className="lg:col-span-2">
								{/* Activity Highlights */}
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 sm:mb-12">
									<HighlightCard icon={<Star className="w-5 h-5 sm:w-6 sm:h-6" />} label="Featured" />
									<HighlightCard icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />} label="Full Day" />
									<HighlightCard icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />} label="Groups OK" />
									<HighlightCard icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />} label="Local Guide" />
								</div>

								{/* About Section */}
								<div className="mb-10 sm:mb-12">
									<h2
										className="text-2xl sm:text-3xl md:text-4xl mb-5 sm:mb-6"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 700,
											color: "#27261C",
											letterSpacing: "-0.04em",
										}}
									>
										About This Activity
									</h2>
									<p
										className="text-base sm:text-lg text-[#686766] leading-relaxed"
										style={{ fontWeight: 500, lineHeight: "1.8" }}
									>
										Experience authentic cultural immersion with this carefully curated activity. Our team is preparing detailed information about what makes this experience special and how you can make the most of your time.
									</p>
								</div>

								{/* What to Expect */}
								<div className="mb-10 sm:mb-12">
									<h3
										className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-[#27261C]"
										style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
									>
										What to Expect
									</h3>
									<div className="space-y-3 sm:space-y-4">
										<ExpectItem text="Immersive cultural experience led by local experts" />
										<ExpectItem text="Safe and comfortable environment" />
										<ExpectItem text="Small group sizes for personalized attention" />
										<ExpectItem text="Photography opportunities" />
										<ExpectItem text="Refreshments included" />
									</div>
								</div>
							</div>

							{/* Sidebar - Right */}
							<div className="lg:col-span-1">
								{/* Coming Soon Card */}
								<div className="sticky top-24 bg-linear-to-br from-[#FC611E]/10 via-[#4F87C7]/10 to-[#2D7A3E]/10 border-2 border-[#DDE7E0] rounded-3xl p-8 sm:p-10">
									<div className="flex items-center gap-2 mb-4">
										<span className="inline-flex h-4 w-4 rounded-sm bg-[#FC611E]" />
										<p
											className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
											style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
										>
											Coming Soon
										</p>
									</div>

									<h3
										className="text-xl sm:text-2xl font-semibold mb-3 text-[#27261C]"
										style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
									>
										Booking Coming
									</h3>

									<p className="text-sm sm:text-base text-[#686766] mb-6 leading-relaxed" style={{ fontWeight: 500 }}>
										We're finalizing the booking experience for this activity. Get notified when it's available.
									</p>

									{/* Info Items */}
									<div className="space-y-4 mb-6 sm:mb-8">
										<InfoItem label="Availability" value="Seasonal" />
										<InfoItem label="Group Size" value="Up to 12 people" />
										<InfoItem label="Duration" value="Full day" />
										<InfoItem label="Difficulty" value="Moderate" />
									</div>

									{/* CTA Button */}
									<button
										className="w-full bg-[#FC611E] hover:bg-[#f46a2f] text-white py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700 }}
									>
										Notify Me
										<span>→</span>
									</button>
								</div>
							</div>
						</div>
					</section>

					{/* FAQ Section */}
					<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-400 mx-auto py-12 sm:py-16 md:py-20">
						<h2
							className="text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-10"
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								color: "#27261C",
								letterSpacing: "-0.04em",
							}}
						>
							Common Questions
						</h2>

						<div className="space-y-4">
							<FAQItem
								question="What should I bring?"
								answer="Comfortable clothing, sturdy shoes, sunscreen, and a water bottle. More details will be provided upon booking."
							/>
							<FAQItem
								question="Is this suitable for beginners?"
								answer="Yes! This activity is designed for all experience levels. Our guides will provide full support and guidance."
							/>
							<FAQItem
								question="What's the best time to visit?"
								answer="The optimal season varies. You'll receive personalized recommendations based on your travel dates and preferences."
							/>
							<FAQItem
								question="Are there smaller group options?"
								answer="Absolutely. We can arrange private experiences tailored to your group size and interests."
							/>
						</div>
					</section>
				</main>
				<Footer showCta />
			</div>
		</MobileMenuProvider>
	);
}

function HighlightCard({ icon, label }: { icon: React.ReactNode; label: string }) {
	return (
		<div className="bg-white border-2 border-[#DDE7E0] rounded-2xl p-4 sm:p-5 text-center hover:shadow-lg transition-all duration-300">
			<div className="flex justify-center mb-2 text-[#FC611E]">{icon}</div>
			<p className="text-xs sm:text-sm font-semibold text-[#27261C]" style={{ fontWeight: 600 }}>
				{label}
			</p>
		</div>
	);
}

function ExpectItem({ text }: { text: string }) {
	return (
		<div className="flex items-start gap-3">
			<div className="w-6 h-6 rounded-full bg-[#FC611E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
				<div className="w-2 h-2 rounded-full bg-[#FC611E]" />
			</div>
			<span className="text-base sm:text-lg text-[#27261C]" style={{ fontWeight: 500 }}>
				{text}
			</span>
		</div>
	);
}

function InfoItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-white/50 rounded-lg p-3 sm:p-4">
			<p className="text-xs sm:text-sm text-[#686766] mb-1" style={{ fontWeight: 500 }}>
				{label}
			</p>
			<p className="text-sm sm:text-base font-semibold text-[#27261C]" style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}>
				{value}
			</p>
		</div>
	);
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
	return (
		<div className="bg-white border-2 border-[#DDE7E0] rounded-2xl p-6 sm:p-7 hover:border-[#FC611E] hover:shadow-lg transition-all duration-300">
			<h3 className="text-base sm:text-lg font-semibold text-[#27261C] mb-2" style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}>
				{question}
			</h3>
			<p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500, lineHeight: "1.6" }}>
				{answer}
			</p>
		</div>
	);
}
