"use client";

import { useState } from "react";
import {
    Bell,
    Bookmark,
    Calendar,
    CreditCard,
    FileText,
    Heart,
    MapPin,
    MessageSquare,
    Settings,
    Star,
    Ticket,
    User,
} from "lucide-react";

const user = {
    name: "Tenzin Dorjee",
    location: "Tawang, Arunachal Pradesh",
    memberSince: "Member since 2022",
    level: "Explorer",
};

const initialBookings = [
    {
        id: "BKG-2194",
        title: "Tawang Monastery Trail",
        date: "Mar 12 - Mar 16",
        status: "Confirmed",
        type: "Tour",
    },
    {
        id: "BKG-2031",
        title: "Sangti Valley Homestay",
        date: "Apr 4 - Apr 6",
        status: "Pending",
        type: "Homestay",
    },
];

const initialIlpItems = [
    {
        id: "ILP-9842",
        region: "West Kameng",
        status: "Approved",
        expiry: "Valid till Apr 22",
    },
    {
        id: "ILP-9910",
        region: "Tawang",
        status: "In review",
        expiry: "Processing",
    },
];

const initialBucketItems = [
    {
        id: "BK-1",
        title: "Dirang River View Room",
        category: "Homestay",
        meta: "2 guests · 1 night",
    },
    {
        id: "BK-2",
        title: "Bum La Pass Day Tour",
        category: "Tour",
        meta: "Full day · 12 slots",
    },
    {
        id: "BK-3",
        title: "Sela Lake Sunrise Trek",
        category: "Trek",
        meta: "Moderate · 8 km",
    },
];

const initialPreferences = [
    { label: "Trip alerts", status: "Enabled" },
    { label: "Price drops", status: "Enabled" },
    { label: "Review reminders", status: "Paused" },
];

const initialLikes = [
    {
        id: "LK-1",
        title: "Zemithang Homestay",
        meta: "Saved 2 days ago",
    },
    {
        id: "LK-2",
        title: "Tawang Heritage Walk",
        meta: "Saved last week",
    },
];

const initialReviews = [
    {
        id: "RV-1",
        title: "Dirang Hot Springs",
        meta: "4.8 rating · 2 comments",
    },
];

const initialArticles = [
    {
        id: "AR-1",
        title: "Checklist: Winter travel in Arunachal",
        meta: "Draft",
    },
    {
        id: "AR-2",
        title: "Photographing monasteries respectfully",
        meta: "Published",
    },
];

const initialPayments = [
    {
        id: "PM-1",
        label: "Visa •••• 4628",
        status: "Primary",
    },
    {
        id: "PM-2",
        label: "UPI - tenzin@upi",
        status: "Backup",
    },
];

