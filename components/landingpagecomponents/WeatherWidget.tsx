const WeatherWidget = () => {
	return (
		<div
			className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-[8px] px-[16px] py-[12px] shadow-lg"
			style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "black" }}
		>
			<div className="flex items-center justify-between gap-8 mt-1">
				<div>
					<div className="text-sm text-gray-600">Sela Pass, Arunachal Pradesh</div>
					<div className="text-xs text-gray-500">H: 7° L: -5° 06:21</div>
				</div>
				<div className="flex items-start">
					<span className="text-[48px] leading-none">2</span>
					<span className="text-sm text-[#686766] leading-none">°C</span>
				</div>
			</div>
		</div>
	);
};

export default WeatherWidget;