import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, Lock } from "lucide-react";
import { MainLogo } from "@/assets";

export const metadata = {
    title: "Reset Password | Drokpa",
    description: "Set a new password for your Drokpa account",
};

export default function ResetPasswordPage() {
    return (
        <section className="relative min-h-screen flex items-center py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white" />
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />

            <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1400px] mx-auto">
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-start w-full">
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
                            <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#4F87C7]" />
                            <p
                                className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
                                style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                            >
                                Reset access
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
                            Set a new password.
                        </h1>
                        <p
                            className="text-base sm:text-lg md:text-xl leading-relaxed mb-8"
                            style={{ color: "#686766", fontWeight: 500, lineHeight: "1.7" }}
                        >
                            Choose a strong password you have not used before to keep your account secure.
                        </p>

                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-[#4F87C7]/10 text-[#4F87C7] flex-shrink-0">
                                    <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3
                                        className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
                                        style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                    >
                                        Strong credentials
                                    </h3>
                                    <p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
                                        Use at least 8 characters with letters and numbers.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-[#4F87C7]/10 text-[#4F87C7] flex-shrink-0">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3
                                        className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
                                        style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                    >
                                        Password confirmation
                                    </h3>
                                    <p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
                                        Re-enter the password to make sure it matches.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-[#DDE7E0] p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2
                                className="text-xl sm:text-2xl"
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    color: "#27261C",
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                Reset password
                            </h2>
                            <span
                                className="text-xs text-[#686766] px-2.5 py-1 rounded-full border border-[#DDE7E0]"
                                style={{ fontWeight: 600 }}
                            >
                                Secure
                            </span>
                        </div>

                        <form className="space-y-5">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold mb-2 text-[#27261C]"
                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                >
                                    New password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="Enter a new password"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#DDE7E0] focus:outline-none focus:border-[#4F87C7] bg-white transition-colors"
                                        style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, color: "#27261C" }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-semibold mb-2 text-[#27261C]"
                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                >
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        name="confirm-password"
                                        required
                                        placeholder="Re-enter your new password"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#DDE7E0] focus:outline-none focus:border-[#4F87C7] bg-white transition-colors"
                                        style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, color: "#27261C" }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-[#686766]" style={{ fontWeight: 500 }}>
                                Use at least 8 characters with a mix of letters and numbers.
                            </p>

                            <button
                                type="submit"
                                className="w-full bg-[#4F87C7] hover:bg-[#3f79ba] text-white py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700 }}
                            >
                                Reset password
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="text-center text-sm mt-6">
                            <span className="text-[#686766]" style={{ fontWeight: 500 }}>
                                Remembered your password?{" "}
                            </span>
                            <Link
                                href="/sign-in"
                                className="text-[#005246] font-semibold hover:underline"
                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
