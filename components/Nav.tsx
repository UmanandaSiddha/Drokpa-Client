"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DrokpaGreenLogo, DrokpaWhiteLogo } from "@/assets";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const textClass = scrolled ? "text-(--brand-green)" : "text-white";
    const navBgClass = scrolled
        ? "fixed bg-white/95 dark:bg-black/95 shadow-md backdrop-blur"
        : "absolute bg-transparent";

    return (
        <header
            className={`w-full top-0 left-0 z-30 transition-all duration-300 ${navBgClass}`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-3">
                    <Image
                        src={scrolled ? DrokpaGreenLogo : DrokpaWhiteLogo}
                        alt="logo"
                        width={44}
                        height={44}
                        style={{ height: "auto" }}
                    />
                    <span className={`${textClass} font-bold text-xl`}>Drokpa</span>
                </div>

                {/* Desktop Menu */}
                <nav className={`hidden md:flex gap-8 items-center ${textClass}`}>
                    <Link href="/" className="text-base font-medium hover:underline">
                        Home
                    </Link>
                    <Link href="/" className="text-base font-medium hover:underline">
                        Explore
                    </Link>
                    <Link href="/" className="text-base font-medium hover:underline">
                        Vehicles
                    </Link>
                    <Link href="/" className="text-base font-medium hover:underline">
                        About
                    </Link>
                </nav>

                {/* Buttons & Hamburger */}
                <div className="flex items-center gap-3">
                    {/* Sign in/up buttons for desktop */}
                    <div className="hidden md:flex gap-3">
                        <button
                            className={`px-4 py-2 rounded-full border ${scrolled ? "border-(--brand-green)" : "border-white/30"
                                } ${textClass} bg-transparent hover:opacity-90`}
                        >
                            Sign in
                        </button>

                        <button
                            className={`px-4 py-2 rounded-full border ${scrolled
                                ? "border-(--brand-green) bg-(--brand-green) text-white"
                                : "border-white/30 bg-white text-black"
                                } hover:opacity-90`}
                        >
                            Sign up
                        </button>
                    </div>

                    {/* Hamburger menu button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? (
                            <X size={28} className={scrolled ? "text-(--brand-green)" : "text-white"} />
                        ) : (
                            <Menu size={28} className={scrolled ? "text-(--brand-green)" : "text-white"} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 md:hidden z-40"
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ width: "70vw", height: "100vh" }}
                            className="fixed top-0 left-0 bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden overflow-y-auto"
                        >
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={DrokpaGreenLogo}
                                        alt="logo"
                                        width={40}
                                        height={40}
                                        style={{ height: "auto" }}
                                    />
                                    <span className="text-(--brand-green) font-bold text-xl">Drokpa</span>
                                </div>
                                {/* <button
                                    onClick={() => setMenuOpen(false)}
                                    className="text-(--brand-green) hover:opacity-70 transition-opacity"
                                >
                                    <X size={28} />
                                </button> */}
                            </div>

                            {/* Sidebar Content */}
                            <nav className="flex flex-col gap-6 p-6">
                                <Link
                                    href="/"
                                    className="text-lg font-medium text-slate-900 dark:text-white hover:text-(--brand-green) transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/"
                                    className="text-lg font-medium text-slate-900 dark:text-white hover:text-(--brand-green) transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Explore
                                </Link>
                                <Link
                                    href="/"
                                    className="text-lg font-medium text-slate-900 dark:text-white hover:text-(--brand-green) transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Vehicles
                                </Link>
                                <Link
                                    href="/"
                                    className="text-lg font-medium text-slate-900 dark:text-white hover:text-(--brand-green) transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    About
                                </Link>

                                {/* Divider */}
                                <div className="h-px bg-slate-200 dark:bg-slate-700" />

                                {/* Mobile buttons */}
                                <div className="flex flex-col gap-3">
                                    <button className="px-4 py-3 rounded-lg border border-(--brand-green) text-(--brand-green) bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                                        Sign in
                                    </button>
                                    <button className="px-4 py-3 rounded-lg border border-(--brand-green) bg-(--brand-green) text-white hover:opacity-90 transition-opacity font-medium">
                                        Sign up
                                    </button>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
