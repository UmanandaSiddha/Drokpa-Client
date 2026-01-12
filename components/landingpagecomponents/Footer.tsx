"use client";

import { useState } from 'react';
import { ChevronRight, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import img1 from "@/assets/footer-image1.png";
import Image from 'next/image';

export default function Footer() {
	const [email, setEmail] = useState('');

	const handleSubmit = () => {
		if (email) {
			console.log('Email submitted:', email);
			setEmail('');
		}
	};

	return (
		<div className="">
			{/* CTA Banner */}
			<div className="mx-auto py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-0">
				<div className="relative rounded-2xl md:rounded-4xl overflow-hidden min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
					{/* Background */}
					<Image
						src={img1}
						alt="Mountains"
						fill
						className="object-cover mix-blend-multiply"
						priority
					/>

					{/* Content wrapper */}
					<div className="relative z-10 flex flex-col lg:flex-row w-full justify-between gap-6 md:gap-8 px-4 md:px-8 lg:px-16 pt-8 md:pt-12 lg:pt-14">

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
								"Where prayer flags color the wind and mountains remember."
							</h2>
						</div>

						{/* RIGHT CARD — BIG & TOP ALIGNED */}
						<div className="bg-white rounded-2xl md:rounded-4xl shadow-xl p-6 md:p-8 w-full lg:w-[320px] lg:flex-shrink-0 min-h-[280px] md:min-h-[320px] flex flex-col justify-between">

							{/* Progress bar */}
							<div className="flex gap-2 mb-4">
								<span className="h-1.5 w-12 bg-blue-500 rounded-full"></span>
								<span className="h-1.5 w-12 bg-gray-300 rounded-full"></span>
							</div>

							{/* Text */}
							<div className="mb-6">
								<p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 mb-3">
									Explore Arunachal's mountains, cultures, and quiet paths.
								</p>

								<p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700">
									15% off all treks.
								</p>
							</div>

							{/* Button */}
							<button className="w-full lg:w-[60%] bg-orange-500 hover:bg-orange-600 text-black font-medium py-3 rounded-xl transition">
								Explore All
							</button>
						</div>

					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t border-gray-200 bg-[#F6F6F6] rounded-t-2xl">
				<div className="max-w-8xl w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
						{/* Newsletter Section */}
						<div className="lg:col-span-1 lg:pr-10">
							<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
								Join the<br />Community
							</h3>
							<div className="flex">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									// onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
									placeholder="Enter Email"
									className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
								/>
								<button
									onClick={handleSubmit}
									className="p-2 md:p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
								>
									<ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-black" />
								</button>
							</div>
						</div>

						{/* Links Section (Quick + Social) */}
						<div className="lg:col-span-2 lg:pl-10 lg:ml-12">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 lg:border-l lg:border-gray-300 lg:pl-8">

								{/* Quick Links */}
								<ul className="space-y-3">
									<li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Contact Us</a></li>
									<li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Experiences</a></li>
									<li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Treks</a></li>
									<li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Route Planner</a></li>
									<li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Blogs</a></li>
									<li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Our Story</a></li>
								</ul>

								{/* Social Links */}
								<ul className="space-y-3 sm:border-l sm:border-gray-300 sm:pl-8">
									<li>
										<a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
											<Facebook className="w-5 h-5" />
											Facebook
										</a>
									</li>
									<li>
										<a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
											<Instagram className="w-5 h-5" />
											Instagram
										</a>
									</li>
									<li>
										<a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
											<Linkedin className="w-5 h-5" />
											Linkedin
										</a>
									</li>
									<li>
										<a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
											<Youtube className="w-5 h-5" />
											Youtube
										</a>
									</li>
								</ul>

							</div>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
						<div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
							<span>©Drokpa 2025. All rights reserved.</span>
							<a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
							<a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
							<a href="#" className="hover:text-emerald-600 transition-colors">Company Details</a>
						</div>
						{/* <div className="flex items-center gap-2">
							<span>Designed by</span>
							<span className="font-bold text-gray-900">UBY</span>
						</div> */}
					</div>
				</div>
			</footer>
		</div>
	);
}