import type { Metadata } from "next";
import HomePageClient from "@/client/HomePageClient";
import tours from "@/data/tours";
import homestays from "@/data/homestays";

export const metadata: Metadata = {
	title: "Drokpa - Discover Authentic Travel in Arunachal Pradesh",
	description: "Experience authentic travel in Arunachal Pradesh with Drokpa. Explore guided treks, local homestays, cultural activities, and hidden gems curated by locals. Your perfect travel companion awaits.",
	alternates: {
		canonical: "https://www.drokpa.in",
	},
	openGraph: {
		title: "Drokpa - Your Local Travel Buddy in Arunachal Pradesh",
		description: "Discover authentic travel experiences in Arunachal Pradesh",
		url: "https://www.drokpa.in",
	},
};

export default function App() {
	return <HomePageClient tours={tours} homestays={homestays} />;
}