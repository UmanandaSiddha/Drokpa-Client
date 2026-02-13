"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";

export type ToastType = "info" | "success" | "error" | "warning";
export type ToastSide = "left" | "right";
export type ToastPosition = "top" | "bottom";

export type ToastData = {
    id: string;
    type: ToastType;
    side: ToastSide;
    position: ToastPosition;
    title?: string;
    message: string;
    durationMs: number;
    createdAt: number;
};

type ToastItemProps = {
    toast: ToastData;
    onRemove: (id: string) => void;
};

const TYPE_STYLES: Record<ToastType, {
    border: string;
    accent: string;
    text: string;
    icon: React.ReactNode;
}> = {
    info: {
        border: "border-[#4F87C7]/50",
        accent: "bg-[#4F87C7]",
        text: "text-[#4F87C7]",
        icon: <Info className="h-5 w-5" />,
    },
    success: {
        border: "border-[#005246]/50",
        accent: "bg-[#005246]",
        text: "text-[#005246]",
        icon: <CheckCircle className="h-5 w-5" />,
    },
    warning: {
        border: "border-[#FC611E]/60",
        accent: "bg-[#FC611E]",
        text: "text-[#FC611E]",
        icon: <AlertTriangle className="h-5 w-5" />,
    },
    error: {
        border: "border-[#E1483F]/60",
        accent: "bg-[#E1483F]",
        text: "text-[#E1483F]",
        icon: <XCircle className="h-5 w-5" />,
    },
};

export default function ToastItem({ toast, onRemove }: ToastItemProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [remaining, setRemaining] = useState(toast.durationMs);
    const lastTickRef = useRef<number | null>(null);
    const closeRequested = useRef(false);

    const requestClose = () => {
        if (closeRequested.current) return;
        closeRequested.current = true;
        setIsClosing(true);
        window.setTimeout(() => onRemove(toast.id), 220);
    };

    useEffect(() => {
        if (isPaused) return;

        const interval = window.setInterval(() => {
            const now = Date.now();
            if (lastTickRef.current === null) {
                lastTickRef.current = now;
                return;
            }
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;
            setRemaining((prev) => {
                const next = prev - delta;
                if (next <= 0) {
                    requestClose();
                    return 0;
                }
                return next;
            });
        }, 120);

        return () => {
            window.clearInterval(interval);
            lastTickRef.current = null;
        };
    }, [isPaused]);

    const style = TYPE_STYLES[toast.type];
    const motionClass = toast.side === "right"
        ? isClosing
            ? "toast-out-right"
            : "toast-in-right"
        : isClosing
            ? "toast-out-left"
            : "toast-in-left";

    return (
        <div
            className={`toast-item ${motionClass} relative rounded-2xl border bg-white/95 px-4 py-3 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.45)] ${style.border}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <button
                className="absolute -top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DDE7E0] bg-white text-[#686766] shadow-sm sm:hidden"
                onClick={requestClose}
                aria-label="Dismiss toast"
            >
                <X className="h-4 w-4" />
            </button>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${style.text}`}>
                        {style.icon}
                    </span>
                    <div className="space-y-1">
                        {toast.title && (
                            <p className={`text-sm ${style.text}`} style={{ fontWeight: 700 }}>
                                {toast.title}
                            </p>
                        )}
                        <p className={`text-xs ${style.text}`} style={{ fontWeight: 600, lineHeight: "1.5", opacity: 0.85 }}>
                            {toast.message}
                        </p>
                    </div>
                </div>
                <button
                    className="relative h-10 w-10 rounded-full border border-transparent text-[#686766] transition hover:border-[#DDE7E0]"
                    style={{ fontWeight: 600 }}
                    onClick={requestClose}
                    aria-label="Dismiss toast"
                >
                    <span
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPaused ? "opacity-0" : "opacity-100"}`}
                    >
                        <svg className="h-8 w-8" viewBox="0 0 40 40">
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="#DDE7E0"
                                strokeWidth="3"
                            />
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={2 * Math.PI * 16}
                                strokeDashoffset={(2 * Math.PI * 16) * (1 - remaining / toast.durationMs)}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 0.2s linear" }}
                            />
                        </svg>
                    </span>
                    <span
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPaused ? "opacity-100" : "opacity-0"}`}
                    >
                        <X className="h-4 w-4" />
                    </span>
                </button>
            </div>
            <div className="sr-only" aria-live="polite">
                {Math.max(0, Math.round(remaining / 1000))} seconds remaining
            </div>
        </div>
    );
}
