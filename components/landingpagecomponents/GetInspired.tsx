import { ChevronRight } from "lucide-react";

interface Article {
	id: number;
	title: string;
	description?: string;
	image: string;
	size: "large" | "small";
}

export default function GetInspired() {
	const articles: Article[] = [
		{
			id: 1,
			title: "Where Seven Lakes Guard the Himalayas.",
			description:
				"Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
			image:
				"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1300&fit=crop",
			size: "large",
		},
		{
			id: 2,
			title: "Trails That Test, Views That Reward.",
			image:
				"https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&h=600&fit=crop",
			size: "small",
		},
		{
			id: 3,
			title: "Silence, Snow, and Sacred Ground.",
			image:
				"https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=900&h=600&fit=crop",
			size: "small",
		},
		{
			id: 4,
			title: "Mechuka: Where the Mountains Breathe.",
			image:
				"https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&h=600&fit=crop",
			size: "small",
		},
		{
			id: 5,
			title: "Floating Over Ziro’s Dreamscape.",
			image:
				"https://images.unsplash.com/photo-1586276393635-5ecd8a851acc?w=900&h=600&fit=crop",
			size: "small",
		},
	];

	const largeArticle = articles.find(a => a.size === "large");
	const smallArticles = articles.filter(a => a.size === "small");

	return (
		<section className="pt-24 bg-white">
			<div className="mx-auto">
				{/* Header */}

				<div className="flex items-center gap-2 mb-3">
					<div className="w-5 h-5 bg-[#4F87C7] rounded-sm flex-shrink-0 self-center"></div>
					<span
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							fontSize: "20px",
							color: "#353030",
							lineHeight: "20px",
							letterSpacing: "-0.07em",
							display: "flex",
							alignItems: "center",
						}}
					>
						GET INSPIRED.
					</span>
				</div>

				{/* Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

					{/* LEFT FEATURE */}
					{largeArticle && (
						<div className="group">
							<div className="relative overflow-hidden rounded-xl cursor-pointer">
								<img
									src={largeArticle.image}
									alt={largeArticle.title}
									className="w-full h-[720px] object-cover"
								/>
							</div>

							<h2
								className="mt-3 leading-snug"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									fontSize: "62px",
									color: "#353030",
									lineHeight: "64px",
									letterSpacing: "-0.07em",
								}}
							>
								{largeArticle.title}
							</h2>

							<p
								className="mt-3 leading-snug"
								style={{
									fontFamily: "var(--font-mona-sans)",
									fontWeight: 500,
									fontSize: "18px",
									color: "#686766",
									lineHeight: "20px",
									letterSpacing: "-0.02em"
								}}
							>
								{largeArticle.description}
							</p>

							<button className="mt-4 cursor-pointer inline-flex items-center px-5 py-2 bg-[#686766] text-white rounded text-sm font-medium">
								Read More
							</button>
						</div>
					)}

					{/* RIGHT GRID */}
					<div className="grid grid-cols-2 gap-6">
						{smallArticles.map(article => (
							<div key={article.id} className="group cursor-pointer">
								<div className="relative overflow-hidden rounded-xl">
									<img
										src={article.image}
										alt={article.title}
										className="w-full h-[320px] object-cover"
									/>
								</div>

								<h3
									className="mt-3 leading-snug"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										fontSize: "24px",
										color: "#353030",
										lineHeight: "28px",
										letterSpacing: "-0.06em",
									}}
								>
									{article.title}
								</h3>
							</div>
						))}
					</div>

				</div>

				{/* View All Link */}
				<div className="mt-16 text-center">
					<button className="text-sm px-6 py-3 rounded-md cursor-pointer text-gray-500 hover:text-gray-700 bg-[#F4F4F4] inline-flex items-center gap-2 font-medium">
						View All Articles
						<ChevronRight className="w-4 h-4 text-gray-500" />
					</button>
				</div>
			</div>
		</section>
	);
}
