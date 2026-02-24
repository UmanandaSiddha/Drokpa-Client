"use client";
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Room = {
	id: string;
	name: string;
	price: number;
	likedPercent: number;
	recommended: boolean;
	capacity: number;
	beds: number;
	baths: number;
	features: string[];
	images: string[];
};

type Props = {
	rooms: Room[];
};

export default function BookingCard({ rooms }: Props) {
	const [roomId, setRoomId] = React.useState<string>(rooms[0]?.id ?? "");
	const [guests, setGuests] = React.useState(1);
	const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

	const selectedRoom = rooms.find((r) => r.id === roomId);

	/* ---------- PRICE RANGE ---------- */
	const prices = rooms.map((r) => r.price);
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);

	/* ---------- DATE LOGIC ---------- */
	const nights = dateRange?.from && dateRange?.to
		? Math.max(
			0,
			(dateRange.to.getTime() - dateRange.from.getTime()) /
			(1000 * 60 * 60 * 24)
		)
		: 0;

	const totalPrice =
		selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

	return (
		<div className="border border-[#DDE7E0]/70 rounded-2xl p-6 shadow-[0_18px_45px_-35px_rgba(0,0,0,0.35)] bg-white space-y-5">

			{/* PRICE HEADER */}
			<div className="flex items-baseline gap-2">
				{selectedRoom ? (
					<>
						<span className="text-2xl font-semibold">₹{selectedRoom.price.toLocaleString()}</span>
						<span className="text-gray-600">per night</span>
					</>
				) : (
					<span className="text-2xl font-semibold">₹{minPrice} – ₹{maxPrice}</span>
				)}
			</div>

			{/* DATE RANGE PICKER */}
			<div>
				<label className="text-sm font-semibold block mb-2">Dates</label>
				<Popover>
					<PopoverTrigger asChild>
						<button
							type="button"
							className={cn(
								"w-full flex items-center justify-between rounded-xl border-2 border-gray-200 px-3 py-2 text-sm",
								!dateRange?.from && "text-[#686766]"
							)}
						>
							<span className="flex items-center gap-2">
								<CalendarIcon className="h-4 w-4 text-[#005246]" />
								{dateRange?.from ? (
									dateRange.to ? (
										`${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
									) : (
										format(dateRange.from, "MMM dd, yyyy")
									)
								) : (
									"Select check-in and check-out"
								)}
							</span>
							<span className="text-xs">{nights > 0 ? `${nights} nights` : ""}</span>
						</button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="range"
							selected={dateRange}
							onSelect={setDateRange}
							numberOfMonths={2}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>

			{/* ROOM SELECT */}
			<div>
				<label className="text-sm font-semibold block mb-2">Room</label>
				<Select value={roomId} onValueChange={setRoomId}>
					<SelectTrigger className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm">
						<SelectValue placeholder="Select a room" />
					</SelectTrigger>
					<SelectContent>
						{rooms.map((room) => (
							<SelectItem key={room.id} value={room.id}>
								{room.name} — ₹{room.price}/night
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* GUEST SELECT */}
			<div>
				<label className="text-sm font-semibold block mb-2">Guests</label>
				<Select value={String(guests)} onValueChange={(value) => setGuests(Number(value))}>
					<SelectTrigger className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm">
						<SelectValue placeholder="Select guests" />
					</SelectTrigger>
					<SelectContent>
						{Array.from(
							{ length: selectedRoom?.capacity || 2 },
							(_, i) => i + 1
						).map((n) => (
							<SelectItem key={n} value={String(n)}>
								{n} guest{n > 1 && "s"}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* PRICE BREAKDOWN */}
			{nights > 0 && selectedRoom && (
				<div className="border-t border-[#DDE7E0]/70 pt-4 space-y-2 text-sm">
					<div className="flex justify-between">
						<span>₹{selectedRoom.price} × {nights} nights</span>
						<span>₹{totalPrice.toLocaleString()}</span>
					</div>

					<div className="flex justify-between font-semibold">
						<span>Total</span>
						<span>₹{totalPrice.toLocaleString()}</span>
					</div>
				</div>
			)}

			{/* CTA */}
			<button
				disabled={!dateRange?.from || !dateRange?.to || nights <= 0}
				className="w-full bg-[#005246] disabled:opacity-50 text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
			>
				Reserve
			</button>

			<p className="text-center text-sm text-gray-600">
				You won’t be charged yet
			</p>
		</div>
	);
}
