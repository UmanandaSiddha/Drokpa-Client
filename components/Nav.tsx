"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DrokpaGreenLogo, DrokpaWhiteLogo } from "@/assets";
import { Menu, X } from "lucide-react";

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
      <div className="container-wide mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        
        <div className="flex items-center gap-3">
          <Image
            src={scrolled ? DrokpaGreenLogo : DrokpaWhiteLogo}
            alt="logo"
            width={44}
            height={44}
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
              className={`px-4 py-2 rounded-full border ${
                scrolled ? "border-(--brand-green)" : "border-white/30"
              } ${textClass} bg-transparent hover:opacity-90`}
            >
              Sign in
            </button>

            <button
              className={`px-4 py-2 rounded-full border ${
                scrolled
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur shadow-lg w-full absolute top-full left-0 z-20">
          <nav className="flex flex-col gap-4 p-6">
            <Link
              href="/"
              className="text-base font-medium text-slate-900 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/"
              className="text-base font-medium text-slate-900 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/"
              className="text-base font-medium text-slate-900 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/"
              className="text-base font-medium text-slate-900 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            {/* Mobile buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button className="px-4 py-2 rounded-full border border-(--brand-green) text-(--brand-green) bg-transparent hover:opacity-90">
                Sign in
              </button>
              <button className="px-4 py-2 rounded-full border border-(--brand-green) bg-(--brand-green) text-white hover:opacity-90">
                Sign up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
