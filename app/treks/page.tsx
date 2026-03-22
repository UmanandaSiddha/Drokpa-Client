import type { Metadata } from "next";
import ToursListClient from "@/client/ToursListClient";
import { TourType } from "@/types/tour";

export const metadata: Metadata = {
    title: "Treks in Arunachal Pradesh - Guided Mountain Adventures | Drokpa",
    description:
        "Discover guided treks across Arunachal Pradesh with local experts. Explore highland trails, remote valleys, and authentic mountain experiences with Drokpa.",
    alternates: {
        canonical: "https://www.drokpa.in/treks",
    },
    openGraph: {
        title: "Treks in Arunachal Pradesh - Drokpa",
        description: "Guided trekking experiences in Arunachal Pradesh.",
        url: "https://www.drokpa.in/treks",
    },
};

export default function TreksPage() {
    return <ToursListClient forcedType={TourType.TREK} />;
}
