"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DrokpaGreenLogo, DrokpaWhiteLogo } from "@/assets";
import { josefinSans, kabelBlack } from "./ui/fonts/fonts";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

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

  const signUpClass = scrolled
    ? "px-4 py-2 rounded-md bg-(--brand-green) text-white font-semibold"
    : "px-4 py-2 rounded-md bg-white text-(--brand-green) font-semibold";

  return (
    <header
      className={`w-full top-0 left-0 z-30 transition-all duration-300 ${navBgClass}`}
    >
      <div className="container-wide mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Image
            src={scrolled ? DrokpaGreenLogo : DrokpaWhiteLogo}
            alt="logo"
            width={44}
            height={44}
          />
          <span className={`${textClass} ${kabelBlack.className} text-xl`}>
            Drokpa
          </span>
        </div>

        <nav className={`hidden md:flex gap-8 items-center ${textClass}`}>
          <Link href={"/"} className="text-base font-medium hover:underline">
            Home
          </Link>
          <Link href={"/"} className="text-base font-medium hover:underline">
            Explore
          </Link>
          <Link href={"/"} className="text-base font-medium hover:underline">
            Pricing
          </Link>
          <Link href={"/"} className="text-base font-medium hover:underline">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            className={`hidden md:inline-block px-4 py-2 rounded-md border ${
              scrolled ? "border-(--brand-green)" : "border-white/30"
            } ${textClass} bg-transparent hover:opacity-90`}
          >
            Sign in
          </button>
          <button className={signUpClass}>Sign up</button>
        </div>
      </div>
    </header>
  );
}
