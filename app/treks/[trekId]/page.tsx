import type { Metadata } from "next";
import { notFound } from "next/navigation";
import treks from "@/data/treks";
import TrekBookingClient from "@/client/TrekBookingClient";

type TrekPageProps = {
    params: Promise<{
        trekId: string;
    }>;
};

export async function generateMetadata({ params }: TrekPageProps): Promise<Metadata> {
    const { trekId: trekIdParam } = await params;
    const trekId = Number(trekIdParam);
    const trek = treks.find((item) => item.id === trekId);

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
            canonical: `https://www.drokpa.in/treks/${trek.id}`,
        },
        openGraph: {
            title: trek.title,
            description: trek.description,
            url: `https://www.drokpa.in/treks/${trek.id}`,
            images: [trek.image],
        },
    };
}

export default async function TrekBookingPage({ params }: TrekPageProps) {
    const { trekId: trekIdParam } = await params;
    const trekId = Number(trekIdParam);
    const trek = treks.find((item) => item.id === trekId);

    if (!trek) {
        notFound();
    }

    return <TrekBookingClient params={Promise.resolve({ trekId: trekIdParam })} />;
}
