export default function IlpSection() {
    return (
        <section className="lg:hidden w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto mt-6 sm:mt-8">
            <div className="relative overflow-hidden rounded-2xl bg-[#F5F1E6]">
                <div className="absolute inset-0 bg-linear-to-br from-white/60 via-transparent to-[#DDE7E0]/40" />
                <div className="relative p-5 sm:p-7">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex w-4 h-4 sm:w-5 sm:h-5 bg-[#FC611E] rounded-sm" />
                        <span
                            className="text-xs uppercase tracking-widest text-[#686766]"
                            style={{
                                fontFamily: "var(--font-subjectivity), sans-serif",
                                fontWeight: 700,
                            }}
                        >
                            Inner Line Permit
                        </span>
                    </div>
                    <h2
                        className="text-[28px] sm:text-[32px] leading-tight"
                        style={{
                            fontFamily: "var(--font-subjectivity), sans-serif",
                            fontWeight: 700,
                            color: "#353030",
                            letterSpacing: "-0.06em",
                        }}
                    >
                        ILP made simple for Arunachal.
                    </h2>
                    <p
                        className="mt-2 text-sm sm:text-base"
                        style={{
                            fontFamily: "var(--font-mona-sans)",
                            fontWeight: 500,
                            color: "#686766",
                        }}
                    >
                        Apply in minutes, get clear guidance, and travel with confidence. Required for entry into Arunachal for most visitors.
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white/70 border border-white/70 p-3">
                            <p
                                className="text-xs uppercase tracking-wider text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                            >
                                Processing
                            </p>
                            <p
                                className="mt-1 text-sm"
                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}
                            >
                                Fast online approval
                            </p>
                        </div>
                        <div className="rounded-xl bg-white/70 border border-white/70 p-3">
                            <p
                                className="text-xs uppercase tracking-wider text-[#686766]"
                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600 }}
                            >
                                Coverage
                            </p>
                            <p
                                className="mt-1 text-sm"
                                style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 600, color: "#27261C" }}
                            >
                                All districts supported
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                            href="/ilp"
                            className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold bg-[#FC611E] text-[#27261C] hover:bg-[#f46a2f] transition-colors"
                            style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 700 }}
                        >
                            Start ILP Application
                        </a>
                        <span
                            className="text-xs text-[#686766]"
                            style={{ fontFamily: "var(--font-mona-sans)", fontWeight: 500 }}
                        >
                            Takes less than 5 minutes
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
