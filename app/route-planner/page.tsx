"use client";

import TextPressure from "@/components/ui/textPressure";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";

export default function RoutePlannerPage() {
	return (
		<div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<Navigation />
			<main className="relative min-h-screen bg-white">
				<section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
					<div className="absolute inset-0 bg-linear-to-b from-[#F5F1E6] via-white to-white" />
					<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
						<div className="w-full rounded-2xl bg-white/90 border border-white/70 shadow-xl backdrop-blur-sm p-6 sm:p-8">
							<div className="flex items-center gap-2 mb-4">
								<span className="inline-flex h-3 w-3 rounded-sm bg-[#FC611E]" />
								<p className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]">
									Coming soon
								</p>
							</div>
							<div style={{ position: "relative", height: "220px" }}>
								<TextPressure
									text="Coming Soon!"
									flex={true}
									alpha={false}
									stroke={false}
									width={true}
									weight={true}
									italic={true}
									textColor="#005246"
									strokeColor="#ff0000"
									minFontSize={36}
								/>
							</div>
							<p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
								We are building the planner experience. Check back soon.
							</p>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
