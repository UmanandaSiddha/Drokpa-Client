import type { Metadata } from "next";
import HomestaysListClient from "@/client/HomestaysListClient";

export const metadata: Metadata = {
    title: "Homestays in Arunachal Pradesh - Authentic Local Stays | Drokpa",
    description: "Discover authentic homestays across Arunachal Pradesh. Stay with local families, experience genuine hospitality, home-cooked meals, and immerse yourself in local culture with Drokpa.",
    alternates: {
        canonical: "https://www.drokpa.in/homestays",
    },
    openGraph: {
        title: "Homestays - Drokpa",
        description: "Authentic homestays and local stays in Arunachal Pradesh",
        url: "https://www.drokpa.in/homestays",
    },
};

export default function HomestaysPage() {
    return <HomestaysListClient />;
}
