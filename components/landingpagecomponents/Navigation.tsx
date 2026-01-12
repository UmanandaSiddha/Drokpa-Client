"use client";

import { ChevronDown, MapPin, Menu, X } from 'lucide-react';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import { GreenArrow, MainLogo } from '@/assets';

// Navigation Component
const Navigation = () => {
    const [openMenu, setOpenMenu] = useState<"experiences" | "treks" | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

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
            className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 py-3 flex items-center justify-between"
            style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
        >
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
            <div className="hidden lg:flex justify-center">
                <div
                    ref={navRef}
                    className="relative flex items-center gap-6 p-4 h-[46px] max-w-[383px] bg-gray-200 rounded-[8px]"
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
            <div className="hidden lg:flex items-center gap-4">
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
            </div>

            {/* Mobile Hamburger Menu */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-[#27261C]" />
                ) : (
                    <Menu className="w-6 h-6 text-[#27261C]" />
                )}
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
                    <div className="px-4 py-4 space-y-4">
                        <button
                            className="block w-full text-left py-2 text-[#27261C]"
                            style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                            Experiences
                        </button>
                        <button
                            className="block w-full text-left py-2 text-[#27261C]"
                            style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                            Treks
                        </button>
                        <button
                            className="block w-full text-left py-2 text-[#27261C]"
                            style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                            Contact us
                        </button>
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <button
                                className="block w-full text-left py-2 text-[#27261C] mb-2"
                                style={{ fontSize: "14px", fontWeight: 500 }}
                            >
                                Login
                            </button>
                            <button className="flex items-center gap-2 py-2 text-[#27261C]">
                                <Image
                                    src={GreenArrow}
                                    alt="Green Arrow"
                                    width={16}
                                    height={16}
                                />
                                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                                    Build Your Itinerary
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;