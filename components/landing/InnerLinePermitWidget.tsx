"use client";

import Link from "next/link";

type InnerLinePermitWidgetProps = {
    className?: string;
};

const InnerLinePermitWidget = ({ className }: InnerLinePermitWidgetProps) => {
    return (
        <div
            className={`z-30 bg-white/85 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-white/60 w-[240px] sm:w-[260px] ${className ?? ""}`}
            style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500, color: "#27261C" }}
        >
            <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#FC611E]" />
                <p
                    className="text-[11px] uppercase tracking-wider text-[#686766]"
                    style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                >
                    Inner Line Permit
                </p>
            </div>
            <p
                className="mt-2 text-sm leading-snug"
                style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700, color: "#353030" }}
            >
                Apply fast and travel with ease in Arunachal.
            </p>
            <p
                className="mt-1 text-xs text-[#686766]"
                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
            >
                Required for entry. Instant guidance.
            </p>
            <Link
                href="/ilp"
                className="inline-flex mt-3 items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold bg-[#FC611E] text-[#27261C] hover:bg-[#f46a2f] transition-colors"
                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 700 }}
            >
                Start ILP Application
            </Link>
        </div>
    );
};

export default InnerLinePermitWidget;
