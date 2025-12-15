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

	return (
		<div className="min-h-screen bg-white overflow-x-hidden">
			{/* Simple Sticky Navbar */}
			<nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 md:h-20">
						<Link href="/" className="flex items-center gap-2 md:gap-3">
							<Image
								src={DrokpaGreenLogo}
								alt="Drokpa Logo"
								className="w-8 h-8 md:w-10 md:h-10"
							/>
							<span className="text-xl md:text-2xl font-bold text-(--brand-green)">DROKPA</span>
						</Link>

						<Link
							href="/"
							className="inline-flex items-center gap-2 text-(--brand-green) hover:text-emerald-700 font-medium transition-colors"
						>
							<ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
							<span className="hidden sm:inline">Back to Homestays</span>
							<span className="sm:hidden">Back</span>
						</Link>
					</div>
				</div>
			</nav>

			{/* Title Section */}
			<div className="bg-linear-to-b from-emerald-50/50 to-white py-8 md:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-2 text-gray-600 mb-3">
						<MapPin className="w-4 h-4 md:w-5 md:h-5 text-(--brand-green)" />
						<span className="text-sm md:text-base capitalize">{homestay.location}, Arunachal Pradesh</span>
					</div>

					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
								{homestay.name}
							</h1>
							<div className="flex flex-wrap items-center gap-4">
								<div className="flex items-center gap-2">
									<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
									<span className="text-lg font-semibold text-gray-900">
										{homestay.rating}
									</span>
									<span className="text-gray-600">
										({homestay.reviews} reviews)
									</span>
								</div>
								<div className="flex items-center gap-2">
									<UserCheck className="w-5 h-5 text-(--brand-green)" />
									<span className="text-gray-700 font-medium">
										Hosted by {homestay.host}
									</span>
								</div>
							</div>
						</div>

						{homestay.featured && (
							<div className="inline-flex items-center gap-2 bg-(--brand-green) text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
								<Star className="w-4 h-4 fill-white" />
								Featured
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Image Carousel Section */}
			<div className="bg-white py-6 md:py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="relative group">
						<div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
							<img
								src={homestay.image}
								alt={homestay.name}
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Carousel Navigation Buttons - Hidden for now (can be activated when multiple images) */}
						<button
							className="hidden absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
							aria-label="Previous image"
						>
							<ChevronLeft className="w-6 h-6 text-(--brand-green)" />
						</button>
						<button
							className="hidden absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
							aria-label="Next image"
						>
							<ChevronRight className="w-6 h-6 text-(--brand-green)" />
						</button>

						{/* Carousel Indicators - Hidden for now */}
						<div className="hidden absolute bottom-4 left-1/2 -translate-x-1/2 gap-2">
							<div className="w-2 h-2 rounded-full bg-white shadow-md" />
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="bg-linear-to-b from-white via-emerald-50/30 to-white py-12 md:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Content Grid */}
					<div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6 md:space-y-8">
							{/* Description Card */}
							<div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
								<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
									<Home className="w-7 h-7 text-(--brand-green)" />
									About This Homestay
								</h2>
								<p className="text-gray-700 leading-relaxed text-base md:text-lg">
									{homestay.description}
								</p>
							</div>

							{/* Amenities */}
							<div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
								<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
									<Sparkles className="w-7 h-7 text-(--brand-green)" />
									Amenities
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
									{homestay.amenities.map((amenity, index) => (
										<div
											key={index}
											className="flex items-center gap-3 bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 hover:shadow-md transition-all group"
										>
											<div className="text-(--brand-green) group-hover:scale-110 transition-transform">
												{getAmenityIcon(amenity)}
											</div>
											<span className="text-gray-800 font-medium">{amenity}</span>
										</div>
									))}
								</div>
							</div>

							{/* Host Info */}
							<div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
								<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
									<Users className="w-7 h-7 text-(--brand-green)" />
									Your Host
								</h2>
								<div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
									<div className="w-20 h-20 bg-linear-to-br from-(--brand-green) to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
										{homestay.host.charAt(0)}
									</div>
									<div>
										<p className="text-xl md:text-2xl font-bold text-gray-900">
											{homestay.host}
										</p>
										<div className="flex items-center gap-2 mt-1">
											<Check className="w-4 h-4 text-(--brand-green)" />
											<p className="text-gray-600 font-medium">Verified Superhost</p>
										</div>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-3">
									<a
										href={`tel:${homestay.contact.phone}`}
										className="flex items-center justify-center gap-2 bg-(--brand-green) text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 transform"
									>
										<Phone className="w-5 h-5" />
										{homestay.contact.phone}
									</a>
									<a
										href={`mailto:${homestay.contact.email}`}
										className="flex items-center justify-center gap-2 bg-emerald-50 text-(--brand-green) px-6 py-3 rounded-xl hover:bg-emerald-100 transition-all font-medium border-2 border-(--brand-green) hover:shadow-md"
									>
										<Mail className="w-5 h-5" />
										Email Host
									</a>
								</div>
							</div>
						</div>

						{/* Booking Sidebar */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl sticky top-24 border border-gray-100">
								<div className="mb-6 pb-6 border-b border-gray-200">
									<div className="flex items-baseline gap-2">
										<div className="text-4xl font-bold text-(--brand-green)">
											{homestay.price}
										</div>
										<div className="text-gray-600 text-lg">/ night</div>
									</div>
									<div className="flex items-center gap-2 mt-3">
										<Calendar className="w-4 h-4 text-gray-500" />
										<span className="text-sm text-gray-600">Available year-round</span>
									</div>
								</div>

								<button className="w-full bg-linear-to-r from-(--brand-green) to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4">
									Book Now
								</button>

								<p className="text-center text-sm text-gray-600 mb-6 flex items-center justify-center gap-2">
									<Check className="w-4 h-4 text-(--brand-green)" />
									You won't be charged yet
								</p>

								<div className="bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 space-y-3">
									<h3 className="font-bold text-gray-900 mb-3">Price Details</h3>
									<div className="flex justify-between text-gray-700">
										<span>{homestay.price} × 3 nights</span>
										<span className="font-semibold">
											₹{parseInt(homestay.price.replace(/[^\d]/g, "")) * 3}
										</span>
									</div>
									<div className="flex justify-between text-gray-700">
										<span>Service fee</span>
										<span className="font-semibold">₹500</span>
									</div>
									<div className="border-t border-emerald-200 pt-3 flex justify-between font-bold text-xl">
										<span className="text-gray-900">Total</span>
										<span className="text-(--brand-green)">
											₹{parseInt(homestay.price.replace(/[^\d]/g, "")) * 3 + 500}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}
