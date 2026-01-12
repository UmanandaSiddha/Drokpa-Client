import { HeroBg } from "@/assets";
import TrekCard from "./TrekCard";
import WeatherWidget from "./WeatherWidget";

const HeroSection = () => {
	return (
		<div className="flex justify-center h-full w-full">
			<div className="relative h-full w-full overflow-hidden rounded-[12px]">

				{/* Background */}
				<img
					src={HeroBg.src}
					alt="Hero Background"
					width={1000}
					height={1000}
					className="absolute inset-0 w-full h-full object-cover z-0"
				/>

				{/* Overlay */}
				<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40 z-10" />

				{/* Floating widgets */}
				<WeatherWidget />
				<TrekCard />

				{/* Hero text */}
				<div className="relative z-20 h-full flex flex-col justify-end px-8 pb-6">
					<h1 
						style={{
							fontFamily: "var(--font-subjectivity), sans-serif",
							fontWeight: 700,
							fontSize: "68px",
							lineHeight: "80px",
							letterSpacing: "-0.06em",
							color: "#F6F6F6"
						}}
					>
						Journeys Designed For<br />
						Comfort And Connection.
					</h1>
				</div>
			</div>
		</div>
	);
};
export default HeroSection