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
			text1: "Explore",
			text2: "Arunachal's",
			text3: "mountains,",
			text4: "cultures, and",
			text5: "quiet paths,",
			buttonBg: "#FC611E",
			buttonText: "#27261C",
		},
		{
			text1: "Explore",
			text2: "Arunachal's",
			text3: "mountains,",
			text4: "cultures, and",
			text5: "quiet paths,",
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
				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-8 md:py-12 lg:py-18">
					<div className="relative rounded-[20px] sm:rounded-[40px] md:rounded-[60px] overflow-hidden min-h-[480px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[560px]">
						{/* Background */}
						<Image
							src={FooterBg}
							alt="Mountains"
							fill
							sizes="100vw"
							className="object-cover mix-blend-multiply"
							priority
						/>

						{/* Content wrapper */}
						<div className="absolute inset-0 z-10 flex flex-col lg:flex-row w-full justify-between gap-6 md:gap-8 p-6 sm:p-8 md:p-10">

							{/* LEFT TEXT — TOP LEFT */}
							<div className="max-w-full lg:max-w-3xl">
								<h2
									className="leading-tight md:leading-snug text-[28px] md:text-[36px] lg:text-[48px]"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 500,
										// fontSize: "clamp(24px, 5vw, 48px)",
										color: "#27261C",
										lineHeight: "1.1",
										letterSpacing: "-0.07em",
									}}
								>
									“Where prayer flags color the wind and mountains remember.”
								</h2>
							</div>

							{/* RIGHT CARD — BIG & TOP ALIGNED */}
							<div className="bg-white rounded-2xl md:rounded-4xl p-5 sm:p-6 md:p-8 w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:w-[340px] lg:flex-shrink-0 min-h-[300px] sm:min-h-[320px] md:min-h-[320px] flex flex-col justify-between self-end sm:self-end lg:self-auto mt-auto sm:mt-auto lg:mt-0">

								{/* Progress bars */}
								<div className="w-full flex gap-2 mb-3 md:mb-4">
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
								<div className="w-full my-3 md:my-4">
									<p
										className="text-gray-900 text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px]"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 500,
											lineHeight: "1.3",
											letterSpacing: "-0.07em",
										}}
									>
										{currentContent.text1} <br />
										{currentContent.text2} <br />
										{currentContent.text3} <br />
										{currentContent.text4} <br />
										{currentContent.text5}
									</p>

									<p
										className="text-gray-900 text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px]"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 500,
											lineHeight: "1.3",
											letterSpacing: "-0.07em",
										}}
									>
										<span className="italic font-bold">15%</span> off all treks.
									</p>
								</div>

								{/* Button */}
								<button
									className="w-full sm:w-[70%] lg:w-[60%] text-[16px] sm:text-[18px] font-medium py-3 px-4 rounded-lg transition"
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
			<footer className="w-full bg-[#F6F6F6] rounded-t-[60px] p-0 md:p-12">
				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-8 sm:py-12 lg:py-16">
					<div className="flex flex-col gap-8 p-2 sm:p-4 md:p-8 lg:p-16 sm:gap-10 lg:h-[360px] lg:grid lg:grid-cols-3 lg:gap-12">
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
								Join the <br className='hidden sm:block' />Community
							</h3>
							<div className="flex w-full md:w-[50%] lg:w-full justify-between bg-[#DFDFDF] rounded-md">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter Email"
									className='w-full min-w-0 px-4 text-[#686766] placeholder-[#686766] outline-none'
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
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
						<div className="h-full lg:col-span-2 lg:pl-10 lg:ml-12">
							<div className="h-full flex flex-col sm:flex-row justify-between gap-6 sm:gap-10 lg:grid lg:grid-cols-2 lg:gap-10">

								{/* Quick Links */}
								<div className="h-full w-full md:w-[50%] lg:w-full sm:border-l-2 sm:border-[#D9D9D9] sm:pl-8">
									<ul className="space-y-2 mt-0 md:mt-4">
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
								</div>

								<hr className='block sm:hidden' />

								{/* Social Links */}
								<div className="w-full md:w-[50%] lg:w-full sm:border-l-2 sm:border-[#D9D9D9] sm:pl-8">
									<ul className="space-y-2 mt-0 md:mt-4 flex flex-wrap sm:flex-col justify-between">
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
					<div className="mt-4 pt-2 lg:border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-md text-gray-600" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}>
						<div className="flex flex-col sm:flex-row flex-wrap justify-center sm:items-start items-center gap-2">
							<span className='hidden sm:block'>©Drokpa 2025. All rights reserved.</span>
							<div className='flex flex-wrap justify-center gap-4'>
								<a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
								<span className="text-gray-400">•</span>
								<a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
								<span className="text-gray-400">•</span>
								<a href="#" className="hover:text-emerald-600 transition-colors">Company Details</a>
							</div>
							<span className='block sm:hidden'>©Drokpa 2025. All rights reserved.</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}