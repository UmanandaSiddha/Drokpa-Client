"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
    MapPin,
    Clock,
    Users,
    Star,
    Download,
    Upload,
    X,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Share2,
    Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";
import tours from "@/data/tours";

export default function TourBookingPage({
    params,
}: {
    params: Promise<{ tourId: string }>;
}) {
    const [tourId, setTourId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [prevImage, setPrevImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [isFading, setIsFading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [formData, setFormData] = useState({
        numberOfPeople: 1,
        participants: [{ name: "", phone: "", age: "", identityProof: null as File | null }],
        specialRequests: ""
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Get tour data
    useEffect(() => {
        let mounted = true;
        params.then((p) => {
            if (mounted) {
                setTourId(p.tourId);
            }
        });
        return () => {
            mounted = false;
        };
    }, [params]);

    const tour = tourId ? tours.find((t) => t.id === Number(tourId)) : null;

    // Extended tour data with additional details
    const tourData = tour ? {
        ...tour,
        location: "Tawang, Arunachal Pradesh",
        reviews: 156,
        groupSize: "10 people",
        images: [
            tour.image,
            "https://images.unsplash.com/photo-1578824381648-52f000bb5f9f?q=80&w=2071&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1606044466411-207a9a49711f?q=80&w=2070&auto=format&fit=crop",
        ],
        brochure: "/tour-brochure.pdf",
        highlights: tour.features,
        itinerary: [
            {
                day: 1,
                title: "Arrival & Orientation",
                description: "Arrive at the starting point, meet your guide, and get briefed about the journey ahead.",
                activities: ["Welcome briefing", "Equipment check", "Local orientation"],
                meals: ["Dinner"]
            },
            {
                day: 2,
                title: "Main Adventure Begins",
                description: "Start your journey with the first major activity and exploration.",
                activities: ["Main activity", "Sightseeing", "Cultural experience"],
                meals: ["Breakfast", "Lunch", "Dinner"]
            },
            {
                day: 3,
                title: "Full Day Experience",
                description: "Immerse yourself in the complete experience with guided tours and activities.",
                activities: ["Guided tours", "Local interactions", "Photography"],
                meals: ["Breakfast", "Lunch", "Dinner"]
            },
            {
                day: 4,
                title: "Departure",
                description: "Final activities and departure from the destination.",
                activities: ["Final activities", "Farewell"],
                meals: ["Breakfast"]
            }
        ],
        included: [
            "Accommodation in best homestays",
            "Breakfast provided daily",
            "Comfortable vehicle for all travel",
            "Entry fees & Inner Line Permit included",
            "Experienced local guide"
        ],
        excluded: [
            "Lunch & Dinner",
            "Personal expenses",
            "Tips and additional activities not mentioned"
        ]
    } : null;

    const imagesCount = tourData ? tourData.images.length : 0;

    useEffect(() => {
        if (!imagesCount || lightboxOpen) return;
        const interval = setInterval(() => {
            setSelectedImage((prev) => {
                const next = (prev + 1) % imagesCount;
                setPrevImage(prev);
                setIsTransitioning(true);
                return next;
            });
        }, 4500);
        return () => clearInterval(interval);
    }, [imagesCount, lightboxOpen]);

    useEffect(() => {
        if (!isTransitioning) return;
        setIsFading(false);
        const raf = requestAnimationFrame(() => setIsFading(true));
        const timeout = setTimeout(() => setIsTransitioning(false), 900);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(timeout);
        };
    }, [selectedImage]);

    if (!tourId) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div
                    style={{
                        fontFamily: "var(--font-mona-sans), sans-serif",
                        fontWeight: 500,
                        color: "#686766",
                    }}
                >
                    Loading...
                </div>
            </div>
        );
    }

    if (!tourData) return notFound();

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tourData.location)}`;

    const handleParticipantChange = (index: number, field: string, value: string | File | null) => {
        const newParticipants = [...formData.participants];
        newParticipants[index] = { ...newParticipants[index], [field]: value };
        setFormData({ ...formData, participants: newParticipants });
    };

    const handleAddParticipant = () => {
        const participants = [
            ...formData.participants,
            { name: "", phone: "", age: "", identityProof: null }
        ];
        setFormData({ ...formData, numberOfPeople: participants.length, participants });
    };

    const handleRemoveParticipant = (index: number) => {
        if (formData.participants.length === 1) return;
        const participants = formData.participants.filter((_, idx) => idx !== index);
        setFormData({ ...formData, numberOfPeople: participants.length, participants });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Booking submitted:", formData);
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            <main className="relative min-h-screen bg-white">
                {/* Hero Section with Image Gallery */}
                <div className="mt-16 sm:mt-20 md:mt-24 bg-white py-4 sm:py-6 md:py-8">
                    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
                        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                            {/* Image Gallery */}
                            <div className="space-y-3 sm:space-y-4">
                                <div
                                    className="relative aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                                    onClick={() => setLightboxOpen(true)}
                                >
                                    {isTransitioning && (
                                        <Image
                                            src={tourData.images[prevImage]}
                                            alt={tourData.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    )}
                                    <Image
                                        src={tourData.images[selectedImage]}
                                        alt={tourData.title}
                                        fill
                                        className={`object-cover transition-opacity duration-900 ease-in-out ${isFading ? "opacity-100" : "opacity-0"}`}
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                    <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 z-10">
                                        <p
                                            className="text-white text-lg sm:text-2xl"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                letterSpacing: "-0.04em",
                                            }}
                                        >
                                            {tourData.location}
                                        </p>
                                        <a
                                            href={mapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white/90 text-[#27261C] hover:bg-white transition-colors"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MapPin className="w-4 h-4" />
                                            Open in Maps
                                        </a>
                                    </div>
                                </div>

                                <button
                                    className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 border-2 rounded-lg font-semibold hover:text-white transition-colors text-sm sm:text-base"
                                    style={{ borderColor: "#005246", color: "#005246", fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                >
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Download Brochure
                                </button>
                            </div>

                            {/* Tour Info */}
                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <h1
                                        className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3"
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            color: "#353030",
                                            letterSpacing: "-0.07em",
                                        }}
                                    >
                                        {tourData.title}
                                    </h1>
                                    <p
                                        className="text-base sm:text-lg mb-3 sm:mb-4"
                                        style={{
                                            fontFamily: "var(--font-mona-sans), sans-serif",
                                            fontWeight: 500,
                                            color: "#686766",
                                        }}
                                    >
                                        {tourData.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 sm:w-5 sm:h-5" style={{ fill: "#005246", color: "#005246" }} />
                                            <span
                                                className="font-semibold"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 600,
                                                    color: "#353030",
                                                    fontSize: "clamp(14px, 3.5vw, 16px)",
                                                }}
                                            >
                                                {tourData.rating}
                                            </span>
                                            <span
                                                className="underline"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                    fontSize: "clamp(12px, 3vw, 14px)",
                                                }}
                                            >
                                                ({tourData.reviews} reviews)
                                            </span>
                                        </div>
                                        <span className="text-[#686766]">·</span>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#686766]" />
                                            <span
                                                className="underline capitalize"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                    fontSize: "clamp(12px, 3vw, 14px)",
                                                }}
                                            >
                                                {tourData.location}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <div className="flex items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: "#005246" }} />
                                            <div>
                                                <p
                                                    className="text-xs text-[#686766]"
                                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                                                >
                                                    Duration
                                                </p>
                                                <p
                                                    className="font-semibold text-sm"
                                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600, color: "#353030" }}
                                                >
                                                    {tourData.duration}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: "#005246" }} />
                                            <div>
                                                <p
                                                    className="text-xs text-[#686766]"
                                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                                                >
                                                    Group Size
                                                </p>
                                                <p
                                                    className="font-semibold text-sm"
                                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600, color: "#353030" }}
                                                >
                                                    {tourData.groupSize}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-6 bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                                    <div>
                                        <h3
                                            className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                color: "#353030",
                                            }}
                                        >
                                            What's Included
                                        </h3>
                                        <ul className="space-y-2">
                                            {tourData.included.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base">
                                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" style={{ color: "#005246" }} />
                                                    <span
                                                        style={{
                                                            fontFamily: "var(--font-mona-sans), sans-serif",
                                                            fontWeight: 500,
                                                            color: "#686766",
                                                        }}
                                                    >
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="hidden md:block w-px bg-gray-200" aria-hidden="true" />

                                    <div>
                                        <h3
                                            className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                color: "#353030",
                                            }}
                                        >
                                            What's Not Included
                                        </h3>
                                        <ul className="space-y-2">
                                            {tourData.excluded.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base">
                                                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                                                    <span
                                                        style={{
                                                            fontFamily: "var(--font-mona-sans), sans-serif",
                                                            fontWeight: 500,
                                                            color: "#686766",
                                                        }}
                                                    >
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 text-[#005246] rounded-xl">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-3xl sm:text-4xl font-bold"
                                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700 }}
                                            >
                                                ₹ {tourData.price.toLocaleString()}
                                            </span>
                                            {tourData.discount && (
                                                <span
                                                    className="px-3 py-1 rounded-full text-sm font-semibold bg-[#005246]/10 text-[#005246]"
                                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                                >
                                                    {tourData.discount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className="text-gray-600 text-sm sm:text-base line-through"
                                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                                            >
                                                ₹ {tourData.originalPrice.toLocaleString()}
                                            </span>
                                            <span
                                                className="text-gray-600 text-sm sm:text-base"
                                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                                            >
                                                per person
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="w-full sm:w-[300px] py-2.5 sm:py-3 bg-[#005246] rounded-lg font-semibold text-center transition-colors text-base"
                                        style={{ color: "#FFFFFF", fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto pb-8 sm:pb-12 md:pb-16">
                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8 md:space-y-10">
                            {/* Booking Form */}
                            <div id="booking-form" className="scroll-mt-20">
                                <div className="border-t border-gray-200 pt-6 sm:pt-8 md:pt-10">
                                    <h2
                                        className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6"
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            color: "#353030",
                                            letterSpacing: "-0.07em",
                                        }}
                                    >
                                        Book Your Adventure
                                    </h2>

                                    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 sm:p-6 md:p-8 border border-gray-200 shadow-sm space-y-5 sm:space-y-6">
                                        {/* Number of People */}
                                        <div className="flex items-center justify-between gap-4">
                                            <label
                                                className="block text-sm sm:text-base font-semibold mb-3"
                                                style={{
                                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                                    fontWeight: 700,
                                                    color: "#353030",
                                                }}
                                            >
                                                Number of Travelers
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[rgba(0,82,70,0.08)] text-[#005246]"
                                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                                >
                                                    {formData.participants.length} traveler{formData.participants.length > 1 ? "s" : ""}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleAddParticipant}
                                                    className="px-4 py-2 rounded-lg font-semibold text-sm sm:text-base border border-[#005246] text-[#005246] hover:bg-[rgba(0,82,70,0.06)] transition-colors"
                                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                                >
                                                    Add new
                                                </button>
                                            </div>
                                        </div>

                                        {/* Participant Details */}
                                        <div className="space-y-4 sm:space-y-5">
                                            <h3
                                                className="text-lg sm:text-xl font-semibold pb-2 border-b border-gray-200"
                                                style={{
                                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                                    fontWeight: 700,
                                                    color: "#353030",
                                                }}
                                            >
                                                Traveler Details
                                            </h3>
                                            {formData.participants.map((participant, idx) => (
                                                <div key={idx} className="p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-3 sm:space-y-4">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                                style={{ backgroundColor: "#005246", fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                                            >
                                                                {idx + 1}
                                                            </div>
                                                            <h4
                                                                className="font-semibold text-base sm:text-lg"
                                                                style={{
                                                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                                                    fontWeight: 700,
                                                                    color: "#353030",
                                                                }}
                                                            >
                                                                Traveler {idx + 1}
                                                            </h4>
                                                        </div>
                                                        {formData.participants.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveParticipant(idx)}
                                                                className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600"
                                                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                                        <div>
                                                            <label
                                                                className="block text-xs sm:text-sm font-medium mb-1.5"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                Full Name *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter full name"
                                                                required
                                                                value={participant.name}
                                                                onChange={(e) => handleParticipantChange(idx, "name", e.target.value)}
                                                                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base bg-white"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                                    fontWeight: 500,
                                                                    "--tw-ring-color": "#005246"
                                                                } as React.CSSProperties}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                className="block text-xs sm:text-sm font-medium mb-1.5"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                Phone Number *
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                placeholder="Enter phone number"
                                                                required
                                                                value={participant.phone}
                                                                onChange={(e) => handleParticipantChange(idx, "phone", e.target.value)}
                                                                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base bg-white"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                                    fontWeight: 500,
                                                                    "--tw-ring-color": "#005246"
                                                                } as React.CSSProperties}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                className="block text-xs sm:text-sm font-medium mb-1.5"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                Age *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                placeholder="Enter age"
                                                                required
                                                                min="1"
                                                                max="100"
                                                                value={participant.age}
                                                                onChange={(e) => handleParticipantChange(idx, "age", e.target.value)}
                                                                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base bg-white"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                                    fontWeight: 500,
                                                                    "--tw-ring-color": "#005246"
                                                                } as React.CSSProperties}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                className="block text-xs sm:text-sm font-medium mb-1.5"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                Identity Proof (Aadhaar/Passport) *
                                                            </label>
                                                            <input
                                                                type="file"
                                                                required
                                                                accept="image/*,.pdf"
                                                                onChange={(e) => handleParticipantChange(idx, "identityProof", e.target.files?.[0] || null)}
                                                                className="hidden"
                                                                id={`identityProof-${idx}`}
                                                            />
                                                            <label
                                                                htmlFor={`identityProof-${idx}`}
                                                                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all duration-200 text-xs sm:text-sm bg-white hover:border-[#005246] hover:bg-[rgba(0,82,70,0.02)]"
                                                                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, color: "#686766" }}
                                                            >
                                                                <Upload className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#005246" }} />
                                                                <span className="truncate">
                                                                    {participant.identityProof ? participant.identityProof.name : "Upload Identity Proof"}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total Price */}
                                        <div className="p-4 sm:p-5 rounded-xl border-2 border-[#005246] bg-[rgba(0,82,70,0.05)]">
                                            <div className="flex justify-between items-center mb-2">
                                                <span
                                                    className="text-base sm:text-lg font-semibold"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans), sans-serif",
                                                        fontWeight: 600,
                                                        color: "#353030",
                                                    }}
                                                >
                                                    Total Price:
                                                </span>
                                                <span
                                                    className="text-xl sm:text-2xl font-bold"
                                                    style={{
                                                        color: "#005246",
                                                        fontFamily: "var(--font-mona-sans), sans-serif",
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    ₹ {(tourData.price * formData.numberOfPeople).toLocaleString()}
                                                </span>
                                            </div>
                                            <p
                                                className="text-xs sm:text-sm"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                }}
                                            >
                                                {formData.participants.length} traveler{formData.participants.length > 1 ? "s" : ""} × ₹{tourData.price.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full py-3.5 sm:py-4 text-white rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                            style={{
                                                backgroundColor: "#005246",
                                                fontFamily: "var(--font-mona-sans), sans-serif",
                                                fontWeight: 600
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#004536"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#005246"}
                                        >
                                            Confirm Booking
                                        </button>

                                        {formSubmitted && (
                                            <div className="flex items-center gap-2 p-4 bg-[rgba(0,82,70,0.1)] border border-[#005246] rounded-lg">
                                                <CheckCircle className="w-5 h-5" style={{ color: "#005246" }} />
                                                <span
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans), sans-serif",
                                                        fontWeight: 500,
                                                        color: "#005246",
                                                    }}
                                                >
                                                    Booking submitted successfully! We'll contact you shortly.
                                                </span>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* What's Included */}
                            {/* <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <h3
                                    className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        color: "#353030",
                                    }}
                                >
                                    What's Included
                                </h3>
                                <ul className="space-y-2">
                                    {tourData.included.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm sm:text-base">
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" style={{ color: "#005246" }} />
                                            <span
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                }}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <hr className="my-4" />

                                <h3
                                    className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        color: "#353030",
                                    }}
                                >
                                    What's Not Included
                                </h3>
                                <ul className="space-y-2">
                                    {tourData.excluded.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm sm:text-base">
                                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                                            <span
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                }}
                                            >
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div> */}

                            {/* Itinerary */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                                <h2
                                    className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        color: "#353030",
                                        letterSpacing: "-0.07em",
                                    }}
                                >
                                    Day-by-Day Itinerary
                                </h2>
                                <div className="space-y-4">
                                    {tourData.itinerary.map((day, idx) => (
                                        <div
                                            key={idx}
                                            className="border-l-2 border-[#005246] pl-3 sm:pl-4 pb-4 last:pb-0"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <div
                                                    className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center font-bold text-sm sm:text-base"
                                                    style={{ backgroundColor: "#005246", fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                                >
                                                    {day.day}
                                                </div>
                                                <h3
                                                    className="text-base sm:text-lg font-semibold"
                                                    style={{
                                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                                        fontWeight: 700,
                                                        color: "#353030",
                                                    }}
                                                >
                                                    {day.title}
                                                </h3>
                                            </div>
                                            <p
                                                className="mb-2 sm:mb-3 text-xs sm:text-sm"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                }}
                                            >
                                                {day.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                                                {day.activities.map((activity, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 rounded-full text-xs"
                                                        style={{ backgroundColor: "rgba(0, 82, 70, 0.1)", color: "#005246", fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                                                    >
                                                        {activity}
                                                    </span>
                                                ))}
                                            </div>
                                            <p
                                                className="text-xs sm:text-sm"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans), sans-serif",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                }}
                                            >
                                                <span className="font-semibold" style={{ color: "#353030" }}>Meals: </span>
                                                {day.meals.join(", ")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage((prev) => (prev === 0 ? tourData.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 text-white hover:text-gray-300 z-10"
                    >
                        <ChevronLeft className="w-10 h-10 sm:w-12 sm:h-12" />
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
                        className="absolute right-4 text-white hover:text-gray-300 z-10"
                    >
                        <ChevronRight className="w-10 h-10 sm:w-12 sm:h-12" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm sm:text-base">
                        {selectedImage + 1} / {tourData.images.length}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
