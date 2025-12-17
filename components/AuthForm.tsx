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
		<div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
			<div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/10 backdrop-blur-lg border border-white/10">

				{/* Title */}
				<h2 className="text-3xl font-semibold text-center text-[#005246]">
					{isSignUp ? " Sign in via Email" : "Sign in via Email"}
				</h2>

				{/* DIVIDER WITH LOGO */}
				<div className="w-full my-8 flex items-center justify-center">
					<div className="w-[45%] border-t border-green-800" />

					<div className="flex justify-center items-center px-4">
						<Image src={DrokpaGreenLogo} alt="logo" width={48} height={48} priority className="w-12 h-12" />
					</div>

					<div className="w-[45%] border-t border-green-800" />
				</div>

				{/* Form */}
				<form className="mt-6 space-y-4">
					<div className="relative">
						<Mail className="absolute left-3 top-3 text-gray-500" size={20} />
						<input
							type="email"
							placeholder="Email"
							autoComplete="email"
							className="w-full bg-[#FFF0CA] text-black rounded-lg pl-10 py-3 placeholder-black outline-none"
							required
						/>
					</div>

					<div className="relative">
						<Lock className="absolute left-3 top-3 text-gray-500" size={20} />
						<input
							type="password"
							placeholder="Password"
							autoComplete="current-password"
							className="w-full bg-[#FFF0CA] text-black rounded-lg pl-10 py-3 placeholder-black outline-none"
							required
						/>
					</div>

					<button className="w-full mt-3 bg-[#005246] text-white font-semibold py-3 rounded-lg hover:bg-[#e6d7a8] transition">
						{isSignUp ? "Get Started" : "Sign In"}
					</button>
				</form>

				{/* Toggle */}
				<p className="text-center text-white mt-4">
					{isSignUp ? "Already have an account?" : "Don't have an account?"}
					<span
						className="text-[#FFF0CA] cursor-pointer ml-1"
						onClick={() => setIsSignUp(!isSignUp)}
					>
						{isSignUp ? "Sign In" : "Sign Up"}
					</span>
				</p>

				{/* Divider */}
				<div className="flex items-center my-6">
					<span className="flex-1 h-px bg-white/30" />
					<span className="px-3 text-white text-sm">Or continue with</span>
					<span className="flex-1 h-px bg-white/30" />
				</div>

				{/* Social Icons */}
				<div className="flex justify-center gap-6">
					<button className="p-3 bg-white rounded-full shadow hover:scale-105 transition">
						<Image src="/google.svg" width={30} height={30} alt="google" />
					</button>

					<button className="p-3 bg-[#1877f2] rounded-full text-white shadow hover:scale-105 transition">
						<Facebook size={50} />
					</button>

					<button className="p-3 bg-black rounded-full text-white shadow hover:scale-105 transition">
						<Apple size={50} />
					</button>
				</div>
			</div>
		</div>
	);
}
