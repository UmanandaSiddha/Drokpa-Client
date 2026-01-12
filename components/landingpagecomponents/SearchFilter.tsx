"use client";

import { useState } from "react";

interface SearchFilterProps {
	onSearch?: (filters: FilterState) => void;
}

interface FilterState {
	region: string;
	date: string;
	category: string;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
	const [filters, setFilters] = useState<FilterState>({
		region: "All Regions",
		date: "",
		category: "All",
	});

	const regions = [
		"All Regions",
		"North America",
		"Europe",
		"Asia",
		"South America",
		"Africa",
		"Oceania",
	];

	const categories = [
		"All",
		"Technology",
		"Business",
		"Science",
		"Health",
		"Entertainment",
		"Sports",
	];

	const handleFilterChange = (key: keyof FilterState, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleSearch = () => {
		onSearch?.(filters);
	};

	const selectClass =
		"w-full bg-transparent border-b border-white text-white text-sm pb-2 pr-8 focus:outline-none cursor-pointer";

	return (
		<div
			className="w-full mx-auto bg-[#27261C] rounded-[12px] px-10 py-10 shadow-xl"
			style={{
				fontFamily: "var(--font-mona-sans)",
				fontWeight: 500,
			}}
		>
			<div className="flex items-end justify-between gap-10 px-28">

				{/* REGION */}
				<div className="flex-1 relative">
					<p className="text-[11px] text-white uppercase mb-2">
						Region
					</p>
					<select
						value={filters.region}
						onChange={(e) => handleFilterChange("region", e.target.value)}
						className={selectClass}
					>
						{regions.map((region) => (
							<option
								key={region}
								value={region}
								className="bg-[#1f1e16] text-white"
							>
								{region}
							</option>
						))}
					</select>
				</div>

				{/* DATES */}
				<div className="flex-1">
					<p className="text-[11px] text-white uppercase mb-2">
						Dates
					</p>
					<input
						type="date"
						value={filters.date}
						onChange={(e) => handleFilterChange("date", e.target.value)}
						className="w-full bg-transparent border-white border-b text-white text-sm pb-2 focus:outline-none cursor-pointer"
					/>
				</div>

				{/* CATEGORY */}
				<div className="flex-1 relative">
					<p className="text-[11px] text-white uppercase mb-2">
						Category
					</p>
					<select
						value={filters.category}
						onChange={(e) => handleFilterChange("category", e.target.value)}
						className={selectClass}
					>
						{categories.map((category) => (
							<option
								key={category}
								value={category}
								className="bg-[#1f1e16] text-white"
							>
								{category}
							</option>
						))}
					</select>
				</div>

				{/* SEARCH BUTTON */}
				<button
					onClick={handleSearch}
					className="bg-emerald-500 text-black text-[17px] px-6 py-2 rounded-full hover:bg-emerald-600 transition"
				>
					Search
				</button>
			</div>
		</div>
	);
}
