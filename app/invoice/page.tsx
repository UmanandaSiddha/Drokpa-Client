import { Metadata } from "next";
import InvoiceClient from "@/client/InvoiceClient";

export const metadata: Metadata = {
    title: "Invoice | Drokpa Adventures",
    description: "View and download your Drokpa Adventures booking invoice. Keep your adventure receipt safe.",
    openGraph: {
        title: "Invoice | Drokpa Adventures",
        description: "View and download your Drokpa Adventures booking invoice.",
        type: "website",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function InvoicePage() {
    return <InvoiceClient />;
}
