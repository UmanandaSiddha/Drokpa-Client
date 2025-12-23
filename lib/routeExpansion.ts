/**
 * Expands places for special cases like round trips.
 * IMPORTANT:
 * - This file NEVER deals with time or distance
 * - It only decides WHICH places should exist in the route
 */

export function expandPlacesForRoundTrip(
	start: string,
	end: string,
	places: string[]
): string[] {
	// Normalize helper
	const normalize = (p: string) => p.split(",")[0].trim();

	const startN = normalize(start);
	const endN = normalize(end);
	const userPlaces = places.map(normalize);

	// If NOT a round trip, return user places as-is
	if (startN !== endN) {
		return userPlaces;
	}

	/**
	 * Known safe corridor between Tawang ↔ Guwahati
	 * Ordered North → South
	 *
	 * This list represents REAL towns where:
	 * - Roads exist
	 * - Hotels exist
	 * - Overnight halts make sense
	 */
	const TAWANG_GUWAHATI_CORRIDOR = [
		"Tawang",
		"Dirang",
		"Bomdila",
		"Rupa",
		"Shergaon",
		"Tezpur",
	];

	/**
	 * Remove start/end and duplicates
	 */
	const corridorStops = TAWANG_GUWAHATI_CORRIDOR.filter(
		(p) =>
			p !== startN &&
			p !== endN &&
			!userPlaces.includes(p)
	);

	/**
	 * Final expanded places:
	 * - User-requested places FIRST (respect user intent)
	 * - Corridor stops NEXT (for safe return routing)
	 */
	return [...userPlaces, ...corridorStops];
}
