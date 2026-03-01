import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tourService } from "@/services/tour.service";
import TrekBookingClient from "@/client/TrekBookingClient";

type TrekSlugPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: TrekSlugPageProps): Promise<Metadata> {
    try {
        const { slug } = await params;
        const trek = await tourService.getTourBySlug(slug);

        if (!trek) {
            return {
                title: "Trek Not Found | Drokpa",
                robots: {
                    index: false,
                    follow: false,
                },
            };
        }

        return {
            title: `Book ${trek.title} | Drokpa Treks`,
            description: trek.description,
            alternates: {
                canonical: `https://www.drokpa.in/treks/${slug}`,
            },
            openGraph: {
                title: trek.title,
                description: trek.description,
                url: `https://www.drokpa.in/treks/${slug}`,
                images: trek.imageUrls && trek.imageUrls.length > 0 ? [trek.imageUrls[0]] : [],
            },
        };
    } catch {
        return {
            title: "Trek Not Found | Drokpa",
            robots: {
                index: false,
                follow: false,
            },
        };
    }
}

export default async function TrekSlugPage({ params }: TrekSlugPageProps) {
    try {
        const { slug } = await params;
        const trek = await tourService.getTourBySlug(slug);

        if (!trek) {
            notFound();
        }

        // Pass trek ID to client component since we got it via slug
        return <TrekBookingClient params={Promise.resolve({ trekId: trek.id })} />;
    } catch {
        notFound();
    }
}
