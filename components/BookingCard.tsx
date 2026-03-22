"use client";
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
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
import { useAuth } from "@/hooks/auth/useAuth";
import { bookingService } from "@/services/booking.service";
import type { BookingCriteria, RoomAvailability } from "@/types/homestay";

type Room = {
	id: string;
	name: string;
	price: number;
	likedPercent: number;
	recommended: boolean;
	capacity: number;
	totalRooms: number;
	bookingCriteria: BookingCriteria;
	beds: number;
	baths: number;
	features: string[];
	images: string[];
	availability?: RoomAvailability[];
};

type Props = {
	rooms: Room[];
	onLoginRequired?: () => void;
};

const normalizeDateKey = (value: string | Date) =>
	typeof value === "string" ? value.slice(0, 10) : format(value, "yyyy-MM-dd");

const buildStayDateKeys = (dateRange: DateRange | undefined) => {
	if (!dateRange?.from || !dateRange?.to) {
		return [] as string[];
	}

	const dates: string[] = [];
	const current = new Date(dateRange.from);
	current.setHours(0, 0, 0, 0);
	const end = new Date(dateRange.to);
	end.setHours(0, 0, 0, 0);

	while (current < end) {
		dates.push(format(current, "yyyy-MM-dd"));
		current.setDate(current.getDate() + 1);
	}

	return dates;
};

const getRequiredRooms = (room: Room, guests: number) =>
	Math.max(1, Math.ceil(guests / room.capacity));

const getAvailableRooms = (room: Room, stayDateKeys: string[]) => {
	if (stayDateKeys.length === 0) {
		return room.totalRooms;
	}

	const availabilityByDate = new Map(
		(room.availability ?? []).map((entry) => [normalizeDateKey(entry.date), entry.available]),
	);

	return stayDateKeys.reduce((lowest, dateKey) => {
		const available = availabilityByDate.get(dateKey) ?? room.totalRooms;
		return Math.min(lowest, available);
	}, room.totalRooms);
};

const getEstimatedTotal = (room: Room, guests: number, nights: number) => {
	const requiredRooms = getRequiredRooms(room, guests);

	if (room.bookingCriteria === "PER_PERSON") {
		return room.price * guests;
	}

	if (room.bookingCriteria === "HYBRID") {
		return room.price * guests * nights;
	}

	return room.price * requiredRooms * nights;
};

const getPricingLabel = (bookingCriteria: BookingCriteria) => {
	if (bookingCriteria === "PER_PERSON") {
		return "per person";
	}

	if (bookingCriteria === "HYBRID") {
		return "per person / night";
	}

	return "per night";
};

