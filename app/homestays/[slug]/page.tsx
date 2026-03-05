import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { homestayService } from "@/services/homestay.service";
import HomestayBookingClient from "@/client/HomestayBookingClient";

type HomestaySlugPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({ params }: HomestaySlugPageProps): Promise<Metadata> {
    try {
        const { slug } = await params;
        const homestay = await homestayService.getHomestayBySlug(slug);

        if (!homestay) {
            return {
                title: "Homestay Not Found | Drokpa",
                robots: {
                    index: false,
                    follow: false,
                },
            };
        }

        return {
            title: `${homestay.name} | Drokpa Homestays`,
            description: homestay.description,
            alternates: {
                canonical: `https://www.drokpa.in/homestays/${slug}`,
            },
            openGraph: {
                title: homestay.name,
                description: homestay.description,
                url: `https://www.drokpa.in/homestays/${slug}`,
                images: homestay.imageUrls && homestay.imageUrls.length > 0 ? [homestay.imageUrls[0]] : [],
            },
        };
    } catch {
        return {
            title: "Homestay Not Found | Drokpa",
            robots: {
                index: false,
                follow: false,
            },
        };
    }
}

export default async function HomestaySlugPage({ params }: HomestaySlugPageProps) {
    try {
        const { slug } = await params;
        const homestay = await homestayService.getHomestayBySlug(slug);

        if (!homestay) {
            notFound();
        }

        if (!homestay.id) {
            notFound();
        }

        return <HomestayBookingClient params={Promise.resolve({ homestayId: homestay.id })} />;
    } catch {
        notFound();
    }
}
