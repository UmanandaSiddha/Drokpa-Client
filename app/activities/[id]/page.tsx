import { activities } from "../../../data/activities";
import { notFound } from "next/navigation";
import TextPressure from "@/components/ui/textPressure";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";

export default async function ActivityDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const activity = activities.find((a) => a.id === Number(id));

	if (!activity) return notFound();

	return (
		<div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
			<Navigation />
			<main className="relative min-h-screen bg-white">
				<section className="relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-b from-[#F5F1E6] via-white to-white" />
					<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-12">
						<div className="relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
							<img
								src={activity.image}
								alt={activity.title}
								className="absolute inset-0 w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
							<div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
								<p
									className="text-white text-xl sm:text-2xl"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										letterSpacing: "-0.05em",
									}}
								>
									{activity.title}
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto pb-16 sm:pb-20">
					<div className="mt-10 sm:mt-12 rounded-2xl bg-white/90 border border-white/70 shadow-xl backdrop-blur-sm p-6 sm:p-8">
						<div className="flex items-center gap-2 mb-4">
							<span className="inline-flex h-3 w-3 rounded-sm bg-[#FC611E]" />
							<p
								className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
								style={{ fontWeight: 600 }}
							>
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
							We are crafting this experience with care. Check back soon for details.
						</p>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
