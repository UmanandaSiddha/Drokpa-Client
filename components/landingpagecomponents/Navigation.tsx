"use client";

import { ChevronDown, MapPin } from 'lucide-react';
import Image from "next/image";
import logo from "@/assets/logo.png";
import send from "@/assets/send.png";
import { useEffect, useRef, useState } from 'react';

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
        <nav className="bg-white px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Image
                    src={logo}
                    alt="Drokpa Logo"
                    priority
                />
            </div>

            <div className="flex justify-center">
                <div
                    ref={navRef}
                    className="relative flex items-center gap-10 px-6 h-12 bg-gray-200 rounded-2xl"
                >
                    {/* Experiences */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenMenu(openMenu === "experiences" ? null : "experiences")
                            }
                            className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900"
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
                            className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900"
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
                    <button className="text-gray-700 hover:text-gray-900">
                        Contact us
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-10">
                <button className="text-gray-700 hover:text-gray-900">Login</button>
                <button className="flex items-center gap-2 text-black">
                    <Image
                    src={send}
                    alt="Drokpa Logo"
                    priority
                />
                    Build Your Itinerary
                </button>
            </div>
        </nav>
    );
};

export default Navigation;