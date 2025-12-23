export type PlannerRequest = {
	start: string;
	end: string;
	places: string[];
	maxHoursPerDay: number;
};

export type DayPlan = {
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
