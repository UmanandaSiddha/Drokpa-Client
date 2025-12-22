import { getDirections, findHotels } from "./googleMaps";
import { ALLOWED_STOPS } from "./allowedStops";
import { distanceKm } from "./geo";

export async function planRoute(
	start: string,
	end: string,
	maxHours: number
) {
	const route = await getDirections(start, end);
	const legs = route.legs;

	let elapsedHours = 0;
	let stops = [];

	for (const leg of legs) {
		for (const step of leg.steps) {
			elapsedHours += step.duration.value / 3600;

			if (elapsedHours >= maxHours) {
				const curLat = step.end_location.lat;
				const curLng = step.end_location.lng;

				// Find nearest FORWARD allowed stop
				let nearestStop = null;
				let minDist = Infinity;

				for (const stop of ALLOWED_STOPS) {
					const d = distanceKm(curLat, curLng, stop.lat, stop.lng);
					if (d < minDist) {
						minDist = d;
						nearestStop = stop;
					}
				}

				if (!nearestStop) continue;

				const hotels = await findHotels(
					nearestStop.lat,
					nearestStop.lng
				);

				stops.push({
					place: nearestStop.name,
					location: nearestStop,
					hotels: hotels.slice(0, 5).map((h: any) => ({
						name: h.name,
						rating: h.rating,
						address: h.vicinity,
					})),
				});

				elapsedHours = 0;
			}
		}
	}

	return { start, end, stops };
}
