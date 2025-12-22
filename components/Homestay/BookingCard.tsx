"use client";
import React from "react";

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
  const [roomId, setRoomId] = React.useState<string>(rooms[0]?.id);
  const [guests, setGuests] = React.useState(1);
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");

  const selectedRoom = rooms.find((r) => r.id === roomId);

  /* ---------- PRICE RANGE ---------- */
  const prices = rooms.map((r) => r.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  /* ---------- DATE LOGIC ---------- */
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalPrice =
    selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  return (
    <div className="sticky top-24 border rounded-xl p-6 shadow-lg bg-white space-y-4">

      {/* PRICE HEADER */}
      <div className="flex items-baseline gap-2">
        {selectedRoom ? (
          <>
            <span className="text-2xl font-semibold">
              ₹{selectedRoom.price.toLocaleString()}
            </span>
            <span className="text-gray-600">night</span>
          </>
        ) : (
          <span className="text-2xl font-semibold">
            ₹{minPrice} – ₹{maxPrice}
          </span>
        )}
      </div>

      {/* DATE PICKER */}
      <div className="grid grid-cols-2 border rounded-lg overflow-hidden">
        <div className="p-3 border-r">
          <label className="text-xs font-semibold">CHECK-IN</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full text-sm outline-none"
          />
        </div>
        <div className="p-3">
          <label className="text-xs font-semibold">CHECK-OUT</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full text-sm outline-none"
          />
        </div>
      </div>

      {/* ROOM SELECT */}
      <div>
        <label className="text-sm font-semibold block mb-1">Room</label>
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} — ₹{room.price}/night
            </option>
          ))}
        </select>
      </div>

      {/* GUEST SELECT */}
      <div>
        <label className="text-sm font-semibold block mb-1">Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          {Array.from(
            { length: selectedRoom?.capacity || 2 },
            (_, i) => i + 1
          ).map((n) => (
            <option key={n} value={n}>
              {n} guest{n > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE BREAKDOWN */}
      {nights > 0 && selectedRoom && (
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              ₹{selectedRoom.price} × {nights} nights
            </span>
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
        disabled={!checkIn || !checkOut || nights <= 0}
        className="w-full bg-(--brand-green) disabled:opacity-50 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
      >
        Reserve
      </button>

      <p className="text-center text-sm text-gray-600">
        You won’t be charged yet
      </p>
    </div>
  );
}
