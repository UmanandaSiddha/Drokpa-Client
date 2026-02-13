"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, Users, MapPin, Star } from "lucide-react";
import { Things1, Things2, Things3, Things4 } from "@/assets";
import NotifyModal from "@/components/NotifyModal";

interface ActivityType {
    id: number;
    title: string;
    image: string;
    description: string;
    highlights: string[];
    badge: string;
    duration: string;
    difficulty: string;
    groupSize: string;
}

function ActivitiesContent() {
    const searchParams = useSearchParams();
    const activityParam = searchParams.get('activity');
    const initialActivityId = activityParam ? parseInt(activityParam) : 1;
    const [selectedActivityId, setSelectedActivityId] = useState(initialActivityId);
    const [notifyOpen, setNotifyOpen] = useState(false);
    const [notifyFeature, setNotifyFeature] = useState("Activity booking");

    useEffect(() => {
        if (activityParam) {
            setSelectedActivityId(parseInt(activityParam));
        }
    }, [activityParam]);

    const activitiesData: ActivityType[] = [
        {
            id: 1,
            title: "Trekking",
            image: Things1.src,
            badge: "Adventure",
            description: "Experience breathtaking mountain trails and pristine natural landscapes. Our expert guides will lead you through some of the most scenic routes in the region, offering unforgettable views and a deep connection with nature.",
            highlights: [
                "Stunning mountain vistas and panoramic views",
                "Forest immersion and wildlife spotting",
                "Professional guides with local expertise",
                "Flexible routes for all experience levels",
                "Photography opportunities at scenic locations"
            ],
            duration: "Half-day to Multi-day",
            difficulty: "Moderate to Challenging",
            groupSize: "Up to 15 people"
        },
        {
            id: 2,
            title: "Spiritual Places",
            image: Things2.src,
            badge: "Cultural",
            description: "Journey through sacred sites and spiritual destinations that hold profound significance. Connect with local traditions, ancient wisdom, and the peaceful energy of these revered locations.",
            highlights: [
                "Access to sacred monasteries and temples",
                "Guided spiritual wisdom sessions",
                "Local cultural rituals and ceremonies",
                "Meditation and mindfulness practices",
                "Interaction with local spiritual guides"
            ],
            duration: "Half-day to Full-day",
            difficulty: "Easy to Moderate",
            groupSize: "Up to 12 people"
        },
        {
            id: 3,
            title: "Wildlife Safaris",
            image: Things3.src,
            badge: "Nature",
            description: "Discover the rich biodiversity and diverse wildlife of the region. Professional naturalists will help you spot elusive species while sharing fascinating insights about the ecosystem and conservation efforts.",
            highlights: [
                "Expert wildlife spotting guidance",
                "Bird watching and species identification",
                "Conservation education programs",
                "Close encounters with nature",
                "Professional photography assistance"
            ],
            duration: "Full-day",
            difficulty: "Easy to Moderate",
            groupSize: "Up to 8 people"
        },
        {
            id: 4,
            title: "River Rafting",
            image: Things4.src,
            badge: "Adventure",
            description: "Navigate thrilling rapids and serene river stretches. Experience the rush of adventure while enjoying stunning riverside landscapes and the thrill of water sports designed for all skill levels.",
            highlights: [
                "Expert river navigation and safety",
                "Multiple difficulty levels available",
                "Professional equipment and gear",
                "Scenic riverside landscapes",
                "Beach breaks and swimming spots"
            ],
            duration: "Half-day to Full-day",
            difficulty: "Easy to Challenging",
            groupSize: "Up to 10 people"
        }
    ];

    const selectedActivity = activitiesData.find((a) => a.id === selectedActivityId);

    if (!selectedActivity) return null;

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
            <main className="relative min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto pb-8 sm:pb-10 md:pb-12">
                        {/* Title Section */}
                        <div className="mt-6">
                            <h1
                                className="text-3xl sm:text-4xl md:text-5xl"
                                style={{
                                    fontFamily: "var(--font-subjectivity), sans-serif",
                                    fontWeight: 700,
                                    color: "#27261C",
                                    letterSpacing: "-0.06em",
                                }}
                            >
                                Activities & Experiences
                            </h1>
                            <p className="text-base sm:text-lg text-[#686766] mt-3 max-w-2xl" style={{ fontWeight: 500 }}>
                                Explore a variety of curated experiences designed to immerse you in adventure, culture, and nature.
                            </p>
                        </div>
                    </div>

                    {/* Activity Cards Grid */}
                    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                            {activitiesData.map((activity) => (
                                <button
                                    key={activity.id}
                                    onClick={() => setSelectedActivityId(activity.id)}
                                    className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 aspect-square ${selectedActivityId === activity.id
                                        ? "ring-2 ring-[#FC611E] shadow-lg"
                                        : "hover:shadow-lg"
                                        }`}
                                >
                                    <img
                                        src={activity.image}
                                        alt={activity.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${selectedActivityId === activity.id ? "bg-black/0" : "group-hover:bg-black/40"}`} />
                                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                                        <h3
                                            className="text-sm sm:text-base font-semibold text-white drop-shadow-lg"
                                            style={{
                                                fontFamily: "var(--font-subjectivity), sans-serif",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {activity.title}
                                        </h3>
                                        <span
                                            className="text-xs font-semibold text-[#27261C] mt-2 inline-block bg-white/90 rounded-full px-2.5 py-1 w-fit"
                                            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
                                        >
                                            {activity.badge}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
                        {/* Main Content - Left */}
                        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
                            {/* Activity Highlights */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <HighlightCard icon={<Star className="w-5 h-5 sm:w-6 sm:h-6" />} label={selectedActivity.badge} />
                                <HighlightCard icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />} label={selectedActivity.duration} />
                                <HighlightCard icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />} label={selectedActivity.groupSize} />
                                <HighlightCard icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />} label={selectedActivity.difficulty} />
                            </div>

                            {/* About Section */}
                            <div>
                                <h2
                                    className="text-2xl sm:text-3xl font-semibold mb-4 text-[#27261C]"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    About {selectedActivity.title}
                                </h2>
                                <p
                                    className="text-base sm:text-lg text-[#686766] leading-relaxed"
                                    style={{ fontWeight: 500, lineHeight: "1.8" }}
                                >
                                    {selectedActivity.description}
                                </p>
                            </div>

                            {/* Highlights Section */}
                            <div>
                                <h3
                                    className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-[#27261C]"
                                    style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                >
                                    What to Expect
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {selectedActivity.highlights.map((highlight, idx) => (
                                        <ExpectItem key={idx} text={highlight} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right */}
                        <div className="lg:col-span-1">
                            {/* Coming Soon Card */}
                            <div className="sticky top-24 bg-linear-to-br from-[#FC611E]/10 via-[#4F87C7]/10 to-[#2D7A3E]/10 border-2 border-[#DDE7E0] rounded-3xl p-8 sm:p-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="inline-flex h-4 w-4 rounded-sm bg-[#FC611E]" />
                                    <p
                                        className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
                                        style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                    >
                                        Coming Soon
                                    </p>
                                </div>

                                <h3
                                    className="text-xl sm:text-2xl font-semibold mb-3 text-[#27261C]"
                                    style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                >
                                    Booking Coming
                                </h3>

                                <p className="text-sm sm:text-base text-[#686766] mb-6 leading-relaxed" style={{ fontWeight: 500 }}>
                                    We're finalizing the booking experience for this activity. Get notified when it's available.
                                </p>

                                {/* Info Items */}
                                <div className="space-y-4 mb-6 sm:mb-8">
                                    <InfoItem label="Duration" value={selectedActivity.duration} />
                                    <InfoItem label="Difficulty" value={selectedActivity.difficulty} />
                                    <InfoItem label="Group Size" value={selectedActivity.groupSize} />
                                    <InfoItem label="Category" value={selectedActivity.badge} />
                                </div>

                                {/* CTA Button */}
                                <button
                                    className="w-full bg-[#FC611E] hover:bg-[#f46a2f] text-white py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 700 }}
                                    onClick={() => {
                                        setNotifyFeature(`${selectedActivity.title} booking`);
                                        setNotifyOpen(true);
                                    }}
                                >
                                    Notify Me
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
                    <h2
                        className="text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-10"
                        style={{
                            fontFamily: "var(--font-subjectivity), sans-serif",
                            fontWeight: 700,
                            color: "#27261C",
                            letterSpacing: "-0.04em",
                        }}
                    >
                        Common Questions
                    </h2>

                    <div className="space-y-4">
                        <FAQItem
                            question="What should I bring?"
                            answer="Comfortable clothing, sturdy shoes, sunscreen, and a water bottle. More details will be provided specific to your chosen activity."
                        />
                        <FAQItem
                            question="Are these activities suitable for beginners?"
                            answer="Yes! Most of our activities are designed for all experience levels. We have different difficulty options and professional guides to support you."
                        />
                        <FAQItem
                            question="What's the best time to visit?"
                            answer="Each activity has optimal seasons. We'll provide personalized recommendations based on your preferred activity and travel dates."
                        />
                        <FAQItem
                            question="Can we arrange private group experiences?"
                            answer="Absolutely! We offer customized experiences for groups. Contact us for tailored packages and private group arrangements."
                        />
                    </div>
                </section>
                <NotifyModal
                    open={notifyOpen}
                    feature={notifyFeature}
                    onClose={() => setNotifyOpen(false)}
                />
            </main>
        </div>
    );
}

export default function ActivitiesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ActivitiesContent />
        </Suspense>
    );
}

function HighlightCard({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="bg-white border-2 border-[#DDE7E0] rounded-2xl p-4 sm:p-5 text-center hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-2 text-[#FC611E]">{icon}</div>
            <p className="text-xs sm:text-sm font-semibold text-[#27261C]" style={{ fontWeight: 600 }}>
                {label}
            </p>
        </div>
    );
}

function ExpectItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC611E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-[#FC611E]" />
            </div>
            <span className="text-base sm:text-lg text-[#27261C]" style={{ fontWeight: 500 }}>
                {text}
            </span>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white/50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-[#686766] mb-1" style={{ fontWeight: 500 }}>
                {label}
            </p>
            <p className="text-sm sm:text-base font-semibold text-[#27261C]" style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}>
                {value}
            </p>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="bg-white border-2 border-[#DDE7E0] rounded-2xl p-6 sm:p-7 hover:border-[#FC611E] hover:shadow-lg transition-all duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-[#27261C] mb-2" style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}>
                {question}
            </h3>
            <p className="text-sm sm:text-base text-[#686766]" style={{ fontWeight: 500, lineHeight: "1.6" }}>
                {answer}
            </p>
        </div>
    );
}
