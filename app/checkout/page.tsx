import type { Metadata } from "next";
import CheckoutClient from "../../client/CheckoutClient";

export const metadata: Metadata = {
    title: "Checkout - Complete Your Booking on Drokpa",
    description: "Secure checkout for your Drokpa booking. Easy payment process for tours, homestays, and activities in Arunachal Pradesh.",
    alternates: {
        canonical: "https://www.drokpa.in/checkout",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}