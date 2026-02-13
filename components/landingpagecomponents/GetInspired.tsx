import { Inspired1, Inspired2, Inspired3, Inspired4, Inspired5 } from "@/assets";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Article {
	id: number;
	href: string;
	title: string;
	description?: string;
	image: string;
	size: "large" | "small";
}

export default function GetInspired() {
	const articles: Article[] = [
		{
			id: 1,
			href: "/articles/seven-lakes",
			title: "Where Seven Lakes Guard the Himalayas.",
			description:
				"Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
			image: Inspired1.src,
			size: "large",
		},
		{
			id: 2,
			href: "/articles/trails-that-test",
			title: "Trails That Test, Views That Reward.",
			image: Inspired2.src,
			size: "small",
		},
		{
			id: 3,
			href: "/articles/silence-snow-sacred",
			title: "Silence, Snow, and Sacred Ground.",
			image: Inspired3.src,
			size: "small",
		},
		{
			id: 4,
			href: "/articles/mechuka-breathe",
			title: "Mechuka: Where the Mountains Breathe.",
			image: Inspired4.src,
			size: "small",
		},
		{
			id: 5,
			href: "/articles/ziro-dreamscape",
			title: "Floating Over Ziro’s Dreamscape.",
			image: Inspired5.src,
			size: "small",
		},
	];

	const largeArticle = articles.find(a => a.size === "large");
	const smallArticles = articles.filter(a => a.size === "small");

	return (
		<section className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 md:pb-16 bg-white">
			<div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
				{/* Header */}

				<div className="flex items-center gap-2 mb-3 sm:mb-4">
					<div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#4F87C7] rounded-sm flex-shrink-0 self-center"></div>
					<span
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							fontSize: "clamp(16px, 4vw, 20px)",
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
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-start">

					{/* LEFT FEATURE */}
					{largeArticle && (
						<div className="group">
							<Link href={largeArticle.href} className="relative overflow-hidden rounded-xl cursor-pointer block">
								<img
									src={largeArticle.image}
									alt={largeArticle.title}
									className="w-full h-[520px] sm:h-[620px] md:h-[700px] lg:h-[750px] xl:h-[880px] object-cover"
								/>
							</Link>

							<h2
								className="mt-3 sm:mt-4 leading-snug"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									fontSize: "clamp(32px, 8vw, 62px)",
									color: "#353030",
									lineHeight: "clamp(38px, 9vw, 64px)",
									letterSpacing: "-0.07em",
								}}
							>
								{largeArticle.title}
							</h2>

							<p
								className="mt-3 sm:mt-4 leading-snug"
								style={{
									fontFamily: "var(--font-mona-sans)",
									fontWeight: 500,
									fontSize: "clamp(16px, 4vw, 20px)",
									color: "#686766",
									lineHeight: "clamp(20px, 5vw, 24px)",
									letterSpacing: "-0.02em"
								}}
							>
								{largeArticle.description}
							</p>

							<Link
								href={largeArticle.href}
								className="mt-4 sm:mt-5 inline-flex items-center px-4 sm:px-5 py-2 bg-[#686766] text-white rounded-md text-xs sm:text-sm font-medium"
							>
								Read More
							</Link>
						</div>
					)}

					{/* RIGHT GRID */}
					<div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-start">
						{smallArticles.map(article => (
							<Link key={article.id} href={article.href} className="group cursor-pointer flex flex-col">
								<div className="relative overflow-hidden rounded-xl">
									<img
										src={article.image}
										alt={article.title}
										className="w-full aspect-square object-cover"
									/>
								</div>

								<h3
									className="mt-3 sm:mt-4 leading-snug w-[90%]"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										fontSize: "clamp(18px, 4.5vw, 28px)",
										color: "#353030",
										lineHeight: "clamp(22px, 5.5vw, 32px)",
										letterSpacing: "-0.06em",
									}}
								>
									{article.title}
								</h3>
							</Link>
						))}
					</div>

				</div>

				{/* View All Link */}
				<div className="mt-8 sm:mt-12 md:mt-16 text-center">
					<Link
						href="/articles"
						className="text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-md cursor-pointer text-gray-500 hover:text-gray-700 bg-[#F4F4F4] inline-flex items-center gap-2 font-medium"
					>
						View All Articles
						<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
					</Link>
				</div>
			</div>
		</section>
	);
}
