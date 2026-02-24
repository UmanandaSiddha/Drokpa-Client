"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLogo } from "@/assets";
import { useAuth } from "@/hooks/auth/useAuth";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { useSignIn } from "@/hooks/auth/useSignIn";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import { GoogleSignUpModal } from "./GoogleSignUpModal";

export default function AuthForm({ defaultMode = "sign-in" }: { defaultMode?: "sign-in" | "sign-up" }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mode = searchParams.get("mode");
	const { isAuthenticated } = useAuth();
	const [isSignUp, setIsSignUp] = useState(mode === "sign-up" || (!mode && defaultMode === "sign-up"));

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	// Form state
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	// Forgot password modal state
	const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
	const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

	// Auth mutations
	const signUpMutation = useSignUp();
	const signInMutation = useSignIn();
	const forgotPasswordMutation = useForgotPassword();

	const {
		triggerGoogleAuth,
		completeGoogleSignUp,
		isPending,
		isCompletingSignUp,
		pendingGoogleUser,
		clearPendingGoogleUser,
	} = useGoogleAuth()

	const isLoading = signUpMutation.isPending || signInMutation.isPending;

	useEffect(() => {
		setIsSignUp(mode === "sign-up" || (!mode && defaultMode === "sign-up"));
	}, [mode, defaultMode]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isSignUp) {
			// Sign up
			signUpMutation.mutate({
				email: formData.email,
				firstName: formData.firstName,
				lastName: formData.lastName,
				password: formData.password,
			});
		} else {
			// Sign in
			signInMutation.mutate({
				email: formData.email,
				password: formData.password,
			});
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleForgotPassword = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		forgotPasswordMutation.mutate({ email: forgotPasswordEmail }, {
			onSuccess: () => {
				setShowForgotPasswordModal(false);
				setForgotPasswordEmail("");
			},
		});
	};

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

						<form className="space-y-5" onSubmit={handleSubmit} name={isSignUp ? "signup" : "login"}>
							{/* Name Fields (Sign Up Only) */}
							{isSignUp && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
									{/* First Name Field */}
									<div>
										<label
											htmlFor="firstName"
											className="block text-sm font-semibold mb-2 text-[#27261C]"
											style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
										>
											First Name
										</label>
										<div className="relative">
											<User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
											<input
												type="text"
												id="firstName"
												name="firstName"
												placeholder="Enter your first name"
												autoComplete="given-name"
												value={formData.firstName}
												onChange={handleChange}
												className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
												required
												disabled={isLoading}
												style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
											/>
										</div>
									</div>

									{/* Last Name Field */}
									<div>
										<label
											htmlFor="lastName"
											className="block text-sm font-semibold mb-2 text-[#27261C]"
											style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
										>
											Last Name
										</label>
										<div className="relative">
											<User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
											<input
												type="text"
												id="lastName"
												name="lastName"
												placeholder="Enter your last name"
												autoComplete="family-name"
												value={formData.lastName}
												onChange={handleChange}
												className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
												required
												disabled={isLoading}
												style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
											/>
										</div>
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
										value={formData.email}
										onChange={handleChange}
										className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
										required
										disabled={isLoading}
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
										id={isSignUp ? "new-password" : "current-password"}
										name="password"
										placeholder="Enter your password"
										autoComplete={isSignUp ? "new-password" : "current-password"}
										value={formData.password}
										onChange={handleChange}
										className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
										required
										disabled={isLoading}
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
									/>
								</div>
							</div>

							{/* Forgot Password Link (Sign In Only) */}
							{!isSignUp && (
								<div className="flex justify-end">
									<button
										type="button"
										onClick={() => setShowForgotPasswordModal(true)}
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
								disabled={isLoading}
								className="w-full bg-[#FC611E] hover:bg-[#f46a2f] text-white py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
								style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700, color: "#27261C" }}
							>
								{isLoading ? (
									<span className="flex items-center gap-2">
										<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										{isSignUp ? "Creating Account..." : "Signing In..."}
									</span>
								) : (
									<>
										{isSignUp ? "Create Account" : "Sign In"}
										<ArrowRight className="w-5 h-5" />
									</>
								)}
							</button>
						</form>

						{/* Toggle Sign In/Sign Up */}
						<p className="text-center text-[#686766] mt-6" style={{ fontWeight: 500 }}>
							{isSignUp ? "Already have an account?" : "Don't have an account?"}
							<button
								type="button"
								className="text-[#FC611E] hover:text-[#f46a2f] font-semibold ml-1 transition-colors"
								onClick={() => {
									const from = searchParams.get("from");
									const url = isSignUp ? "/sign-in" : "/sign-up";
									router.push(from ? `${url}?from=${encodeURIComponent(from)}` : url);
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

						{/* Google Login Button */}
						<button
							type="button"
							className="w-full px-6 py-3.5 bg-white border-2 border-[#DDE7E0] text-[#27261C] font-semibold rounded-full hover:border-[#4285F4] hover:shadow-md transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
							aria-label="Sign in with Google"
							title="Sign in with Google"
							onClick={() => triggerGoogleAuth()}
							disabled={isPending}
							style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
						>
							{/* Google Logo SVG */}
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC04" />
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
								<path d="M1 1h22v22H1z" fill="none" />
							</svg>
							{isPending ? 'Signing in...' : 'Continue with Google'}
						</button>

						{pendingGoogleUser && (
							<GoogleSignUpModal
								prefill={pendingGoogleUser.prefill}
								onSubmit={completeGoogleSignUp}
								onClose={clearPendingGoogleUser}
								isLoading={isCompletingSignUp}
							/>
						)}

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

			{/* Forgot Password Modal */}
			{showForgotPasswordModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
					<div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
						<h3
							className="text-2xl font-bold text-[#27261C] mb-2"
							style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
						>
							Forgot Password?
						</h3>
						<p className="text-[#686766] mb-6" style={{ fontWeight: 500 }}>
							Enter your email address and we'll send you a link to reset your password.
						</p>

						<form onSubmit={handleForgotPassword}>
							<div className="mb-6">
								<label
									htmlFor="forgotPasswordEmail"
									className="block text-sm font-semibold mb-2 text-[#27261C]"
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
								>
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
									<input
										type="email"
										id="forgotPasswordEmail"
										value={forgotPasswordEmail}
										onChange={(e) => setForgotPasswordEmail(e.target.value)}
										placeholder="your.email@example.com"
										className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors"
										required
										disabled={forgotPasswordMutation.isPending}
										style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
									/>
								</div>
							</div>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => {
										setShowForgotPasswordModal(false);
										setForgotPasswordEmail("");
									}}
									className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#27261C] py-3 rounded-full font-semibold transition-all duration-300"
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700 }}
									disabled={forgotPasswordMutation.isPending}
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={forgotPasswordMutation.isPending}
									className="flex-1 bg-[#FC611E] hover:bg-[#f46a2f] text-white py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700, color: "#27261C" }}
								>
									{forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
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
