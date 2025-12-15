"use client";

import { useEffect, useState } from "react";
import { X, Mail, Lock, Facebook, Apple } from "lucide-react";
import Image from "next/image";
import { DrokpaGreenLogo } from "@/assets";
import { SiFacebook, SiGoogle, SiApple } from "react-icons/si";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: Props) {
    const [isSignUp, setIsSignUp] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md sm:max-w-md p-6 sm:p-8 rounded-2xl shadow-xl bg-white/50 backdrop-blur-lg border border-white/10 z-50">

                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-white hover:opacity-70 transition"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#005246]">
                    {isSignUp ? "Sign up via Email" : "Sign in via Email"}
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
                <form className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-600" size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            className="w-full bg-[#FFF0CA] text-black rounded-lg pl-10 py-2 sm:py-3 placeholder-black outline-none"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-600" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            className="w-full bg-[#FFF0CA] text-black rounded-lg pl-10 py-2 sm:py-3 placeholder-black outline-none"
                            required
                        />
                    </div>

                    <div className="text-right mt-1 sm:mt-2">
                        <button
                            type="button"
                            className="text-sm sm:text-base text-[#005246] underline hover:opacity-80 transition"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        className="w-full mt-3 sm:mt-2 bg-[#005246] text-white font-semibold py-3 sm:py-2.5 text-lg sm:text-base rounded-lg hover:bg-[#e6d7a8] transition"
                    >
                        {isSignUp ? "Get Started" : "Sign In"}
                    </button>

                </form>

                {/* Switch */}
                <p className="text-center text-[#005246] mt-3 sm:mt-4 text-sm sm:text-base">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <span
                        className="text-[#005246] cursor-pointer ml-1"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </span>
                </p>

                {/* Divider */}
                <div className="flex items-center my-4 sm:my-6">
                    <span className="flex-1 h-px bg-[#005246]" />
                    <span className="px-2 sm:px-3 text-[#005246] text-xs sm:text-sm">Or continue with</span>
                    <span className="flex-1 h-px bg-[#005246]" />
                </div>

                {/* Social Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
                    <button className="flex items-center justify-center bg-white w-full sm:w-36 py-2.5 sm:py-3 rounded-lg border hover:scale-105 transition">
                        {/* <Image src="/google.svg" width={24} height={24} alt="google" className="mr-2" /> */}
                        <SiGoogle size={24} className="m-1" />
                        <span className="text-black font-medium text-sm">Google</span>
                    </button>

                    <button className="flex items-center justify-center p-2 sm:p-3 bg-[#1877f2] w-full sm:w-36 rounded-lg text-white shadow hover:scale-105 transition">
                        <SiFacebook size={24} className="m-1" />
                        <span className="hidden sm:block ml-2 text-sm font-medium">Facebook</span>
                    </button>

                    <button className="flex items-center justify-center p-2 sm:p-3 bg-black w-full sm:w-36 rounded-lg text-white shadow hover:scale-105 transition">
                        <SiApple size={24} className="m-1" />
                        <span className="hidden sm:block ml-2 text-sm font-medium">Apple</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
