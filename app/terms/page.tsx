import Navigation from "@/components/landingpagecomponents/Navigation";
import Footer from "@/components/landingpagecomponents/Footer";
import MobileMenu from "@/components/MobileMenu";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

export const metadata = {
    title: "Terms of Service | Drokpa",
    description: "Terms of Service for Drokpa - Read our terms and conditions",
};

export default function TermsPage() {
    return (
        <MobileMenuProvider>
            <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
                <Navigation />
                <MobileMenu />
                <main className="relative min-h-screen bg-white pt-16">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white">
                        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
                            <div className="max-w-3xl">
                                <div className="flex items-center gap-2 mb-5 sm:mb-6">
                                    <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#FC611E]" />
                                    <p
                                        className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
                                        style={{ fontFamily: "var(--font-subjectivity), sans-serif", fontWeight: 700 }}
                                    >
                                        Legal
                                    </p>
                                </div>
                                <h1
                                    className="leading-[1.1] mb-6"
                                    style={{
                                        fontFamily: "var(--font-subjectivity), sans-serif",
                                        fontWeight: 700,
                                        fontSize: "clamp(36px, 7vw, 64px)",
                                        color: "#27261C",
                                        letterSpacing: "-0.06em",
                                    }}
                                >
                                    Terms of Service
                                </h1>
                                <p
                                    className="text-base sm:text-lg md:text-xl text-[#686766]"
                                    style={{ fontWeight: 500, lineHeight: "1.7" }}
                                >
                                    Please read these terms carefully before using Drokpa. By accessing and using this platform, you agree to be bound by these terms.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Content Section */}
                    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[900px] mx-auto py-12 sm:py-16 md:py-20">
                        <div className="space-y-10 sm:space-y-14">
                            <TermsSection title="1. Acceptance of Terms">
                                By accessing and using Drokpa (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </TermsSection>

                            <TermsSection title="2. Use License">
                                Permission is granted to temporarily download one copy of the materials (information or software) on Drokpa's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                                <ul className="list-disc list-inside space-y-2 mt-4 text-[#686766]">
                                    <li>Modify or copy the materials</li>
                                    <li>Use the materials for any commercial purpose or for any public display</li>
                                    <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                                    <li>Remove any copyright or other proprietary notations from the materials</li>
                                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                                </ul>
                            </TermsSection>

                            <TermsSection title="3. Disclaimer of Warranties">
                                The materials on Drokpa's website are provided on an 'as is' basis. Drokpa makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </TermsSection>

                            <TermsSection title="4. Limitations of Liability">
                                In no event shall Drokpa or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Drokpa's website, even if Drokpa or an authorized representative has been notified orally or in writing of the possibility of such damage.
                            </TermsSection>

                            <TermsSection title="5. Accuracy of Materials">
                                The materials appearing on Drokpa's website could include technical, typographical, or photographic errors. Drokpa does not warrant that any of the materials on its website are accurate, complete, or current. Drokpa may make changes to the materials contained on its website at any time without notice.
                            </TermsSection>

                            <TermsSection title="6. Materials and Links">
                                Drokpa has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Drokpa of the site. Use of any such linked website is at the user's own risk.
                            </TermsSection>

                            <TermsSection title="7. Modifications">
                                Drokpa may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                            </TermsSection>

                            <TermsSection title="8. Governing Law">
                                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                            </TermsSection>

                            <TermsSection title="9. User Conduct">
                                You agree that you will not use Drokpa to:
                                <ul className="list-disc list-inside space-y-2 mt-4 text-[#686766]">
                                    <li>Harass, threaten, or intimidate any other user</li>
                                    <li>Post spam, unsolicited advertising, or promotional materials</li>
                                    <li>Impersonate any person or entity</li>
                                    <li>Violate any applicable laws or regulations</li>
                                    <li>Infringe upon the rights of others</li>
                                </ul>
                            </TermsSection>

                            <TermsSection title="10. Contact Information">
                                If you have any questions about these Terms of Service, please contact us at:
                                <div className="mt-4 p-4 bg-[#F5F1E6] rounded-xl border border-[#DDE7E0]">
                                    <p className="text-[#27261C] font-semibold">Drokpa</p>
                                    <p className="text-[#686766]">Email: dokpa@gmail.com</p>
                                    <p className="text-[#686766]">Location: Tawang, Arunachal Pradesh, India</p>
                                </div>
                            </TermsSection>
                        </div>
                    </section>
                </main>
                <Footer showCta />
            </div>
        </MobileMenuProvider>
    );
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2
                className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-5"
                style={{
                    fontFamily: "var(--font-subjectivity), sans-serif",
                    fontWeight: 700,
                    color: "#27261C",
                    letterSpacing: "-0.04em",
                }}
            >
                {title}
            </h2>
            <div className="text-base sm:text-lg text-[#686766] leading-relaxed space-y-4" style={{ fontWeight: 500, lineHeight: "1.8" }}>
                {children}
            </div>
        </div>
    );
}
