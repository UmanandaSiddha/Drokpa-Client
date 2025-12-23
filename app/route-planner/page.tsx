"use client";

import { useState } from "react";

type Hotel = {
	name: string;
	rating?: number;
	address?: string;
};

type DayPlan = {
	day: number;
	from: string;
	to: string;
	driveHours: number;
	hotels: Hotel[];
};

type ApiResponse = {
	route: {
		start: string;
		end: string;
		totalDays: number;
	};
	days: DayPlan[];
};

export default function RoutePlannerPage() {
	const [start, setStart] = useState("Guwahati");
	const [end, setEnd] = useState("Guwahati");
	const [places, setPlaces] = useState("Shergaon, Tawang");
	const [maxHours, setMaxHours] = useState(8);

	const [result, setResult] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handlePlan = async () => {
		setLoading(true);
		setError("");
		setResult(null);

		try {
			const res = await fetch("/api/route-planner", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					start,
					end,
					places: places
						.split(",")
						.map((p) => p.trim())
						.filter(Boolean),
					maxHoursPerDay: maxHours,
				}),
			});

			const data = await res.json();
			console.log(data)
			if (!res.ok) {
				throw new Error(data.error || "Failed to plan route");
			}

			setResult(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	/* MAP URL */
	const mapWaypoints =
		result?.days.map((d) => d.to).join("|") ?? "";

	const mapUrl =
		result && result.days.length > 0
			? `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${result.route.start}&destination=${result.route.end}&waypoints=${mapWaypoints}`
			: "";

	return (
		<div className="min-h-screen bg-linear-to-b from-(--brand-green) via-white to-white">
			{/* HERO + INPUT */}
			<section className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12">
				<div className="space-y-6">
					<p className="text-sm font-semibold text-emerald-100">
						TRAVEL, SIMPLIFIED
					</p>
					{/* <h1 className="text-4xl font-bold text-gray-100">
						Intelligent Route Planner
					</h1> */}
					<p className="text-gray-300">
						Plan safe, day-wise road trips across the Northeast with
						hotel-backed stopovers.
					</p>

					<div className="bg-white rounded-2xl shadow p-6 space-y-4">
						<input
							className="border rounded-lg p-3 w-full"
							value={start}
							onChange={(e) => setStart(e.target.value)}
							placeholder="Start location"
						/>

						<input
							className="border rounded-lg p-3 w-full"
							value={end}
							onChange={(e) => setEnd(e.target.value)}
							placeholder="End location"
						/>

						<input
							className="border rounded-lg p-3 w-full"
							value={places}
							onChange={(e) => setPlaces(e.target.value)}
							placeholder="Places to visit (comma separated)"
						/>

						<input
							type="number"
							className="border rounded-lg p-3 w-full"
							value={maxHours}
							onChange={(e) =>
								setMaxHours(Number(e.target.value))
							}
							placeholder="Max driving hours per day"
						/>

						<button
							onClick={handlePlan}
							disabled={loading}
							className="bg-emerald-700 text-white px-6 py-3 rounded-full hover:bg-emerald-800 disabled:opacity-50"
						>
							{loading ? "Planning..." : "Generate Route Plan"}
						</button>

						{error && (
							<p className="text-sm text-red-600">{error}</p>
						)}
					</div>
				</div>

				{/* MAP */}
				<div className="bg-white rounded-2xl shadow overflow-hidden h-[420px]">
					{result ? (
						<iframe
							src={mapUrl}
							className="w-full h-full border-0"
							loading="lazy"
						/>
					) : (
						<div className="flex items-center justify-center h-full text-gray-500">
							Route map will appear here
						</div>
					)}
				</div>
			</section>

			{/* DAY-WISE PLAN */}
			{result && (
				<section className="max-w-7xl mx-auto px-6 pb-20 space-y-8">
					<h2 className="text-2xl font-bold text-emerald-900">
						Your Day-wise Itinerary
					</h2>

					<div className="space-y-6">
						{result.days.map((day) => (
							<div
								key={day.day}
								className="bg-white rounded-2xl shadow p-6 space-y-4"
							>
								<div className="flex flex-wrap items-center gap-3">
									<span className="bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full">
										Day {day.day}
									</span>
									<h3 className="text-lg font-semibold">
										{day.from} → {day.to}
									</h3>
									<span className="text-sm text-gray-500">
										{day.driveHours} hrs driving
									</span>
								</div>

								{day.hotels.length > 0 ? (
									<div className="grid md:grid-cols-3 gap-4">
										{day.hotels.map((hotel, i) => (
											<div
												key={i}
												className="border rounded-lg p-4 bg-slate-50"
											>
												<p className="font-medium">
													{hotel.name}
												</p>
												{hotel.rating && (
													<p className="text-sm">
														⭐ {hotel.rating}
													</p>
												)}
												{hotel.address && (
													<p className="text-sm text-gray-600">
														{hotel.address}
													</p>
												)}
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-500">
										No hotels found for this stop.
									</p>
								)}
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
