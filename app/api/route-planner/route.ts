import { NextResponse } from "next/server";
import { planRoute } from "@/lib/planner";

export async function POST(req: Request) {
	try {
		const { start, end, maxHours } = await req.json();

		if (!start || !end || !maxHours) {
			return NextResponse.json(
				{ error: "Missing parameters" },
				{ status: 400 }
			);
		}

		const result = await planRoute(start, end, maxHours);
		return NextResponse.json(result);
	} catch (err: any) {
		return NextResponse.json(
			{ error: err.message },
			{ status: 500 }
		);
	}
}
