"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, MapPin, Calendar, Users, Phone, Mail, Home, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { bookingService } from "@/services/booking.service";
import type { Booking } from "@/types/booking";
import Link from "next/link";

export default function BookingConfirmationClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: authLoading } = useAuth();

    const bookingId = searchParams.get("bookingId");
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userFullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

    // Load booking on mount
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (bookingId && user) {
            bookingService
                .getBooking(bookingId)
                .then((data) => {
                    setBooking(data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load booking:", err);
                    setError("Could not load booking details. Please contact support.");
                    setIsLoading(false);
                });
        } else if (!bookingId) {
            setError("No booking ID provided");
            setIsLoading(false);
        }
    }, [bookingId, user, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#F5F1E6] via-white to-[#F5F1E6] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#005246]" />
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#F5F1E6] via-white to-[#F5F1E6] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#27261C] mb-2">Oops!</h2>
                    <p className="text-[#686766] mb-6">{error || "Booking not found"}</p>
                    <Link href="/" className="inline-block px-6 py-3 bg-[#005246] text-white rounded-xl font-medium hover:opacity-90 transition">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#F5F1E6] via-white to-[#F5F1E6]">
            <main className="py-12 sm:py-16 md:py-20">
                <div className="w-full lg:w-[90%] max-w-300 mx-auto px-4 sm:px-6 md:px-8">
                    {/* Success Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                                <div className="absolute inset-0 bg-linear-to-br from-[#005246] to-[#003d38] rounded-full animate-pulse opacity-20"></div>
                                <div className="relative inset-0 flex items-center justify-center">
                                    <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-[#005246]" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#27261C] mb-4">
                            Booking Confirmed!
                        </h1>
                        <p className="text-base sm:text-lg text-[#686766] max-w-2xl mx-auto">
                            Thank you for booking with Drokpa. Your adventure awaits! A confirmation email has been sent to{" "}
                            <span className="font-semibold text-[#27261C]">{user?.email}</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Booking Details Card */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDE7E0]/60 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.3)]">
                                <div className="mb-8 pb-8 border-b border-[#DDE7E0]/60">
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-[#686766] uppercase tracking-wider mb-1">
                                            Booking Reference
                                        </p>
                                        <p className="text-xl sm:text-2xl font-bold text-[#005246] font-mono">
                                            {booking.id.substring(0, 12).toUpperCase()}
                                        </p>
                                    </div>
                                    <p className="text-sm text-[#686766]">
                                        Status:{" "}
                                        <span className="inline-block px-3 py-1 rounded-full bg-[#E8F5F1] text-[#005246] font-semibold text-xs mt-1">
                                            {booking.status || "CONFIRMED"}
                                        </span>
                                    </p>
                                </div>

                                {/* Journey Details */}
                                <div className="mb-8">
                                    <h3 className="text-base font-bold text-[#27261C] mb-6">Your Journey</h3>
                                    <div className="space-y-4">
                                        {booking.items?.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="p-5 rounded-xl bg-[#F5F1E6]/50 border border-[#DDE7E0]/40 hover:border-[#DDE7E0]/70 transition"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {index === 0 && (
                                                        <div className="shrink-0">
                                                            <Home className="w-6 h-6 text-[#005246]" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-[#27261C] truncate">
                                                            {item.productType}
                                                        </p>
                                                        <p className="text-sm text-[#686766] mt-1">
                                                            Quantity: {item.quantity} × ₹{item.basePrice.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm font-semibold text-[#005246] mt-2">
                                                            ₹{item.totalAmount.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Guest Information */}
                                <div className="mb-8">
                                    <h3 className="text-base font-bold text-[#27261C] mb-4">Guest Information</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-[#F5F1E6]/50 border border-[#DDE7E0]/40">
                                            <p className="text-xs font-semibold text-[#686766] uppercase mb-1">Name</p>
                                            <p className="text-sm font-medium text-[#27261C]">{userFullName || "Guest"}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#F5F1E6]/50 border border-[#DDE7E0]/40">
                                            <p className="text-xs font-semibold text-[#686766] uppercase mb-1">Email</p>
                                            <p className="text-sm font-medium text-[#27261C] break-all">{user?.email}</p>
                                        </div>
                                        {user?.phoneNumber && (
                                            <div className="p-4 rounded-xl bg-[#F5F1E6]/50 border border-[#DDE7E0]/40">
                                                <p className="text-xs font-semibold text-[#686766] uppercase mb-1">Phone</p>
                                                <p className="text-sm font-medium text-[#27261C]">{user.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
                                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        What's Next?
                                    </h4>
                                    <ul className="text-sm text-blue-800 space-y-1 ml-6">
                                        <li>Check your email for the booking confirmation letter</li>
                                        <li>Your detailed itinerary will be sent before your trip</li>
                                        <li>Save your booking reference number for check-in</li>
                                        <li>Contact us anytime with questions or changes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary Card */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl p-6 border border-[#DDE7E0]/60 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.3)] sticky top-24">
                                <h3 className="text-base font-bold text-[#27261C] mb-4">Price Summary</h3>

                                <div className="space-y-3 mb-6 pb-6 border-b border-[#DDE7E0]/60">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#686766]">Subtotal</span>
                                        <span className="font-medium text-[#27261C]">
                                            ₹{((booking.totalAmount || 0) - 100).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#686766]">Taxes</span>
                                        <span className="font-medium text-[#27261C]">₹100</span>
                                    </div>
                                    {(booking.discountAmount ?? 0) > 0 && (
                                        <div className="flex justify-between text-sm p-2 bg-green-50 rounded">
                                            <span className="text-green-700 font-medium">Discount</span>
                                            <span className="font-medium text-green-700">
                                                −₹{(booking.discountAmount ?? 0).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 rounded-xl bg-[#005246]/5 border border-[#005246]/20 mb-6">
                                    <p className="text-xs text-[#686766] uppercase font-semibold mb-1">Total Paid</p>
                                    <p className="text-2xl font-bold text-[#005246]">
                                        ₹{(booking.totalAmount || 0).toLocaleString()}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F1E6] text-[#005246] rounded-xl font-semibold hover:bg-[#E8E4D8] transition"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Receipt
                                    </button>
                                    <Link
                                        href="/"
                                        className="w-full block text-center px-4 py-3 bg-[#005246] text-white rounded-xl font-semibold hover:opacity-90 transition"
                                    >
                                        Back to Home
                                    </Link>
                                </div>

                                {/* Trust Signals */}
                                <div className="mt-6 pt-6 border-t border-[#DDE7E0]/60 space-y-3 text-xs text-[#686766]">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#005246] shrink-0 mt-0.5" />
                                        <span>Payment processed securely</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#005246] shrink-0 mt-0.5" />
                                        <span>Confirmation email sent</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#005246] shrink-0 mt-0.5" />
                                        <span>Cancellation available anytime</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-linear-to-r from-[#005246]/10 to-[#4F87C7]/10 rounded-2xl p-8 border border-[#DDE7E0]/30 text-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#27261C] mb-3">Ready for your next adventure?</h3>
                        <p className="text-[#686766] mb-6 max-w-2xl mx-auto">
                            Check out our other tours, treks, and homestays to plan your next trip
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-[#FC611E] hover:bg-[#e54f1a] text-white rounded-xl font-semibold transition"
                        >
                            Explore More Experiences
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
