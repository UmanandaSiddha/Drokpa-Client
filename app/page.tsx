import Footer from "@/components/landingpagecomponents/Footer";
import GetInspired from "@/components/landingpagecomponents/GetInspired";
import HeroSection from "@/components/landingpagecomponents/HeroSection";
import Navigation from "@/components/landingpagecomponents/Navigation";
// import SearchFilter from "@/components/landingpagecomponents/SearchFilter";
import ThingsToDo from "@/components/landingpagecomponents/ThingsToDo";
import TourHomeComponent from "@/components/landingpagecomponents/TourHomeComponent";
import WhyDroppa from "@/components/landingpagecomponents/WhyDropa";
import tours from "@/data/tours";

export default function App() {
	return (
		<div
			className="min-h-screen bg-white"
			style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
		>
			<Navigation />
			<main className="relative min-h-screen bg-white">
				{/* Hero Section - Full Viewport Height */}
				<div className="h-screen flex items-center">
					<div className="mt-16 w-full h-[90%] px-4 md:px-6 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
						<HeroSection />
					</div>
				</div>
				{/* Rest of the content */}
				<div className="w-full px-4 md:px-6 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
					{/* <div className="pb-4">
						<SearchFilter />
					</div> */}
					<TourHomeComponent tours={tours} title="Tours & Treks" />
					<TourHomeComponent tours={tours} title="HomeStays" />
					<WhyDroppa />
					<ThingsToDo />
					<GetInspired />
				</div>
			</main>
			{/* Footer - Full width background, content constrained inside */}
			<Footer />
		</div>
	);
}