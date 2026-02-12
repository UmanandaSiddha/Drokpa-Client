"use client";

import type { ReactNode } from "react";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
    return <MobileMenuProvider>{children}</MobileMenuProvider>;
}
