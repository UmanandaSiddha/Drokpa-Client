"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
    MapPin,
    Star,
    Users,
    Bed,
    Wifi,
    Coffee,
    Wind,
    CheckCircle2,
    AlertCircle,
    Calendar,
    PhoneCall,
    Mail,
    Download,
    Upload,
    X,
} from "lucide-react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/auth/useAuth";
import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";
import { bookingService } from "@/services/booking.service";
import type { RequestHomestayBookingRequest } from "@/types/booking";
import { useHomestay } from "@/hooks/homestays";

type HomestayBookingPageClientProps = {
    params: Promise<{
        homestayId: string;
    }>;
};

export default function HomestayBookingClient({ params }: HomestayBookingPageClientProps) {
    const { user, isLoading: authLoading } = useAuth();
    const [homestayId, setHomestayId] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Form state
    const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
    const [guests, setGuests] = useState("1");
    const [selectedRoom, setSelectedRoom] = useState<string>("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [identityProof, setIdentityProof] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setHomestayId(resolvedParams.homestayId);
        };
        resolveParams();
    }, [params]);

    const { data: apiHomestay, isLoading: homestayLoading } = useHomestay(homestayId || "");

    // Transform API homestay to expected structure
    const homestayData = apiHomestay ? {
        id: apiHomestay.id,
        name: apiHomestay.name,
        images: apiHomestay.imageUrls?.length ? apiHomestay.imageUrls : ["/placeholder.jpg"],
        location: "Arunachal Pradesh", // Default location since API doesn't provide it directly
        description: apiHomestay.description,
        rating: apiHomestay.rating || 4.5,
        reviews: apiHomestay.totalReviews || 0,
        rooms: apiHomestay.rooms || [],
        host: "Homestay Host", // Default host name
        contact: {
            phone: apiHomestay.phoneNumber || "",
            email: apiHomestay.email || "",
        }
    } : null;

    if (homestayLoading || !homestayId) {
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

    if (!homestayData) {
        return notFound();
    }

    const handleIdentityProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }
            // Validate file type
            const validTypes = ["application/pdf", "image/jpeg", "image/png"];
            if (!validTypes.includes(file.type)) {
                alert("Only PDF, JPEG, and PNG files are allowed");
                return;
            }
            setIdentityProof(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!checkInDate || !checkOutDate || !selectedRoom) {
            alert("Please fill in all required fields");
            return;
        }

        if (checkOutDate <= checkInDate) {
            alert("Check-out date must be after check-in date");
            return;
        }

        try {
            setIsSubmitting(true);

            const bookingData: RequestHomestayBookingRequest = {
                homestayId: homestayId,
                checkIn: checkInDate.toISOString().split("T")[0], // YYYY-MM-DD format
                checkOut: checkOutDate.toISOString().split("T")[0],
                guests: parseInt(guests),
                roomId: selectedRoom,
                specialRequests: specialRequests,
            };

            // Call booking service
            const booking = await bookingService.requestHomestayBooking(bookingData);

            // Redirect to checkout with booking ID
            if (booking?.id) {
                window.location.href = `/checkout?bookingId=${booking.id}`;
            }
        } catch (error) {
            console.error("Failed to create booking:", error);
            setIsSubmitting(false);
            alert("Failed to create booking. Please try again.");
        }
    };

    const nights = checkInDate && checkOutDate ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div className="min-h-screen bg-white">
            <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Sign In to Book Your Homestay"
                message="You need to be logged in to book a homestay. Please sign in to continue with your booking."
            />

            <main className="relative min-h-screen bg-white">
                {/* Hero Section with Images */}
                <div className="relative py-6 sm:py-8 md:py-10 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#4F87C7]/10 blur-3xl" />
                        <div className="absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-[#FC611E]/10 blur-3xl" />
                    </div>

                    <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                            {/* Images */}
                            <div className="space-y-4">
                                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
                                    <Image
                                        src={homestayData.images[0]}
                                        alt={homestayData.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        unoptimized
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {homestayData.images.slice(1, 4).map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                                            <Image src={img} alt={`${homestayData.name} ${idx}`} fill className="object-cover" unoptimized />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex flex-col justify-start">
                                <div className="mb-6">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h1 className="text-3xl sm:text-4xl font-bold text-[#27261C] mb-2">{homestayData.name}</h1>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < 4 ? "fill-[#FC611E] text-[#FC611E]" : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-[#686766]">4.0 (42 reviews)</span>
                                            </div>
                                        </div>
                                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-[#4F87C7] text-white">
                                            Homestay
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[#686766] mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <span>{homestayData.location}</span>
                                    </div>
                                </div>

                                <p className="text-[#686766] text-base leading-relaxed mb-6">{homestayData.description}</p>

                                {/* Amenities */}
                                <div className="mb-8">
                                    <h3 className="font-semibold text-[#27261C] mb-4">Amenities</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Wifi, label: "Free WiFi" },
                                            { icon: Coffee, label: "Breakfast" },
                                            { icon: Wind, label: "AC Rooms" },
                                            { icon: Bed, label: "Comfortable Beds" },
                                        ].map((amenity, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <amenity.icon className="w-5 h-5 text-[#005246]" />
                                                <span className="text-sm text-[#686766]">{amenity.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form Section */}
                <section className="py-12 sm:py-16 bg-linear-to-br from-[#F5F1E6] via-white to-[#F0EBDF]">
                    <div className="w-full lg:w-[90%] max-w-400 mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Booking Form */}
                            <div className="md:col-span-2">
                                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-[#DDE7E0]/60">
                                    <h2 className="text-2xl font-bold text-[#27261C] mb-6">Book Your Stay</h2>

                                    {/* Check-in Date */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-[#27261C] mb-3">
                                            Check-in Date<span className="text-red-500">*</span>
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="w-full px-4 py-3 rounded-xl border-2 border-[#DDE7E0] flex items-center justify-between hover:border-[#005246] transition">
                                                    <span className={checkInDate ? "text-[#27261C]" : "text-[#686766]"}>
                                                        {checkInDate ? checkInDate.toLocaleDateString() : "Select date"}
                                                    </span>
                                                    <Calendar className="w-5 h-5 text-[#686766]" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent align="start">
                                                <CalendarUI mode="single" selected={checkInDate} onSelect={setCheckInDate} disabled={(date) => date < new Date()} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Check-out Date */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-[#27261C] mb-3">
                                            Check-out Date<span className="text-red-500">*</span>
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="w-full px-4 py-3 rounded-xl border-2 border-[#DDE7E0] flex items-center justify-between hover:border-[#005246] transition">
                                                    <span className={checkOutDate ? "text-[#27261C]" : "text-[#686766]"}>
                                                        {checkOutDate ? checkOutDate.toLocaleDateString() : "Select date"}
                                                    </span>
                                                    <Calendar className="w-5 h-5 text-[#686766]" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent align="start">
                                                <CalendarUI
                                                    mode="single"
                                                    selected={checkOutDate}
                                                    onSelect={setCheckOutDate}
                                                    disabled={(date) => (checkInDate ? date <= checkInDate : date < new Date())}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Guests */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-[#27261C] mb-3">
                                            Number of Guests<span className="text-red-500">*</span>
                                        </label>
                                        <Select value={guests} onValueChange={setGuests}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                                    <SelectItem key={num} value={num.toString()}>
                                                        {num} {num === 1 ? "Guest" : "Guests"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Room Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-[#27261C] mb-3">
                                            Select Room<span className="text-red-500">*</span>
                                        </label>
                                        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Choose a room" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {homestayData.rooms?.map((room) => (
                                                    <SelectItem key={room.id} value={room.id}>
                                                        {room.name} - ₹{room.finalPrice}/night
                                                    </SelectItem>
                                                )) || (
                                                        <SelectItem value="standard">Standard Room - ₹2,999/night</SelectItem>
                                                    )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Special Requests */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-[#27261C] mb-3">Special Requests</label>
                                        <textarea
                                            value={specialRequests}
                                            onChange={(e) => setSpecialRequests(e.target.value)}
                                            placeholder="Let us know if you have any special requests (optional)"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#DDE7E0] resize-none focus:outline-none focus:border-[#005246] transition text-sm"
                                            rows={4}
                                        />
                                    </div>

                                    {/* Identity Proof Upload */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-semibold text-[#27261C] mb-3">Identity Proof (Optional)</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                onChange={handleIdentityProofChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                                id="identity-proof"
                                            />
                                            <label
                                                htmlFor="identity-proof"
                                                className="block px-4 py-3 rounded-xl border-2 border-dashed border-[#DDE7E0] text-center cursor-pointer hover:border-[#005246] hover:bg-[#F5F1E6] transition"
                                            >
                                                {identityProof ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <CheckCircle2 className="w-5 h-5 text-[#005246]" />
                                                        <span className="text-sm text-[#27261C] font-medium">{identityProof.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Upload className="w-5 h-5 text-[#686766] mb-2" />
                                                        <span className="text-sm text-[#686766]">Upload PDF, JPG, or PNG (Max 5MB)</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !checkInDate || !checkOutDate || !selectedRoom}
                                        className="w-full px-6 py-3 bg-[#005246] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Proceed to Payment"
                                        )}
                                    </button>

                                    {formSubmitted && (
                                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                            <span className="text-sm text-green-700">Booking created successfully! Redirecting to payment...</span>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Price Summary */}
                            <div className="md:col-span-1">
                                <div className="bg-white rounded-2xl p-6 border border-[#DDE7E0]/60 sticky top-24">
                                    <h3 className="text-lg font-bold text-[#27261C] mb-4">Price Details</h3>

                                    {nights > 0 && selectedRoom ? (
                                        <>
                                            <div className="space-y-3 mb-6 pb-6 border-b border-[#DDE7E0]/60">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#686766]">₹2,999 × {nights} nights</span>
                                                    <span className="font-semibold text-[#27261C]">₹{2999 * nights}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#686766]">Taxes & Charges</span>
                                                    <span className="font-semibold text-[#27261C]">₹{Math.round((2999 * nights * 0.18) / 100)}</span>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl bg-[#005246]/5 border border-[#005246]/20 mb-6">
                                                <p className="text-xs text-[#686766] uppercase font-semibold mb-1">Total Price</p>
                                                <p className="text-2xl font-bold text-[#005246]">
                                                    ₹{2999 * nights + Math.round((2999 * nights * 0.18) / 100)}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-[#686766] text-center py-6">Select dates and room to see price</p>
                                    )}

                                    <div className="space-y-2 text-xs text-[#686766]">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#005246] shrink-0 mt-0.5" />
                                            <span>Free cancellation until 48 hours before check-in</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#005246] shrink-0 mt-0.5" />
                                            <span>Secure payment with Razorpay</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
