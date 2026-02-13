
export const metadata = {
    title: "Privacy Policy | Drokpa",
    description: "Privacy Policy for Drokpa - Learn how we protect your data",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-mona-sans), sans-serif" }}>
            <main className="relative min-h-screen bg-white pt-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white">
                    <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto py-12 sm:py-16 md:py-20">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 mb-5 sm:mb-6">
                                <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#4F87C7]" />
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
                                Privacy Policy
                            </h1>
                            <p
                                className="text-base sm:text-lg md:text-xl text-[#686766]"
                                style={{ fontWeight: 500, lineHeight: "1.7" }}
                            >
                                Your privacy is important to us. Please read this policy carefully to understand our practices regarding your personal data.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[900px] mx-auto py-12 sm:py-16 md:py-20">
                    <div className="space-y-10 sm:space-y-14">
                        <PrivacySection title="1. Introduction">
                            Drokpa ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                        </PrivacySection>

                        <PrivacySection title="2. Information We Collect">
                            We may collect information about you in a variety of ways. The information we may collect on the site includes:
                            <ul className="list-disc list-inside space-y-2 mt-4 text-[#686766]">
                                <li><strong>Personal Data:</strong> Name, email address, phone number, and other information you voluntarily provide</li>
                                <li><strong>Booking Information:</strong> Details about homestays or tours you book through our platform</li>
                                <li><strong>Device Information:</strong> IP address, browser type, operating system, and other technical data</li>
                                <li><strong>Location Data:</strong> Your general location based on IP address (with your consent)</li>
                                <li><strong>Communication Data:</strong> Records of your interactions with us</li>
                            </ul>
                        </PrivacySection>

                        <PrivacySection title="3. How We Use Your Information">
                            We use the information we collect in the following ways:
                            <ul className="list-disc list-inside space-y-2 mt-4 text-[#686766]">
                                <li>To provide and maintain our services</li>
                                <li>To process your transactions and send related information</li>
                                <li>To email you regarding your account or order</li>
                                <li>To fulfill and manage bookings</li>
                                <li>To generate a personal profile about you</li>
                                <li>To improve our website and services</li>
                                <li>To monitor and analyze trends, usage, and activities</li>
                                <li>To detect, prevent, and address technical and security issues</li>
                            </ul>
                        </PrivacySection>

                        <PrivacySection title="4. Disclosure of Your Information">
                            We may share your information in the following situations:
                            <ul className="list-disc list-inside space-y-2 mt-4 text-[#686766]">
                                <li><strong>With Service Providers:</strong> Third parties who assist us in operating our website and conducting our business</li>
                                <li><strong>With Homestay Owners:</strong> We share booking information with the homestay or tour operators involved in your reservation</li>
                                <li><strong>By Law:</strong> When required by law or to protect our rights</li>
                                <li><strong>With Your Consent:</strong> With your explicit permission for other uses</li>
                            </ul>
                        </PrivacySection>

                        <PrivacySection title="5. Security of Your Information">
                            We use administrative, technical, and physical security measures to protect your personal information. These security measures include SSL encryption for sensitive data transmitted over the internet. However, no method of transmission over the internet or electronic storage is 100% secure.
                        </PrivacySection>

                        <PrivacySection title="6. Cookies and Tracking Technologies">
                            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that include an anonymous unique identifier. Most web browsers can be set to refuse cookies, though this may limit your use of certain features of our site.
                        </PrivacySection>

                        <PrivacySection title="7. Your Privacy Rights">
                            Depending on your location, you may have the following rights:
                            <ul className="list-disc list-inside space-y-2 mt-4 text-[#686766]">
                                <li>The right to access your personal data</li>
                                <li>The right to correct inaccurate data</li>
                                <li>The right to request deletion of your data</li>
                                <li>The right to object to processing of your data</li>
                                <li>The right to request restriction of processing</li>
                                <li>The right to data portability</li>
                            </ul>
                        </PrivacySection>

                        <PrivacySection title="8. Data Retention">
                            We will retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including to satisfy any legal, accounting, or reporting requirements. The length of time we keep information varies depending on the context of the processing and our legal obligations.
                        </PrivacySection>

                        <PrivacySection title="9. Links To Other Websites">
                            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policy of any website before providing your personal information.
                        </PrivacySection>

                        <PrivacySection title="10. International Data Transfers">
                            Your information, including personal data, may be transferred to — and maintained in — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
                        </PrivacySection>

                        <PrivacySection title="11. Children's Privacy">
                            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have received personal information from a child under 18, we will delete such information promptly.
                        </PrivacySection>

                        <PrivacySection title="12. Changes To This Privacy Policy">
                            We may update this privacy policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new privacy policy on this page and updating the "Last Updated" date.
                        </PrivacySection>

                        <PrivacySection title="13. Contact Us">
                            If you have questions or comments about this privacy policy, please contact us at:
                            <div className="mt-4 p-4 bg-[#F5F1E6] rounded-xl border border-[#DDE7E0]">
                                <p className="text-[#27261C] font-semibold">Drokpa Privacy Team</p>
                                <p className="text-[#686766]">Email: dokpa@gmail.com</p>
                                <p className="text-[#686766]">Location: Tawang, Arunachal Pradesh, India</p>
                                <p className="text-[#686766] mt-2 text-sm">Last Updated: February 2026</p>
                            </div>
                        </PrivacySection>
                    </div>
                </section>
            </main>
        </div>
    );
}

function PrivacySection({ title, children }: { title: string; children: React.ReactNode }) {
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
