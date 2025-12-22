const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

export async function getDirections(origin: string, destination: string) {
	const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
		origin
	)}&destination=${encodeURIComponent(destination)}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

	const res = await fetch(url);
	const data = await res.json();

	if (data.status !== "OK") throw new Error("Directions API failed");
	return data.routes[0];
}

export async function findHotels(lat: number, lng: number) {
	const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=30000&type=lodging&key=${GOOGLE_MAPS_API_KEY}`;

	const res = await fetch(url);
	const data = await res.json();

	if (data.status !== "OK") return [];
	return data.results;
}
