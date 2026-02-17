import type { Metadata } from "next";
import CompanyDetailsClient from "../../client/CompanyDetailsClient";

export const metadata: Metadata = {
    title: "Company Details - Drokpa Information",
    description: "Company details, team information, and organizational structure of Drokpa.",
    alternates: {
        canonical: "https://www.drokpa.in/company-details",
    },
    openGraph: {
        title: "Company Details - Drokpa",
        description: "Company details, team information, and organizational structure of Drokpa.",
        url: "https://www.drokpa.in/company-details",
    },
};

export default function CompanyDetailsPage() {
    return <CompanyDetailsClient />;
}
