import Link from "next/link";
import { Twitter, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import { DrokpaWhiteLogo } from "@/assets";

export default function Footer() {
    return (
        <footer className="bg-linear-to-t from-[#042f28] via-[#064b3f] to-[#0a6b56] text-white">
            <div className="container-wide mx-auto py-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link href="#">
                            <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <span className="w-10 h-10 flex items-center justify-center">
                                    <Image src={DrokpaWhiteLogo} alt="logo" width={44} height={44} />
                                </span>
                                Drokpa
                            </div>
                        </Link>
                        <p className="mt-4 text-sm text-white/80 max-w-[18rem]">A gateway to the high Himalaya — curated trips, local guides, and quiet trails.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Explore</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li><Link href="#"><p className="hover:underline">Destinations</p></Link></li>
                            <li><Link href="#"><p className="hover:underline">Activities</p></Link></li>
                            <li><Link href="#"><p className="hover:underline">Guides</p></Link></li>
                            <li><Link href="#"><p className="hover:underline">Travel Tips</p></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li><Link href="#"><p className="hover:underline">About</p></Link></li>
                            <li><Link href="#"><p className="hover:underline">Careers</p></Link></li>
                            <li><Link href="#"><p className="hover:underline">Contact</p></Link></li>
                            <li><Link href="#"><p className="hover:underline">Privacy</p></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Stay in touch</h4>
                        <p className="text-sm text-white/80 mb-3">Subscribe for trip ideas, weather alerts, and local stories.</p>
                        <form className="flex gap-2">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input id="email" type="email" placeholder="your@email.com" className="flex-1 px-3 py-2 rounded-md bg-white/10 placeholder-white/70 text-white outline-none" />
                            <button type="submit" className="bg-white text-[#044036] px-3 py-2 rounded-md font-semibold">Join</button>
                        </form>

                        <div className="mt-4 flex items-center gap-3">
                            <Link href="#" aria-label="Twitter" className="p-2 rounded-md bg-white/6 hover:bg-white/10">
                                <Twitter className="w-4 h-4 text-white" />
                            </Link>
                            <Link href="#" aria-label="Instagram" className="p-2 rounded-md bg-white/6 hover:bg-white/10">
                                <Instagram className="w-4 h-4 text-white" />
                            </Link>
                            <Link href="#" aria-label="Email" className="p-2 rounded-md bg-white/6 hover:bg-white/10">
                                <Mail className="w-4 h-4 text-white" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>© {new Date().getFullYear()} Drokpa — All rights reserved.</div>
                    <div className="flex items-center gap-4">
                        <div>Made with <span aria-hidden className="text-amber-300">♥</span> in the mountains</div>
                        <div className="text-white/70">Version 1.0</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
