"use client";

import { ChevronDown, X, TextAlignJustify } from 'lucide-react';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import { GreenArrow, MainLogo } from '@/assets';
import { useMobileMenu } from '@/context/MobileMenuContext';

// Navigation Component
const Navigation = () => {
    const [openMenu, setOpenMenu] = useState<"experiences" | "treks" | null>(null);
    const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenu();
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm'
                : 'bg-transparent'
                } py-3`}
            style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
        >
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src={MainLogo}
                        alt="Drokpa Logo"
                        priority
                        width={44}
                        height={44}
                        className="w-8 h-8 md:w-11 md:h-11"
                    />
                    <p
                        className="text-lg md:text-2xl"
                        style={{
                            fontFamily: "var(--font-subjectivity), sans-serif",
                            fontWeight: 700,
                            lineHeight: "32px",
                            letterSpacing: "-0.07em",
                            color: "#353030"
                        }}
                    >
                        Drokpa.
                    </p>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden xl:flex justify-center">
                    <div
                        ref={navRef}
                        className="relative flex items-center gap-6 p-4 h-11.5 max-w-95.75 bg-gray-200 rounded-md"
                    >
                        {/* Experiences */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenMenu(openMenu === "experiences" ? null : "experiences")
                                }
                                className="flex items-center gap-1 cursor-pointer text-[#27261C] hover:text-gray-900"
                                style={{
                                    fontSize: "14px",
                                }}
                            >
                                Experiences
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${openMenu === "experiences" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openMenu === "experiences" && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50">
                                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                        Cultural
                                    </button>
                                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                        Adventure
                                    </button>
                                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                        Spiritual
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Treks */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenMenu(openMenu === "treks" ? null : "treks")
                                }
                                className="flex items-center gap-1 cursor-pointer text-[#27261C] hover:text-gray-900"
                                style={{
                                    fontSize: "14px",
                                }}
                            >
                                Treks
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${openMenu === "treks" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openMenu === "treks" && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50">
                                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                        Easy
                                    </button>
                                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                        Moderate
                                    </button>
                                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                        Difficult
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Contact */}
                        <button
                            className="text-[#27261C] hover:text-gray-900"
                            style={{
                                fontSize: "14px",
                            }}
                        >
                            Contact us
                        </button>
                    </div>
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="text-gray-700 hover:text-gray-900" style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#27261C",
                    }}>
                        Login
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <button className="flex items-center gap-2 text-black">
                        <Image
                            src={GreenArrow}
                            alt="Green Arrow"
                            priority
                            width={16}
                            height={16}
                        />
                        <p
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#27261C",
                            }}
                        >
                            Build Your Itinerary
                        </p>
                    </button>

                    {/* Mobile/Tablet Hamburger Menu */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex xl:hidden m-1 px-2 py-1.5 bg-[#BCBCBC1A] border-[0.5px] border-[#D9D9D9] rounded-md shadow-0.5 shadow-[#BCBCBC1A]"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5 text-[#27261C]" />
                        ) : (
                            <TextAlignJustify className="w-5 h-5 text-[#27261C]" />
                        )}
                    </button>
                </div>

                {/* Mobile/Tablet Hamburger Menu */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex md:hidden m-1 px-2 py-1.5 bg-[#BCBCBC1A] border-[0.5px] border-[#D9D9D9] rounded-md shadow-0.5 shadow-[#BCBCBC1A]"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-5 h-5 text-[#27261C]" />
                    ) : (
                        <TextAlignJustify className="w-5 h-5 text-[#27261C]" />
                    )}
                </button>
            </div>
        </nav>
    );
};

export default Navigation;