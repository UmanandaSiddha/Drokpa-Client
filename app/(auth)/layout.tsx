import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div
            className="min-h-screen bg-white"
            style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}
        >
            {children}
        </div>
    );
}
