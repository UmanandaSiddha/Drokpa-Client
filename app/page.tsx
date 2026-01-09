import HeroSection from "@/components/landingpagecomponents/HeroSection";
import HomeStays from "@/components/landingpagecomponents/HomeStays";
import Navigation from "@/components/landingpagecomponents/Navigation";
import SearchFilter from "@/components/landingpagecomponents/SearchFilter";
import ToursAndTreks from "@/components/landingpagecomponents/TourAndTrek";

export default function App() {
	return (
		<div
			className="min-h-screen bg-gray-50"
			style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
		>
			<Navigation />
			<HeroSection />
			<div className="mt-[0.5]">
				<SearchFilter />
			</div>
			<ToursAndTreks/>
			<HomeStays/>
		</div>
	);
}