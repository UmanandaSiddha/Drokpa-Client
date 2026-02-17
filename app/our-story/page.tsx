import type { Metadata } from "next";
import OurStoryClient from "../../client/OurStoryClient";

export const metadata: Metadata = {
    title: "Our Story - How Drokpa Began",
    description: "Discover how Drokpa was founded. A movement to bring authentic, local-led travel experiences to Arunachal Pradesh travelers worldwide.",
    alternates: {
        canonical: "https://www.drokpa.in/our-story",
    },
    openGraph: {
        title: "Our Story - Drokpa",
        description: "Learn about Drokpa's journey and mission",
        url: "https://www.drokpa.in/our-story",
    },
};

export default function OurStoryPage() {
    return <OurStoryClient />;
}