export default function AccountPage() {
    const [activeSection, setActiveSection] = useState<
        | "overview"
        | "bookings"
        | "bucket"
        | "likes"
        | "reviews"
        | "articles"
        | "payments"
        | "notifications"
        | "settings"
    >("overview");
    const [activeModal, setActiveModal] = useState<
        | null
        | "bookings"
        | "ilp"
        | "bucket"
        | "likes"
        | "reviews"
        | "articles"
        | "payments"
        | "notifications"
        | "settings"
    >(null);
    const [bookings] = useState(initialBookings);
    const [ilpItems] = useState(initialIlpItems);
    const [bucketItems, setBucketItems] = useState(initialBucketItems);
    const [preferences, setPreferences] = useState(initialPreferences);
    const [likes, setLikes] = useState(initialLikes);
    const [reviews] = useState(initialReviews);
    const [articles] = useState(initialArticles);
    const [payments, setPayments] = useState(initialPayments);
    const [profileStatus, setProfileStatus] = useState("Available for new trips");

    const handleRemoveBucket = (id: string) => {
        setBucketItems((prev) => prev.filter((item) => item.id !== id));
    };

    const togglePreference = (label: string) => {
        setPreferences((prev) =>
            prev.map((pref) =>
                pref.label === label
                    ? {
                        ...pref,
                        status: pref.status === "Enabled" ? "Paused" : "Enabled",
                    }
                    : pref
            )
        );
    };

    const setPrimaryPayment = (id: string) => {
        setPayments((prev) =>
            prev.map((pay) => ({
                ...pay,
                status: pay.id === id ? "Primary" : "Backup",
            }))
        );
    };

    const openModal = (key: NonNullable<typeof activeModal>) => {
        setActiveModal(key);
    };

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
            <main className="pt-24 pb-16">
                <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
                    <div className="mb-10">
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl"
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                                color: "#27261C",
                                letterSpacing: "-0.06em",
                            }}
                        >
                            Your Profile
                        </h1>
                        <p className="text-base sm:text-lg text-[#686766] mt-3 max-w-2xl" style={{ fontWeight: 500 }}>
                            Track bookings, manage ILP permits, and keep your bucket ready for the next trip.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                        <aside className="space-y-6">
                            <div className="bg-white border border-[#DDE7E0]/70 rounded-3xl p-6 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.3)]">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-[#F5F1E6] flex items-center justify-center text-[#005246]">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-[#27261C]" style={{ fontWeight: 700 }}>
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-[#686766]" style={{ fontWeight: 500 }}>
                                            {user.memberSince}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-[#686766]" style={{ fontWeight: 500 }}>
                                    <MapPin className="w-4 h-4" />
                                    {user.location}
                                </div>
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#005246] text-white text-xs">
                                    <Star className="w-3.5 h-3.5" />
                                    {user.level}
                                </div>
                                <div className="mt-5 rounded-2xl border border-[#F5F1E6] px-4 py-3">
                                    <p className="text-xs text-[#686766]" style={{ fontWeight: 600 }}>
                                        Status
                                    </p>
                                    <input
                                        value={profileStatus}
                                        onChange={(e) => setProfileStatus(e.target.value)}
                                        className="mt-2 w-full bg-transparent text-sm text-[#27261C] outline-none"
                                        style={{ fontWeight: 600 }}
                                    />
                                </div>
                            </div>

                            <div className="bg-white border border-[#DDE7E0]/70 rounded-3xl p-5 space-y-4">
                                <SidebarItem
                                    active={activeSection === "overview"}
                                    icon={<User className="w-4 h-4" />}
                                    label="Overview"
                                    onClick={() => setActiveSection("overview")}
                                />
                                <SidebarItem
                                    active={activeSection === "bookings"}
                                    icon={<Calendar className="w-4 h-4" />}
                                    label="Bookings & ILP"
                                    onClick={() => setActiveSection("bookings")}
                                />
                                <SidebarItem
                                    active={activeSection === "bucket"}
                                    icon={<Bookmark className="w-4 h-4" />}
                                    label="Bucket"
                                    onClick={() => setActiveSection("bucket")}
                                />
                                <SidebarItem
                                    active={activeSection === "likes"}
                                    icon={<Heart className="w-4 h-4" />}
                                    label="Likes"
                                    onClick={() => setActiveSection("likes")}
                                />
                                <SidebarItem
                                    active={activeSection === "reviews"}
                                    icon={<MessageSquare className="w-4 h-4" />}
                                    label="Reviews"
                                    onClick={() => setActiveSection("reviews")}
                                />
                                <SidebarItem
                                    active={activeSection === "articles"}
                                    icon={<FileText className="w-4 h-4" />}
                                    label="Articles"
                                    onClick={() => setActiveSection("articles")}
                                />
                                <SidebarItem
                                    active={activeSection === "payments"}
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="Payments"
                                    onClick={() => setActiveSection("payments")}
                                />
                                <SidebarItem
                                    active={activeSection === "notifications"}
                                    icon={<Bell className="w-4 h-4" />}
                                    label="Notifications"
                                    onClick={() => setActiveSection("notifications")}
                                />
                                <SidebarItem
                                    active={activeSection === "settings"}
                                    icon={<Settings className="w-4 h-4" />}
                                    label="Settings"
                                    onClick={() => setActiveSection("settings")}
                                />
                            </div>
                        </aside>

                        <section className="space-y-8">
                            {activeSection === "overview" && (
                                <>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Card title="Upcoming bookings" icon={<Ticket className="w-4 h-4" />} onManage={() => openModal("bookings")}>
                                            {bookings.map((booking) => (
                                                <RowItem
                                                    key={booking.id}
                                                    title={booking.title}
                                                    meta={`${booking.date} · ${booking.type}`}
                                                    badge={booking.status}
                                                />
                                            ))}
                                        </Card>
                                        <Card title="Inner Line Permit" icon={<FileText className="w-4 h-4" />} onManage={() => openModal("ilp")}>
                                            {ilpItems.map((permit) => (
                                                <RowItem
                                                    key={permit.id}
                                                    title={permit.region}
                                                    meta={permit.expiry}
                                                    badge={permit.status}
                                                />
                                            ))}
                                        </Card>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Card title="Bucket" icon={<Bookmark className="w-4 h-4" />} onManage={() => openModal("bucket")}>
                                            {bucketItems.map((item) => (
                                                <RowItem
                                                    key={item.id}
                                                    title={item.title}
                                                    meta={`${item.category} · ${item.meta}`}
                                                />
                                            ))}
                                        </Card>
                                        <Card title="Likes & Reviews" icon={<Heart className="w-4 h-4" />} onManage={() => openModal("likes")}>
                                            {likes.map((item) => (
                                                <RowItem key={item.id} title={item.title} meta={item.meta} />
                                            ))}
                                            {reviews.map((item) => (
                                                <RowItem key={item.id} title={item.title} meta={item.meta} />
                                            ))}
                                        </Card>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Card title="Notification preferences" icon={<Bell className="w-4 h-4" />} onManage={() => openModal("notifications")}>
                                            {preferences.map((pref) => (
                                                <RowItem key={pref.label} title={pref.label} meta={pref.status} />
                                            ))}
                                        </Card>
                                        <Card title="Payment methods" icon={<CreditCard className="w-4 h-4" />} onManage={() => openModal("payments")}>
                                            {payments.map((pay) => (
                                                <RowItem key={pay.id} title={pay.label} meta={pay.status} />
                                            ))}
                                        </Card>
                                    </div>

                                    <Card title="Articles & Posts" icon={<FileText className="w-4 h-4" />} onManage={() => openModal("articles")}>
                                        {articles.map((article) => (
                                            <RowItem key={article.id} title={article.title} meta={article.meta} />
                                        ))}
                                    </Card>
                                </>
                            )}

                            {activeSection === "bookings" && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card title="Upcoming bookings" icon={<Ticket className="w-4 h-4" />} onManage={() => openModal("bookings")}>
                                        {bookings.map((booking) => (
                                            <RowItem
                                                key={booking.id}
                                                title={booking.title}
                                                meta={`${booking.date} · ${booking.type}`}
                                                badge={booking.status}
                                            />
                                        ))}
                                    </Card>
                                    <Card title="Inner Line Permit" icon={<FileText className="w-4 h-4" />} onManage={() => openModal("ilp")}>
                                        {ilpItems.map((permit) => (
                                            <RowItem
                                                key={permit.id}
                                                title={permit.region}
                                                meta={permit.expiry}
                                                badge={permit.status}
                                            />
                                        ))}
                                    </Card>
                                </div>
                            )}

                            {activeSection === "bucket" && (
                                <Card title="Bucket" icon={<Bookmark className="w-4 h-4" />} onManage={() => openModal("bucket")}>
                                    {bucketItems.length === 0 ? (
                                        <EmptyState title="Your bucket is clear" message="Save rooms and tours to plan your next trip." />
                                    ) : (
                                        bucketItems.map((item) => (
                                            <RowItem
                                                key={item.id}
                                                title={item.title}
                                                meta={`${item.category} · ${item.meta}`}
                                                actionLabel="Remove"
                                                onAction={() => handleRemoveBucket(item.id)}
                                            />
                                        ))
                                    )}
                                </Card>
                            )}

                            {activeSection === "likes" && (
                                <Card title="Likes" icon={<Heart className="w-4 h-4" />} onManage={() => openModal("likes")}>
                                    {likes.map((item) => (
                                        <RowItem key={item.id} title={item.title} meta={item.meta} />
                                    ))}
                                </Card>
                            )}

                            {activeSection === "reviews" && (
                                <Card title="Reviews" icon={<MessageSquare className="w-4 h-4" />} onManage={() => openModal("reviews")}>
                                    {reviews.map((item) => (
                                        <RowItem key={item.id} title={item.title} meta={item.meta} />
                                    ))}
                                </Card>
                            )}

                            {activeSection === "articles" && (
                                <Card title="Articles & Posts" icon={<FileText className="w-4 h-4" />} onManage={() => openModal("articles")}>
                                    {articles.map((article) => (
                                        <RowItem key={article.id} title={article.title} meta={article.meta} />
                                    ))}
                                </Card>
                            )}

                            {activeSection === "payments" && (
                                <Card title="Payment methods" icon={<CreditCard className="w-4 h-4" />} onManage={() => openModal("payments")}>
                                    {payments.map((pay) => (
                                        <RowItem
                                            key={pay.id}
                                            title={pay.label}
                                            meta={pay.status}
                                            actionLabel={pay.status === "Primary" ? "Primary" : "Make primary"}
                                            onAction={() => setPrimaryPayment(pay.id)}
                                            disabled={pay.status === "Primary"}
                                        />
                                    ))}
                                </Card>
                            )}

                            {activeSection === "notifications" && (
                                <Card title="Notification preferences" icon={<Bell className="w-4 h-4" />} onManage={() => openModal("notifications")}>
                                    {preferences.map((pref) => (
                                        <RowItem
                                            key={pref.label}
                                            title={pref.label}
                                            meta={pref.status}
                                            actionLabel={pref.status === "Enabled" ? "Pause" : "Enable"}
                                            onAction={() => togglePreference(pref.label)}
                                        />
                                    ))}
                                </Card>
                            )}

                            {activeSection === "settings" && (
                                <Card title="Settings" icon={<Settings className="w-4 h-4" />} onManage={() => openModal("settings")} manageLabel="Edit">
                                    <div className="space-y-4">
                                        <InputRow label="Full name" value={user.name} />
                                        <InputRow label="Home base" value={user.location} />
                                        <InputRow label="Travel style" value="Balanced" />
                                        <div className="flex flex-wrap gap-3">
                                            <button className="px-4 py-2 rounded-full bg-[#005246] text-white text-xs" style={{ fontWeight: 600 }}>
                                                Save changes
                                            </button>
                                            <button className="px-4 py-2 rounded-full border border-[#DDE7E0] text-xs text-[#27261C]" style={{ fontWeight: 600 }}>
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </section>
                    </div>
                </div>
            </main>
            {activeModal && (
                <Modal title={getModalTitle(activeModal)} onClose={() => setActiveModal(null)}>
                    <ModalBody modalKey={activeModal} />
                </Modal>
            )}
        </div>
    );
}

function SidebarItem({
    icon,
    label,
    active,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between text-left text-sm ${active ? "text-[#005246]" : "text-[#27261C]"}`}
        >
            <span className="inline-flex items-center gap-2" style={{ fontWeight: 600 }}>
                <span className={active ? "text-[#005246]" : "text-[#005246]/70"}>{icon}</span>
                {label}
            </span>
            <span className={`text-xs ${active ? "text-[#005246]" : "text-[#686766]"}`}>{active ? "Active" : "View"}</span>
        </button>
    );
}

function Card({
    title,
    icon,
    children,
    onManage,
    manageLabel = "Manage",
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onManage?: () => void;
    manageLabel?: string;
}) {
    return (
        <div className="bg-white border border-[#DDE7E0]/70 rounded-3xl p-6 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 text-[#27261C] text-sm" style={{ fontWeight: 700 }}>
                    <span className="text-[#005246]">{icon}</span>
                    {title}
                </div>
                {onManage && (
                    <button className="text-xs text-[#686766]" style={{ fontWeight: 600 }} onClick={onManage}>
                        {manageLabel}
                    </button>
                )}
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function RowItem({
    title,
    meta,
    badge,
    actionLabel,
    onAction,
    disabled,
}: {
    title: string;
    meta: string;
    badge?: string;
    actionLabel?: string;
    onAction?: () => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#F5F1E6] px-4 py-3">
            <div>
                <p className="text-sm text-[#27261C]" style={{ fontWeight: 600 }}>
                    {title}
                </p>
                <p className="text-xs text-[#686766]" style={{ fontWeight: 500 }}>
                    {meta}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {badge && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#F5F1E6] text-[#27261C]" style={{ fontWeight: 600 }}>
                        {badge}
                    </span>
                )}
                {actionLabel && (
                    <button
                        onClick={onAction}
                        disabled={disabled}
                        className={`text-xs px-3 py-1 rounded-full border ${disabled ? "border-[#DDE7E0] text-[#686766]" : "border-[#005246] text-[#005246]"}`}
                        style={{ fontWeight: 600 }}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}

function InputRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-[#686766]" style={{ fontWeight: 600 }}>
                {label}
            </p>
            <input
                defaultValue={value}
                className="mt-2 w-full rounded-2xl border border-[#F5F1E6] px-4 py-3 text-sm text-[#27261C] outline-none"
                style={{ fontWeight: 600 }}
            />
        </div>
    );
}

function EmptyState({ title, message }: { title: string; message: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-[#DDE7E0] px-4 py-6 text-center">
            <p className="text-sm text-[#27261C]" style={{ fontWeight: 700 }}>
                {title}
            </p>
            <p className="text-xs text-[#686766] mt-2" style={{ fontWeight: 500 }}>
                {message}
            </p>
        </div>
    );
}

function getModalTitle(key: NonNullable<React.ComponentProps<typeof ModalBody>["modalKey"]>) {
    switch (key) {
        case "bookings":
            return "Manage bookings";
        case "ilp":
            return "Manage ILP";
        case "bucket":
            return "Manage bucket";
        case "likes":
            return "Manage likes";
        case "reviews":
            return "Manage reviews";
        case "articles":
            return "Manage articles";
        case "payments":
            return "Manage payments";
        case "notifications":
            return "Manage notifications";
        case "settings":
            return "Edit settings";
        default:
            return "Manage";
    }
}

function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg text-[#27261C]" style={{ fontWeight: 700 }}>
                        {title}
                    </h2>
                    <button className="text-sm text-[#686766]" style={{ fontWeight: 600 }} onClick={onClose}>
                        Close
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}

function ModalBody({ modalKey }: { modalKey: "bookings" | "ilp" | "bucket" | "likes" | "reviews" | "articles" | "payments" | "notifications" | "settings" }) {
    const messageMap: Record<typeof modalKey, { title: string; description: string }> = {
        bookings: {
            title: "Booking controls",
            description: "Reschedule, cancel, or contact support for active bookings.",
        },
        ilp: {
            title: "ILP status",
            description: "Upload documents or request updates for active permits.",
        },
        bucket: {
            title: "Bucket manager",
            description: "Organize saved items and prepare your next trip.",
        },
        likes: {
            title: "Liked items",
            description: "Manage your liked stays, tours, and treks.",
        },
        reviews: {
            title: "Review center",
            description: "Edit or remove feedback you have shared.",
        },
        articles: {
            title: "Articles and posts",
            description: "Publish drafts, edit writing, or start a new post.",
        },
        payments: {
            title: "Payment methods",
            description: "Add, remove, or set your primary payment method.",
        },
        notifications: {
            title: "Notifications",
            description: "Choose how you want to hear from us.",
        },
        settings: {
            title: "Profile settings",
            description: "Update profile details and account preferences.",
        },
    };

    const content = messageMap[modalKey];

    return (
        <div className="rounded-2xl border border-[#F5F1E6] bg-[#F5F1E6]/40 p-5">
            <p className="text-sm text-[#27261C]" style={{ fontWeight: 700 }}>
                {content.title}
            </p>
            <p className="text-sm text-[#686766] mt-2" style={{ fontWeight: 500 }}>
                {content.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full bg-[#005246] text-white text-xs" style={{ fontWeight: 600 }}>
                    Open manager
                </button>
                <button className="px-4 py-2 rounded-full border border-[#DDE7E0] text-xs text-[#27261C]" style={{ fontWeight: 600 }}>
                    View details
                </button>
            </div>
        </div>
    );
}
