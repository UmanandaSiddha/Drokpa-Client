import type { Metadata } from "next";
import { notFound } from "next/navigation";
import tours from "@/data/tours";
import TourBookingPageClient from "../../../client/TourBookingClient";

type TourPageProps = {
    params: Promise<{
        tourId: string;
    }>;
};

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
    const { tourId: tourIdParam } = await params;
    const tourId = Number(tourIdParam);
    const tour = tours.find((item) => item.id === tourId);

    if (!tour) {
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
            canonical: `https://www.drokpa.in/tours/${tour.id}`,
        },
        openGraph: {
            title: tour.title,
            description: tour.description,
            url: `https://www.drokpa.in/tours/${tour.id}`,
            images: [tour.image],
        },
    };
}

export default async function TourBookingPage({ params }: TourPageProps) {
    const { tourId: tourIdParam } = await params;
    const tourId = Number(tourIdParam);
    const tour = tours.find((item) => item.id === tourId);

    if (!tour) {
        notFound();
    }

    return <TourBookingPageClient params={Promise.resolve({ tourId: tourIdParam })} />;
}
