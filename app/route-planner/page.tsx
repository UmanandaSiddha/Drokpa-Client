import type { Metadata } from "next";
import RoutePlannerPage from "../../client/RoutePlannerClient";

export const metadata: Metadata = {
	title: "Smart Route Planner - Plan Your Journey in Arunachal Pradesh",
	description: "Coming soon: Plan your perfect journey across Arunachal Pradesh with our intelligent route planning tool. Discover scenic routes, optimize travel times, and explore hidden gems.",
	alternates: {
		canonical: "https://www.drokpa.in/route-planner",
	},
	openGraph: {
		title: "Route Planner - Drokpa",
		description: "Intelligent route planning for Arunachal Pradesh travel",
		url: "https://www.drokpa.in/route-planner",
	},
};

export default function Page() {
	return <RoutePlannerPage />;
}
