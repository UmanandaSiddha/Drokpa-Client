import { getRouteWithWaypoints, findHotels } from "./googleMaps";
import { expandPlacesForRoundTrip } from "./routeExpansion";

/* ============================
   Types
============================ */
type PlannerRequest = {
	start: string;
	end: string;
	places: string[];
	maxHoursPerDay: number;
};

type DayPlan = {
	day: number;
	from: string;
	to: string;
	driveHours: number;
	hotels: {
		name: string;
		rating?: number;
		address?: string;
	}[];
};

/* ============================
   Helpers
============================ */
function normalize(place: string) {
	return place.split(",")[0].trim();
}

/* ============================
   Core Planner
============================ */
export async function planRoute(
	req: PlannerRequest
): Promise<{
	route: { start: string; end: string; totalDays: number };
	days: DayPlan[];
}> {
	if (!req.start || !req.end) {
		throw new Error("Start and end locations are required");
	}

	if (req.maxHoursPerDay <= 0) {
		throw new Error("maxHoursPerDay must be greater than 0");
	}

	/* --------------------------------
	   1️⃣ Expand places (NO time logic)
	-------------------------------- */
	const expandedPlaces = expandPlacesForRoundTrip(
		req.start,
		req.end,
		req.places || []
	);

	/* --------------------------------
	   2️⃣ Get REAL route from Google
	-------------------------------- */
	const route = await getRouteWithWaypoints(
		req.start,
		req.end,
		expandedPlaces
	);

	const legs = route.legs;

	if (!legs || legs.length === 0) {
		throw new Error("No route legs returned from Google Maps");
	}

	/* --------------------------------
	   3️⃣ Day-wise segmentation
	-------------------------------- */
	let days: DayPlan[] = [];
	let day = 1;

	let currentDayHours = 0;
	let dayStart = normalize(req.start);
	let lastLocation = normalize(req.start);

	for (const leg of legs) {
		const from = normalize(leg.start_address);
		const to = normalize(leg.end_address);
		const legHours = leg.duration.value / 3600;

		// 🚫 Skip fake / zero legs
		if (legHours === 0 || from === to) continue;

		// 🚨 Single leg longer than allowed day
		// We ALLOW it, but it becomes a forced long-drive day
		if (legHours > req.maxHoursPerDay && currentDayHours === 0) {
			const hotels = await findHotels(to);

			days.push({
				day,
				from: dayStart,
				to,
				driveHours: Number(legHours.toFixed(1)),
				hotels: hotels.slice(0, 3).map((h: any) => ({
					name: h.name,
					rating: h.rating,
					address: h.formatted_address,
				})),
			});

			day++;
			currentDayHours = 0;
			dayStart = to;
			lastLocation = to;
			continue;
		}

		// 🚦 If this leg exceeds today's limit → end day BEFORE it
		if (currentDayHours + legHours > req.maxHoursPerDay) {
			const hotels = await findHotels(lastLocation);

			days.push({
				day,
				from: dayStart,
				to: lastLocation,
				driveHours: Number(currentDayHours.toFixed(1)),
				hotels: hotels.slice(0, 3).map((h: any) => ({
					name: h.name,
					rating: h.rating,
					address: h.formatted_address,
				})),
			});

			day++;
			currentDayHours = 0;
			dayStart = lastLocation;
		}

		// ✅ Add leg to current day
		currentDayHours += legHours;
		lastLocation = to;
	}

	/* --------------------------------
	   4️⃣ Final day (if movement exists)
	-------------------------------- */
	if (currentDayHours > 0 && dayStart !== lastLocation) {
		const hotels = await findHotels(lastLocation);

		days.push({
			day,
			from: dayStart,
			to: lastLocation,
			driveHours: Number(currentDayHours.toFixed(1)),
			hotels: hotels.slice(0, 3).map((h: any) => ({
				name: h.name,
				rating: h.rating,
				address: h.formatted_address,
			})),
		});
	}

	return {
		route: {
			start: req.start,
			end: req.end,
			totalDays: days.length,
		},
		days,
	};
}
