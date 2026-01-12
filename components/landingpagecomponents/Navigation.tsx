"use client";

import { ChevronDown, MapPin } from 'lucide-react';
import Image from "next/image";
import logo from "@/assets/logo.png";
import send from "@/assets/send.png";
import { useEffect, useRef, useState } from 'react';
import { GreenArrow, MainLogo } from '@/assets';

// Navigation Component
const Navigation = () => {
    const [openMenu, setOpenMenu] = useState<"experiences" | "treks" | null>(null);
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
            className="py-3 flex items-center justify-between"
            style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
        >
            <div className="flex items-center gap-2">
                <Image
                    src={MainLogo}
                    alt="Drokpa Logo"
                    priority
                    width={44}
                    height={44}
                />
                <p 
                    style={{ 
                        fontFamily: "var(--font-subjectivity), sans-serif",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "32px",
                        letterSpacing: "-0.07em",
                        color: "#353030"
                    }}
                >
                    Drokpa.
                </p>
            </div>

            <div className="flex justify-center">
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

            <div className="flex items-center gap-4">
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
        </nav>
    );
};

export default Navigation;