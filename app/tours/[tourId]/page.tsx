import type { Metadata } from "next";
import { notFound } from "next/navigation";
import tours from "@/data/tours";
import TourBookingPageClient from "../../../client/TourBookingClient";

type TourPageProps = {
    params: {
        tourId: string;
    };
};

export function generateMetadata({ params }: TourPageProps): Metadata {
    const tourId = Number(params.tourId);
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

export default function TourBookingPage({ params }: TourPageProps) {
    const tourId = Number(params.tourId);
    const tour = tours.find((item) => item.id === tourId);

    if (!tour) {
        notFound();
    }

    return <TourBookingPageClient params={Promise.resolve({ tourId: params.tourId })} />;
}