export default function BookingCard({ rooms, onLoginRequired }: Props) {
	const { user } = useAuth();
	const [roomId, setRoomId] = React.useState<string>(rooms[0]?.id ?? "");
	const [guests, setGuests] = React.useState(1);
	const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const prices = rooms.map((r) => r.price);
	const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
	const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

	const nights =
		dateRange?.from && dateRange?.to
			? Math.max(
				0,
				Math.round(
					(dateRange.to.getTime() - dateRange.from.getTime()) /
					(1000 * 60 * 60 * 24)
				)
			)
			: 0;
	const stayDateKeys = buildStayDateKeys(dateRange);

	const roomOptions = rooms.map((room) => {
		const availableRooms = getAvailableRooms(room, stayDateKeys);
		const requiredRooms = getRequiredRooms(room, guests);

		return {
			room,
			availableRooms,
			requiredRooms,
			canAccommodate: room.totalRooms > 0 && availableRooms >= requiredRooms,
		};
	});

	const visibleRoomOptions = roomOptions.filter((option) => option.canAccommodate);
	const selectedRoomOption =
		visibleRoomOptions.find((option) => option.room.id === roomId) ??
		visibleRoomOptions[0] ??
		null;
	const selectedRoom = selectedRoomOption?.room ?? null;
	const requiredRooms = selectedRoomOption?.requiredRooms ?? 0;
	const availableRooms = selectedRoomOption?.availableRooms ?? 0;
	const maxSelectableGuests = roomOptions.reduce((highest, option) => {
		return Math.max(highest, option.room.capacity * Math.max(option.availableRooms, 0));
	}, 1);

	const totalPrice =
		selectedRoom && nights > 0 ? getEstimatedTotal(selectedRoom, guests, nights) : 0;

	const maxGuests = selectedRoom
		? Math.max(1, selectedRoom.capacity * Math.max(availableRooms, selectedRoom.totalRooms))
		: maxSelectableGuests;

	React.useEffect(() => {
		const nextRoomId = visibleRoomOptions[0]?.room.id ?? "";

		if (roomId && visibleRoomOptions.some((option) => option.room.id === roomId)) {
			return;
		}

		if (roomId !== nextRoomId) {
			setRoomId(nextRoomId);
		}
	}, [roomId, visibleRoomOptions]);

	React.useEffect(() => {
		if (guests > maxSelectableGuests) {
			setGuests(maxSelectableGuests);
		}
	}, [guests, maxSelectableGuests]);

	const handleRoomChange = (id: string) => {
		setRoomId(id);
		setError(null);
	};

	const canReserve =
		!!dateRange?.from &&
		!!dateRange?.to &&
		nights > 0 &&
		!!selectedRoomOption;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const handleReserve = async () => {
		if (!user) {
			onLoginRequired?.();
			return;
		}
		if (!dateRange?.from || !dateRange?.to || nights <= 0) {
			setError("Please select valid check-in and check-out dates.");
			return;
		}
		if (!selectedRoomOption) {
			setError("No room type is available for the selected dates and guest count.");
			return;
		}
		try {
			setIsSubmitting(true);
			setError(null);
			const booking = await bookingService.requestHomestayBooking({
				roomId: selectedRoomOption.room.id,
				checkIn: format(dateRange.from, "yyyy-MM-dd"),
				checkOut: format(dateRange.to, "yyyy-MM-dd"),
				guests,
			});
			if (booking?.id) {
				window.location.assign(`/checkout?bookingId=${booking.id}`);
				return;
			}

			setError("Booking was created but the checkout page could not be opened.");
		} catch (err) {
			console.error("[BookingCard] Reserve failed:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to create booking. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="border border-[#DDE7E0]/70 rounded-2xl p-6 shadow-[0_18px_45px_-35px_rgba(0,0,0,0.35)] bg-white space-y-5">
			<div className="flex items-baseline gap-2">
				{selectedRoom ? (
					<>
						<span className="text-2xl font-semibold">
							{"\u20B9"}{selectedRoom.price.toLocaleString()}
						</span>
						<span className="text-gray-600">{getPricingLabel(selectedRoom.bookingCriteria)}</span>
					</>
				) : (
					<span className="text-2xl font-semibold">
						{"\u20B9"}{minPrice.toLocaleString()} {"\u2013"} {"\u20B9"}{maxPrice.toLocaleString()}
					</span>
				)}
			</div>

			{error && (
				<div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
					<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
					<span>{error}</span>
				</div>
			)}

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
										`${format(dateRange.from, "MMM dd, yyyy")} ${"\u2013"} ${format(
											dateRange.to,
											"MMM dd, yyyy"
										)}`
									) : (
										format(dateRange.from, "MMM dd, yyyy")
									)
								) : (
									"Select check-in and check-out"
								)}
							</span>
							<span className="text-xs text-gray-500">
								{nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : ""}
							</span>
						</button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="range"
							selected={dateRange}
							onSelect={(range) => {
								setDateRange(range);
								setError(null);
							}}
							numberOfMonths={2}
							disabled={{ before: today }}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div>
				<label className="text-sm font-semibold block mb-2">Room Type</label>
				<Select value={roomId} onValueChange={handleRoomChange}>
					<SelectTrigger className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm">
						<SelectValue placeholder="Select a room type" />
					</SelectTrigger>
					<SelectContent>
						{visibleRoomOptions.map(({ room, availableRooms: roomAvailability, requiredRooms: neededRooms }) => (
							<SelectItem key={room.id} value={room.id}>
								{room.name} {"\u2014"} {"\u20B9"}{room.price.toLocaleString()} ({room.capacity} guest{room.capacity > 1 ? "s" : ""}/room, {roomAvailability} available, {neededRooms} needed)
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<label className="text-sm font-semibold block mb-2">Guests</label>
				<Select
					value={String(guests)}
					onValueChange={(value) => {
						setGuests(Number(value));
						setError(null);
					}}
				>
					<SelectTrigger className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm">
						<SelectValue placeholder="Select guests" />
					</SelectTrigger>
					<SelectContent>
						{Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
							<SelectItem key={n} value={String(n)}>
								{n} guest{n > 1 ? "s" : ""}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{selectedRoom && (
				<div className="rounded-xl border border-[#DDE7E0]/70 bg-[#F5F1E6]/60 p-4 space-y-2 text-sm text-[#353030]">
					<div className="flex items-center justify-between gap-3">
						<span className="text-[#686766]">Rooms required</span>
						<span className="font-semibold">{requiredRooms}</span>
					</div>
					<div className="flex items-center justify-between gap-3">
						<span className="text-[#686766]">Available for your stay</span>
						<span className="font-semibold">{availableRooms}</span>
					</div>
					<div className="flex items-center justify-between gap-3">
						<span className="text-[#686766]">Max guests for this stay</span>
						<span className="font-semibold">{maxGuests}</span>
					</div>
				</div>
			)}

			{dateRange?.from && dateRange?.to && visibleRoomOptions.length === 0 && (
				<div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
					No active room type can accommodate {guests} guest{guests > 1 ? "s" : ""} for the selected dates.
				</div>
			)}

			{nights > 0 && selectedRoom && (
				<div className="border-t border-[#DDE7E0]/70 pt-4 space-y-2 text-sm">
					<div className="flex justify-between text-gray-700">
						<span>
							{selectedRoom.bookingCriteria === "PER_PERSON"
								? `${selectedRoom.name}: ${guests} guest${guests > 1 ? "s" : ""} ${"\u00D7"} ${"\u20B9"}${selectedRoom.price.toLocaleString()}`
								: selectedRoom.bookingCriteria === "HYBRID"
									? `${selectedRoom.name}: ${guests} guest${guests > 1 ? "s" : ""} ${"\u00D7"} ${nights} night${nights > 1 ? "s" : ""}`
									: `${selectedRoom.name}: ${requiredRooms} room${requiredRooms > 1 ? "s" : ""} ${"\u00D7"} ${nights} night${nights > 1 ? "s" : ""}`}
						</span>
						<span>{"\u20B9"}{totalPrice.toLocaleString()}</span>
					</div>
					<div className="flex justify-between font-semibold">
						<span>Total</span>
						<span>{"\u20B9"}{totalPrice.toLocaleString()}</span>
					</div>
				</div>
			)}

			<button
				type="button"
				onClick={handleReserve}
				disabled={!canReserve || isSubmitting}
				className="w-full bg-[#005246] disabled:opacity-50 text-white py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="w-4 h-4 animate-spin" />
						Reserving...
					</>
				) : (
					"Reserve"
				)}
			</button>

			{canReserve && !isSubmitting && (
				<p className="text-center text-sm text-gray-600">
					You won&apos;t be charged yet
				</p>
			)}
			{!canReserve && !isSubmitting && (
				<p className="text-center text-xs text-gray-400">
					Select dates to enable booking
				</p>
			)}
		</div>
	);
}
