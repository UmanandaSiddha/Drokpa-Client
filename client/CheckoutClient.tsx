"use client";

import { CheckCircle2, Lock, MapPin, Shield } from "lucide-react";

const orderItems = [
    {
        id: "tour-1",
        title: "Tawang Monastery & Sela Pass",
        subtitle: "2 days, 1 night",
        date: "Mar 21, 2026",
        guests: 2,
        price: 5800,
    },
];

const priceBreakdown = {
    subtotal: 5800,
    taxes: 420,
    service: 180,
    total: 6400,
};

export default function CheckoutPage() {
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
                                            Contact details
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
                                                    placeholder="Enter full name"
                                                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#005246] text-sm bg-white"
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
                                                    placeholder="Enter email"
                                                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#005246] text-sm bg-white"
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
                                                    placeholder="Enter phone number"
                                                    className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#005246] text-sm bg-white"
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
                                            Billing Contact
                                        </p>
                                        <p
                                            className="text-xs mt-2"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 500,
                                                color: "#686766",
                                            }}
                                        >
                                            You can update billing details once payment is confirmed.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#005246] hover:bg-[#004536] transition-colors flex items-center justify-center gap-2 text-base font-semibold"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 700,
                                            color: "#FFFFFF",
                                        }}
                                    >
                                        <Lock className="w-4 h-4" />
                                        Pay with Razorpay
                                    </button>
                                    <p
                                        className="text-xs"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 500,
                                            color: "#686766",
                                        }}
                                    >
                                        Powered by Razorpay. Transactions are encrypted and secure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6 lg:sticky lg:top-24">
                                <div className="bg-[#F5F1E6] rounded-2xl p-6 border border-[#DDE7E0]/60 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.3)]">
                                    <h3
                                        className="text-base font-semibold mb-4"
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            color: "#27261C",
                                        }}
                                    >
                                        Order Summary
                                    </h3>
                                    <div className="space-y-4">
                                        {orderItems.map((item) => (
                                            <div key={item.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p
                                                        className="text-sm font-semibold"
                                                        style={{
                                                            fontFamily: "var(--font-mona-sans)",
                                                            fontWeight: 600,
                                                            color: "#27261C",
                                                        }}
                                                    >
                                                        {item.title}
                                                    </p>
                                                    <p
                                                        className="text-sm"
                                                        style={{
                                                            fontFamily: "var(--font-mona-sans)",
                                                            fontWeight: 600,
                                                            color: "#27261C",
                                                        }}
                                                    >
                                                        ₹ {item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: "#686766",
                                                    }}
                                                >
                                                    {item.subtitle}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#DDE7E0]/70">
                                                        <MapPin className="w-3 h-3" />
                                                        {item.date}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-[#DDE7E0]/70">
                                                        {item.guests} travelers
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-[#DDE7E0]/70 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.3)]">
                                    <h3
                                        className="text-base font-semibold mb-4"
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            color: "#27261C",
                                        }}
                                    >
                                        Price Breakdown
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F1E6]/70 border border-[#DDE7E0]/70">
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}>
                                                Total due today
                                            </span>
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 700, color: "#005246" }}>
                                                ₹ {priceBreakdown.total.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#686766" }}>
                                                Subtotal
                                            </span>
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}>
                                                ₹ {priceBreakdown.subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#686766" }}>
                                                Taxes
                                            </span>
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}>
                                                ₹ {priceBreakdown.taxes.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#686766" }}>
                                                Service fees
                                            </span>
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}>
                                                ₹ {priceBreakdown.service.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="border-t border-[#DDE7E0]/70 pt-3 flex items-center justify-between">
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 700, color: "#27261C" }}>
                                                Total
                                            </span>
                                            <span style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 700, color: "#005246" }}>
                                                ₹ {priceBreakdown.total.toLocaleString()}
                                            </span>
                                        </div>
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
