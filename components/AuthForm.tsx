"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { SiGoogle, SiMeta, SiApple } from "react-icons/si";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLogo } from "@/assets";

export default function AuthForm({ defaultMode = "sign-in" }: { defaultMode?: "sign-in" | "sign-up" }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mode = searchParams.get("mode");
	const [isSignUp, setIsSignUp] = useState(mode === "sign-up" || (!mode && defaultMode === "sign-up"));

	useEffect(() => {
		setIsSignUp(mode === "sign-up" || (!mode && defaultMode === "sign-up"));
	}, [mode, defaultMode]);

	return (
		<section className="relative min-h-screen flex items-center py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white" />
			<div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
			<div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />

			<div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1400px] mx-auto">
				<div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-start w-full">
					{/* LEFT - Info Section */}
					<div>
						<Link href="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8">
							<Image
								src={MainLogo}
								alt="Drokpa Logo"
								priority
								width={44}
								height={44}
								className="w-8 h-8 md:w-11 md:h-11"
							/>
							<span
								className="text-lg md:text-2xl"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									lineHeight: "32px",
									letterSpacing: "-0.07em",
									color: "#353030",
								}}
							>
								Drokpa.
							</span>
						</Link>
						<div className="flex items-center gap-2 mb-5 sm:mb-6">
							<span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#FC611E]" />
							<p
								className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
								style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
							>
								{isSignUp ? "Create account" : "Welcome back"}
							</p>
						</div>
						<h1
							className="leading-[1.1] mb-6 sm:mb-7"
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								fontSize: "clamp(36px, 7vw, 64px)",
								color: "#27261C",
								letterSpacing: "-0.06em",
							}}
						>
							{isSignUp ? (
								<>
									Start your journey <br />
									with Drokpa.
								</>
							) : (
								<>
									Welcome back <br />
									to Drokpa.
								</>
							)}
						</h1>
						<p
							className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10"
							style={{ color: "#686766", fontWeight: 500, lineHeight: "1.7" }}
						>
							{isSignUp
								? "Create an account to access curated homestays, route planning tools, and authentic local experiences across Arunachal Pradesh."
								: "Sign in to continue exploring authentic stays, routes, and experiences across Arunachal Pradesh."}
						</p>

						{/* Benefits Section */}
						<div className="space-y-4 sm:space-y-5">
							<BenefitItem
								icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />}
								title="Authentic Homestays"
								description="Access verified local accommodations"
							/>
							<BenefitItem
								icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />}
								title="Route Planning"
								description="Plan your journey with real-time insights"
							/>
							<BenefitItem
								icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />}
								title="Local Experiences"
								description="Connect with authentic cultural activities"
							/>
						</div>
					</div>

					{/* RIGHT - Form Section */}
					<div className="bg-white border-2 border-[#DDE7E0] p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
						<div className="flex items-center justify-between mb-6 sm:mb-8">
							<h2
								className="text-xl sm:text-2xl md:text-3xl"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									color: "#27261C",
									letterSpacing: "-0.04em",
								}}
							>
								{isSignUp ? "Create Account" : "Sign In"}
							</h2>
						</div>

						<form className="space-y-5">
							{/* Name Field (Sign Up Only) */}
							{isSignUp && (
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-semibold mb-2 text-[#27261C]"
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
									>
										Full Name
									</label>
									<div className="relative">
										<User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
										<input
											type="text"
											id="name"
											name="name"
											placeholder="Enter your full name"
											autoComplete="name"
											className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
											required
											style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
										/>
									</div>
								</div>
							)}

							{/* Email Field */}
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-semibold mb-2 text-[#27261C]"
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
								>
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
									<input
										type="email"
										id="email"
										name="email"
										placeholder="your.email@example.com"
										autoComplete="email"
										className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
										required
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
									/>
								</div>
							</div>

							{/* Password Field */}
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-semibold mb-2 text-[#27261C]"
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
								>
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
									<input
										type="password"
										id="password"
										name="password"
										placeholder="Enter your password"
										autoComplete={isSignUp ? "new-password" : "current-password"}
										className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
										required
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
									/>
								</div>
							</div>

							{/* Forgot Password Link (Sign In Only) */}
							{!isSignUp && (
								<div className="flex justify-end">
									<button
										type="button"
										className="text-sm text-[#4F87C7] hover:text-[#FC611E] font-medium transition-colors"
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
									>
										Forgot password?
									</button>
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								className="w-full bg-[#FC611E] hover:bg-[#f46a2f] text-white py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
								style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700, color: "#27261C" }}
							>
								{isSignUp ? "Create Account" : "Sign In"}
								<ArrowRight className="w-5 h-5" />
							</button>
						</form>

						{/* Toggle Sign In/Sign Up */}
						<p className="text-center text-[#686766] mt-6" style={{ fontWeight: 500 }}>
							{isSignUp ? "Already have an account?" : "Don't have an account?"}
							<button
								type="button"
								className="text-[#FC611E] hover:text-[#f46a2f] font-semibold ml-1 transition-colors"
								onClick={() => {
									if (isSignUp) {
										router.push("/sign-in");
									} else {
										router.push("/sign-up");
									}
								}}
								style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
							>
								{isSignUp ? "Sign in" : "Sign up"}
							</button>
						</p>

						{/* Divider */}
						<div className="flex items-center my-6 sm:my-8">
							<span className="flex-1 h-px bg-[#DDE7E0]" />
							<span className="px-4 text-[#686766] text-xs sm:text-sm font-medium">Or continue with</span>
							<span className="flex-1 h-px bg-[#DDE7E0]" />
						</div>

						{/* Social Login Buttons */}
						<div className="flex justify-center gap-3 sm:gap-4">
							<button
								type="button"
								className="p-3 sm:p-3.5 bg-white border-2 border-[#DDE7E0] rounded-full text-[#1F2937] hover:border-[#FC611E] hover:shadow-md transition-all duration-300 hover:bg-gray-50"
								aria-label="Sign in with Google"
								title="Sign in with Google"
							>
								<SiGoogle size={20} className="sm:w-6 sm:h-6" />
							</button>
							<button
								type="button"
								className="p-3 sm:p-3.5 bg-white border-2 border-[#DDE7E0] rounded-full text-[#1B74E4] hover:border-[#FC611E] hover:shadow-md transition-all duration-300 hover:bg-gray-50"
								aria-label="Sign in with Meta"
								title="Sign in with Meta"
							>
								<SiMeta size={20} className="sm:w-6 sm:h-6" />
							</button>
							<button
								type="button"
								className="p-3 sm:p-3.5 bg-white border-2 border-[#DDE7E0] rounded-full text-black hover:border-[#FC611E] hover:shadow-md transition-all duration-300 hover:bg-gray-50"
								aria-label="Sign in with Apple"
								title="Sign in with Apple"
							>
								<SiApple size={20} className="sm:w-6 sm:h-6" />
							</button>
						</div>

						{/* Terms & Privacy */}
						{isSignUp && (
							<p className="text-xs text-center text-[#686766] mt-6 leading-relaxed" style={{ fontWeight: 400 }}>
								By signing up, you agree to our{" "}
								<a href="/terms" className="text-[#4F87C7] hover:text-[#FC611E] underline">
									Terms of Service
								</a>{" "}
								and{" "}
								<a href="/privacy" className="text-[#4F87C7] hover:text-[#FC611E] underline">
									Privacy Policy
								</a>
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function BenefitItem({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="flex items-start gap-4 group">
			<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-[#FC611E]/10 text-[#FC611E] flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
				{icon}
			</div>
			<div className="flex-1 min-w-0">
				<h3
					className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
					style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
				>
					{title}
				</h3>
				<p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
					{description}
				</p>
			</div>
		</div>
	);
}
