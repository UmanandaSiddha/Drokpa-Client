import React from "react";
import Link from "next/link";

const LetterCTA = () => {
	return (
		<section className="relative bg-white py-24 px-6">
			{/* Soft green backdrop */}
			{/* <div className="absolute inset-0 flex justify-center items-center">
				<div className="w-[92%] max-w-6xl h-[300px] rounded-3xl bg-[#0f5132]/95 transform rotate-1" />
			</div> */}

			{/* CTA Card */}
			<div className="relative mx-auto max-w-3xl rounded-3xl bg-white border border-[#0f5132]/20 p-10 md:p-14 text-center shadow-lg">
				<p className="mb-4 text-sm uppercase tracking-widest text-[#0f5132]">
					Before you go
				</p>

				<h2 className="font-serif text-3xl md:text-4xl leading-snug text-gray-900">
					Your journey doesn’t start with a booking.
				</h2>

				<p className="mt-6 text-lg text-gray-700 leading-relaxed">
					It starts with curiosity. With choosing roads that slow you down,
					places that welcome you, and stories that stay long after you return.
				</p>

				<div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
					<Link
						href="/explore"
						className="inline-flex items-center justify-center rounded-full bg-[#0f5132] px-8 py-4 text-white text-base font-medium transition hover:bg-[#0c432a]"
					>
						Explore Arunachal
					</Link>

					<Link
						href="/plan"
						className="inline-flex items-center justify-center rounded-full border border-[#0f5132] px-8 py-4 text-[#0f5132] text-base font-medium transition hover:bg-[#0f5132]/5"
					>
						Plan Your Route
					</Link>
				</div>

				<p className="mt-8 text-sm text-gray-500">
					Travel slowly. Stay longer. Leave lighter.
				</p>
			</div>
		</section>
	);
};

export default LetterCTA;
