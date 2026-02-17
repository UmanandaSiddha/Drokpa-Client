import type { Metadata } from "next";
import AccountClient from "../../client/AccountClient";

export const metadata: Metadata = {
    title: "My Account - Manage Your Drokpa Profile",
    description: "Manage your Drokpa account, view bookings, save favorites, and manage your travel preferences.",
    alternates: {
        canonical: "https://www.drokpa.in/account",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function AccountPage() {
    return <AccountClient />;
}
