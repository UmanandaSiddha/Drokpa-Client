const WeatherWidget = () => {
  return (
    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
      <div className="text-sm text-gray-600">Sela Pass, Arunachal Pradesh</div>
      <div className="flex items-center justify-between gap-8 mt-1">
        <div className="text-xs text-gray-500">H: 7° L: -5° 06:21</div>
        <div className="text-3xl font-light">2°C</div>
      </div>
    </div>
  );
};

export default WeatherWidget;