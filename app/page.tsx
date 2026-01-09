import HeroSection from "@/components/landingpagecomponents/HeroSection";
import Navigation from "@/components/landingpagecomponents/Navigation";
import SearchBar from "@/components/landingpagecomponents/SearchBar";

export default function App() {
	return (
		<div
			className="min-h-screen bg-gray-50"
			style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
		>
			<Navigation />
			<HeroSection />
			{/* <div className="relative -mt-16 px-16 pb-16">
				<SearchBar />
			</div> */}
		</div>
	);
}