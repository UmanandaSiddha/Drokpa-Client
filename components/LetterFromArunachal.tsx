import React from "react";

const LetterFromArunachal = () => {
	return (
		<section className="bg-white py-20 px-6">
			<div className="mx-auto max-w-3xl">
				{/* Letter Container */}
				<div className="rounded-2xl border border-[#0f5132]/20 bg-white p-8 md:p-12 shadow-sm">
					{/* Small Intro */}
					<p className="mb-6 text-sm uppercase tracking-widest text-[#0f5132]">
						A personal note
					</p>

					{/* Letter Content */}
					<div className="space-y-6 font-serif text-lg leading-relaxed text-gray-800">
						<p>Dear Traveler,</p>

						<p>
							If you’re reading this, Arunachal Pradesh has already found
							you — quietly, gently, the way the mountains always do.
						</p>

						<p>
							This website wasn’t created to sell destinations. It was
							created to gather stories — of roads that disappear into
							clouds, homes that welcome strangers like family, and journeys
							that slow you down enough to feel alive again.
						</p>

						<p>
							Here, you’ll find homestays run by locals, routes that value
							the journey as much as the destination, festivals that are
							lived — not performed — and guides written with care, not
							hype.
						</p>

						<p>
							Arunachal doesn’t rush. It asks you to arrive with patience,
							curiosity, and respect. If you do, it gives back more than
							memories — it gives perspective.
						</p>

						<p>
							This platform exists to help you travel thoughtfully. To help
							you stay where stories live. To help you walk roads that don’t
							always appear on maps.
						</p>

						<p>
							If that’s the kind of journey you’re looking for, you’re
							already in the right place.
						</p>

						{/* Signature */}
						<div className="pt-8">
							<p className="font-medium text-[#0f5132]">
								With warmth,
							</p>
							<p className="mt-1 text-xl font-semibold text-[#0f5132]">
								From Arunachal
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LetterFromArunachal;
