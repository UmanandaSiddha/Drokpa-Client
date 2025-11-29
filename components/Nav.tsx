"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DrokpaLogo, DrokpaWhiteLogo } from "@/assets";

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

    const textClass = scrolled ? "text-black" : "text-white";
    const navBgClass = scrolled
        ? "fixed bg-white/95 dark:bg-black/95 shadow-md backdrop-blur"
        : "absolute bg-transparent";

    const signUpClass = scrolled
        ? "px-4 py-2 rounded-md bg-black text-white font-semibold"
        : "px-4 py-2 rounded-md bg-white text-black font-semibold";

    return (
        <header className={`w-full top-0 left-0 z-30 transition-all duration-300 ${navBgClass}`}>
            <div className="container-wide mx-auto flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                    <Image src={scrolled ? DrokpaLogo : DrokpaWhiteLogo} alt="logo" width={44} height={44} />
                    <span className={`${textClass} font-bold text-xl`}>Drokpa</span>
                </div>

                <nav className={`hidden md:flex gap-8 items-center ${textClass}`}>
                    <a className="text-base font-medium hover:underline" href="#">Home</a>
                    <a className="text-base font-medium hover:underline" href="#">Explore</a>
                    <a className="text-base font-medium hover:underline" href="#">Pricing</a>
                    <a className="text-base font-medium hover:underline" href="#">About</a>
                </nav>

                <div className="flex items-center gap-3">
                    <button className={`hidden md:inline-block px-4 py-2 rounded-md border ${scrolled ? 'border-black/10' : 'border-white/30'} ${textClass} bg-transparent hover:opacity-90`}>
                        Sign in
                    </button>
                    <button className={signUpClass}>Sign up</button>
                </div>
            </div>
        </header>
    );
}
