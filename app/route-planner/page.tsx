"use client";

import { useEffect, useState } from "react";

type Hotel = {
	name: string;
	rating?: number;
	address?: string;
};

type Stop = {
	place: string;
	location: {
		lat: number;
		lng: number;
	};
	hotels: Hotel[];
};

export default function RoutePlannerPage() {
	const [start, setStart] = useState("Tezpur");
	const [end, setEnd] = useState("Tawang");
	const [maxHours, setMaxHours] = useState(8);
	const [stops, setStops] = useState<Stop[]>([]);
	const [loading, setLoading] = useState(false);

	const handlePlan = async () => {
		setLoading(true);
		const res = await fetch("/api/route-planner", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ start, end, maxHours }),
		});
		const data = await res.json();
		setStops(data.stops || []);
		setLoading(false);
	};

	const mapUrl =
		stops.length > 0
			? `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${start}&destination=${end}&waypoints=${stops
					.map((s) => s.place)
					.join("|")}`
			: "";

	return (
		<div className="min-h-screen pt-32 bg-linear-to-b from-(--brand-green) via-white to-white">
			{/* HERO */}
			<section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-12">
				<div className="space-y-6">
					<p className="text-sm font-semibold text-emerald-700">
						TRAVEL, SIMPLIFIED
					</p>
					<h1 className="text-4xl font-bold text-emerald-900">
						Plan Your Journey with Drokpa
					</h1>
					<p className="text-gray-600">
						Intelligent stop planning across the Northeast — safe
						driving hours, trusted towns, and curated hotel stays.
					</p>

					{/* INPUT CARD */}
					<div className="bg-white rounded-2xl shadow p-6 space-y-4">
						<div className="grid sm:grid-cols-3 gap-4">
							<input
								className="border rounded-lg p-3"
								value={start}
								onChange={(e) => setStart(e.target.value)}
								placeholder="Start"
							/>
							<input
								className="border rounded-lg p-3"
								value={end}
								onChange={(e) => setEnd(e.target.value)}
								placeholder="End"
							/>
							<input
								type="number"
								className="border rounded-lg p-3"
								value={maxHours}
								onChange={(e) =>
									setMaxHours(Number(e.target.value))
								}
								placeholder="Hours / day"
							/>
						</div>

						<button
							onClick={handlePlan}
							className="bg-emerald-700 text-white px-6 py-3 rounded-full hover:bg-emerald-800"
						>
							{loading ? "Planning..." : "Plan My Route"}
						</button>
					</div>
				</div>

				{/* MAP */}
				<div className="bg-white rounded-2xl shadow overflow-hidden h-[420px]">
					{stops.length > 0 ? (
						<iframe
							src={mapUrl}
							className="w-full h-full border-0"
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						/>
					) : (
						<div className="flex items-center justify-center h-full text-gray-500">
							Map will appear here
						</div>
					)}
				</div>
			</section>

			{/* STOPS */}
			{stops.length > 0 && (
				<section className="max-w-7xl mx-auto px-6 pb-20 space-y-8">
					<h2 className="text-2xl font-bold text-emerald-900">
						Your Day-wise Stopovers
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{stops.map((stop, i) => (
							<div
								key={i}
								className="bg-white rounded-2xl shadow p-5 space-y-4"
							>
								<div>
									<p className="text-sm text-gray-500">
										Day {i + 1}
									</p>
									<h3 className="text-lg font-semibold text-emerald-800">
										{stop.place}
									</h3>
								</div>

								<div className="space-y-2">
									{stop.hotels.length > 0 ? (
										stop.hotels.map((h, idx) => (
											<div
												key={idx}
												className="border rounded-lg p-3"
											>
												<p className="font-medium">
													{h.name}
												</p>
												{h.rating && (
													<p className="text-sm">
														⭐ {h.rating}
													</p>
												)}
												{h.address && (
													<p className="text-sm text-gray-600">
														{h.address}
													</p>
												)}
											</div>
										))
									) : (
										<p className="text-sm text-gray-500">
											No hotels found
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
