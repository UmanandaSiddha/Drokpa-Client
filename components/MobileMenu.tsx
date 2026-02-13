"use client";

import { X } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from 'lucide-react';
import { GreenArrow } from '@/assets';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { useEffect, useState } from 'react';

const MobileMenu = () => {
    const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenu();
    const [isMobile, setIsMobile] = useState(false);

    // Track screen size to ensure menu never renders on desktop
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1279px)');
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);
        updateIsMobile();

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', updateIsMobile);
            return () => mediaQuery.removeEventListener('change', updateIsMobile);
        }

        const handleResize = () => updateIsMobile();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Block scrolling when mobile menu is open (mobile screens only)
    useEffect(() => {
        if (mobileMenuOpen && isMobile) {
            document.documentElement.classList.add('no-scroll');
            document.body.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
        }
    }, [mobileMenuOpen, isMobile]);

    if (!mobileMenuOpen || !isMobile) return null;

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 xl:hidden"
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel - Centered */}
            <div className="fixed inset-0 z-50 flex items-start justify-end pointer-events-none px-4 xl:hidden">
                <div className="w-full max-w-md max-h-[85vh] overflow-y-auto pointer-events-auto">
                    {/* Close Button */}
                    <div className="sticky top-0 flex justify-end py-4">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 bg-white rounded-lg"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 text-[#27261C]" />
                        </button>
                    </div>

                    <div className='p-5 sm:p-6 bg-white rounded-3xl'>
                        {/* Offer Banner */}
                        <div className="block md:hidden mb-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#353030]" style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}>
                                Get Exclusive offers when you log in for the first time.
                            </h3>
                        </div>

                        {/* Log In Button */}
                        <Link
                            href="/signin"
                            className="inline-flex md:hidden px-10 sm:px-14 py-2 sm:py-2.5 bg-[#4F87C7] text-base sm:text-lg text-white font-normal rounded-full mb-6 transition-colors text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Log In
                        </Link>

                        <hr className='block md:hidden pb-6' />

                        {/* Main Menu Items */}
                        <div className="space-y-4 mb-6">
                            <Link
                                href="/route-planner"
                                className="md:hidden flex items-center gap-2 w-full text-[#27261C] text-base sm:text-lg"
                                style={{ fontWeight: 600 }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Image
                                    src={GreenArrow}
                                    alt="Green Arrow"
                                    width={16}
                                    height={16}
                                />
                                Build Your Itinerary
                            </Link>
                            <button className="flex items-center gap-2 w-full text-[#27261C] text-base sm:text-lg" style={{ fontWeight: 600 }}>
                                <span>Experiences</span>
                                <ChevronDown size={18} />
                            </button>
                            <button className="flex items-center gap-2 w-full text-[#27261C] text-base sm:text-lg" style={{ fontWeight: 600 }}>
                                <span>Treks</span>
                                <ChevronDown size={18} />
                            </button>
                            <Link
                                href="/contact"
                                className="w-full text-left text-[#27261C] text-base sm:text-lg"
                                style={{ fontWeight: 600 }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact Us
                            </Link>
                            {/* <Link
                                href="/about"
                                className="w-full text-left text-[#27261C] text-base sm:text-lg"
                                style={{ fontWeight: 600 }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link> */}
                        </div>

                        {/* Social Links */}
                        <div className="border-t border-gray-200 pt-6 space-y-3 pb-6">
                            <button className="w-full text-left text-[#27261C] text-base sm:text-lg" style={{ fontWeight: 600 }}>
                                <span className="flex items-center gap-2">
                                    Instagram
                                </span>
                            </button>
                            <button className="w-full text-left text-[#27261C] text-base sm:text-lg" style={{ fontWeight: 600 }}>
                                <span className="flex items-center gap-2">
                                    Facebook
                                </span>
                            </button>
                            <button className="w-full text-left text-[#27261C] text-base sm:text-lg" style={{ fontWeight: 600 }}>
                                <span className="flex items-center gap-2">
                                    LinkedIn
                                </span>
                            </button>
                            <button className="w-full text-left text-[#27261C] text-base sm:text-lg" style={{ fontWeight: 600 }}>
                                <span className="flex items-center gap-2">
                                    YouTube
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
