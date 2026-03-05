import type { Metadata } from "next";
import ToursListClient from "@/client/ToursListClient";

export const metadata: Metadata = {
    title: "Tours & Treks in Arunachal Pradesh - Guided Adventures | Drokpa",
    description: "Explore guided tours and treks across Arunachal Pradesh. Discover pristine landscapes, cultural experiences, and outdoor adventures with expert local guides on Drokpa.",
    alternates: {
        canonical: "https://www.drokpa.in/tours",
    },
    openGraph: {
        title: "Tours & Treks - Drokpa",
        description: "Guided tours and treks in Arunachal Pradesh",
        url: "https://www.drokpa.in/tours",
    },
};

export default function ToursPage() {
    return <ToursListClient />;
}
