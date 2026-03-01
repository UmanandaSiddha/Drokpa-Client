"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Lock, MapPin, Shield, Loader2, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";
import { bookingService } from "@/services/booking.service";
import { paymentService } from "@/services/payment.service";
import type { Booking } from "@/types/booking";

type RazorpayOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => void;
    modal: {
        ondismiss: () => void;
    };
};

export default function CheckoutClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: authLoading } = useAuth();
    
    const bookingId = searchParams.get("bookingId");
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Check auth
        if (!authLoading && !user) {
            setShowLoginModal(true);
            return;
        }

        // Load booking details
        if (bookingId && user) {
            bookingService
                .getBooking(bookingId)
                .then((data) => {
                    setBooking(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error loading booking:", error);
                    setIsLoading(false);
                });
        }
    }, [bookingId, user, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#005246]" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <LoginRequiredModal
                    isOpen={showLoginModal}
                    onClose={() => router.push("/")}
                    title="Sign In to Complete Payment"
                    message="You need to be logged in to process payment for your booking."
                />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-gray-600">Booking not found</p>
            </div>
        );
    }

    const handlePayment = async () => {
        try {
            setIsProcessing(true);

            // Initialize Razorpay
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = async () => {
                const options: RazorpayOptions = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                    amount: (booking.totalAmount || 0) * 100, // Convert to paise
                    currency: "INR",
                    name: "Drokpa",
                    description: `Booking ${booking.id}`,
                    order_id: booking.id, // Use booking ID as order ID
                    prefill: {
                        name: user?.name || "",
                        email: user?.email || "",
                        contact: user?.phone || "",
                    },
                    handler: async (response) => {
                        try {
                            // Verify payment with backend
                            const verifyResponse = await paymentService.verifyPayment({
                                orderId: booking.id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                            });

                            console.log("Payment verified successfully:", verifyResponse);
                            // Redirect to success page
                            router.push(`/booking-confirmation?bookingId=${booking.id}`);
                        } catch (error) {
                            console.error("Payment verification error:", error);
                            alert("Payment verification failed. Please contact support.");
                            setIsProcessing(false);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setIsProcessing(false);
                        },
                    },
                };

                // @ts-ignore - Razorpay global type
                const rzp = new window.Razorpay(options);
                rzp.open();
            };
        } catch (error) {
            console.error("Payment initialization error:", error);
            setIsProcessing(false);
        }
    };
    return (
        <div className="min-h-screen bg-white">
            <main className="relative min-h-screen bg-white pt-16 pb-12 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[#FC611E]/10 blur-3xl" />
                    <div className="absolute top-32 -left-24 h-72 w-72 rounded-full bg-[#4F87C7]/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#005246]/10 blur-3xl" />
                </div>

                <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                    {/* Hero */}
                    <div className="pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex w-4 h-4 sm:w-5 sm:h-5 bg-[#FC611E] rounded-sm" />
                            <span
                                className="text-xs sm:text-sm uppercase tracking-widest text-[#686766]"
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                }}
                            >
                                Secure Checkout
                            </span>
                        </div>
                        <h1
                            className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] leading-tight mb-4"
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                                color: "#27261C",
                                letterSpacing: "-0.06em",
                            }}
                        >
                            Confirm your booking.
                        </h1>
                        <p
                            className="text-base sm:text-lg md:text-xl max-w-2xl"
                            style={{
                                fontFamily: "var(--font-mona-sans)",
                                fontWeight: 500,
                                color: "#686766",
                            }}
                        >
                            Review your trip details and complete payment through Razorpay. Your confirmation will be sent instantly.
                        </p>
                    </div>

                    {/* Info Banner */}
                    <div className="mb-8 sm:mb-12">
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F1E6] border border-[#DDE7E0]/60">
                                <Lock className="w-4 h-4 text-[#FC611E]" />
                                <span
                                    className="text-sm"
                                    style={{
                                        fontFamily: "var(--font-mona-sans)",
                                        fontWeight: 600,
                                        color: "#27261C",
                                    }}
                                >
                                    SSL Secure Payments
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F1E6] border border-[#DDE7E0]/60">
                                <Shield className="w-4 h-4 text-[#4F87C7]" />
                                <span
                                    className="text-sm"
                                    style={{
                                        fontFamily: "var(--font-mona-sans)",
                                        fontWeight: 600,
                                        color: "#27261C",
                                    }}
                                >
                                    Refunds in 48 hours
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F1E6] border border-[#DDE7E0]/60">
                                <CheckCircle2 className="w-4 h-4 text-[#005246]" />
                                <span
                                    className="text-sm"
                                    style={{
                                        fontFamily: "var(--font-mona-sans)",
                                        fontWeight: 600,
                                        color: "#27261C",
                                    }}
                                >
                                    Instant Confirmation
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3 lg:gap-12">
                        {/* Payment Panel */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)]">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                    <h2
                                        className="text-xl sm:text-2xl md:text-3xl"
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            color: "#27261C",
                                        }}
                                    >
                                        Payment details
                                    </h2>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F1E6] border border-[#DDE7E0]/60"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 600,
                                            color: "#27261C",
                                        }}
                                    >
                                        Step 1 of 2
                                    </span>
                                </div>
                                <p
                                    className="text-sm sm:text-base mb-6 sm:mb-8"
                                    style={{
                                        fontFamily: "var(--font-mona-sans)",
                                        fontWeight: 500,
                                        color: "#686766",
                                    }}
                                >
                                    Choose Razorpay to complete your booking. You will be redirected to a secure payment window.
                                </p>

                                <div className="space-y-6">
                                    <div className="bg-[#F5F1E6]/60 border border-[#DDE7E0]/60 rounded-2xl p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p
                                                    className="text-sm"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 600,
                                                        color: "#27261C",
                                                    }}
                                                >
                                                    Payment Method
                                                </p>
                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: "#686766",
                                                    }}
                                                >
                                                    Razorpay (UPI, Cards, Netbanking)
                                                </p>
                                            </div>
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DDE7E0]/70"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 600,
                                                    color: "#005246",
                                                }}
                                            >
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
                                        <p
                                            className="text-sm font-semibold mb-4"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 600,
                                                color: "#27261C",
                                            }}
                                        >
                                            Booking Summary
                                        </p>
                                        <div className="space-y-3 mb-4">
                                            {booking.items && booking.items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-start">
                                                    <div>
                                                        <p style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}>
                                                            {item.productType}
                                                        </p>
                                                        <p style={{ fontSize: "0.875rem", color: "#686766" }}>
                                                            Qty: {item.quantity} × ₹{item.basePrice.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <p style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}>
                                                        ₹{item.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span style={{ color: "#686766" }}>Subtotal</span>
                                                <span>₹{((booking.totalAmount || 0) - 100).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span style={{ color: "#686766" }}>Taxes</span>
                                                <span>₹100</span>
                                            </div>
                                            {booking.discountAmount > 0 && (
                                                <div className="flex justify-between items-center mb-3 p-2 bg-green-50 rounded">
                                                    <span style={{ color: "#005246", fontWeight: 600 }}>Discount ({booking.couponCode})</span>
                                                    <span style={{ color: "#005246", fontWeight: 600 }}>−₹{booking.discountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
                                        <p
                                            className="text-sm font-semibold mb-4"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 600,
                                                color: "#27261C",
                                            }}
                                        >
                                            Guest Information
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    className="block text-xs font-semibold mb-2"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 600,
                                                        color: "#686766",
                                                    }}
                                                >
                                                    Full name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={user?.name || ""}
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-xl border-2 outline-none bg-gray-50 text-sm"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: "#27261C",
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    className="block text-xs font-semibold mb-2"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 600,
                                                        color: "#686766",
                                                    }}
                                                >
                                                    Email address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={user?.email || ""}
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-xl border-2 outline-none bg-gray-50 text-sm"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: "#27261C",
                                                    }}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label
                                                    className="block text-xs font-semibold mb-2"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 600,
                                                        color: "#686766",
                                                    }}
                                                >
                                                    Phone number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={user?.phone || ""}
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-xl border-2 outline-none bg-gray-50 text-sm"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: "#27261C",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-dashed border-[#DDE7E0] rounded-2xl p-5">
                                        <p
                                            className="text-sm"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 600,
                                                color: "#27261C",
                                            }}
                                        >
                                            Payment Processing
                                        </p>
                                        <p
                                            className="text-xs mt-2"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 500,
                                                color: "#686766",
                                            }}
                                        >
                                            Click "Proceed to Payment" to open Razorpay checkout. You can pay using UPI, cards, net banking, and more.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        type="button"
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#005246] hover:bg-[#004536] disabled:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-base font-semibold text-white"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 600
                                        }}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Proceed to Payment"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 sticky top-24 border-2 border-gray-100 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)]">
                                <h3
                                    className="text-lg font-bold mb-4"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        color: "#27261C",
                                    }}
                                >
                                    Order Summary
                                </h3>

                                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex justify-between">
                                        <span style={{ color: "#686766" }}>Subtotal</span>
                                        <span style={{ fontWeight: 600, color: "#27261C" }}>
                                            ₹{((booking.totalAmount || 0) - 100).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#686766" }}>Taxes & Fees</span>
                                        <span style={{ fontWeight: 600, color: "#27261C" }}>₹100</span>
                                    </div>
                                    {booking.discountAmount > 0 && (
                                        <div className="flex justify-between text-green-700">
                                            <span>Discount</span>
                                            <span>−₹{booking.discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mb-6 p-3 bg-[#F5F1E6] rounded-lg">
                                    <span
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 600,
                                            color: "#27261C",
                                        }}
                                    >
                                        Total Amount
                                    </span>
                                    <span
                                        className="text-2xl"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 700,
                                            color: "#005246",
                                        }}
                                    >
                                        ₹{(booking.totalAmount || 0).toLocaleString()}
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                        <Lock className="w-4 h-4 text-[#005246] flex-shrink-0 mt-0.5" />
                                        <span style={{ color: "#686766" }}>Secure payment with Razorpay</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Shield className="w-4 h-4 text-[#4F87C7] flex-shrink-0 mt-0.5" />
                                        <span style={{ color: "#686766" }}>Full refund within 48 hours if cancelled</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-[#FC611E] flex-shrink-0 mt-0.5" />
                                        <span style={{ color: "#686766" }}>Confirmation sent to your email</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
