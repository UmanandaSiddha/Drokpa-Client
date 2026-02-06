"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#F5F1E6] via-white to-white" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FC611E]/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#4F87C7]/10 blur-3xl" />

      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-[90%] max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex h-3 w-3 rounded-sm bg-[#FC611E]" />
              <p
                className="text-xs sm:text-sm tracking-widest uppercase text-[#686766]"
                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
              >
                Contact
              </p>
            </div>
            <h2
              className="leading-tight mb-4 sm:mb-5"
              style={{
                fontFamily: "var(--font-subjectivity), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(32px, 6vw, 54px)",
                color: "#353030",
                letterSpacing: "-0.06em",
              }}
            >
              Get in touch.
              <br />
              We are here to help.
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: "#686766", fontWeight: 500 }}
            >
              Have questions about trips, bookings, or our services?
              Share the details and we will get back to you with care.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-xs sm:text-sm text-[#686766]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#005246]" />
              Typical response time: within 24 hours.
            </div>

            <div className="mt-8 sm:mt-10 grid gap-4">
              <div className="flex items-center gap-4 rounded-2xl bg-white/85 border border-white/60 px-4 py-3 shadow-lg">
                <div className="p-2.5 rounded-full bg-[#005246]/10 text-[#005246]">
                  <Mail size={20} />
                </div>
                <span className="text-sm sm:text-base text-[#353030]" style={{ fontWeight: 600 }}>
                  dokpa@gmail.com
                </span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white/85 border border-white/60 px-4 py-3 shadow-lg">
                <div className="p-2.5 rounded-full bg-[#005246]/10 text-[#005246]">
                  <Phone size={20} />
                </div>
                <span className="text-sm sm:text-base text-[#353030]" style={{ fontWeight: 600 }}>
                  +91 8119984614
                </span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white/85 border border-white/60 px-4 py-3 shadow-lg">
                <div className="p-2.5 rounded-full bg-[#005246]/10 text-[#005246]">
                  <MapPin size={20} />
                </div>
                <span className="text-sm sm:text-base text-[#353030]" style={{ fontWeight: 600 }}>
                  Tawang, Arunachal Pradesh, India
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT – FORM */}
          <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/70">
            <h3
              className="text-xl sm:text-2xl mb-6"
              style={{
                fontFamily: "var(--font-subjectivity), sans-serif",
                fontWeight: 700,
                color: "#353030",
              }}
            >
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-xs sm:text-sm font-medium mb-2 text-[#686766]"
                  style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005246] focus:border-transparent bg-white"
                  style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium mb-2 text-[#686766]"
                  style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005246] focus:border-transparent bg-white"
                  style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium mb-2 text-[#686766]"
                  style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#005246] focus:border-transparent resize-none bg-white"
                  style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 500 }}
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#005246] text-white py-3 rounded-xl font-semibold hover:bg-[#004536] transition"
                style={{ fontFamily: "var(--font-mona-sans), sans-serif", fontWeight: 600 }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
