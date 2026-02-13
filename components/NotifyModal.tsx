"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";

type NotifyModalProps = {
    open: boolean;
    feature: string;
    onClose: () => void;
    ctaLabel?: string;
};

export default function NotifyModal({
    open,
    feature,
    onClose,
    ctaLabel = "Get notified when available",
}: NotifyModalProps) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (!open) {
            setEmail("");
            setSubmitted(false);
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!email.trim()) return;
        setSubmitted(true);
        addToast({
            type: "error",
            side: "right",
            position: "bottom",
            title: "Waitlist confirmed",
            message: `We will notify you about ${feature}.`,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#686766]" style={{ fontWeight: 700 }}>
                            Waitlist
                        </p>
                        <h2
                            className="mt-2 text-xl"
                            style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#27261C" }}
                        >
                            Get notified when it is ready
                        </h2>
                        <p className="mt-2 text-sm text-[#686766]" style={{ fontWeight: 500 }}>
                            We will send updates about {feature}.
                        </p>
                    </div>
                    <button className="text-xs text-[#686766]" style={{ fontWeight: 600 }} onClick={onClose}>
                        Close
                    </button>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-xs text-[#686766]" style={{ fontWeight: 600 }}>
                        Email address
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            className="mt-2 w-full rounded-2xl border border-[#DDE7E0] px-4 py-3 text-sm text-[#27261C] outline-none"
                            style={{ fontWeight: 600 }}
                            required
                        />
                    </label>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={!email.trim()}
                            className="rounded-full bg-[#FC611E] px-5 py-2.5 text-xs text-white transition disabled:opacity-60"
                            style={{ fontWeight: 700 }}
                        >
                            {ctaLabel}
                        </button>
                        <button
                            type="button"
                            className="rounded-full border border-[#DDE7E0] px-5 py-2.5 text-xs text-[#27261C]"
                            style={{ fontWeight: 700 }}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {submitted && (
                    <p className="mt-4 text-xs text-[#005246]" style={{ fontWeight: 600 }}>
                        Thanks! You are on the waitlist.
                    </p>
                )}
            </div>
        </div>
    );
}
