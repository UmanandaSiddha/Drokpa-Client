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
} from "lucide-react";
import Link from "next/link";

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
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Back Button */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-[#005246] hover:text-[#00735f] mb-6 font-medium"
				>
					<ArrowLeft className="w-5 h-5" />
					Back to Homestays
				</Link>

				{/* Main Image */}
				<div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
					<img
						src={homestay.image}
						alt={homestay.name}
						className="w-full h-[400px] sm:h-[500px] object-cover"
					/>
					{homestay.featured && (
						<div className="absolute top-6 left-6 bg-[#005246] text-white px-4 py-2 rounded-full text-sm font-semibold">
							Featured
						</div>
					)}
				</div>

				{/* Content Grid */}
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Header */}
						<div>
							<div className="flex items-center gap-2 text-gray-600 mb-2">
								<MapPin className="w-5 h-5" />
								<span className="text-lg capitalize">{homestay.location}</span>
							</div>
							<h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
								{homestay.name}
							</h1>
							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center gap-2">
									<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
									<span className="text-xl font-semibold">
										{homestay.rating}
									</span>
									<span className="text-gray-600">
										({homestay.reviews} reviews)
									</span>
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="bg-white rounded-xl p-6 shadow-md">
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								About this homestay
							</h2>
							<p className="text-gray-700 leading-relaxed text-lg">
								{homestay.description}
							</p>
						</div>

						{/* Amenities */}
						<div className="bg-white rounded-xl p-6 shadow-md">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								Amenities
							</h2>
							<div className="grid grid-cols-2 gap-4">
								{homestay.amenities.map((amenity, index) => (
									<div
										key={index}
										className="flex items-center gap-3 bg-gray-50 rounded-lg p-4"
									>
										{getAmenityIcon(amenity)}
										<span className="text-gray-700 font-medium">{amenity}</span>
									</div>
								))}
							</div>
						</div>

						{/* Host Info */}
						<div className="bg-white rounded-xl p-6 shadow-md">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								Your Host
							</h2>
							<div className="flex items-center gap-4 mb-4">
								<div className="w-16 h-16 bg-[#005246] rounded-full flex items-center justify-center text-white text-2xl font-bold">
									{homestay.host.charAt(0)}
								</div>
								<div>
									<p className="text-xl font-semibold text-gray-900">
										{homestay.host}
									</p>
									<p className="text-gray-600">Superhost</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-4">
								<a
									href={`tel:${homestay.contact.phone}`}
									className="flex items-center gap-2 bg-[#005246] text-white px-6 py-3 rounded-lg hover:bg-[#00735f] transition-colors font-medium"
								>
									<Phone className="w-5 h-5" />
									{homestay.contact.phone}
								</a>
								<a
									href={`mailto:${homestay.contact.email}`}
									className="flex items-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
								>
									<Mail className="w-5 h-5" />
									Email Host
								</a>
							</div>
						</div>
					</div>

					{/* Booking Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl p-6 shadow-xl sticky top-8">
							<div className="mb-6">
								<div className="text-3xl font-bold text-[#005246] mb-1">
									{homestay.price}
								</div>
								<div className="text-gray-600">per night</div>
							</div>

							<button className="w-full bg-[#005246] text-white font-semibold py-4 rounded-xl hover:bg-[#00735f] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mb-4">
								Book Now
							</button>

							<p className="text-center text-sm text-gray-600 mb-4">
								You won't be charged yet
							</p>

							<div className="border-t pt-4 space-y-3">
								<div className="flex justify-between text-gray-700">
									<span>{homestay.price} × 3 nights</span>
									<span>
										₹{parseInt(homestay.price.replace(/[^\d]/g, "")) * 3}
									</span>
								</div>
								<div className="flex justify-between text-gray-700">
									<span>Service fee</span>
									<span>₹500</span>
								</div>
								<div className="border-t pt-3 flex justify-between font-bold text-lg">
									<span>Total</span>
									<span className="text-[#005246]">
										₹{parseInt(homestay.price.replace(/[^\d]/g, "")) * 3 + 500}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
