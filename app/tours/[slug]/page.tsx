import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tourService } from "@/services/tour.service";
import TourBookingPageClient from "@/client/TourBookingClient";

type TourSlugPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: TourSlugPageProps): Promise<Metadata> {
    try {
        const { slug } = await params;
        const tour = await tourService.getTourBySlug(slug);

        if (!tour) {
            console.warn(`[generateMetadata] No tour found for slug: ${slug}`);
            return {
                title: "Tour Not Found | Drokpa",
                robots: {
                    index: false,
                    follow: false,
                },
            };
        }

        return {
            title: `Book ${tour.title} | Drokpa`,
            description: tour.description,
            alternates: {
                canonical: `https://www.drokpa.in/tours/${slug}`,
            },
            openGraph: {
                title: tour.title,
                description: tour.description,
                url: `https://www.drokpa.in/tours/${slug}`,
                images: tour.imageUrls && tour.imageUrls.length > 0 ? [tour.imageUrls[0]] : [],
            },
        };
    } catch (error) {
        console.error('[generateMetadata] Error:', error);
        return {
            title: "Tour Not Found | Drokpa",
            robots: {
                index: false,
                follow: false,
            },
        };
    }
}

export default async function TourSlugPage({ params }: TourSlugPageProps) {
    try {
        const { slug } = await params;

        const tour = await tourService.getTourBySlug(slug);

        if (!tour) {
            console.error(`[TourSlugPage] No tour found for slug: ${slug}`);
            notFound();
        }

        if (!tour.id) {
            console.error(`[TourSlugPage] Tour has no ID:`, tour);
            notFound();
        }

        return <TourBookingPageClient params={Promise.resolve({ tourId: tour.id })} />;
    } catch (error) {
        console.error('[TourSlugPage] Error loading tour:', error);
        notFound();
    }
}
