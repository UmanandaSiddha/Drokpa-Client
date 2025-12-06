"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    Star,
    Download,
    Upload,
    X,
    ChevronLeft,
    ChevronRight,
    CheckCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const tourData = {
    id: 1,
    title: "Drokpa Expedation ",
    subtitle: "Explore the Spiritual Heart of Arunachal Pradesh",
    duration: "4 Days / 3 Nights",
    location: "Tawang, Arunachal Pradesh",
    price: "₹6,800",
    rating: 4.8,
    reviews: 156,
    groupSize: "10 people",
    images: [
        "/losar28.webp",
        "/selaimg.jpg",
        "/sangti2.jpg",
    ],
    brochure: "/tour-brochure.pdf",
    description: "Experience the rich cultural heritage of Tawang with visits to ancient monasteries, local homestays, and guided cultural tours. Perfect for first-time visitors to Northeast India.",
    highlights: [
        "Visit Tawang Monastery - 2nd largest in Asia",
        "Traditional Monpa cuisine experiences",
        "Sela Pass scenic photography stops",
        "Local artisan workshops",
        "Guided heritage walks"
    ],

    itinerary: [
        {
            day: 1,
            title: "Tezpur → Dirang | Sangti Valley & Dirang Monastery",
            description: [
                "Departure from Tezpur ",
                "Arrival at Dirang homestay",
                "Visit to Sangti Valley",
                "Visit to Dirang Monastery",
                "Return to Dirang homestay"
            ],
            activities: [
                "Road trip from Tezpur",
                "Sangti Valley visit",
                "Dirang Monastery exploration",
                "Local homestay stay"
            ],
            meals: ["Breakfast"]
        },
        {
            day: 2,
            title: "Dirang → Tawang | Sela Pass & Nuranang Waterfalls",
            description: [
                "Departure from Dirang homestay",
                "Stop at Sela Pass for sightseeing",
                "Visit to Jang (Nuranang) Waterfalls",
                "Arrival at Tawang homestay"
            ],
            activities: [
                "Sela Pass viewpoint",
                "Photography at Sela Lake",
                "Nuranang Waterfall",
                "Settle in at Tawang"
            ],
            meals: ["Breakfast"]
        },
        {
            day: 3,
            title: "Tawang Local Sightseeing",
            description: [
                "Visit Tawang Monastery",
                "Visit War Memorial",
                "Visit Buddha Park",
                "Explore Tawang Market"
            ],
            activities: [
                "Monastery visit",
                "War Memorial",
                "Buddha Park",
                "Shopping & culture walk"
            ],
            meals: ["Breakfast"]
        },
        {
            day: 4,
            title: "Return to Tezpur",
            description: [
                "Return road trip from Tawang to Tezpur"
            ],
            activities: [
                "Scenic drive back to Tezpur"
            ],
            meals: ["Breakfast"]
        }
    ],

    included: [
        "Accommodation in best homestays",
        "Breakfast provided daily",
        "Comfortable vehicle for all travel",
        "Entry fees & Inner Line Permit included"
    ],

    excluded: [
        "Lunch & Dinner",
        "Personal expenses",
        "Tips and additional activities not mentioned"
    ]

};

