"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastItem, { ToastData, ToastPosition, ToastSide, ToastType } from "@/components/Toast";

type ToastOptions = {
    type?: ToastType;
    side?: ToastSide;
    position?: ToastPosition;
    title?: string;
    message: string;
    durationMs?: number;
};

type ToastContextValue = {
    toasts: ToastData[];
    addToast: (options: ToastOptions) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const addToast = useCallback((options: ToastOptions) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const toast: ToastData = {
            id,
            type: options.type ?? "info",
            side: options.side ?? "right",
            position: options.position ?? "top",
            title: options.title,
            message: options.message,
            durationMs: options.durationMs ?? 10000,
            createdAt: Date.now(),
        };
        setToasts((prev) => [...prev, toast]);
        return id;
    }, []);

    const value = useMemo(
        () => ({ toasts, addToast, removeToast, clearToasts }),
        [toasts, addToast, removeToast, clearToasts]
    );

    const grouped = {
        topLeft: toasts.filter((t) => t.position === "top" && t.side === "left"),
        topRight: toasts.filter((t) => t.position === "top" && t.side === "right"),
        bottomLeft: toasts.filter((t) => t.position === "bottom" && t.side === "left"),
        bottomRight: toasts.filter((t) => t.position === "bottom" && t.side === "right"),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport position="top" side="left" toasts={grouped.topLeft} onRemove={removeToast} />
            <ToastViewport position="top" side="right" toasts={grouped.topRight} onRemove={removeToast} />
            <ToastViewport position="bottom" side="left" toasts={grouped.bottomLeft} onRemove={removeToast} />
            <ToastViewport position="bottom" side="right" toasts={grouped.bottomRight} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastViewport({
    position,
    side,
    toasts,
    onRemove,
}: {
    position: ToastPosition;
    side: ToastSide;
    toasts: ToastData[];
    onRemove: (id: string) => void;
}) {
    if (!toasts.length) return null;

    const positionClass = position === "top" ? "top-20" : "bottom-6";
    const sideClass = side === "right" ? "right-4 sm:right-6" : "left-4 sm:left-6";

    return (
        <div className={`fixed ${positionClass} ${sideClass} z-50 flex w-[90vw] max-w-sm flex-col gap-3`}
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}
