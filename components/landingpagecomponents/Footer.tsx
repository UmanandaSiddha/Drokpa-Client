"use client";

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { FooterBg } from '@/assets';

type FooterProps = {
	showCta?: boolean;
};

export default function Footer({ showCta = false }: FooterProps) {
	const [email, setEmail] = useState('');
	const [currentContentIndex, setCurrentContentIndex] = useState(0);
	const [progress, setProgress] = useState(0);

	// Content data for both states
	const contents = [
		{
			text1: "Explore Arunachal's",
			text2: "mountains,",
			text3: "cultures,",
			text4: "and quiet paths.",
			text5: "15% off all treks.",
			buttonBg: "#FC611E",
			buttonText: "#27261C",
		},
		{
			text1: "Explore Arunachal's",
			text2: "mountains,",
			text3: "cultures,",
			text4: "and quiet paths.",
			text5: "15% off all treks.",
			buttonBg: "#000000",
			buttonText: "#FFFFFF",
		},
	];

	useEffect(() => {
		if (!showCta) return;
		let start = Date.now();

		const duration = 10000;
		const interval = 16;

		const timer = setInterval(() => {
			const elapsed = Date.now() - start;
			const newProgress = (elapsed / duration) * 100;

			if (newProgress >= 100) {
				setCurrentContentIndex((i) => (i + 1) % contents.length);
				setProgress(0);
				start = Date.now(); // restart cycle
			} else {
				setProgress(newProgress);
			}
		}, interval);

		return () => clearInterval(timer);
	}, [showCta]);


	const currentContent = contents[currentContentIndex];

	const handleSubmit = () => {
		if (email) {
			console.log('Email submitted:', email);
			setEmail('');
		}
	};

	return (
		<div className="">
			{showCta && (
				<div className="w-full px-4 md:px-6 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-8 md:py-14 lg:py-18">
					<div className="relative rounded-2xl md:rounded-4xl lg:rounded-[60px] overflow-hidden">
						{/* Background */}
						<Image
							src={FooterBg}
							alt="Mountains"
							width={0}
							height={0}
							sizes="100vw"
							className="w-full h-auto mix-blend-multiply"
							priority
						/>

						{/* Content wrapper */}
						<div className="absolute inset-0 z-10 flex flex-col lg:flex-row w-full justify-between gap-6 md:gap-8 p-10">

							{/* LEFT TEXT — TOP LEFT */}
							<div className="max-w-full lg:max-w-3xl">
								<h2
									className="leading-tight md:leading-snug"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 500,
										fontSize: "clamp(24px, 5vw, 48px)",
										color: "#27261C",
										lineHeight: "1.1",
										letterSpacing: "-0.07em",
									}}
								>
									“Where prayer flags color the wind and mountains remember.”
								</h2>
							</div>

							{/* RIGHT CARD — BIG & TOP ALIGNED */}
							<div className="bg-white rounded-2xl md:rounded-4xl p-6 md:p-8 w-full lg:w-[340px] lg:flex-shrink-0 min-h-[280px] md:min-h-[320px] flex flex-col justify-between">

								{/* Progress bars */}
								<div className="w-full flex gap-2 mb-4">
									{/* First progress bar */}
									<div className="relative h-2 flex-1 bg-[#27261C] rounded-full overflow-hidden">
										<div
											className="absolute top-0 left-0 h-full bg-[#4F87C7] rounded-full"
											style={{
												width: currentContentIndex === 0 ? `${progress}%` : '100%',
											}}
										/>
									</div>
									{/* Second progress bar */}
									<div className="relative h-2 flex-1 bg-[#27261C] rounded-full overflow-hidden">
										<div
											className="absolute top-0 left-0 h-full bg-[#4F87C7] rounded-full"
											style={{
												width: currentContentIndex === 1 ? `${progress}%` : '0%',
											}}
										/>
									</div>
								</div>

								{/* Text */}
								<div className="w-full my-4">
									<p
										className="text-gray-900"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 500,
											fontSize: "32px",
											lineHeight: "42px",
											letterSpacing: "-7%",
										}}
									>
										{currentContent.text1} <span className="underline">{currentContent.text2}</span> <span className="underline">{currentContent.text3}</span> {currentContent.text4}
									</p>

									<p
										className="text-gray-900"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 500,
											fontSize: "32px",
											lineHeight: "42px",
											letterSpacing: "-7%",
										}}
									>
										<span className="italic font-bold">15%</span> off all treks.
									</p>
								</div>

								{/* Button */}
								<button
									className="w-full lg:w-[60%] text-[18px] font-medium py-3 px-4 rounded-lg transition"
									style={{
										fontFamily: "var(--font-mona-sans), sans-serif",
										fontWeight: 500,
										backgroundColor: currentContent.buttonBg,
										color: currentContent.buttonText,
									}}
								>
									Explore All
								</button>
							</div>

						</div>
					</div>
				</div>
			)}

			{/* Footer */}
			<footer className="w-full bg-[#F6F6F6] rounded-t-[60px]">
				<div className="w-full px-4 md:px-6 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-8 sm:py-12 lg:py-16">
					<div className="h-[320px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
						{/* Newsletter Section */}
						<div className="lg:col-span-1 lg:pr-10">
							<h3
								className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									fontSize: "clamp(32px, 5vw, 64px)",
									color: "#27261C",
									lineHeight: "1.1",
									letterSpacing: "-0.07em",
								}}
							>
								Join the<br />Community
							</h3>
							<div className="flex justify-between bg-[#DFDFDF] rounded-md">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									// onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
									placeholder="Enter Email"
									className='px-4 text-[#686766] placeholder-[#686766]'
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
								// className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
								/>
								<button
									onClick={handleSubmit}
									className="p-2 md:p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
								>
									<ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-black" />
								</button>
							</div>
						</div>

						{/* Links Section (Quick + Social) */}
						<div className="lg:col-span-2 lg:pl-10 lg:ml-12 h-full lg:border-l-2 lg:border-[#D9D9D9] lg:pl-8">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 h-full">

								{/* Quick Links */}
								<ul className="space-y-2 mt-4">
									<li>
										<a
											href="#"
											className="text-gray-700 hover:text-emerald-600 font-medium"
											style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
										>
											Contact Us
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-700 hover:text-emerald-600 font-medium"
											style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
										>
											Experiences
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-700 hover:text-emerald-600 font-medium"
											style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
										>
											Treks
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-700 hover:text-emerald-600 font-medium"
											style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
										>
											Route Planner
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-700 hover:text-emerald-600 font-medium"
											style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
										>
											Blogs
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-700 hover:text-emerald-600 font-medium"
											style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
										>
											Our Story
										</a>
									</li>
								</ul>

								{/* Social Links */}
								<div className="sm:border-l-2 sm:border-[#D9D9D9] sm:pl-8 h-full">
									<ul className="space-y-2 mt-4">
										<li>
											<a
												href="#"
												className="text-gray-700 hover:text-emerald-600 font-medium"
												style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
											>
												Facebook
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-gray-700 hover:text-emerald-600 font-medium"
												style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
											>
												Instagram
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-gray-700 hover:text-emerald-600 font-medium"
												style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
											>
												Linkedin
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-gray-700 hover:text-emerald-600 font-medium"
												style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
											>
												Youtube
											</a>
										</li>
									</ul>
								</div>

							</div>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}>
						<div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
							<span>©Drokpa 2025. All rights reserved.</span>
							<span className="text-gray-400">•</span>
							<a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
							<span className="text-gray-400">•</span>
							<a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
							<span className="text-gray-400">•</span>
							<a href="#" className="hover:text-emerald-600 transition-colors">Company Details</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}