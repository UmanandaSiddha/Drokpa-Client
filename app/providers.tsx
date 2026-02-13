"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/hooks/useToast";

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
    return (
        <ToastProvider>{children}</ToastProvider>
    );
}
