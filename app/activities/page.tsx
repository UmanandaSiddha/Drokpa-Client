import type { Metadata } from "next";
import ActivitiesPageClient from "../../client/ActivitiesClient";

export const metadata: Metadata = {
    title: "Activities & Experiences - Adventure in Arunachal Pradesh",
    description: "Explore thrilling activities in Arunachal Pradesh including trekking, cultural experiences, wildlife tours, and adventure sports. Book your next adventure with Drokpa.",
    alternates: {
        canonical: "https://www.drokpa.in/activities",
    },
    openGraph: {
        title: "Activities & Experiences - Drokpa",
        description: "Discover adventure activities and experiences in Arunachal Pradesh",
        url: "https://www.drokpa.in/activities",
    },
};

export default function ActivitiesPage() {
    return <ActivitiesPageClient />;
}
