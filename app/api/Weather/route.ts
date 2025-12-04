import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "Tawang";

    const apiKey = process.env.WEATHER_API_KEY;

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        return NextResponse.json({
            location: data.location.name,
            temp: data.current.temp_c + "°C",
            condition: data.current.condition.text,
            humidity: data.current.humidity + "%",
            wind: data.current.wind_kph + " kph",
            rain: data.current.precip_mm + " mm",
            aqi: data.current.air_quality?.["pm2_5"] || "N/A",
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
    }
}
