const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

/* ============================
   Helpers
============================ */
function assertKey() {
	if (!GOOGLE_MAPS_API_KEY) {
		throw new Error("GOOGLE_MAPS_API_KEY is missing");
	}
}

/* ============================
   Directions API
============================ */
export async function getRouteWithWaypoints(
	start: string,
	end: string,
	places: string[]
) {
	assertKey();

	const origin = encodeURIComponent(start);
	const destination = encodeURIComponent(end);

	const waypoints =
		places.length > 0
			? `&waypoints=${encodeURIComponent(places.join("|"))}`
			: "";

	const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypoints}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

	const res = await fetch(url);
	const data = await res.json();

	if (!res.ok) {
		throw new Error(`HTTP error ${res.status}`);
	}
	
	if (data.status !== "OK") {
		console.error("Google Directions API error:", data);
		throw new Error(
			`Directions API error: ${data.status} - ${data.error_message || "No message"}`
		);
	}
	

	if (!data.routes || data.routes.length === 0) {
		throw new Error("No routes returned from Google Directions API");
	}

	return data.routes[0];
}

/* ============================
   Places API – Hotels
============================ */
export async function findHotels(place: string) {
	assertKey();

	const query = encodeURIComponent(`hotels in ${place}`);
	const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_MAPS_API_KEY}`;

	const res = await fetch(url);
	const data = await res.json();

	if (!res.ok || data.status !== "OK") {
		// Hotel search should NEVER break route planning
		console.warn(
			"Google Places API warning:",
			data.error_message || data.status
		);
		return [];
	}

	return data.results || [];
}
