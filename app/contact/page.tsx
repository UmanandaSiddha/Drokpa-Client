import type { Metadata } from "next";
import ContactPageClient from "../../client/ContactClient";

export const metadata: Metadata = {
	title: "Contact Us - Get in Touch with Drokpa",
	description: "Have questions? Contact Drokpa's team for inquiries about tours, homestays, activities, and travel planning in Arunachal Pradesh.",
	alternates: {
		canonical: "https://www.drokpa.in/contact",
	},
	openGraph: {
		title: "Contact Drokpa",
		description: "Get in touch with our team for travel inquiries and support",
		url: "https://www.drokpa.in/contact",
	},
};

export default function ContactPage() {
	return <ContactPageClient />;
}
