"use client";

import { useState } from "react";
import Footer from "@/components/landingpagecomponents/Footer";
import Navigation from "@/components/landingpagecomponents/Navigation";
import MobileMenu from "@/components/MobileMenu";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import { ChevronRight, Info } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ILPPage() {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        countryCode: "+91",
        phone: "",
        aadhaarFile: null as File | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, aadhaarFile: file }));
        // Clear error when user selects a file
        if (errors.aadhaarFile) {
            setErrors((prev) => ({ ...prev, aadhaarFile: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
            newErrors.age = "Please enter a valid age";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        if (!formData.aadhaarFile) {
            newErrors.aadhaarFile = "Aadhaar card document is required";
        } else {
            const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
            if (!validTypes.includes(formData.aadhaarFile.type)) {
                newErrors.aadhaarFile = "Please upload a valid file (JPG, PNG, or PDF)";
            } else if (formData.aadhaarFile.size > 5 * 1024 * 1024) {
                newErrors.aadhaarFile = "File size must be less than 5MB";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);
            // Handle form submission here
        }
    };

    return (
        <MobileMenuProvider>
            <div className="min-h-screen bg-white">
                <Navigation />
                <MobileMenu />

                <main className="relative min-h-screen bg-white pt-20 pb-12">
                    <div className="w-full lg:w-[90%] max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                        {/* Hero Section */}
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
                                    Inner Line Permit
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
                                Apply for your ILP.
                            </h1>
                            <p
                                className="text-base sm:text-lg md:text-xl max-w-2xl"
                                style={{
                                    fontFamily: "var(--font-mona-sans)",
                                    fontWeight: 500,
                                    color: "#686766",
                                }}
                            >
                                Fill in your details below to start your Inner Line Permit application.
                                The process takes less than 5 minutes.
                            </p>
                        </div>

                        {/* Info Banner */}
                        <div className="mb-8 sm:mb-12 bg-[#F5F1E6] rounded-2xl p-4 sm:p-6 border border-[#DDE7E0]/40">
                            <div className="flex gap-3">
                                <Info className="w-5 h-5 text-[#FC611E] flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3
                                        className="text-sm sm:text-base font-semibold mb-1"
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            color: "#27261C",
                                        }}
                                    >
                                        What you'll need
                                    </h3>
                                    <ul
                                        className="text-xs sm:text-sm space-y-1"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 500,
                                            color: "#686766",
                                        }}
                                    >
                                        <li>• Valid Aadhaar Card document (photo/scan)</li>
                                        <li>• Active phone number for verification</li>
                                        <li>• Your travel dates and destinations</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                            {/* Left Side - Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 sm:p-8 md:p-10">
                                    <h2
                                        className="text-xl sm:text-2xl md:text-3xl mb-2"
                                        style={{
                                            fontFamily: "var(--font-subjectivity), sans-serif",
                                            fontWeight: 700,
                                            color: "#27261C",
                                        }}
                                    >
                                        Personal Information
                                    </h2>
                                    <p
                                        className="text-sm sm:text-base mb-6 sm:mb-8"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 500,
                                            color: "#686766",
                                        }}
                                    >
                                        Please provide accurate information as per your Aadhaar Card.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name Field */}
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-semibold mb-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 600,
                                                    color: "#27261C",
                                                }}
                                            >
                                                Full Name <span className="text-[#FC611E]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${errors.name
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-gray-200 focus:border-[#FC611E]"
                                                    }`}
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 500,
                                                    color: "#27261C",
                                                }}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-red-500" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Age Field */}
                                        <div>
                                            <label
                                                htmlFor="age"
                                                className="block text-sm font-semibold mb-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 600,
                                                    color: "#27261C",
                                                }}
                                            >
                                                Age <span className="text-[#FC611E]">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="age"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                placeholder="Enter your age"
                                                min="1"
                                                max="120"
                                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${errors.age
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-gray-200 focus:border-[#FC611E]"
                                                    }`}
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 500,
                                                    color: "#27261C",
                                                }}
                                            />
                                            {errors.age && (
                                                <p className="mt-1 text-xs text-red-500" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                    {errors.age}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone Field */}
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-semibold mb-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 600,
                                                    color: "#27261C",
                                                }}
                                            >
                                                Phone Number <span className="text-[#FC611E]">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={formData.countryCode}
                                                    onValueChange={(value) => {
                                                        setFormData((prev) => ({ ...prev, countryCode: value }));
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        className={`w-32 px-4 py-3 rounded-xl border-2 outline-none transition-colors ${errors.phone
                                                            ? "border-red-400"
                                                            : "border-gray-200 focus:border-[#FC611E]"
                                                            }`}
                                                        style={{
                                                            fontFamily: "var(--font-mona-sans)",
                                                            fontWeight: 500,
                                                            color: "#27261C",
                                                            height: "auto",
                                                        }}
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                                        <SelectItem value="+61">🇦🇺 +61</SelectItem>
                                                        <SelectItem value="+86">🇨🇳 +86</SelectItem>
                                                        <SelectItem value="+81">🇯🇵 +81</SelectItem>
                                                        <SelectItem value="+82">🇰🇷 +82</SelectItem>
                                                        <SelectItem value="+65">🇸🇬 +65</SelectItem>
                                                        <SelectItem value="+971">🇦🇪 +971</SelectItem>
                                                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                                                        <SelectItem value="+49">🇩🇪 +49</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="10-digit mobile number"
                                                    maxLength={10}
                                                    className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-colors ${errors.phone
                                                        ? "border-red-400 focus:border-red-500"
                                                        : "border-gray-200 focus:border-[#FC611E]"
                                                        }`}
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: "#27261C",
                                                    }}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-1 text-xs text-red-500" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Aadhaar Field */}
                                        <div>
                                            <label
                                                htmlFor="aadhaarFile"
                                                className="block text-sm font-semibold mb-2"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 600,
                                                    color: "#27261C",
                                                }}
                                            >
                                                Aadhaar Card Document <span className="text-[#FC611E]">*</span>
                                            </label>
                                            <div
                                                className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${errors.aadhaarFile
                                                    ? "border-red-400"
                                                    : "border-gray-300 hover:border-[#FC611E]"
                                                    }`}
                                            >
                                                <input
                                                    type="file"
                                                    id="aadhaarFile"
                                                    name="aadhaarFile"
                                                    onChange={handleFileChange}
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex flex-col items-center text-center pointer-events-none">
                                                    <div className="w-12 h-12 rounded-full bg-[#F5F1E6] flex items-center justify-center mb-3">
                                                        <ChevronRight className="w-6 h-6 text-[#FC611E] rotate-90" />
                                                    </div>
                                                    {formData.aadhaarFile ? (
                                                        <>
                                                            <p
                                                                className="text-sm font-semibold mb-1"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 600,
                                                                    color: "#27261C",
                                                                }}
                                                            >
                                                                {formData.aadhaarFile.name}
                                                            </p>
                                                            <p
                                                                className="text-xs"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                {(formData.aadhaarFile.size / 1024).toFixed(2)} KB • Click to change
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p
                                                                className="text-sm font-semibold mb-1"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 600,
                                                                    color: "#27261C",
                                                                }}
                                                            >
                                                                Click to upload Aadhaar Card
                                                            </p>
                                                            <p
                                                                className="text-xs"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                JPG, PNG or PDF (max 5MB)
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {errors.aadhaarFile && (
                                                <p className="mt-1 text-xs text-red-500" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                    {errors.aadhaarFile}
                                                </p>
                                            )}
                                            <p
                                                className="mt-2 text-xs"
                                                style={{
                                                    fontFamily: "var(--font-mona-sans)",
                                                    fontWeight: 500,
                                                    color: "#686766",
                                                }}
                                            >
                                                Your Aadhaar document is encrypted and securely stored.
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FC611E] hover:bg-[#f46a2f] transition-colors flex items-center justify-center gap-2 text-base font-semibold"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 700,
                                                color: "#27261C",
                                            }}
                                        >
                                            Continue Application
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Right Side - Info Cards */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Processing Time Card */}
                                <div className="bg-[#F5F1E6] rounded-2xl p-6 border border-[#DDE7E0]/40">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FC611E] flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">⚡</span>
                                        </div>
                                        <h3
                                            className="text-base font-semibold"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                color: "#27261C",
                                            }}
                                        >
                                            Fast Processing
                                        </h3>
                                    </div>
                                    <p
                                        className="text-sm"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 500,
                                            color: "#686766",
                                        }}
                                    >
                                        Most applications are processed within 24-48 hours. You'll receive updates via SMS and email.
                                    </p>
                                </div>

                                {/* Coverage Card */}
                                <div className="bg-[#F5F1E6] rounded-2xl p-6 border border-[#DDE7E0]/40">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-[#4F87C7] flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">📍</span>
                                        </div>
                                        <h3
                                            className="text-base font-semibold"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                color: "#27261C",
                                            }}
                                        >
                                            All Districts
                                        </h3>
                                    </div>
                                    <p
                                        className="text-sm"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 500,
                                            color: "#686766",
                                        }}
                                    >
                                        Your permit will be valid for all districts in Arunachal Pradesh for the specified duration.
                                    </p>
                                </div>

                                {/* Support Card */}
                                <div className="bg-[#F5F1E6] rounded-2xl p-6 border border-[#DDE7E0]/40">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">💬</span>
                                        </div>
                                        <h3
                                            className="text-base font-semibold"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                                color: "#27261C",
                                            }}
                                        >
                                            24/7 Support
                                        </h3>
                                    </div>
                                    <p
                                        className="text-sm"
                                        style={{
                                            fontFamily: "var(--font-mona-sans)",
                                            fontWeight: 500,
                                            color: "#686766",
                                        }}
                                    >
                                        Need help? Our support team is available round the clock to assist with your application.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer showCta={true} />
            </div>
        </MobileMenuProvider>
    );
}
