import ContactUs from "@/components/ContactUs";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-white">
			<Navigation />
			<main className="relative min-h-screen bg-white">
				<ContactUs />
			</main>
			<Footer />
		</div>
	);
}
