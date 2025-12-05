"use client";

import Image from "next/image";
import {
    TemperatureLogo,
    HumidityLogo,
    WindLogo,
    AirLogo,
    RainLogo,
} from "@/assets";
import { useEffect, useState } from "react";
import Link from "next/link";

interface WeatherData {
    current: {
        temp_c: number;
        humidity: number;
        wind_kph: number;
        feelslike_c: number;
        precip_mm: number;
        air_quality?: {
            "pm2_5": number;
            "pm10": number;
            "o3": number;
            "no2": number;
            "so2": number;
            "co": number;
            "us-epa-index": number;
        };
        condition: { text: string; icon: string };
        last_updated: string;
    };
    location: { name: string; region: string; country: string };
}

export default function WeatherCard({ place }: { place: string }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiKey = "1ea37dcf8a744e9f9ff151103250509";
                const res = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}&aqi=yes`
                );
                if (!res.ok) throw new Error("Failed to fetch weather");
                const data: WeatherData = await res.json();
                setWeather(data);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000);
        return () => clearInterval(interval);
    }, [place]);

    const formatValue = (value: string) => (
        <span className="text-sm sm:text-base font-semibold text-black dark:text-white">
            <span className="sm:hidden">{value.replace(/[^0-9.]/g, "")}</span>
            <span className="hidden sm:inline">{value}</span>
        </span>
    );

    // 🔴 ERROR UI
    if (error) {
        return (
            <div className="p-4 w-full max-w-2xl text-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-xl">
                <p>⚠️ Could not load weather for "{place}"</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full max-w-2xl p-4 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse h-32" />
        );
    }

    const AQI = weather?.current?.air_quality?.["us-epa-index"] ?? "—";

    return (
        <div className="weather-card-card rounded-xl bg-white/95 dark:bg-black/75 shadow-lg w-full sm:mb-12 mb-0.5 max-w-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">

            <div className="flex w-full sm:w-auto items-center gap-3 sm:gap-4">
                <div className="rounded-lg p-1 sm:p-2 shrink-0">
                    <Image src={`https:${weather?.current.condition.icon}` || TemperatureLogo} alt="temp" width={42} height={42} />
                </div>

                <div className="flex flex-col">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                        {weather?.location?.name}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-white">
                        {weather?.current?.temp_c}
                        <span className="hidden sm:inline">°C</span>
                    </div>
                    <p className="hidden md:block text-xs sm:text-sm text-gray-500 dark:text-gray-300">{weather?.current.condition.text}</p>
                </div>

                <div className="sm:w-auto flex flex-col justify-end">
                    <p className="block md:hidden text-sm sm:text-md text-gray-500 dark:text-gray-300">{weather?.current.condition.text}</p>
                    <Link
                        href="/"
                        className="text-xs sm:text-sm text-gray-500 underline sm:hidden block"
                    >
                        View on AccuWeather »
                    </Link>
                </div>
            </div>

            <div className="hidden sm:block self-stretch w-0.5 bg-gray-300 dark:bg-gray-600 rounded-sm mx-2" />

            <div className="flex-1 w-full">
                <div className="grid grid-cols-4 md:grid-cols-2 gap-2 p-2 sm:p-3">
                    <WeatherItem icon={HumidityLogo} value={formatValue(`${weather?.current.humidity}%`)} />
                    <WeatherItem icon={RainLogo} value={formatValue(`${weather?.current.precip_mm}mm`)} />
                    <WeatherItem icon={WindLogo} value={formatValue(`${weather?.current.wind_kph}km/h`)} />
                    <WeatherItem icon={AirLogo} value={formatValue(`${AQI} AQI`)} />
                </div>
            </div>

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

const WeatherItem = ({ icon, value }: { icon: any; value: React.ReactNode }) => (
    <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 bg-[#B5A26D] rounded-lg">
            <Image src={icon} alt="icon" width={20} height={20} />
        </div>
        {value}
    </div>
);