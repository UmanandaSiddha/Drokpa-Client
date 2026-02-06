"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Facebook, Apple } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DrokpaGreenLogo } from "@/assets";

export default function AuthForm({ defaultMode = "signin" }: { defaultMode?: "signin" | "signup" }) {
	const searchParams = useSearchParams();
	const mode = searchParams.get("mode"); // 'signup' or null
	const [isSignUp, setIsSignUp] = useState(mode === "signup" || (!mode && defaultMode === "signup"));

	useEffect(() => {
		setIsSignUp(mode === "signup" || (!mode && defaultMode === "signup"));
	}, [mode, defaultMode]);

	return (
		<section className="relative py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden">
			<div className="absolute inset-0 bg-linear-to-b from-[#F5F1E6] via-white to-white" />
			<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FC611E]/10 blur-3xl" />
			<div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#4F87C7]/10 blur-3xl" />

			<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1200px] mx-auto">
				<div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<span className="inline-flex h-3 w-3 rounded-sm bg-[#FC611E]" />
							<p
								className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
								style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
							>
								{isSignUp ? "Create account" : "Welcome back"}
							</p>
						</div>
						<h2
							className="leading-tight mb-5 sm:mb-6"
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								fontSize: "clamp(32px, 6vw, 54px)",
								color: "#353030",
								letterSpacing: "-0.06em",
							}}
						>
							{isSignUp ? "Start your journey with Drokpa." : "Sign in to continue your journey."}
						</h2>
						<p
							className="text-base sm:text-lg leading-relaxed max-w-xl"
							style={{ color: "#686766", fontWeight: 500 }}
						>
							Access curated stays, route tools, and local experiences designed for Arunachal.
						</p>
					</div>

					<div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/70">
						<div className="flex items-center justify-between mb-6">
							<h3
								className="text-xl sm:text-2xl"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									color: "#353030",
								}}
							>
								{isSignUp ? "Create your account" : "Sign in via email"}
							</h3>
							<Image src={DrokpaGreenLogo} alt="logo" width={40} height={40} priority className="w-10 h-10" />
						</div>

						<form className="space-y-4">
							<div className="relative">
								<Mail className="absolute left-3 top-3 text-gray-500" size={18} />
								<input
									type="email"
									placeholder="Email"
									autoComplete="email"
									className="w-full bg-white text-black rounded-xl pl-10 py-3 border border-gray-200 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#005246] focus:border-transparent"
									required
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
								/>
							</div>

							<div className="relative">
								<Lock className="absolute left-3 top-3 text-gray-500" size={18} />
								<input
									type="password"
									placeholder="Password"
									autoComplete="current-password"
									className="w-full bg-white text-black rounded-xl pl-10 py-3 border border-gray-200 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#005246] focus:border-transparent"
									required
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
								/>
							</div>

							<button
								className="w-full mt-2 bg-[#005246] text-white font-semibold py-3 rounded-xl hover:bg-[#004536] transition"
								style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
							>
								{isSignUp ? "Create account" : "Sign in"}
							</button>
						</form>

						<p className="text-center text-[#686766] mt-4" style={{ fontWeight: 500 }}>
							{isSignUp ? "Already have an account?" : "Don't have an account?"}
							<span
								className="text-[#005246] cursor-pointer ml-1"
								onClick={() => setIsSignUp(!isSignUp)}
							>
								{isSignUp ? "Sign in" : "Sign up"}
							</span>
						</p>

						<div className="flex items-center my-6">
							<span className="flex-1 h-px bg-gray-200" />
							<span className="px-3 text-[#686766] text-xs sm:text-sm">Or continue with</span>
							<span className="flex-1 h-px bg-gray-200" />
						</div>

						<div className="flex justify-center gap-4">
							<button className="p-3 bg-white rounded-full shadow hover:scale-105 transition">
								<Image src="/google.svg" width={22} height={22} alt="google" />
							</button>
							<button className="p-3 bg-[#1877f2] rounded-full text-white shadow hover:scale-105 transition">
								<Facebook size={22} />
							</button>
							<button className="p-3 bg-black rounded-full text-white shadow hover:scale-105 transition">
								<Apple size={22} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
