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
	Check,
	Home,
	Share2,
	Heart,
	Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import RoomCard from "@/components/RoomCard";
import HomestayImageGrid from "@/components/Homestay/HomestayImageGrid";
import BookingCard from "@/components/Homestay/BookingCard";
import homestays from "@/data/homestays";

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
				return <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />;
			case "parking":
			case "car":
				return <Car className="w-4 h-4 sm:w-5 sm:h-5" />;
			case "meals":
			case "organic food":
			case "local cuisine":
			case "organic meals":
				return <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />;
			case "mountain view":
			case "valley view":
				return <Mountain className="w-4 h-4 sm:w-5 sm:h-5" />;
			default:
				return <Users className="w-4 h-4 sm:w-5 sm:h-5" />;
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

	// Enhanced reviews data
	const reviews = [
		{
			name: "Rahul Sharma",
			comment: "Amazing stay with breathtaking views! The homestay exceeded our expectations. The host was very welcoming and the food was delicious.",
			rating: 5,
			date: "2 weeks ago"
		},
		{
			name: "Tenzin Dorje",
			comment: "Warm hospitality and great local food. The rooms were clean and comfortable. Highly recommended for families.",
			rating: 4,
			date: "1 month ago"
		},
		{
			name: "Priya Mehta",
			comment: "Perfect location with stunning mountain views. The host made us feel at home and shared wonderful stories about the local culture.",
			rating: 5,
			date: "3 weeks ago"
		},
		{
			name: "Amit Kumar",
			comment: "Great value for money. The rooms are spacious and well-maintained. The local cuisine served here is authentic and tasty.",
			rating: 4,
			date: "1 month ago"
		},
		{
			name: "Sarah Johnson",
			comment: "One of the best homestays in Arunachal Pradesh. The peaceful atmosphere and beautiful surroundings made our stay memorable.",
			rating: 5,
			date: "2 months ago"
		},
		{
			name: "David Chen",
			comment: "Comfortable stay with modern amenities. The host was very helpful in arranging local tours and activities.",
			rating: 4,
			date: "1 month ago"
		},
	];

	// Get similar homestays (exclude current one, same location preferred)
	const similarHomestays = homestays
		.filter(h => h.id !== homestay.id && h.location.toLowerCase() === homestay.location.toLowerCase())
		.slice(0, 3);

	// If not enough from same location, add from other locations
	if (similarHomestays.length < 3) {
		const additional = homestays
			.filter(h => h.id !== homestay.id && !similarHomestays.some(sh => sh.id === h.id))
			.slice(0, 3 - similarHomestays.length);
		similarHomestays.push(...additional);
	}

	return (
		<div className="min-h-screen bg-white">
			<main className="relative min-h-screen bg-white">
				{/* Banner Carousel */}
				<div className="relative mt-16 bg-white py-6 sm:py-8 md:py-10 overflow-hidden">
					<div className="absolute inset-0 -z-10">
						<div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#FC611E]/10 blur-3xl" />
						<div className="absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-[#4F87C7]/10 blur-3xl" />
					</div>
					<div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
						<div className="overflow-x-hidden">
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
				</div>

				{/* Main Content */}
				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
					<div className="bg-white pb-8 sm:pb-12 md:pb-16">

						{/* HEADER */}
						<div className="pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 border-b border-[#DDE7E0]/70">
							<div className="flex flex-wrap items-center gap-2 mb-3">
								<span
									className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FC611E]/10 text-[#FC611E]"
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
								>
									Local Homestay
								</span>
								<span
									className="px-3 py-1 rounded-full text-xs font-semibold bg-[#005246]/10 text-[#005246]"
									style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
								>
									Host Verified
								</span>
							</div>
							<h1
								className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									color: "#353030",
									letterSpacing: "-0.07em",
								}}
							>
								{homestay.name}
							</h1>

							<div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
								<div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, fontSize: "clamp(12px, 3vw, 14px)", color: "#686766" }}>
									<div className="flex items-center gap-1.5">
										<Star className="w-3 h-3 sm:w-4 sm:h-4 fill-emerald-500 text-emerald-500" />
										<span className="font-semibold" style={{ color: "#353030" }}>{homestay.rating}</span>
										<span className="underline">({homestay.reviews} reviews)</span>
									</div>

									<span className="hidden sm:inline">·</span>

									<div className="flex items-center gap-1.5">
										<MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
										<span className="underline capitalize">
											{homestay.location}, Arunachal Pradesh
										</span>
									</div>
								</div>

								{/* ACTIONS */}
								<div className="flex items-center gap-3 sm:gap-4" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, fontSize: "clamp(12px, 3vw, 14px)", color: "#27261C" }}>
									<button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F1E6]/70 border border-[#DDE7E0]/70 hover:opacity-80 transition">
										<Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
										<span className="hidden sm:inline">Share</span>
									</button>
									<button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F1E6]/70 border border-[#DDE7E0]/70 hover:opacity-80 transition">
										<Heart className="w-3 h-3 sm:w-4 sm:h-4" />
										<span className="hidden sm:inline">Save</span>
									</button>
								</div>
							</div>
						</div>

						{/* MAIN GRID */}
						<div className="grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 pt-4 sm:pt-6 md:pt-8">

							{/* LEFT CONTENT */}
							<div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-10">

								{/* HOST INFO */}
								<div className="border-b border-[#DDE7E0]/70 pb-4 sm:pb-6 md:pb-8">
									<h2
										className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 700,
											color: "#353030",
											letterSpacing: "-0.07em",
										}}
									>
										Hosted by {homestay.host}
									</h2>
									<p
										className="leading-relaxed max-w-3xl"
										style={{
											fontFamily: "var(--font-mona-sans), sans-serif",
											fontWeight: 500,
											fontSize: "clamp(14px, 3.5vw, 16px)",
											color: "#686766",
											lineHeight: "clamp(20px, 5vw, 24px)",
										}}
									>
										{homestay.description}
									</p>
								</div>

								{/* ROOMS */}
								<div>
									<h2
										className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 700,
											color: "#353030",
											letterSpacing: "-0.07em",
										}}
									>
										Available rooms
									</h2>
									<div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
										{rooms.map((room) => (
											<RoomCard key={room.id} room={room as any} />
										))}
									</div>
								</div>

								<div className="border-t border-[#DDE7E0]/70"></div>

								{/* AMENITIES */}
								<div>
									<h2
										className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 700,
											color: "#353030",
											letterSpacing: "-0.07em",
										}}
									>
										What this place offers
									</h2>
									<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
										{homestay.amenities.map((amenity, i) => (
											<div
												key={i}
												className="group flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#DDE7E0]/70 shadow-[0_12px_35px_-30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_45px_-30px_rgba(0,0,0,0.4)] transition-all"
											>
												<span className="w-10 h-10 rounded-full bg-[#F5F1E6] border border-[#DDE7E0]/70 flex items-center justify-center text-[#005246]">
													{getAmenityIcon(amenity)}
												</span>
												<div>
													<span
														className="block"
														style={{
															fontFamily: "var(--font-mona-sans), sans-serif",
															fontWeight: 600,
															color: "#27261C",
															fontSize: "clamp(13px, 3.5vw, 15px)",
														}}
													>
														{amenity}
													</span>
													<span
														className="text-xs"
														style={{
															fontFamily: "var(--font-mona-sans), sans-serif",
															fontWeight: 500,
															color: "#686766",
														}}
													>
														Included in your stay
													</span>
												</div>
											</div>
										))}
									</div>
								</div>

								<div className="border-t border-[#DDE7E0]/70"></div>

								{/* REVIEWS */}
								<div>
									<h2
										className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 700,
											color: "#353030",
											letterSpacing: "-0.07em",
										}}
									>
										What People have to Say
									</h2>
									<div
										className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
										style={{
											fontFamily: "var(--font-mona-sans), sans-serif",
											fontWeight: 600,
											fontSize: "clamp(16px, 4vw, 18px)",
											color: "#353030",
										}}
									>
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-500 text-emerald-500" />
											<span>{homestay.rating}</span>
										</div>
										<span className="text-[#686766]">·</span>
										<span style={{ fontWeight: 500, color: "#686766", fontSize: "clamp(14px, 3.5vw, 16px)" }}>{homestay.reviews} reviews</span>
									</div>

									<div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
										{reviews.map((r, i) => (
											<div key={i} className="space-y-2 sm:space-y-3 p-4 sm:p-5 bg-white rounded-2xl border border-[#DDE7E0]/70 shadow-[0_14px_40px_-32px_rgba(0,0,0,0.35)]">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div
															className="font-semibold mb-1"
															style={{
																fontFamily: "var(--font-mona-sans), sans-serif",
																fontWeight: 600,
																color: "#353030",
																fontSize: "clamp(13px, 3.5vw, 15px)",
															}}
														>
															{r.name}
														</div>
														<div
															className="text-xs"
															style={{
																fontFamily: "var(--font-mona-sans), sans-serif",
																fontWeight: 400,
																color: "#686766",
															}}
														>
															{r.date}
														</div>
													</div>
													<div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
														{Array.from({ length: r.rating }).map((_, s) => (
															<Star
																key={s}
																className="w-3 h-3 sm:w-4 sm:h-4 fill-emerald-500 text-emerald-500"
															/>
														))}
													</div>
												</div>
												<p
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 500,
														color: "#686766",
														fontSize: "clamp(13px, 3.5vw, 14px)",
														lineHeight: "clamp(18px, 4.5vw, 20px)",
													}}
												>
													{r.comment}
												</p>
											</div>
										))}
									</div>
								</div>

								<div className="border-t border-[#DDE7E0]/70"></div>

								{/* THINGS TO KNOW */}
								<div>
									<h2
										className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 700,
											color: "#353030",
											letterSpacing: "-0.07em",
										}}
									>
										Things to know
									</h2>
									<div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
										{/* House Rules */}
										<div>
											<div className="flex items-center gap-2 mb-3 sm:mb-4">
												<Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#686766]" />
												<h3
													className="text-base sm:text-lg"
													style={{
														fontFamily: "var(--font-subjectivity), sans-serif",
														fontWeight: 700,
														color: "#353030",
													}}
												>
													House rules
												</h3>
											</div>
											<ul className="space-y-2 sm:space-y-3">
												{[
													"Check-in: 2:00 PM - 10:00 PM",
													"Check-out: 11:00 AM",
													"No smoking inside",
													"No parties or events",
													"Pets allowed with prior notice",
													"Quiet hours: 10 PM - 7 AM"
												].map((rule, i) => (
													<li key={i} className="flex items-start gap-2">
														<Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
														<span
															style={{
																fontFamily: "var(--font-mona-sans), sans-serif",
																fontWeight: 500,
																color: "#686766",
																fontSize: "clamp(13px, 3.5vw, 14px)",
															}}
														>
															{rule}
														</span>
													</li>
												))}
											</ul>
										</div>

										{/* Safety & Security */}
										<div>
											<div className="flex items-center gap-2 mb-3 sm:mb-4">
												<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#686766]" />
												<h3
													className="text-base sm:text-lg"
													style={{
														fontFamily: "var(--font-subjectivity), sans-serif",
														fontWeight: 700,
														color: "#353030",
													}}
												>
													Safety & Security
												</h3>
											</div>
											<ul className="space-y-2 sm:space-y-3">
												{[
													"Security cameras on premises",
													"Smoke alarm installed",
													"First aid kit available",
													"Safe for families",
													"24/7 host support",
													"Emergency contact provided"
												].map((item, i) => (
													<li key={i} className="flex items-start gap-2">
														<Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
														<span
															style={{
																fontFamily: "var(--font-mona-sans), sans-serif",
																fontWeight: 500,
																color: "#686766",
																fontSize: "clamp(13px, 3.5vw, 14px)",
															}}
														>
															{item}
														</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>

								<div className="border-t border-[#DDE7E0]/70"></div>

								{/* CONTACT INFORMATION */}
								<div>
									<h2
										className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6"
										style={{
											fontFamily: "var(--font-subjectivity), sans-serif",
											fontWeight: 700,
											color: "#353030",
											letterSpacing: "-0.07em",
										}}
									>
										Contact Information
									</h2>
									<div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
										<a
											href={`tel:${homestay.contact.phone}`}
											className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#F5F1E6]/60 rounded-2xl border border-[#DDE7E0]/70 hover:bg-[#F5F1E6] transition-colors"
										>
											<div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#DDE7E0]/70">
												<Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#005246]" />
											</div>
											<div className="min-w-0">
												<div
													className="text-xs mb-1"
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 500,
														color: "#686766",
													}}
												>
													Phone
												</div>
												<div
													className="truncate"
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 600,
														color: "#353030",
														fontSize: "clamp(13px, 3.5vw, 15px)",
													}}
												>
													{homestay.contact.phone}
												</div>
											</div>
										</a>
										<a
											href={`mailto:${homestay.contact.email}`}
											className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-[#F5F1E6]/60 rounded-2xl border border-[#DDE7E0]/70 hover:bg-[#F5F1E6] transition-colors"
										>
											<div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#DDE7E0]/70">
												<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#005246]" />
											</div>
											<div className="min-w-0">
												<div
													className="text-xs mb-1"
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 500,
														color: "#686766",
													}}
												>
													Email
												</div>
												<div
													className="truncate"
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 600,
														color: "#353030",
														fontSize: "clamp(13px, 3.5vw, 15px)",
													}}
												>
													{homestay.contact.email}
												</div>
											</div>
										</a>
									</div>
								</div>
							</div>

							{/* RIGHT – BOOKING CARD */}
							<div className="lg:col-span-1 mt-6 lg:mt-0">
								<div className="sticky top-20 sm:top-24">
									<div className="rounded-3xl bg-[#F5F1E6]/60 border border-[#DDE7E0]/70 p-3">
										<BookingCard rooms={rooms} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* SIMILAR HOMESTAYS */}
				{similarHomestays.length > 0 && (
					<div className="bg-white py-8 sm:py-12 md:py-16">
						<div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
							<h2
								className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 md:mb-8"
								style={{
									fontFamily: "var(--font-subjectivity), sans-serif",
									fontWeight: 700,
									color: "#353030",
									letterSpacing: "-0.07em",
								}}
							>
								Similar Homestays
							</h2>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
								{similarHomestays.map((similar) => (
									<Link
										key={similar.id}
										href={`/homestays/${similar.id}`}
										className="group bg-white rounded-2xl overflow-hidden border border-[#DDE7E0]/70 shadow-[0_18px_45px_-35px_rgba(0,0,0,0.35)] hover:shadow-[0_22px_55px_-35px_rgba(0,0,0,0.4)] transition-all duration-300"
									>
										<div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
											<Image
												src={similar.image}
												alt={similar.name}
												fill
												className="object-cover group-hover:scale-110 transition-transform duration-500"
											/>
											{similar.featured && (
												<div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-emerald-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold">
													Featured
												</div>
											)}
										</div>
										<div className="p-4 sm:p-5">
											<div className="flex items-center justify-between mb-2">
												<h3
													className="text-base sm:text-lg font-bold flex-1 pr-2"
													style={{
														fontFamily: "var(--font-subjectivity), sans-serif",
														fontWeight: 700,
														color: "#353030",
													}}
												>
													{similar.name}
												</h3>
												<div className="flex items-center gap-1 flex-shrink-0">
													<Star className="w-3 h-3 sm:w-4 sm:h-4 fill-emerald-500 text-emerald-500" />
													<span
														style={{
															fontFamily: "var(--font-mona-sans), sans-serif",
															fontWeight: 600,
															color: "#353030",
															fontSize: "clamp(12px, 3vw, 14px)",
														}}
													>
														{similar.rating}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-2 mb-2 sm:mb-3">
												<MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#686766] flex-shrink-0" />
												<span
													className="truncate"
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 500,
														color: "#686766",
														fontSize: "clamp(12px, 3vw, 14px)",
													}}
												>
													{similar.location}
												</span>
											</div>
											<p
												className="mb-3 sm:mb-4 line-clamp-2"
												style={{
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 500,
													color: "#686766",
													fontSize: "clamp(12px, 3vw, 14px)",
													lineHeight: "clamp(18px, 4.5vw, 20px)",
												}}
											>
												{similar.description}
											</p>
											<div className="flex items-center justify-between gap-2">
												<span
													className="text-base sm:text-lg font-bold"
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 700,
														color: "#353030",
													}}
												>
													₹{similar.price}
													<span
														className="text-xs sm:text-sm font-normal ml-1"
														style={{
															fontFamily: "var(--font-mona-sans), sans-serif",
															fontWeight: 500,
															color: "#686766",
														}}
													>
														/night
													</span>
												</span>
												<span
													className="text-xs sm:text-sm flex-shrink-0"
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 500,
														color: "#686766",
													}}
												>
													{similar.reviews} reviews
												</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
