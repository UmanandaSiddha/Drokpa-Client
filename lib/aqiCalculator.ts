type AQICategory =
    | "Good"
    | "Moderate"
    | "Unhealthy for Sensitive Groups"
    | "Unhealthy"
    | "Very Unhealthy"
    | "Hazardous";

export interface AQIResult {
    aqi: number;
    category: AQICategory;
    color: string;
}

export function calculateAQIFromPM25(pm25: number): AQIResult {
    const breakpoints = [
        { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50, category: "Good", color: "#00e400" },
        { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100, category: "Moderate", color: "#ffff00" },
        { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150, category: "Unhealthy for Sensitive Groups", color: "#ff7e00" },
        { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200, category: "Unhealthy", color: "#ff0000" },
        { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300, category: "Very Unhealthy", color: "#8f3f97" },
        { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500, category: "Hazardous", color: "#7e0023" },
    ] as const;

    const bp = breakpoints.find(
        b => pm25 >= b.cLow && pm25 <= b.cHigh
    );

    if (!bp) {
        return {
            aqi: 500,
            category: "Hazardous",
            color: "#7e0023",
        };
    }

    const aqi =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
        (pm25 - bp.cLow) +
        bp.iLow;

    return {
        aqi: Math.round(aqi),
        category: bp.category,
        color: bp.color,
    };
}