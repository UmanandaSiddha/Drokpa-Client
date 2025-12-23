import { NextResponse } from "next/server";
import { planRoute } from "@/lib/planner";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		if (
			!body.start ||
			!body.end ||
			!Array.isArray(body.places) ||
			!body.maxHoursPerDay
		) {
			return NextResponse.json(
				{ error: "Invalid request payload" },
				{ status: 400 }
			);
		}

		const result = await planRoute(body);
		return NextResponse.json(result);
	} catch (err: any) {
		return NextResponse.json(
			{ error: err.message || "Server error" },
			{ status: 500 }
		);
	}
}
