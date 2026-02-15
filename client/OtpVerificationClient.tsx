"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { MainLogo } from "@/assets";

export default function OtpVerificationClient() {
    const inputCount = 6;
    const otpEmail = "you@example.com";
    const [digits, setDigits] = useState<string[]>(Array.from({ length: inputCount }, () => ""));
    const [timeLeft, setTimeLeft] = useState(180);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formattedTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, [timeLeft]);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        setDigits((prev) => {
            const next = [...prev];
            next[index] = digit;
            return next;
        });
        if (digit && index < inputCount - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            focusInput(index - 1);
        }
        if (event.key === "ArrowRight" && index < inputCount - 1) {
            event.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, inputCount);
        if (!pasted) return;
        const nextDigits = Array.from({ length: inputCount }, (_, index) => pasted[index] || "");
        setDigits(nextDigits);
        const lastIndex = Math.min(pasted.length, inputCount) - 1;
        if (lastIndex >= 0) focusInput(lastIndex);
    };

    const handleResend = () => {
        setDigits(Array.from({ length: inputCount }, () => ""));
        setTimeLeft(180);
        focusInput(0);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const code = digits.join("");
        if (code.length !== inputCount) return;
        // Submit OTP code here.
    };

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
                            <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#FC611E]" />
                            <p
                                className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
                                style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                            >
                                Security check
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
                            Verify your code.
                        </h1>
                        <p
                            className="text-base sm:text-lg md:text-xl leading-relaxed mb-8"
                            style={{ color: "#686766", fontWeight: 500, lineHeight: "1.7" }}
                        >
                            We sent a 6-digit code to your email. Enter it to continue.
                        </p>

                        <div className="space-y-4 sm:space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-[#FC611E]/10 text-[#FC611E] flex-shrink-0">
                                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3
                                        className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
                                        style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                    >
                                        Your account stays protected
                                    </h3>
                                    <p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
                                        We verify every sign-in for extra safety.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-[#FC611E]/10 text-[#FC611E] flex-shrink-0">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3
                                        className="text-base sm:text-lg font-semibold text-[#27261C] mb-1"
                                        style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                    >
                                        Quick verification
                                    </h3>
                                    <p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500 }}>
                                        Paste the full code to auto-fill.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-[#DDE7E0] p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h2
                                className="text-xl sm:text-2xl"
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    color: "#27261C",
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                Verification code
                            </h2>
                            <span
                                className="text-xs text-[#686766] px-2.5 py-1 rounded-full border border-[#DDE7E0]"
                                style={{ fontWeight: 600 }}
                            >
                                {formattedTime}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#686766] mb-6" style={{ fontWeight: 500 }}>
                            OTP sent to <span className="text-[#27261C] font-semibold">{otpEmail}</span>
                        </p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-6 gap-2 sm:gap-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        aria-label={`Digit ${index + 1}`}
                                        value={digits[index]}
                                        onChange={(event) => handleChange(index, event.target.value)}
                                        onKeyDown={(event) => handleKeyDown(index, event)}
                                        onPaste={handlePaste}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        className="h-12 sm:h-14 rounded-xl border-2 border-[#DDE7E0] bg-white text-center text-lg font-semibold text-[#27261C] focus:outline-none focus:border-[#FC611E]"
                                        style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                    />
                                ))}
                            </div>

                            <div
                                className="rounded-2xl border border-[#DDE7E0] bg-[#F5F1E6]/60 px-4 py-3 text-xs sm:text-sm text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                            >
                                Tip: You can paste the full code and it will auto-fill.
                            </div>

                            <button
                                type="submit"
                                disabled={digits.join("").length !== inputCount}
                                className="w-full bg-[#FC611E] hover:bg-[#f46a2f] text-white py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700, color: "#27261C" }}
                            >
                                Verify code
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-[#686766]" style={{ fontWeight: 500 }}>
                                    Did not receive a code?
                                </span>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={timeLeft > 0}
                                    className="text-[#005246] font-semibold hover:underline"
                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                >
                                    Resend
                                </button>
                            </div>
                        </form>

                        <div className="text-center text-sm mt-6">
                            <Link
                                href="/sign-in"
                                className="text-[#005246] font-semibold hover:underline"
                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                            >
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
