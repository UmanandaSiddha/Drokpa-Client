import type { Metadata } from "next";
import ArticlesPageClient from "../../client/ArticlesClient";

export const metadata: Metadata = {
    title: "Field Notes - Travel Stories & Guides from Arunachal Pradesh",
    description: "Read travel stories, local insights, cultural guides, and travel tips from Arunachal Pradesh. Discover hidden gems and authentic experiences through our field notes.",
    alternates: {
        canonical: "https://www.drokpa.in/articles",
    },
    openGraph: {
        title: "Field Notes - Drokpa Travel Stories",
        description: "Travel stories and guides from Arunachal Pradesh",
        url: "https://www.drokpa.in/articles",
    },
};

export default function ArticlesPage() {
    return <ArticlesPageClient />;
}
