import TrekCard from "./TrekCard";
import WeatherWidget from "./WeatherWidget";

const HeroSection = () => {
  return (
    <div className="flex justify-center">
      <div className="relative h-150 w-[95%] max-w-8xl overflow-hidden rounded-2xl">
        
        {/* Background */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop"
          alt="Mountain landscape"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40 z-10" />

        {/* Floating widgets */}
        <WeatherWidget />
        <TrekCard />

        {/* Hero text */}
        <div className="relative z-20 h-full flex flex-col justify-end px-16 pb-24">
          <h1 className="text-white text-7xl font-bold leading-tight">
            Journeys Designed For<br />
            Comfort And Connection.
          </h1>
        </div>
      </div>
    </div>
  );
};
export default HeroSection