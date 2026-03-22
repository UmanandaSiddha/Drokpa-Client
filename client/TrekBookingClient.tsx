"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
    Calendar as CalendarIcon,
    AlertCircle,
    CheckCircle,
    ChevronRight,
    Clock,
    MapPin,
    Mountain,
    Star,
    Users,
    BadgeCheck,
    Mail,
} from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { tourService } from "@/services/tour.service";
import type { RequestTourBookingRequest } from "@/types/booking";
import type { Tour as ApiTour } from "@/types/tour";
import { Gender } from "@/types/auth";
import { LoadingComponent } from "@/components/LoadingComponent";
import GalleryLightbox from "@/components/GalleryLightbox";
import { useS3Upload } from "@/hooks/s3/useS3Upload";
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
import { useAuth } from "@/hooks/auth/useAuth";
import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";

type TrekDifficulty = "Easy" | "Moderate" | "Difficult" | "Challenging";

export default function TrekBookingClient({
    params,
}: {
    params: Promise<{ trekId: string }>;
}) {
    const { user } = useAuth();
    const [trekId, setTrekId] = useState<string | null>(null);
    // undefined = not loaded yet, null = failed/not found
    const [apiTrek, setApiTrek] = useState<ApiTour | null | undefined>(undefined);
    const [isTrekLoading, setIsTrekLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formError, setFormError] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const countryOptions = useCountryOptions();
    const { uploadFile, isUploading, uploadProgress, error: uploadError } = useS3Upload();
    const [formData, setFormData] = useState({
        arrivalDate: undefined as Date | undefined,
        participants: [
            {
                name: "",
                email: "",
                age: "",
                countryIso: "IN",
                countryCode: "+91",
                phone: "",
                passportPhoto: null as File | null,
                identityProof: null as File | null,
                passportPhotoUrl: "",
                identityProofUrl: "",
            },
        ],
        specialRequests: "",
    });
    const [activeParticipantIndex, setActiveParticipantIndex] = useState(0);

    useEffect(() => {
        let mounted = true;
        params.then((p) => {
            if (mounted) {
                setApiTrek(undefined);
                setTrekId(p.trekId);
            }
        });
        return () => {
            mounted = false;
        };
    }, [params]);

    useEffect(() => {
        if (!trekId) return;

        let mounted = true;
        setIsTrekLoading(true);
        setApiTrek(undefined);

        tourService
            .getTour(trekId)
            .then((data) => {
                if (!mounted) return;
                setApiTrek(data);
            })
            .catch((error) => {
                console.error("[TrekBookingClient] Failed to load trek:", error);
                if (!mounted) return;
                setApiTrek(null);
            })
            .finally(() => {
                if (!mounted) return;
                setIsTrekLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [trekId]);

    useEffect(() => {
        if (activeParticipantIndex >= formData.participants.length) {
            setActiveParticipantIndex(Math.max(0, formData.participants.length - 1));
        }
    }, [activeParticipantIndex, formData.participants.length]);

    useEffect(() => {
        if (uploadError) {
            setFormError(uploadError);
        }
    }, [uploadError]);

    const trek = apiTrek
        ? (() => {
            const imagesFromApi = (apiTrek.imageUrls || []).filter(
                (url) => typeof url === "string" && url.trim().length > 0
            );
            const images = imagesFromApi.slice(0, 5);

            const locationLabel = [apiTrek.address?.city, apiTrek.address?.state]
                .filter(Boolean)
                .join(", ");

            const days = Number(apiTrek.duration) || 0;
            const nights = Math.max(0, days - 1);
            const durationLabel = days > 1 ? `${days} Days - ${nights} Nights` : `${days} Day`;

            const textCandidates = [
                ...(apiTrek.tags || []).map((t) => t.tag?.label).filter(Boolean),
                ...(apiTrek.highlights || []),
                apiTrek.about,
                apiTrek.description,
            ].filter((v): v is string => typeof v === "string" && v.trim().length > 0);

            const pickDifficulty = (): TrekDifficulty => {
                for (const text of textCandidates) {
                    const value = text.toLowerCase();
                    if (value.includes("challenging")) return "Challenging";
                    if (value.includes("difficult")) return "Difficult";
                    if (value.includes("moderate")) return "Moderate";
                    if (value.includes("easy")) return "Easy";
                }
                return "Moderate";
            };

            const maxAltitudeMatch = textCandidates
                .map((t) => t.match(/(\d{1,2}(?:,\d{3})|\d{3,5})\s?m\b/i))
                .find(Boolean);
            const parsedMaxAltitude = maxAltitudeMatch
                ? maxAltitudeMatch[0].replace(/\s+/g, "")
                : "";

            const distanceMatch = textCandidates
                .map((t) => t.match(/(\d+(?:\.\d+)?)\s?km\b/i))
                .find(Boolean);
            const parsedDistance = distanceMatch ? `${distanceMatch[1]} km` : "";

            const seasonCandidate = textCandidates.find((t) =>
                /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i.test(t) || /season/i.test(t)
            );
            const parsedBestSeason = seasonCandidate
                ? seasonCandidate.replace(/best\s*season\s*:?\s*/i, "").trim()
                : "";

            const maxAltitude = (apiTrek.maxAltitude || "").trim() || parsedMaxAltitude;
            const distance = (apiTrek.distance || "").trim() || parsedDistance;
            const bestSeason = (apiTrek.bestSeason || "").trim() || parsedBestSeason;

            const guideYears = apiTrek.guide?.createdAt
                ? Math.max(
                    1,
                    Math.floor(
                        (Date.now() - new Date(apiTrek.guide.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24 * 365)
                    )
                )
                : null;

            const guideName = apiTrek.guide?.provider?.name || "Local Guide";
            const guideImage =
                apiTrek.guide?.imageUrls?.[0] || imagesFromApi[0] || "";
            const guideSpecialization = apiTrek.guide?.specialties?.length
                ? apiTrek.guide.specialties.join(", ")
                : "";

            return {
                id: apiTrek.id,
                title: apiTrek.title,
                duration: durationLabel,
                image: images[0] || "",
                images,
                rating: apiTrek.rating || 0,
                description: apiTrek.description,
                difficulty: pickDifficulty(),
                maxAltitude: maxAltitude || "Not specified",
                distance: distance || "Not specified",
                bestSeason: bestSeason || "Not specified",
                features: Array.from(new Set(apiTrek.highlights || [])).filter(Boolean),
                price: apiTrek.finalPrice || 0,
                originalPrice: apiTrek.basePrice || 0,
                discount: apiTrek.discount ? `${apiTrek.discount}% off` : "",
                meetingPoint: locationLabel,
                groupSizeLabel: `${apiTrek.maxCapacity} people`,
                guide: {
                    id: apiTrek.guide?.id || "0",
                    name: guideName,
                    image: guideImage,
                    experience: guideYears ? `${guideYears} Years` : "—",
                    specialization: guideSpecialization,
                    rating: apiTrek.guide?.rating || 0,
                    languages: apiTrek.guide?.languages || [],
                    bio: apiTrek.guide?.bio || "",
                },
            };
        })()
        : null;

    if (!trekId || isTrekLoading || apiTrek === undefined) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <LoadingComponent message="" size="large" />
            </div>
        );
    }

    if (!trek) return notFound();

    if (!trek.images.length) return notFound();

    const images = trek.images;
    const meetingPoint = trek.meetingPoint;
    const locationDisplay = meetingPoint?.trim()
        ? meetingPoint
        : "Location shared after booking confirmation";
    const groupSizeLabel = trek.groupSizeLabel;
    const galleryImages = images.slice(0, 5);

    const handleParticipantChange = (index: number, field: string, value: string | File | null) => {
        if ((field === "passportPhoto" || field === "identityProof") && !user) {
            setShowLoginModal(true);
            return;
        }

        const participants = [...formData.participants];
        participants[index] = { ...participants[index], [field]: value };
        setFormData((prev) => ({ ...prev, participants }));
        setFormError("");
    };

    const handleCountryChange = (index: number, value: string) => {
        const selected = countryOptions.find((option) => option.code === value);
        if (!selected) {
            return;
        }

        const participants = [...formData.participants];
        participants[index] = {
            ...participants[index],
            countryIso: selected.code,
            countryCode: selected.callingCode,
        };
        setFormData((prev) => ({ ...prev, participants }));
        setFormError("");
    };

    const handleAddParticipant = () => {
        const participants = [
            ...formData.participants,
            {
                name: "",
                email: "",
                age: "",
                countryIso: "IN",
                countryCode: "+91",
                phone: "",
                passportPhoto: null,
                identityProof: null,
                passportPhotoUrl: "",
                identityProofUrl: "",
            },
        ];
        setFormData((prev) => ({ ...prev, participants }));
        setActiveParticipantIndex(participants.length - 1);
        setFormError("");
    };

    const handleRemoveParticipant = (index: number) => {
        if (formData.participants.length === 1) {
            return;
        }
        const participants = formData.participants.filter((_, idx) => idx !== index);
        setFormData((prev) => ({ ...prev, participants }));
        setActiveParticipantIndex((prev) => {
            if (prev > index) return prev - 1;
            if (prev === index) return Math.max(0, prev - 1);
            return prev;
        });
    };

    const isParticipantComplete = (participant: (typeof formData.participants)[number]) => {
        const age = Number(participant.age);
        return Boolean(
            participant.name.trim() &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email) &&
            /^\d{10}$/.test(participant.phone) &&
            Number.isFinite(age) &&
            age >= 1 &&
            age <= 120 &&
            participant.passportPhoto &&
            participant.identityProof &&
            participant.passportPhotoUrl &&
            participant.identityProofUrl
        );
    };

    const getFileUploadProgress = (file: File | null): number | null => {
        if (!file) return null;
        const record = uploadProgress.find((item) => item.fileName === file.name);
        return record ? record.progress : null;
    };

    const handleParticipantFileUpload = async (
        index: number,
        field: "passportPhoto" | "identityProof",
        file: File | null
    ) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        handleParticipantChange(index, field, file);
        const urlField = field === "passportPhoto" ? "passportPhotoUrl" : "identityProofUrl";

        if (!file) {
            handleParticipantChange(index, urlField, "");
            return;
        }

        const uploadType = field === "passportPhoto" ? "passport-photos" : "identity-proofs";
        const contextId = `${user.id}-${trekId ?? "trek"}`;

        const uploadedUrl = await uploadFile(file, uploadType, contextId);
        if (!uploadedUrl) {
            setFormError(`Failed to upload ${field === "passportPhoto" ? "passport photo" : "identity proof"}. Please try again.`);
            handleParticipantChange(index, field, null);
            handleParticipantChange(index, urlField, "");
            return;
        }

        handleParticipantChange(index, urlField, uploadedUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!formData.arrivalDate) {
            setFormError("Please select an arrival date.");
            return;
        }

        const incompleteIndex = formData.participants.findIndex((participant) => !isParticipantComplete(participant));
        if (incompleteIndex !== -1) {
            setActiveParticipantIndex(incompleteIndex);
            setFormError("Please complete all traveler details before submitting.");
            return;
        }

        try {
            setFormError("");
            setFormSubmitted(true);

            const startDate = new Date(formData.arrivalDate);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + (Number(apiTrek?.duration) || 3));

            const guests = formData.participants.map((participant) => ({
                fullName: participant.name.trim(),
                email: participant.email.trim(),
                age: Number(participant.age),
                contactNumber: `${participant.countryCode}${participant.phone}`,
                gender: Gender.OTHER,
                passportPhotoId: participant.passportPhotoUrl,
                identityProofId: participant.identityProofUrl,
                dateOfArrival: startDate.toISOString().split("T")[0],
            }));

            const bookingData: RequestTourBookingRequest = {
                tourId: trekId!,
                startDate: startDate.toISOString().split("T")[0],
                guests,
                specialRequests: formData.specialRequests,
            };

            const booking = await bookingService.requestTourBooking(bookingData as RequestTourBookingRequest);
            if (booking?.id) {
                window.location.href = `/checkout?bookingId=${booking.id}`;
                return;
            }

            setFormError("Could not start checkout. Please try again.");
            setFormSubmitted(false);
        } catch (error) {
            console.error("Failed to create trek booking:", error);
            setFormError("Something went wrong while creating your booking.");
            setFormSubmitted(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Sign In to Book Trek"
                message="You need to be logged in to book a trek. Please sign in to continue with your booking."
            />

            <main className="relative min-h-screen bg-white">
                {/* Hero */}
                <section className="relative mt-16 py-6 sm:py-8 md:py-10 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#FC611E]/10 blur-3xl" />
                        <div className="absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-[#4F87C7]/10 blur-3xl" />
                    </div>
                    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-400 mx-auto">
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
                                            {locationDisplay}
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
                            {galleryImages.length === 1 && (
                                <div
                                    className="relative h-72 sm:h-80 md:h-107.5 overflow-hidden rounded-2xl shadow-[0_18px_50px_-25px_rgba(0,0,0,0.35)] cursor-pointer"
                                    onClick={() => {
                                        setLightboxIndex(0);
                                        setLightboxOpen(true);
                                    }}
                                >
                                    <Image
                                        src={galleryImages[0]}
                                        alt={trek.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}

                            {galleryImages.length === 2 && (
                                <div className="grid grid-cols-2 gap-3 h-72 sm:h-80 md:h-107.5">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={`trek-gallery-2-${idx}`}
                                            type="button"
                                            className="relative overflow-hidden rounded-2xl"
                                            onClick={() => {
                                                setLightboxIndex(idx);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${trek.title} ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {galleryImages.length === 3 && (
                                <div className="grid grid-cols-3 grid-rows-2 gap-3 h-72 sm:h-80 md:h-107.5">
                                    <button
                                        type="button"
                                        className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl shadow-[0_18px_50px_-25px_rgba(0,0,0,0.35)]"
                                        onClick={() => {
                                            setLightboxIndex(0);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <Image
                                            src={galleryImages[0]}
                                            alt={trek.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                    {galleryImages.slice(1).map((img, i) => (
                                        <button
                                            key={`trek-gallery-3-${i + 1}`}
                                            type="button"
                                            className="relative overflow-hidden rounded-2xl"
                                            onClick={() => {
                                                setLightboxIndex(i + 1);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${trek.title} ${i + 2}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {galleryImages.length === 4 && (
                                <div className="grid grid-cols-2 grid-rows-2 gap-3 h-72 sm:h-80 md:h-107.5">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={`trek-gallery-4-${idx}`}
                                            type="button"
                                            className="relative overflow-hidden rounded-2xl"
                                            onClick={() => {
                                                setLightboxIndex(idx);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${trek.title} ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {galleryImages.length === 5 && (
                                <div className="grid grid-cols-4 grid-rows-2 gap-3 h-72 sm:h-80 md:h-107.5">
                                    <button
                                        type="button"
                                        className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl shadow-[0_18px_50px_-25px_rgba(0,0,0,0.35)]"
                                        onClick={() => {
                                            setLightboxIndex(0);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <Image
                                            src={galleryImages[0]}
                                            alt={trek.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                    {galleryImages.slice(1).map((img, i) => (
                                        <button
                                            key={`trek-gallery-5-${i + 1}`}
                                            type="button"
                                            className="relative overflow-hidden rounded-2xl"
                                            onClick={() => {
                                                setLightboxIndex(i + 1);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${trek.title} ${i + 2}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Details and Booking */}
                <section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-400 mx-auto pb-16 sm:pb-20 md:pb-24">
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
                                        <Image
                                            src={trek.guide.image}
                                            alt={trek.guide.name}
                                            width={112}
                                            height={112}
                                            className="w-full h-full object-cover"
                                            unoptimized
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
                                <div>
                                    <label
                                        htmlFor="arrivalDate"
                                        className="block text-sm font-semibold mb-2"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}
                                    >
                                        Date of Arrival <span className="text-[#4F87C7]">*</span>
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                id="arrivalDate"
                                                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-left flex items-center gap-2 border-gray-200 focus:border-[#FC611E]"
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
                                                    setFormError("");
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <p
                                            className="text-sm font-semibold"
                                            style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}
                                        >
                                            Travelers
                                        </p>
                                        <p className="text-xs text-[#686766]">Add each participant with valid documents.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[#F6F6F6] text-[#27261C]"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                        >
                                            {formData.participants.length} traveler{formData.participants.length > 1 ? "s" : ""}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddParticipant}
                                            className="px-4 py-2 rounded-lg font-semibold text-sm border border-[#4F87C7] text-[#4F87C7] hover:bg-[#4F87C7]/10 transition-colors"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                        >
                                            Add traveler
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.participants.map((participant, idx) => (
                                        <button
                                            key={`traveler-${idx}`}
                                            type="button"
                                            onClick={() => setActiveParticipantIndex(idx)}
                                            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors ${idx === activeParticipantIndex
                                                ? "bg-[#4F87C7] text-white border-[#4F87C7]"
                                                : "bg-white text-[#4F87C7] border-[#4F87C7]/40 hover:border-[#4F87C7]"
                                                }`}
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>Traveler {idx + 1}</span>
                                                {isParticipantComplete(participant) ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4" />
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="rounded-2xl bg-white py-4 sm:py-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3
                                            className="text-base sm:text-lg font-semibold"
                                            style={{ fontFamily: "var(--font-subjectivity), sans-serif", color: "#27261C" }}
                                        >
                                            Traveler {activeParticipantIndex + 1} details
                                        </h3>
                                        {formData.participants.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveParticipant(activeParticipantIndex)}
                                                className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600"
                                                style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-mona-sans)", color: "#27261C" }}>
                                                Full Name <span className="text-[#4F87C7]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.participants[activeParticipantIndex].name}
                                                onChange={(e) => handleParticipantChange(activeParticipantIndex, "name", e.target.value)}
                                                placeholder="Enter your full name"
                                                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#FC611E]"
                                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#27261C" }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-mona-sans)", color: "#27261C" }}>
                                                Email <span className="text-[#4F87C7]">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.participants[activeParticipantIndex].email}
                                                onChange={(e) => handleParticipantChange(activeParticipantIndex, "email", e.target.value)}
                                                placeholder="Enter your email"
                                                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#FC611E]"
                                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#27261C" }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-mona-sans)", color: "#27261C" }}>
                                                Age <span className="text-[#4F87C7]">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="120"
                                                value={formData.participants[activeParticipantIndex].age}
                                                onChange={(e) => handleParticipantChange(activeParticipantIndex, "age", e.target.value)}
                                                placeholder="Enter age"
                                                className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#FC611E]"
                                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#27261C" }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-mona-sans)", color: "#27261C" }}>
                                                Phone Number <span className="text-[#4F87C7]">*</span>
                                            </label>
                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <Select
                                                    value={formData.participants[activeParticipantIndex].countryIso}
                                                    onValueChange={(value) => handleCountryChange(activeParticipantIndex, value)}
                                                >
                                                    <SelectTrigger
                                                        className="w-full sm:w-44 px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#FC611E]"
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
                                                    value={formData.participants[activeParticipantIndex].phone}
                                                    onChange={(e) => handleParticipantChange(activeParticipantIndex, "phone", e.target.value)}
                                                    placeholder="10-digit mobile number"
                                                    maxLength={10}
                                                    className="w-full flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#FC611E]"
                                                    style={{
                                                        fontFamily: "var(--font-mona-sans)",
                                                        fontWeight: 500,
                                                        color: "#27261C",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-mona-sans)", color: "#27261C" }}>
                                                Passport Photo <span className="text-[#4F87C7]">*</span>
                                            </label>
                                            <div className="relative border-2 border-dashed border-[#DDE7E0] rounded-2xl p-6 bg-[#FDFBF6]">
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={(e) => {
                                                        void handleParticipantFileUpload(
                                                            activeParticipantIndex,
                                                            "passportPhoto",
                                                            e.target.files?.[0] || null
                                                        );
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    id={`passportPhoto-${activeParticipantIndex}`}
                                                />
                                                <div className="flex flex-col items-center text-center pointer-events-none">
                                                    <div className="w-12 h-12 rounded-full bg-[#F5F1E6] flex items-center justify-center mb-3">
                                                        <ChevronRight className="w-6 h-6 text-[#4F87C7] rotate-90" />
                                                    </div>
                                                    {formData.participants[activeParticipantIndex].passportPhoto ? (
                                                        <>
                                                            <p
                                                                className="text-sm font-semibold mb-1"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 600,
                                                                    color: "#27261C",
                                                                }}
                                                            >
                                                                {formData.participants[activeParticipantIndex].passportPhoto?.name}
                                                            </p>
                                                            <p
                                                                className="text-xs"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                {(() => {
                                                                    const progress = getFileUploadProgress(
                                                                        formData.participants[activeParticipantIndex].passportPhoto
                                                                    );
                                                                    if (progress !== null) {
                                                                        return `Uploading... ${progress}%`;
                                                                    }
                                                                    if (formData.participants[activeParticipantIndex].passportPhotoUrl) {
                                                                        return "Uploaded to secure storage • Click to change";
                                                                    }
                                                                    return `${(formData.participants[activeParticipantIndex].passportPhoto!.size / 1024).toFixed(2)} KB • Click to change`;
                                                                })()}
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
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-mona-sans)", color: "#27261C" }}>
                                                Aadhaar/Passport Document <span className="text-[#4F87C7]">*</span>
                                            </label>
                                            <div className="relative border-2 border-dashed border-[#DDE7E0] rounded-2xl p-6 bg-[#FDFBF6]">
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                    onChange={(e) => {
                                                        void handleParticipantFileUpload(
                                                            activeParticipantIndex,
                                                            "identityProof",
                                                            e.target.files?.[0] || null
                                                        );
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    id={`identityProof-${activeParticipantIndex}`}
                                                />
                                                <div className="flex flex-col items-center text-center pointer-events-none">
                                                    <div className="w-12 h-12 rounded-full bg-[#F5F1E6] flex items-center justify-center mb-3">
                                                        <ChevronRight className="w-6 h-6 text-[#4F87C7] rotate-90" />
                                                    </div>
                                                    {formData.participants[activeParticipantIndex].identityProof ? (
                                                        <>
                                                            <p
                                                                className="text-sm font-semibold mb-1"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 600,
                                                                    color: "#27261C",
                                                                }}
                                                            >
                                                                {formData.participants[activeParticipantIndex].identityProof?.name}
                                                            </p>
                                                            <p
                                                                className="text-xs"
                                                                style={{
                                                                    fontFamily: "var(--font-mona-sans)",
                                                                    fontWeight: 500,
                                                                    color: "#686766",
                                                                }}
                                                            >
                                                                {(() => {
                                                                    const progress = getFileUploadProgress(
                                                                        formData.participants[activeParticipantIndex].identityProof
                                                                    );
                                                                    if (progress !== null) {
                                                                        return `Uploading... ${progress}%`;
                                                                    }
                                                                    if (formData.participants[activeParticipantIndex].identityProofUrl) {
                                                                        return "Uploaded to secure storage • Click to change";
                                                                    }
                                                                    return `${(formData.participants[activeParticipantIndex].identityProof!.size / 1024).toFixed(2)} KB • Click to change`;
                                                                })()}
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
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-mona-sans)", color: "#27261C" }}>
                                        Special Requests (optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.specialRequests}
                                        onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, specialRequests: e.target.value }));
                                            setFormError("");
                                        }}
                                        placeholder="Any dietary, medical, or travel-related requests"
                                        className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors border-gray-200 focus:border-[#FC611E]"
                                        style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#27261C" }}
                                    />
                                </div>

                                <div className="p-4 rounded-xl border border-[#DDE7E0] bg-[#F6F6F6]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-[#27261C]">Estimated total</span>
                                        <span className="text-xl font-bold text-[#27261C]">
                                            ₹ {(trek.price * formData.participants.length).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-[#686766]">
                                        {formData.participants.length} traveler{formData.participants.length > 1 ? "s" : ""} x ₹ {trek.price.toLocaleString("en-IN")}
                                    </p>
                                </div>

                                {formError && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {formError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={formSubmitted || isUploading}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4F87C7] hover:bg-[#5e91cc] disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-base font-semibold"
                                    style={{
                                        fontFamily: "var(--font-mona-sans)",
                                        fontWeight: 700,
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {formSubmitted ? "Processing..." : isUploading ? "Uploading documents..." : "Request booking"}
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

            <GalleryLightbox
                images={galleryImages}
                open={lightboxOpen}
                initialIndex={lightboxIndex}
                onClose={() => setLightboxOpen(false)}
                showThumbnails={true}
            />
        </div>
    );
}