import type { Metadata } from "next";
import ILPPage from "../../client/IlpClient";

export const metadata: Metadata = {
    title: "Inner Line Permit (ILP) - Travel to Arunachal Pradesh",
    description: "Apply for your Inner Line Permit (ILP) directly through Drokpa. Easy ILP application process for traveling to Arunachal Pradesh. Get your permit approved quickly.",
    alternates: {
        canonical: "https://www.drokpa.in/ilp",
    },
    openGraph: {
        title: "Inner Line Permit (ILP) - Drokpa",
        description: "Easy ILP application for traveling to Arunachal Pradesh",
        url: "https://www.drokpa.in/ilp",
    },
};

export default function Page() {
    return <ILPPage />;
}
