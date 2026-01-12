import Footer from "@/components/landingpagecomponents/Footer";
import GetInspired from "@/components/landingpagecomponents/GetInspired";
import HeroSection from "@/components/landingpagecomponents/HeroSection";
import Navigation from "@/components/landingpagecomponents/Navigation";
import SearchFilter from "@/components/landingpagecomponents/SearchFilter";
import ThingsToDo from "@/components/landingpagecomponents/ThingsToDo";
import TourHomeComponent from "@/components/landingpagecomponents/TourHomeComponent";
import WhyDroppa from "@/components/landingpagecomponents/WhyDropa";
import tours from "@/data/tours";

export default function App() {
	return (
		<div
			className="min-h-screen bg-white flex justify-center"
			style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
		>
			<div className="w-[90%] max-w-[1600px]">
				<div className="h-screen flex flex-col overflow-hidden">
					<Navigation />
					<div className="flex-1 flex items-center mb-1">
						<HeroSection />
					</div>
				</div>
				<div className="pb-4">
					<SearchFilter />
				</div>
				<TourHomeComponent tours={tours} title="Tours & Treks" />
				<TourHomeComponent tours={tours} title="HomeStays" />
				<WhyDroppa />
				<ThingsToDo />
				<GetInspired />
				<Footer />
			</div>
		</div>
	);
}