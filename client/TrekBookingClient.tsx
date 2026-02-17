"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import {
    Calendar as CalendarIcon,
    ChevronRight,
    Clock,
    MapPin,
    Mountain,
    Star,
    Users,
    BadgeCheck,
    Phone,
    Mail,
} from "lucide-react";
import treks from "@/data/treks";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCountryOptions } from "@/hooks/useCountryOptions";

const fallbackImages = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&h=900&fit=crop",
];

const meetingPoint = "Tawang, Arunachal Pradesh";
const groupSizeLabel = "8-12 people";

export default function TrekBookingClient({
    params,
}: {
    params: Promise<{ trekId: string }>;
}) {
    const [trekId, setTrekId] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const countryOptions = useCountryOptions();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        arrivalDate: undefined as Date | undefined,
        countryIso: "IN",
        countryCode: "+91",
        phone: "",
        passportPhoto: null as File | null,
        aadhaarFile: null as File | null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        let mounted = true;
        params.then((p) => {
            if (mounted) {
                setTrekId(p.trekId);
            }
        });
        return () => {
            mounted = false;
        };
    }, [params]);

    const trek = trekId ? treks.find((t) => t.id === Number(trekId)) : null;

    if (!trekId) {
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

    if (!trek) return notFound();

    const images = [trek.image, ...fallbackImages].slice(0, 3);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, aadhaarFile: file }));
        if (errors.aadhaarFile) {
            setErrors((prev) => ({ ...prev, aadhaarFile: "" }));
        }
    };

    const handlePassportPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, passportPhoto: file }));
        if (errors.passportPhoto) {
            setErrors((prev) => ({ ...prev, passportPhoto: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
            newErrors.age = "Please enter a valid age";
        }

        if (!formData.arrivalDate) {
            newErrors.arrivalDate = "Date of arrival is required";
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

        if (!formData.passportPhoto) {
            newErrors.passportPhoto = "Passport photo is required";
        } else {
            const validTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!validTypes.includes(formData.passportPhoto.type)) {
                newErrors.passportPhoto = "Please upload a valid photo (JPG or PNG)";
            } else if (formData.passportPhoto.size > 5 * 1024 * 1024) {
                newErrors.passportPhoto = "Photo size must be less than 5MB";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="relative min-h-screen bg-white">
                {/* Hero */}
                <section className="relative mt-16 py-6 sm:py-8 md:py-10 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#FC611E]/10 blur-3xl" />
                        <div className="absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-[#4F87C7]/10 blur-3xl" />
                    </div>
                    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            <div>
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6F6F6] text-xs sm:text-sm"
                                    style={{
                                        fontFamily: "var(--font-mona-sans), sans-serif",
                                        fontWeight: 600,
                                        color: "#27261C",
                                    }}
                                >
                                    <Mountain className="w-4 h-4" />
                                    {trek.difficulty} Trail
                                </div>
                                <h1
                                    className="mt-4 text-[36px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1.05] tracking-[-0.06em] text-[#27261C] font-bold"
                                    style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}
                                >
                                    {trek.title}
                                </h1>
                                <p
                                    className="mt-4 text-sm sm:text-base md:text-lg text-[#686766] max-w-xl"
                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                >
                                    {trek.description}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 bg-white border border-[#DDE7E0]/70 px-3 py-2 rounded-xl">
                                        <Clock className="w-4 h-4 text-[#4F87C7]" />
                                        <span
                                            className="text-xs sm:text-sm"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {trek.duration}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white border border-[#DDE7E0]/70 px-3 py-2 rounded-xl">
                                        <Users className="w-4 h-4 text-[#FC611E]" />
                                        <span
                                            className="text-xs sm:text-sm"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {groupSizeLabel}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white border border-[#DDE7E0]/70 px-3 py-2 rounded-xl">
                                        <MapPin className="w-4 h-4 text-[#27261C]" />
                                        <span
                                            className="text-xs sm:text-sm"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {meetingPoint}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white border border-[#DDE7E0]/70 px-3 py-2 rounded-xl">
                                        <Star className="w-4 h-4 text-[#F2BD11]" />
                                        <span
                                            className="text-xs sm:text-sm"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {trek.rating} rating
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap items-center gap-4">
                                    <div className="bg-[#27261C] text-white px-4 py-2 rounded-xl">
                                        <div
                                            className="text-xs uppercase tracking-wide"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            From
                                        </div>
                                        <div
                                            className="text-xl sm:text-2xl font-bold"
                                            style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}
                                        >
                                            ₹ {trek.price.toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                    <div className="text-sm text-[#686766]">
                                        <span className="line-through">₹{trek.originalPrice.toLocaleString("en-IN")}</span>
                                        <span className="ml-2 text-[#FC611E] font-semibold">{trek.discount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 grid-rows-2 gap-3">
                                <div className="col-span-2 relative h-64 sm:h-72 md:h-80 overflow-hidden rounded-2xl shadow-[0_18px_50px_-25px_rgba(0,0,0,0.35)]">
                                    <img
                                        src={images[0]}
                                        alt={trek.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="relative h-32 sm:h-36 overflow-hidden rounded-2xl">
                                    <img
                                        src={images[1]}
                                        alt="Trek view"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="relative h-32 sm:h-36 overflow-hidden rounded-2xl">
                                    <img
                                        src={images[2]}
                                        alt="Trek trail"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Details and Booking */}
                <section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto pb-16 sm:pb-20 md:pb-24">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">
                        <div className="space-y-8">
                            <div className="bg-[#F6F6F6] rounded-2xl p-6 sm:p-8">
                                <h2
                                    className="text-2xl sm:text-3xl font-bold text-[#27261C]"
                                    style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}
                                >
                                    Trek highlights
                                </h2>
                                <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                                    {trek.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-2 text-sm text-[#353030]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            <BadgeCheck className="w-4 h-4 text-[#4F87C7]" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-4 border border-[#DDE7E0]/70">
                                        <p className="text-xs uppercase text-[#686766]">Max Altitude</p>
                                        <p
                                            className="text-lg font-semibold text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {trek.maxAltitude}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-[#DDE7E0]/70">
                                        <p className="text-xs uppercase text-[#686766]">Distance</p>
                                        <p
                                            className="text-lg font-semibold text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {trek.distance}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-[#DDE7E0]/70">
                                        <p className="text-xs uppercase text-[#686766]">Best season</p>
                                        <p
                                            className="text-lg font-semibold text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {trek.bestSeason}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-[#DDE7E0]/70">
                                        <p className="text-xs uppercase text-[#686766]">Duration</p>
                                        <p
                                            className="text-lg font-semibold text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {trek.duration}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-[#DDE7E0]/70 p-6 sm:p-8 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.15)]">
                                <h2
                                    className="text-2xl sm:text-3xl font-bold text-[#27261C]"
                                    style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}
                                >
                                    Meet your guide
                                </h2>
                                <div className="mt-5 flex flex-col sm:flex-row gap-5">
                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden">
                                        <img
                                            src={trek.guide.image}
                                            alt={trek.guide.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p
                                            className="text-lg font-semibold text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {trek.guide.name}
                                        </p>
                                        <p className="text-sm text-[#686766]">{trek.guide.specialization}</p>
                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#353030]">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-[#F2BD11]" />
                                                {trek.guide.rating} rating
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-[#4F87C7]" />
                                                {trek.guide.experience} experience
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-[#686766]">{trek.guide.bio}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {trek.guide.languages.map((language) => (
                                        <span
                                            key={language}
                                            className="px-3 py-1 rounded-full bg-[#F6F6F6] text-xs text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#DDE7E0]/70 p-6 sm:p-8 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.15)]">
                            <h2
                                className="text-2xl sm:text-3xl font-bold text-[#27261C]"
                                style={{ fontFamily: "var(--font-subjectivity), sans-serif" }}
                            >
                                Request a booking
                            </h2>
                            <p className="mt-2 text-sm text-[#686766]">
                                Tell us a few details and we will get back within 24 hours.
                            </p>
                            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4">
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
                                            Full Name <span className="text-[#4F87C7]">*</span>
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

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold mb-2"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 600,
                                                color: "#27261C",
                                            }}
                                        >
                                            Email <span className="text-[#4F87C7]">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${errors.email
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-gray-200 focus:border-[#FC611E]"
                                                }`}
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 500,
                                                color: "#27261C",
                                            }}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

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
                                            Age <span className="text-[#4F87C7]">*</span>
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

                                    <div>
                                        <label
                                            htmlFor="arrivalDate"
                                            className="block text-sm font-semibold mb-2"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 600,
                                                color: "#27261C",
                                            }}
                                        >
                                            Date of Arrival <span className="text-[#4F87C7]">*</span>
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    id="arrivalDate"
                                                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-left flex items-center gap-2 ${errors.arrivalDate
                                                        ? "border-red-400 focus:border-red-500"
                                                        : "border-gray-200 focus:border-[#FC611E]"
                                                        }`}
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: formData.arrivalDate ? "#27261C" : "#686766",
                                                    }}
                                                >
                                                    <span className="flex-1">
                                                        {formData.arrivalDate
                                                            ? formData.arrivalDate.toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            })
                                                            : "Select arrival date"}
                                                    </span>
                                                    <CalendarIcon className="w-4 h-4 text-[#686766]" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.arrivalDate}
                                                    onSelect={(date) => {
                                                        setFormData((prev) => ({ ...prev, arrivalDate: date }));
                                                        if (errors.arrivalDate) {
                                                            setErrors((prev) => ({ ...prev, arrivalDate: "" }));
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.arrivalDate && (
                                            <p className="mt-1 text-xs text-red-500" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                {errors.arrivalDate}
                                            </p>
                                        )}
                                    </div>

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
                                            Phone Number <span className="text-[#4F87C7]">*</span>
                                        </label>
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <Select
                                                value={formData.countryIso}
                                                onValueChange={(value) => {
                                                    const selected = countryOptions.find((option) => option.code === value);
                                                    if (!selected) {
                                                        return;
                                                    }
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        countryIso: selected.code,
                                                        countryCode: selected.callingCode,
                                                    }));
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={`w-full sm:w-44 px-4 py-3 rounded-xl border-2 outline-none transition-colors ${errors.phone
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
                                                    <SelectValue placeholder="Country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countryOptions.map((option) => (
                                                        <SelectItem key={option.code} value={option.code}>
                                                            {option.name} ({option.callingCode})
                                                        </SelectItem>
                                                    ))}
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
                                                className={`w-full flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-colors ${errors.phone
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

                                    <div>
                                        <label
                                            htmlFor="passportPhoto"
                                            className="block text-sm font-semibold mb-2"
                                            style={{
                                                fontFamily: "var(--font-mona-sans)",
                                                fontWeight: 600,
                                                color: "#27261C",
                                            }}
                                        >
                                            Passport Photo <span className="text-[#4F87C7]">*</span>
                                        </label>
                                        <div className="relative border-2 border-dashed border-[#DDE7E0] rounded-2xl p-6 bg-[#FDFBF6]">
                                            <input
                                                type="file"
                                                id="passportPhoto"
                                                name="passportPhoto"
                                                onChange={handlePassportPhotoChange}
                                                accept=".jpg,.jpeg,.png"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center text-center pointer-events-none">
                                                <div className="w-12 h-12 rounded-full bg-[#F5F1E6] flex items-center justify-center mb-3">
                                                    <ChevronRight className="w-6 h-6 text-[#4F87C7] rotate-90" />
                                                </div>
                                                {formData.passportPhoto ? (
                                                    <>
                                                        <p
                                                            className="text-sm font-semibold mb-1"
                                                            style={{
                                                                fontFamily: "var(--font-mona-sans)",
                                                                fontWeight: 600,
                                                                color: "#27261C",
                                                            }}
                                                        >
                                                            {formData.passportPhoto.name}
                                                        </p>
                                                        <p
                                                            className="text-xs"
                                                            style={{
                                                                fontFamily: "var(--font-mona-sans)",
                                                                fontWeight: 500,
                                                                color: "#686766",
                                                            }}
                                                        >
                                                            {(formData.passportPhoto.size / 1024).toFixed(2)} KB • Click to change
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
                                                            Click to upload passport photo
                                                        </p>
                                                        <p
                                                            className="text-xs"
                                                            style={{
                                                                fontFamily: "var(--font-mona-sans)",
                                                                fontWeight: 500,
                                                                color: "#686766",
                                                            }}
                                                        >
                                                            JPG or PNG (max 5MB)
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {errors.passportPhoto && (
                                            <p className="mt-1 text-xs text-red-500" style={{ fontFamily: "var(--font-mona-sans)" }}>
                                                {errors.passportPhoto}
                                            </p>
                                        )}
                                    </div>

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
                                            Aadhaar Card Document <span className="text-[#4F87C7]">*</span>
                                        </label>
                                        <div className="relative border-2 border-dashed border-[#DDE7E0] rounded-2xl p-6 bg-[#FDFBF6]">
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
                                                    <ChevronRight className="w-6 h-6 text-[#4F87C7] rotate-90" />
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
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4F87C7] hover:bg-[#5e91cc] transition-colors flex items-center justify-center gap-2 text-base font-semibold"
                                    style={{
                                        fontFamily: "var(--font-mona-sans)",
                                        fontWeight: 700,
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {submitted ? "Request sent" : "Request booking"}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </form>
                            <div className="mt-6 rounded-xl bg-[#F6F6F6] p-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-[#4F87C7] mt-1" />
                                    <p className="text-xs text-[#686766]">
                                        We will email you the full itinerary, packing list, and next steps
                                        within 24 hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
