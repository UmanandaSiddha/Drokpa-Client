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
	Share2,
	Heart,
	Clock,
	Shield,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";
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
		<div className="min-h-screen bg-white flex justify-center">
			<div className="w-full px-4 md:px-6 lg:px-0 lg:w-[90%] max-w-[1600px]">
				<Navigation />

				{/* Banner Carousel */}
				<div className="mt-4 md:mt-8 bg-white py-6 md:py-8">
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

			<div className="bg-white pb-12">
				<div className="mx-auto">

					{/* HEADER */}
					<div className="pt-6 md:pt-8 pb-6 border-b border-gray-200">
						<h1 
							className="text-2xl md:text-3xl lg:text-4xl mb-4"
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								color: "#353030",
								letterSpacing: "-0.07em",
							}}
						>
							{homestay.name}
						</h1>

						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex flex-wrap items-center gap-3 md:gap-4" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, fontSize: "14px", color: "#686766" }}>
								<div className="flex items-center gap-1.5">
									<Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
									<span className="font-semibold" style={{ color: "#353030" }}>{homestay.rating}</span>
									<span className="underline">({homestay.reviews} reviews)</span>
								</div>

								<span>·</span>

								<div className="flex items-center gap-1.5">
									<MapPin className="w-4 h-4" />
									<span className="underline capitalize">
										{homestay.location}, Arunachal Pradesh
									</span>
								</div>
							</div>

							{/* ACTIONS */}
							<div className="flex items-center gap-4" style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, fontSize: "14px", color: "#27261C" }}>
								<button className="flex items-center gap-1.5 hover:opacity-70 transition">
									<Share2 className="w-4 h-4" />
									Share
								</button>
								<button className="flex items-center gap-1.5 hover:opacity-70 transition">
									<Heart className="w-4 h-4" />
									Save
								</button>
							</div>
						</div>
					</div>

					{/* MAIN GRID */}
					<div className="grid lg:grid-cols-3 gap-8 md:gap-12 pt-6 md:pt-8">

						{/* LEFT CONTENT */}
						<div className="lg:col-span-2 space-y-8 md:space-y-10">

							{/* HOST INFO */}
							<div className="border-b border-gray-200 pb-6 md:pb-8">
								<h2 
									className="text-xl md:text-2xl mb-3"
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
										fontSize: "16px",
										color: "#686766",
										lineHeight: "24px",
									}}
								>
									{homestay.description}
								</p>
							</div>

							{/* ROOMS */}
							<div>
								<h2 
									className="text-xl md:text-2xl mb-4 md:mb-6"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										color: "#353030",
										letterSpacing: "-0.07em",
									}}
								>
									Available rooms
								</h2>
								<div className="grid sm:grid-cols-2 gap-4 md:gap-6">
									{rooms.map((room) => (
										<RoomCard key={room.id} room={room as any} />
									))}
								</div>
							</div>

							<div className="border-t border-gray-200"></div>

							{/* AMENITIES */}
							<div>
								<h2 
									className="text-xl md:text-2xl mb-4 md:mb-6"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										color: "#353030",
										letterSpacing: "-0.07em",
									}}
								>
									What this place offers
								</h2>
								<div className="grid sm:grid-cols-2 gap-3 md:gap-4">
									{homestay.amenities.map((amenity, i) => (
										<div key={i} className="flex items-center gap-3">
											<span className="text-gray-600">{getAmenityIcon(amenity)}</span>
											<span 
												style={{
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 500,
													color: "#27261C",
													fontSize: "15px",
												}}
											>
												{amenity}
											</span>
										</div>
									))}
								</div>
							</div>

							<div className="border-t border-gray-200"></div>

							{/* REVIEWS */}
							<div>
								<h2 
									className="text-xl md:text-2xl mb-4"
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
									className="mb-6 flex items-center gap-3"
									style={{
										fontFamily: "var(--font-mona-sans), sans-serif",
										fontWeight: 600,
										fontSize: "18px",
										color: "#353030",
									}}
								>
									<div className="flex items-center gap-1">
										<Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
										<span>{homestay.rating}</span>
									</div>
									<span className="text-[#686766]">·</span>
									<span style={{ fontWeight: 500, color: "#686766", fontSize: "16px" }}>{homestay.reviews} reviews</span>
								</div>

								<div className="grid sm:grid-cols-2 gap-4 md:gap-6">
									{reviews.map((r, i) => (
										<div key={i} className="space-y-3 p-5 bg-gray-50 rounded-xl">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div 
														className="font-semibold mb-1"
														style={{
															fontFamily: "var(--font-mona-sans), sans-serif",
															fontWeight: 600,
															color: "#353030",
															fontSize: "15px",
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
												<div className="flex gap-1">
													{Array.from({ length: r.rating }).map((_, s) => (
														<Star
															key={s}
															className="w-4 h-4 fill-emerald-500 text-emerald-500"
														/>
													))}
												</div>
											</div>
											<p 
												style={{
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 500,
													color: "#686766",
													fontSize: "14px",
													lineHeight: "20px",
												}}
											>
												{r.comment}
											</p>
										</div>
									))}
								</div>
							</div>

							<div className="border-t border-gray-200"></div>

							{/* THINGS TO KNOW */}
							<div>
								<h2 
									className="text-xl md:text-2xl mb-4 md:mb-6"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										color: "#353030",
										letterSpacing: "-0.07em",
									}}
								>
									Things to know
								</h2>
								<div className="grid sm:grid-cols-2 gap-6 md:gap-8">
									{/* House Rules */}
									<div>
										<div className="flex items-center gap-2 mb-4">
											<Home className="w-5 h-5 text-[#686766]" />
											<h3 
												className="text-lg"
												style={{
													fontFamily: "var(--font-subjectivity), sans-serif",
													fontWeight: 700,
													color: "#353030",
												}}
											>
												House rules
											</h3>
										</div>
										<ul className="space-y-3">
											{[
												"Check-in: 2:00 PM - 10:00 PM",
												"Check-out: 11:00 AM",
												"No smoking inside",
												"No parties or events",
												"Pets allowed with prior notice",
												"Quiet hours: 10 PM - 7 AM"
											].map((rule, i) => (
												<li key={i} className="flex items-start gap-2">
													<Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
													<span 
														style={{
															fontFamily: "var(--font-mona-sans), sans-serif",
															fontWeight: 500,
															color: "#686766",
															fontSize: "14px",
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
										<div className="flex items-center gap-2 mb-4">
											<Shield className="w-5 h-5 text-[#686766]" />
											<h3 
												className="text-lg"
												style={{
													fontFamily: "var(--font-subjectivity), sans-serif",
													fontWeight: 700,
													color: "#353030",
												}}
											>
												Safety & Security
											</h3>
										</div>
										<ul className="space-y-3">
											{[
												"Security cameras on premises",
												"Smoke alarm installed",
												"First aid kit available",
												"Safe for families",
												"24/7 host support",
												"Emergency contact provided"
											].map((item, i) => (
												<li key={i} className="flex items-start gap-2">
													<Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
													<span 
														style={{
															fontFamily: "var(--font-mona-sans), sans-serif",
															fontWeight: 500,
															color: "#686766",
															fontSize: "14px",
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

							<div className="border-t border-gray-200"></div>

							{/* CONTACT INFORMATION */}
							<div>
								<h2 
									className="text-xl md:text-2xl mb-4 md:mb-6"
									style={{
										fontFamily: "var(--font-subjectivity), sans-serif",
										fontWeight: 700,
										color: "#353030",
										letterSpacing: "-0.07em",
									}}
								>
									Contact Information
								</h2>
								<div className="grid sm:grid-cols-2 gap-4 md:gap-6">
									<a
										href={`tel:${homestay.contact.phone}`}
										className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
									>
										<div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
											<Phone className="w-5 h-5 text-emerald-600" />
										</div>
										<div>
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
												style={{
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 600,
													color: "#353030",
													fontSize: "15px",
												}}
											>
												{homestay.contact.phone}
											</div>
										</div>
									</a>
									<a
										href={`mailto:${homestay.contact.email}`}
										className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
									>
										<div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
											<Mail className="w-5 h-5 text-emerald-600" />
										</div>
										<div>
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
												style={{
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 600,
													color: "#353030",
													fontSize: "15px",
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
						<div className="lg:col-span-1 overflow-auto">
							<div className="sticky top-24">
								<BookingCard rooms={rooms} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* SIMILAR HOMESTAYS */}
			{similarHomestays.length > 0 && (
				<div className="bg-white py-12 md:py-16">
					<div className="mx-auto">
						<h2 
							className="text-2xl md:text-3xl mb-6 md:mb-8"
							style={{
								fontFamily: "var(--font-subjectivity), sans-serif",
								fontWeight: 700,
								color: "#353030",
								letterSpacing: "-0.07em",
							}}
						>
							Similar Homestays
						</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{similarHomestays.map((similar) => (
								<Link 
									key={similar.id} 
									href={`/homestays/${similar.id}`}
									className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
								>
									<div className="relative h-48 md:h-56 overflow-hidden">
										<Image
											src={similar.image}
											alt={similar.name}
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-500"
										/>
										{similar.featured && (
											<div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
												Featured
											</div>
										)}
									</div>
									<div className="p-5">
										<div className="flex items-center justify-between mb-2">
											<h3 
												className="text-lg font-bold flex-1"
												style={{
													fontFamily: "var(--font-subjectivity), sans-serif",
													fontWeight: 700,
													color: "#353030",
												}}
											>
												{similar.name}
											</h3>
											<div className="flex items-center gap-1">
												<Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
												<span 
													style={{
														fontFamily: "var(--font-mona-sans), sans-serif",
														fontWeight: 600,
														color: "#353030",
														fontSize: "14px",
													}}
												>
													{similar.rating}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2 mb-3">
											<MapPin className="w-4 h-4 text-[#686766]" />
											<span 
												style={{
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 500,
													color: "#686766",
													fontSize: "14px",
												}}
											>
												{similar.location}
											</span>
										</div>
										<p 
											className="mb-4 line-clamp-2"
											style={{
												fontFamily: "var(--font-mona-sans), sans-serif",
												fontWeight: 500,
												color: "#686766",
												fontSize: "14px",
												lineHeight: "20px",
											}}
										>
											{similar.description}
										</p>
										<div className="flex items-center justify-between">
											<span 
												className="text-lg font-bold"
												style={{
													fontFamily: "var(--font-mona-sans), sans-serif",
													fontWeight: 700,
													color: "#353030",
												}}
											>
												{similar.price}
												<span 
													className="text-sm font-normal ml-1"
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
												className="text-sm"
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

			<Footer />
			</div>
		</div>
	);
}
