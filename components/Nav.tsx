"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DrokpaGreenLogo, DrokpaWhiteLogo } from "@/assets";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import AuthModal from "./Auth";

export default function Nav() {
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

	const textClass = scrolled ? "text-(--brand-green)" : "text-white";
	const navBgClass = scrolled
		? "fixed bg-white/95 dark:bg-black/95 shadow-md backdrop-blur"
		: "absolute bg-transparent";

	return (
		<>
			<header
				className={`w-full top-0 left-0 z-30 transition-colors duration-500 ${navBgClass}`}
			>
				<div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
					<div className="flex items-center gap-3">
						<Image
							src={scrolled ? DrokpaGreenLogo : DrokpaWhiteLogo}
							alt="logo"
							width={44}
							height={44}
							style={{ height: "auto" }}
						/>
						<span
							className={`${textClass} font-bold text-xl transition-colors duration-500`}
						>
							Drokpa
						</span>
					</div>

					{/* Desktop Menu */}
					<nav
						className={`hidden md:flex gap-8 items-center ${textClass} transition-colors duration-500`}
					>
						<span className="text-base font-medium cursor-pointer hover:underline">
							Home
						</span>
						<span className="text-base font-medium cursor-pointer hover:underline">
							Explore
						</span>
						<span className="text-base font-medium cursor-pointer hover:underline">
							Vehicles
						</span>
						<span className="text-base font-medium cursor-pointer hover:underline">
							About
						</span>
					</nav>

					{/* Desktop Buttons */}
					<div className="hidden md:flex gap-3">
						<button
							onClick={() => {
								setAuthMode("signin");
								setOpenAuth(true);
							}}
							className={`px-4 py-2 rounded-full border ${scrolled
								? "border-(--brand-green)"
								: "border-white/30"
								} ${textClass} hover:opacity-90 transition-colors duration-500`}
						>
							Sign in
						</button>

						<button
							onClick={() => {
								setAuthMode("signup");
								setOpenAuth(true);
							}}
							className={`px-4 py-2 rounded-full border ${scrolled
								? "border-(--brand-green) bg-(--brand-green) text-white"
								: "border-white/30 bg-white text-black"
								} hover:opacity-90 transition-colors duration-500`}
						>
							Sign up
						</button>
					</div>

					{/* Hamburger */}
					<button
						className="md:hidden"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						{menuOpen ? (
							<X size={28} className={textClass} />
						) : (
							<Menu size={28} className={textClass} />
						)}
					</button>
				</div>

				{/* Mobile Sidebar */}
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
								style={{ width: "70vw", height: "100vh" }}
								className="fixed top-0 left-0 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
							>
								<div className="flex items-center justify-between p-6 border-b border-gray-200">
									<Image
										src={DrokpaGreenLogo}
										alt="logo"
										width={40}
										height={40}
										style={{ height: "auto" }}
									/>
									<span className="text-(--brand-green) font-bold text-xl">
										Drokpa
									</span>
									<button
										onClick={() => setMenuOpen(false)}
										className="text-(--brand-green) hover:opacity-70 transition-opacity"
									>
										<X size={28} />
									</button>
								</div>

								<nav className="flex flex-col gap-6 p-6">
									{/* Added Navigation Links */}
									<Link href="/" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-slate-900 hover:text-(--brand-green) transition-colors">
										Home
									</Link>
									<Link href="/" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-slate-900 hover:text-(--brand-green) transition-colors">
										Explore
									</Link>
									<Link href="/" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-slate-900 hover:text-(--brand-green) transition-colors">
										Vehicles
									</Link>
									<Link href="/" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-slate-900 hover:text-(--brand-green) transition-colors">
										About
									</Link>

									<div className="h-px bg-gray-200 my-3" />

									{/* Mobile buttons */}
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
								</nav>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</header>

			{/* Auth Modal Rendering */}
			<AuthModal
				isOpen={openAuth}
				// mode={authMode}
				onClose={() => setOpenAuth(false)}
			/>
		</>
	);
}
