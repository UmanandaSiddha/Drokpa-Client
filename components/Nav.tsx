"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DrokpaGreenLogo, DrokpaWhiteLogo } from "@/assets";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import AuthModal from "./Auth";

export default function Nav({ transition }: { transition: boolean }) {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [openAuth, setOpenAuth] = useState(false);
	const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 30);
		};
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const textClass = transition && !scrolled ? "text-white" : "text-(--brand-green)";
	const navBgClass = transition && !scrolled
		? "absolute bg-transparent"
		: "fixed bg-white/95 dark:bg-black/95 shadow-md backdrop-blur";

	return (
		<>
			<header
				className={`w-full top-0 left-0 z-30 transition-colors duration-500 overflow-x-hidden ${navBgClass}`}
			>
				<div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
					<div className="flex items-center gap-3">
						<Image
							src={transition && !scrolled ? DrokpaWhiteLogo : DrokpaGreenLogo}
							alt="logo"
							width={44}
							height={44}
							priority
						/>
						<span
							className={`${textClass} font-bold text-xl transition-colors duration-500`}
						>
							Drokpa
						</span>
					</div>

					{/* Desktop Menu */}
					<nav className={`hidden md:flex gap-8 items-center ${textClass}`}>
						<Link href="/" className="text-base font-medium hover:underline">
							Home
						</Link>

						<Link href="/explore" className="text-base font-medium hover:underline">
							Explore
						</Link>

						<Link href="/about" className="text-base font-medium hover:underline">
							About
						</Link>

						<Link href="/contact" className="text-base font-medium hover:underline">
							Contact
						</Link>
					</nav>

					{/* Desktop Buttons */}
					<div className="hidden md:flex gap-3">
						<button
							onClick={() => {
								setAuthMode("signin");
								setOpenAuth(true);
							}}
							className={`px-4 py-2 rounded-full border ${transition && !scrolled
								? "border-white/30"
								: "border-(--brand-green)"
								} ${textClass} hover:opacity-90 transition-colors duration-500`}
						>
							Sign in
						</button>

						<button
							onClick={() => {
								setAuthMode("signup");
								setOpenAuth(true);
							}}
							className={`px-4 py-2 rounded-full border ${transition && !scrolled
								? "border-white/30 bg-white text-black"
								: "border-(--brand-green) bg-(--brand-green) text-white"
								} hover:opacity-90 transition-colors duration-500`}
						>
							Sign up
						</button>
					</div>

					{/* Hamburger */}
					<button
						className="md:hidden relative z-50 overflow-hidden"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						{menuOpen ? (
							<X size={28} className={textClass} />
						) : (
							<Menu size={28} className={textClass} />
						)}
					</button>
				</div>
			</header>

			{/* Mobile Sidebar - Outside header for full screen coverage */}
			<AnimatePresence>
				{menuOpen && (
					<>
						{/* Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed inset-0 bg-black/50 md:hidden z-40"
							onClick={() => setMenuOpen(false)}
						/>

						{/* Sidebar */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ duration: 0.3 }}
							className="fixed top-0 left-0 w-[70%] h-screen bg-white shadow-2xl z-60 md:hidden overflow-y-auto"
						>
							<div className="flex items-center justify-between px-6 py-4.5 border-b shadow-md border-gray-200">
								<div className="flex gap-2">
									<Image
										src={DrokpaGreenLogo}
										alt="logo"
										width={40}
										height={40}
									/>
									<span className="text-(--brand-green) font-bold text-xl">
										Drokpa
									</span>
								</div>
								<button
									onClick={() => setMenuOpen(false)}
									className="text-(--brand-green) hover:opacity-70 transition-opacity"
								>
									<X size={28} />
								</button>
							</div>

							<nav className="flex flex-col h-[calc(100vh-80px)] p-6">
								<div className="flex flex-col gap-6">
									{/* Added Navigation Links */}
									<Link
										href="/"
										onClick={() => setMenuOpen(false)}
										className="text-lg font-medium text-slate-900 hover:text-(--brand-green)"
									>
										Home
									</Link>

									<Link
										href="/explore"
										onClick={() => setMenuOpen(false)}
										className="text-lg font-medium text-slate-900 hover:text-(--brand-green)"
									>
										Explore
									</Link>

									<Link
										href="/about"
										onClick={() => setMenuOpen(false)}
										className="text-lg font-medium text-slate-900 hover:text-(--brand-green)"
									>
										About
									</Link>

									<Link
										href="/contact"
										onClick={() => setMenuOpen(false)}
										className="text-lg font-medium text-slate-900 hover:text-(--brand-green)"
									>
										Contact
									</Link>

								</div>

								{/* Mobile buttons - Pushed to bottom */}
								<div className="mt-auto flex flex-col gap-3">
									<div className="h-px bg-gray-200 mb-3" />
									<button
										onClick={() => {
											setAuthMode("signin");
											setOpenAuth(true);
											setMenuOpen(false);
										}}
										className="px-4 py-3 rounded-lg border border-(--brand-green) text-(--brand-green)"
									>
										Sign in
									</button>
									<button
										onClick={() => {
											setAuthMode("signup");
											setOpenAuth(true);
											setMenuOpen(false);
										}}
										className="px-4 py-3 rounded-lg border bg-(--brand-green) text-white"
									>
										Sign up
									</button>
								</div>
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Auth Modal Rendering */}
			<AuthModal
				isOpen={openAuth}
				// mode={authMode}
				onClose={() => setOpenAuth(false)}
			/>
		</>
	);
}
