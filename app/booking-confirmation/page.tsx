import { Metadata } from "next";
import BookingConfirmationClient from "@/client/BookingConfirmationClient";

export const metadata: Metadata = {
    title: "Booking Confirmed | Drokpa",
    description: "Your booking has been confirmed. Download your itinerary and confirmation letter.",
};

export default function BookingConfirmationPage() {
    return <BookingConfirmationClient />;
}
