"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export default function ContactPageClient() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user starts typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setSuccess("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
            <main className="relative min-h-screen bg-white pt-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white">
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />

                    <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20 lg:py-24">
                        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-start">
                            {/* LEFT - Info Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-5 sm:mb-6">
                                    <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#FC611E]" />
                                    <p
                                        className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
                                        style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                    >
                                        Get in Touch
                                    </p>
                                </div>
                                <h1
                                    className="leading-[1.1] mb-6 sm:mb-7"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(36px, 7vw, 64px)",
                                        color: "#27261C",
                                        letterSpacing: "-0.06em",
                                    }}
                                >
                                    Let's plan your Arunachal journey.
                                </h1>
                                <p
                                    className="text-base sm:text-lg md:text-xl leading-relaxed mb-8"
                                    style={{ color: "#686766", fontWeight: 500, lineHeight: "1.7" }}
                                >
                                    Have questions about trips, bookings, permits, or our services?
                                    Share the details and we'll get back to you with care and guidance.
                                </p>

                                {/* Response Time Badge */}
                                <div className="inline-flex items-center gap-3 bg-white border-2 border-[#DDE7E0] rounded-full px-5 py-3 mb-8 sm:mb-10">
                                    <Clock className="w-5 h-5 text-[#FC611E]" />
                                    <span className="text-sm font-semibold text-[#27261C]">
                                        Typical response: Within 24 hours
                                    </span>
                                </div>

                                {/* Contact Info Cards */}
                                <div className="grid gap-4 sm:gap-5">
                                    <ContactCard
                                        icon={<Mail className="w-5 h-5" />}
                                        title="Email"
                                        value="dokpa@gmail.com"
                                        color="#FC611E"
                                    />
                                    <ContactCard
                                        icon={<Phone className="w-5 h-5" />}
                                        title="Phone"
                                        value="+91 8119984614"
                                        color="#4F87C7"
                                    />
                                    <ContactCard
                                        icon={<MapPin className="w-5 h-5" />}
                                        title="Location"
                                        value="Tawang, Arunachal Pradesh, India"
                                        color="#2D7A3E"
                                    />
                                </div>
                            </div>

                            {/* RIGHT - Form Section */}
                            <div className="bg-white border-2 border-[#DDE7E0] p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <h2
                                    className="text-xl sm:text-2xl md:text-3xl mb-3"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        color: "#27261C",
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    Send us a message
                                </h2>
                                <p className="text-sm sm:text-base text-[#686766] mb-6 sm:mb-8" style={{ fontWeight: 500 }}>
                                    Fill in the form below and our team will respond as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name Field */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold mb-2 text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                        >
                                            Full Name <span className="text-[#FC611E]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FC611E] bg-white transition-colors"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, color: "#27261C" }}
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold mb-2 text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                        >
                                            Email Address <span className="text-[#FC611E]">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FC611E] bg-white transition-colors"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, color: "#27261C" }}
                                        />
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-semibold mb-2 text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXXXXXXX"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FC611E] bg-white transition-colors"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, color: "#27261C" }}
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-semibold mb-2 text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                        >
                                            Your Message <span className="text-[#FC611E]">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Tell us about your travel plans, questions, or how we can help..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#FC611E] resize-none bg-white transition-colors"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500, color: "#27261C" }}
                                        />
                                    </div>

                                    {/* Error/Success Messages */}
                                    {error && (
                                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                            <p className="text-sm text-red-600 font-medium">{error}</p>
                                        </div>
                                    )}
                                    {success && (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                            <p className="text-sm text-green-600 font-medium">{success}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#FC611E] hover:bg-[#f46a2f] text-white py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                        style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700 }}
                                    >
                                        {loading ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Info Section */}
                <section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
                    <div className="bg-gradient-to-br from-[#F5F1E6] to-[#DDE7E0]/40 rounded-3xl p-8 sm:p-10 md:p-12 border-2 border-[#DDE7E0]">
                        <h3
                            className="text-2xl sm:text-3xl md:text-4xl mb-4"
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                                color: "#27261C",
                                letterSpacing: "-0.05em",
                            }}
                        >
                            We're Here to Help
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-[#686766] leading-relaxed max-w-3xl" style={{ fontWeight: 500 }}>
                            Whether you're planning your first visit to Arunachal Pradesh, need assistance with permits,
                            or want personalized recommendations for homestays and routes — our team is ready to guide you
                            with local knowledge and genuine care.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ContactCard({
    icon,
    title,
    value,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
}) {
    return (
        <div className="group bg-white border-2 border-[#DDE7E0] rounded-2xl p-5 hover:shadow-lg hover:border-[#FC611E]/30 transition-all duration-300 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: color }}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-[#686766] mb-1" style={{ fontWeight: 500 }}>
                    {title}
                </p>
                <p
                    className="text-sm sm:text-base text-[#27261C] font-semibold truncate"
                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}
