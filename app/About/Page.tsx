import Image from "next/image";

export default function AboutPage() {
	return (
		<main className="bg-white text-gray-800">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-linear-to-b from-(--brand-green) to-white">
				<div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div>
						<p className="text-sm tracking-widest uppercase text-white mb-4">
							A letter from Arunachal
						</p>
						<h1 className="text-4xl md:text-5xl font-serif leading-tight text-white mb-6">
							Welcome. <br />
							Arunachal has already called you.
						</h1>
						<p className="text-lg leading-relaxed text-gray-700">
							This is not a travel portal born out of convenience.
							It is a quiet collection of stories, homes, routes,
							and traditions — gathered with care, and offered to
							you the way locals welcome a guest.
						</p>
					</div>

					<div className="relative h-[360px] w-full rounded-2xl overflow-hidden shadow-lg">
						<Image
							src="https://images.unsplash.com/photo-1648963798678-a921079b98b9?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="Arunachal landscape"
							fill
							className="object-cover"
							priority
						/>
					</div>
				</div>
			</section>

			{/* Body Letter */}
			<section className="max-w-4xl mx-auto px-6 py-20 space-y-16">
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
				<div className="pt-12 border-t border-gray-200">
					<p className="text-lg text-gray-700 leading-relaxed mb-6">
						If you come to Arunachal, come with patience.
						Come with curiosity.
						Come ready to listen.
					</p>
					<p className="text-lg text-gray-700 leading-relaxed">
						If this platform helps you feel even a little more prepared,
						then this letter has served its purpose.
					</p>

					<p className="mt-10 text-[#0f5132] font-medium">
						— From Arunachal, with love
					</p>
				</div>
			</section>
		</main>
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
			<h2 className="text-2xl font-serif text-[#0f5132] mb-4">
				{title} 
			</h2>
			<p className="text-gray-600 leading-relaxed text-lg">
				{children}
			</p>
		</div>
	);
}
