"use client";

import Image from "next/image";
import Link from "next/link";
import { TemperatureLogo, HumidityLogo, WindLogo, AirLogo, RainLogo } from "@/assets";

type Weather = {
    location: string;
    temp: string;
    condition: string;
    humidity: string;
    wind?: string;
    rain?: string;
    aqi?: string;
};

export default function WeatherCard({ weather }: { weather: Weather }) {
    return (
        <div className="
            weather-card-card 
            rounded-xl 
            bg-white/95 dark:bg-black/75 
            shadow-lg 
            w-full 
            sm:mb-12
            mb-0.5
            max-w-2xl 
            p-3 sm:p-4 
            mx-0 
            flex flex-col sm:flex-row 
            items-start sm:items-center 
            gap-3
        ">
            {/* Left Section */}
            <div className="flex w-full sm:w-auto items-center gap-3 sm:gap-4">
                <div className="rounded-lg p-1 sm:p-2 shrink-0">
                    <Image src={TemperatureLogo} alt="temp" width={42} height={42} className="sm:w-12 sm:h-12" />
                </div>

                <div className="flex flex-col">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {weather.location}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-white">
                        {weather.temp}
                    </div>
                </div>

                <div className="w-full sm:w-auto flex justify-end">
                    <Link
                        href="/"
                        className="text-xs sm:text-sm text-gray-500 underline sm:hidden block"
                    >
                        View on AccuWeather »
                    </Link>
                </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block self-stretch w-0.5 bg-gray-300 dark:bg-gray-600 rounded-sm mx-2" />

            {/* Weather Info Grid */}
            <div className="flex-1 w-full">
                <div className="grid grid-cols-4 md:grid-cols-2 gap-2 p-2 sm:p-3">

                    {/* Humidity */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center bg-[#B5A26D] rounded-lg p-2 w-10 h-10">
                            <Image src={HumidityLogo} alt="humidity" width={20} height={20} />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-black">
                            {weather.humidity}
                        </span>
                    </div>

                    {/* Rain */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#B5A26D] rounded-lg">
                            <Image src={RainLogo} alt="rain" width={20} height={20} />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-black">
                            {String(weather.rain).replace("%", "")}%
                        </span>
                    </div>

                    {/* Wind */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#B5A26D] rounded-lg">
                            <Image src={WindLogo} alt="wind" width={20} height={20} />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-black">
                            {String(weather.wind).replace("%", "")}%
                        </span>
                    </div>

                    {/* Air Quality */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#B5A26D] rounded-lg">
                            <Image src={AirLogo} alt="air" width={20} height={20} />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-black">
                            {String(weather.aqi).replace("%", "")} AQI
                        </span>
                    </div>

                </div>
            </div>

            {/* AccuWeather Link (Top-right on larger screens, bottom on mobile) */}
            <div className="w-full sm:w-auto flex justify-end">
                <Link
                    href="/"
                    className="text-xs sm:text-sm text-gray-500 underline hidden sm:block"
                >
                    View on AccuWeather »
                </Link>
            </div>
        </div>
    );
}
