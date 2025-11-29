"use client";

import Image from "next/image";
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
        <div className="weather-card-card rounded-xl bg-white/95 dark:bg-black/75 shadow-lg w-full max-w-2xl p-2 md:p-4 mx-4 sm:mx-0 flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex w-full md:w-auto items-center md:items-center gap-2 md:gap-4">
                <div className="bg-transparent rounded-lg p-1 md:p-2 shrink-0">
                    <Image src={TemperatureLogo} alt="temp" width={48} height={48} />
                </div>
                <div className="flex flex-col">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{weather.location}</div>
                    <div className="text-xl md:text-3xl font-bold text-black dark:text-white">{weather.temp}</div>
                </div>

                <div className="w-full flex justify-end md:hidden pr-4">
                    <a href="#" className="text-sm text-gray-500 underline">View on AccuWeather »</a>
                </div>
            </div>

            <div className="hidden md:block self-stretch w-0.5 md:w-[3px] bg-gray-300 dark:bg-gray-600 rounded-sm mx-2" />

            <div className="flex-1 w-full">
                <div className="hidden sm:grid grid-cols-2 gap-2 items-stretch">
                    <div className="flex items-center gap-2 p-1">
                        <div className="bg-black rounded-md p-1 flex items-center justify-center">
                            <Image src={HumidityLogo} alt="humidity" width={24} height={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">0%</div>
                            <div className="text-xs text-gray-400">Humidity</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1">
                        <div className="bg-black rounded-md p-1 flex items-center justify-center">
                            <Image src={RainLogo} alt="rain" width={24} height={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">0%</div>
                            <div className="text-xs text-gray-400">Precipitation</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1">
                        <div className="bg-black rounded-md p-1 flex items-center justify-center">
                            <Image src={WindLogo} alt="wind" width={24} height={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">5 kph</div>
                            <div className="text-xs text-gray-400">Wind</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1">
                        <div className="bg-black rounded-md p-1 flex items-center justify-center">
                            <Image src={AirLogo} alt="air" width={24} height={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">73</div>
                            <div className="text-xs text-gray-400">Air quality</div>
                        </div>
                    </div>
                </div>

                <div className="sm:hidden overflow-x-auto no-scrollbar">
                    <div className="flex gap-3 items-center px-1">
                        <div className="flex flex-row items-center gap-2 p-2 min-w-[72px]" title="Humidity">
                            <div className="bg-black rounded-md p-2 flex items-center justify-center">
                                <Image src={HumidityLogo} alt="humidity" width={20} height={20} />
                            </div>
                            <div className="text-md text-gray-700">0%</div>
                        </div>

                        <div className="flex flex-row items-center gap-2 p-2 min-w-[72px]" title="Precipitation">
                            <div className="bg-black rounded-md p-2 flex items-center justify-center">
                                <Image src={RainLogo} alt="rain" width={20} height={20} />
                            </div>
                            <div className="text-md text-gray-700">0%</div>
                        </div>

                        <div className="flex flex-row items-center gap-2 p-2 min-w-[72px]" title="Wind">
                            <div className="bg-black rounded-md p-2 flex items-center justify-center">
                                <Image src={WindLogo} alt="wind" width={20} height={20} />
                            </div>
                            <div className="text-md text-gray-700">5 kph</div>
                        </div>

                        <div className="flex flex-row items-center gap-2 p-2 min-w-[72px]" title="Air quality">
                            <div className="bg-black rounded-md p-2 flex items-center justify-center">
                                <Image src={AirLogo} alt="air" width={20} height={20} />
                            </div>
                            <div className="text-md text-gray-700">73</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ml-4 text-sm text-gray-500 underline hidden sm:block">View on AccuWeather »</div>
        </div>
    );
}
