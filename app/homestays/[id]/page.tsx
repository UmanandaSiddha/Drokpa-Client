import { homestays } from "../../../data/homestays";
import { notFound } from "next/navigation";
import {
	MapPin,
	Star,
	Wifi,
	Car,
	Coffee,
	Mountain,
	Users,
	Phone,
	Mail,
	ArrowLeft,
	Check,
	Calendar,
	UserCheck,
	Home,
	Sparkles,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import { DrokpaGreenLogo } from "@/assets";
import Nav from "@/components/Nav";
import HomestayCarousel from "@/components/HomestayCarousel";
import RoomCard from "@/components/RoomCard";
import HomestayImageGrid from "@/components/Homestay/HomestayImageGrid";
import BookingCard from "@/components/Homestay/BookingCard";

export default async function HomestayDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const homestay = homestays.find((h) => h.id === Number(id));

	if (!homestay) return notFound();

	const getAmenityIcon = (amenity: string) => {
		switch (amenity.toLowerCase()) {
			case "wifi":
				return <Wifi className="w-5 h-5" />;
			case "parking":
			case "car":
				return <Car className="w-5 h-5" />;
			case "meals":
			case "organic food":
			case "local cuisine":
			case "organic meals":
				return <Coffee className="w-5 h-5" />;
			case "mountain view":
			case "valley view":
				return <Mountain className="w-5 h-5" />;
			default:
				return <Users className="w-5 h-5" />;
		}
	};

	// Mock data: rooms and reviews
	const rooms = [
		{
			id: "r1",
			name: "Deluxe Mountain View",
			price: 2500,
			likedPercent: 92,
			recommended: true,
			capacity: 3,
			beds: 2,
			baths: 1,
			features: ["Morning view", "Heater", "Geyser"],
			images: [
				"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1578898887932-2e4c4a14c50f?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1560067174-8940c79c732e?auto=format&fit=crop&w=1200&q=80",
			],
		},
		{
			id: "r2",
			name: "Standard Cozy Room",
			price: 1800,
			likedPercent: 85,
			recommended: false,
			capacity: 2,
			beds: 1,
			baths: 1,
			features: ["Valley view", "Wifi"],
			images: [
				"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
				"https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
			],
		},
	];

	const reviews = [
		{ name: "Rahul", comment: "Amazing stay with breathtaking views!", rating: 5 },
		{ name: "Tenzin", comment: "Warm hospitality and great local food.", rating: 4 },
	];

	return (
		<div className="min-h-screen bg-white">

			<Nav transition={false} />

			{/* Banner Carousel */}
			<div className="mt-16 bg-white py-6 md:py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
					{/** Banner carousel using mock multi-image array */}
					<HomestayImageGrid images={[
						"https://images.unsplash.com/photo-1566475955255-404134a79aeb?q=80&w=1974&auto=format&fit=crop",
						"https://images.unsplash.com/photo-1578824381648-52f000bb5f9f?q=80&w=2071&auto=format&fit=crop",
						"https://images.unsplash.com/photo-1606044466411-207a9a49711f?q=80&w=2070&auto=format&fit=crop",
						"https://images.unsplash.com/photo-1551249506-d8e2c5536f8a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						"https://images.unsplash.com/photo-1545910685-1248cabdc8d5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						"https://images.unsplash.com/photo-1522031153701-b3eba74004e8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						"https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80",
						"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
						"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
					]} />
				</div>
			</div>

			{/* <div className="mt-16 bg-white py-6 md:py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<HomestayCarousel
						images={[
							"https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80",
							"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
							"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
						]}
					/>
				</div>
			</div> */}



			{/* Content Section */}
			{/* <div className="bg-linear-to-b from-white via-emerald-50/30 to-white pb-12 md:pb-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

					<div className="mb-8">
						<div className="flex items-center gap-2 text-gray-600 mb-2">
							<MapPin className="w-5 h-5 text-(--brand-green)" />
							<span className="text-base capitalize">{homestay.location}, Arunachal Pradesh</span>
						</div>
						<h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">{homestay.name}</h1>
						<div className="flex flex-wrap items-center gap-4">
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
								<span className="font-semibold text-gray-900">{homestay.rating}</span>
								<span className="text-gray-600">({homestay.reviews} reviews)</span>
							</div>
							<div className="flex items-center gap-2">
								<UserCheck className="w-5 h-5 text-(--brand-green)" />
								<span className="text-gray-700">Hosted by {homestay.host}</span>
							</div>
						</div>
						<p className="mt-4 text-gray-700 leading-relaxed max-w-3xl">{homestay.description}</p>
					</div>


					<div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

						<div className="lg:col-span-2 space-y-6 md:space-y-8">
							<div className="grid sm:grid-cols-2 gap-6">
								{rooms.map((room) => (
									<RoomCard key={room.id} room={room as any} />
								))}
							</div>


							<div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
								<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What guests are saying</h2>
								<div className="space-y-4">
									{reviews.map((r, i) => (
										<div key={i} className="rounded-xl border border-gray-200 p-4">
											<div className="flex items-center gap-2 mb-2">
												<span className="font-semibold text-gray-900">{r.name}</span>
												<div className="flex gap-1">
													{Array.from({ length: r.rating }).map((_, s) => (
														<Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
													))}
												</div>
											</div>
											<p className="text-gray-700">{r.comment}</p>
										</div>
									))}
								</div>
							</div>
						</div>


						<div className="lg:col-span-1 space-y-6">
							<div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 sticky top-24">
								<h3 className="text-xl font-bold text-gray-900 mb-4">Select dates</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="flex flex-col">
										<label className="text-sm text-gray-600">Check-in</label>
										<input type="date" className="mt-1 rounded-lg border border-gray-300 px-3 py-2" />
									</div>
									<div className="flex flex-col">
										<label className="text-sm text-gray-600">Check-out</label>
										<input type="date" className="mt-1 rounded-lg border border-gray-300 px-3 py-2" />
									</div>
								</div>
							</div>

							{(() => {

								const prices = rooms.map((r) => r.price);
								const min = Math.min(...prices);
								const max = Math.max(...prices);
								const roundDown500 = (v: number) => Math.floor(v / 500) * 500;
								const roundUp500 = (v: number) => Math.ceil(v / 500) * 500;
								const start = roundDown500(min);
								const end = roundUp500(max);
								const buckets = [
									[start, start + 500],
									[start + 500, start + 1000],
									[start + 1000, end],
								];
								const fmt = (v: number) => `₹${v.toLocaleString()}`;
								return (
									<div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
										<h3 className="text-xl font-bold text-gray-900 mb-4">Price ranges</h3>
										<ul className="space-y-2">
											{buckets.map(([a, b], i) => (
												<li key={i} className="flex items-center justify-between">
													<span className="text-gray-700">{fmt(a)} - {fmt(b)}</span>
													<span className="text-(--brand-green) font-semibold">Available</span>
												</li>
											))}
										</ul>
									</div>
								);
							})()}

							<div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
								<h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
								<div className="flex flex-col gap-3">
									{homestay.amenities.map((amenity, index) => (
										<div key={index} className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3">
											<div className="text-(--brand-green)">{getAmenityIcon(amenity)}</div>
											<span className="text-gray-800 font-medium">{amenity}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> */}

			<div className="bg-white pb-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

					{/* HEADER */}
					<div className="pt-6 pb-6 border-b">
						<h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
							{homestay.name}
						</h1>

						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
								<div className="flex items-center gap-1">
									<Star className="w-4 h-4 fill-black text-black" />
									<span className="font-semibold">{homestay.rating}</span>
									<span className="underline">({homestay.reviews} reviews)</span>
								</div>

								<span>·</span>

								<div className="flex items-center gap-1">
									<MapPin className="w-4 h-4" />
									<span className="underline capitalize">
										{homestay.location}, Arunachal Pradesh
									</span>
								</div>
							</div>

							{/* ACTIONS */}
							<div className="flex items-center gap-4 text-sm font-medium">
								<button className="underline">Share</button>
								<button className="underline">Save</button>
							</div>
						</div>
					</div>

					{/* MAIN GRID */}
					<div className="grid lg:grid-cols-3 gap-12 pt-8">

						{/* LEFT CONTENT */}
						<div className="lg:col-span-2 space-y-10">

							{/* HOST INFO */}
							<div className="border-b pb-6">
								<h2 className="text-xl font-semibold mb-2">
									Hosted by {homestay.host}
								</h2>
								<p className="text-gray-700 leading-relaxed max-w-3xl">
									{homestay.description}
								</p>
							</div>

							{/* ROOMS */}
							<div>
								<h2 className="text-2xl font-semibold mb-6">Available rooms</h2>
								<div className="grid sm:grid-cols-2 gap-6">
									{rooms.map((room) => (
										<RoomCard key={room.id} room={room as any} />
									))}
								</div>
							</div>

							<hr />

							{/* AMENITIES */}
							<div>
								<h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
								<div className="grid sm:grid-cols-2 gap-4">
									{homestay.amenities.map((amenity, i) => (
										<div key={i} className="flex items-center gap-3">
											<span className="text-gray-700">{getAmenityIcon(amenity)}</span>
											<span className="text-gray-800">{amenity}</span>
										</div>
									))}
								</div>
							</div>

							<hr />

							{/* REVIEWS */}
							<div>
							<h2 className="text-2xl font-semibold mb-4">What People have to Say</h2>
								<h2 className="text-2xl font-semibold mb-6">
									★ {homestay.rating} · {homestay.reviews} reviews
								</h2>

								<div className="grid sm:grid-cols-2 gap-6">
									{reviews.map((r, i) => (
										<div key={i} className="space-y-2">
											<div className="flex items-center gap-2">
												<span className="font-semibold">{r.name}</span>
												<div className="flex gap-1">
													{Array.from({ length: r.rating }).map((_, s) => (
														<Star
															key={s}
															className="w-4 h-4 fill-black text-black"
														/>
													))}
												</div>
											</div>
											<p className="text-gray-700">{r.comment}</p>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* RIGHT – BOOKING CARD */}
						<div className="lg:col-span-1 overflow-auto">
							<div className="sticky top-24">
								<BookingCard rooms={rooms} />

								{/* <div className="flex items-baseline gap-2 mb-4">
									<span className="text-2xl font-semibold">₹{Math.min(...rooms.map(r => r.price))}</span>
									<span className="text-gray-600">night</span>
								</div>

								<div className="grid grid-cols-2 border rounded-lg overflow-hidden mb-4">
									<div className="p-3 border-r">
										<label className="text-xs font-semibold">CHECK-IN</label>
										<input type="date" className="w-full text-sm outline-none" />
									</div>
									<div className="p-3">
										<label className="text-xs font-semibold">CHECK-OUT</label>
										<input type="date" className="w-full text-sm outline-none" />
									</div>
								</div>

								<button className="w-full bg-(--brand-green) text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
									Reserve
								</button>

								<p className="text-center text-sm text-gray-600 mt-3">
									You won’t be charged yet
								</p> */}
							</div>
						</div>
					</div>
				</div>
			</div>


			<Footer />
		</div>
	);
}