export default function TourBookingPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [formData, setFormData] = useState({
        numberOfPeople: 1,
        participants: [{ name: "", email: "", phone: "", age: "" }],
        photoId: null as File | null,
        identityProof: null as File | null,
        specialRequests: ""
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleParticipantChange = (index: number, field: string, value: string) => {
        const newParticipants = [...formData.participants];
        newParticipants[index] = { ...newParticipants[index], [field]: value };
        setFormData({ ...formData, participants: newParticipants });
    };

    const handleNumberOfPeopleChange = (num: number) => {
        const participants = Array.from({ length: num }, (_, i) =>
            formData.participants[i] || { name: "", email: "", phone: "", age: "" }
        );
        setFormData({ ...formData, numberOfPeople: num, participants });
    };

    const handleFileUpload = (field: "photoId" | "identityProof", file: File | null) => {
        setFormData({ ...formData, [field]: file });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Booking submitted:", formData);
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-[rgba(0,82,70,0.02)] to-white">
            {/* Hero Section with Image Gallery */}
            <section className="relative w-full bg-linear-to-b from-[rgba(0,82,70,0.08)] to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                  
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <motion.div
                                className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setLightboxOpen(true)}
                            >
                                <Image
                                    src={tourData.images[selectedImage]}
                                    alt={tourData.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                            <div className="grid grid-cols-3 gap-3">
                                {tourData.images.map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === idx ? "border-(--brand-green)" : "border-transparent"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedImage(idx)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Tour image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Tour Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {tourData.title}
                                </h1>
                                <p className="text-lg text-gray-600 mb-4">{tourData.subtitle}</p>

                                <div className="flex items-center gap-4 flex-wrap mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{tourData.rating}</span>
                                        <span className="text-gray-500">({tourData.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        {tourData.location}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <Clock className="w-5 h-5 text-(--brand-green)" />
                                        <div>
                                            <p className="text-xs text-gray-500">Duration</p>
                                            <p className="font-semibold text-sm">{tourData.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <Users className="w-5 h-5 text-(--brand-green)" />
                                        <div>
                                            <p className="text-xs text-gray-500">Group Size</p>
                                            <p className="font-semibold text-sm">{tourData.groupSize}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-(--brand-green) text-white rounded-xl">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-4xl font-bold">{tourData.price}</span>
                                    <span className="text-white/80">per person</span>
                                </div>
                                <a
                                    href="#booking-form"
                                    className="block w-full py-3 bg-white text-(--brand-green) rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors"
                                >
                                    Book Now
                                </a>
                            </div>

                            <a
                                href={tourData.brochure}
                                download
                                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-(--brand-green) text-(--brand-green) rounded-lg font-semibold hover:bg-(--brand-green) hover:text-white transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download Brochure
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tour Details */}
            <section className="w-full py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Description */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    About This Tour
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {tourData.description}
                                </p>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Highlights</h3>
                                <ul className="space-y-2">
                                    {tourData.highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-(--brand-green) shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Itinerary */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                    Day-by-Day Itinerary
                                </h2>
                                <div className="space-y-6">
                                    {tourData.itinerary.map((day, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="shrink-0 w-12 h-12 rounded-full bg-(--brand-green) text-white flex items-center justify-center font-bold">
                                                    {day.day}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                        {day.title}
                                                    </h3>
                                                    <p className="text-gray-700 mb-4">{day.description}</p>

                                                    <div className="space-y-3">
                                                        <div>
                                                            <span className="text-sm font-semibold text-gray-900">Activities:</span>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {day.activities.map((activity, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-3 py-1 bg-[rgba(0,82,70,0.1)] text-(--brand-green) rounded-full text-sm"
                                                                    >
                                                                        {activity}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <span className="text-sm font-semibold text-gray-900">Meals: </span>
                                                            <span className="text-sm text-gray-600">{day.meals.join(", ")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Form */}
                            <div id="booking-form" className="scroll-mt-20">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                    Book Your Adventure
                                </h2>

                                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
                                    {/* Number of People */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            Number of Travelers
                                        </label>
                                        <div className="flex gap-2 flex-wrap">
                                            {[1, 2, 3, 4, 5, 6 ,7 ,8 ,9].map(num => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => handleNumberOfPeopleChange(num)}
                                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${formData.numberOfPeople === num
                                                        ? "bg-(--brand-green) text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Participant Details */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Traveler Details</h3>
                                        {formData.participants.map((participant, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-4">
                                                <h4 className="font-semibold text-gray-900">Traveler {idx + 1}</h4>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name *"
                                                        required
                                                        value={participant.name}
                                                        onChange={(e) => handleParticipantChange(idx, "name", e.target.value)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-green)"
                                                    />
                                                    <input
                                                        type="email"
                                                        placeholder="Email *"
                                                        required
                                                        value={participant.email}
                                                        onChange={(e) => handleParticipantChange(idx, "email", e.target.value)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-green)"
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="Phone Number *"
                                                        required
                                                        value={participant.phone}
                                                        onChange={(e) => handleParticipantChange(idx, "phone", e.target.value)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-green)"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Age *"
                                                        required
                                                        value={participant.age}
                                                        onChange={(e) => handleParticipantChange(idx, "age", e.target.value)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-green)"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* File Uploads */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Documents Upload</h3>

                                        <div className="space-y-3">
                                            <label className="block">
                                                <span className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Photo ID (Group Leader) *
                                                </span>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        required
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload("photoId", e.target.files?.[0] || null)}
                                                        className="hidden"
                                                        id="photoId"
                                                    />
                                                    <label
                                                        htmlFor="photoId"
                                                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-(--brand-green) transition-colors"
                                                    >
                                                        <Upload className="w-5 h-5 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            {formData.photoId ? formData.photoId.name : "Upload Photo ID"}
                                                        </span>
                                                    </label>
                                                </div>
                                            </label>

                                            <label className="block">
                                                <span className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Identity Proof (Aadhaar/Passport) *
                                                </span>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        required
                                                        accept="image/*,.pdf"
                                                        onChange={(e) => handleFileUpload("identityProof", e.target.files?.[0] || null)}
                                                        className="hidden"
                                                        id="identityProof"
                                                    />
                                                    <label
                                                        htmlFor="identityProof"
                                                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-(--brand-green) transition-colors"
                                                    >
                                                        <Upload className="w-5 h-5 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            {formData.identityProof ? formData.identityProof.name : "Upload Identity Proof"}
                                                        </span>
                                                    </label>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Special Requests or Dietary Requirements
                                        </label>
                                        <textarea
                                            value={formData.specialRequests}
                                            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                            rows={4}
                                            placeholder="Any special requests, dietary restrictions, or accessibility needs..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-green) resize-none"
                                        />
                                    </div>

                                    {/* Total Price */}
                                    <div className="p-4 bg-[rgba(0,82,70,0.1)] rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                                            <span className="text-2xl font-bold text-(--brand-green)">
                                                ₹{(parseFloat(tourData.price.replace(/[₹,]/g, "")) * formData.numberOfPeople).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {formData.numberOfPeople} traveler{formData.numberOfPeople > 1 ? "s" : ""} × {tourData.price}
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-(--brand-green) text-white rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Confirm Booking
                                    </button>

                                    {formSubmitted && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Booking submitted successfully! We'll contact you shortly.
                                        </motion.div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* What's Included */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                                <ul className="space-y-2">
                                    {tourData.included.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-(--brand-green) shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <hr className="my-4" />

                                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Not Included</h3>
                                <ul className="space-y-2">
                                    {tourData.excluded.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage((prev) => (prev === 0 ? tourData.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 text-white hover:text-gray-300"
                    >
                        <ChevronLeft className="w-12 h-12" />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-video">
                        <Image
                            src={tourData.images[selectedImage]}
                            alt="Tour image"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage((prev) => (prev === tourData.images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 text-white hover:text-gray-300"
                    >
                        <ChevronRight className="w-12 h-12" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
                        {selectedImage + 1} / {tourData.images.length}
                    </div>
                </motion.div>
            )}
        </div>
    );
}