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
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Get in <span className="text-[#005246]">Touch</span>
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-md">
            Have questions about trips, bookings, or our services?
            Our team is here to help you.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#005246]/10 text-[#005246]">
                <Mail size={22} />
              </div>
              <span className="text-gray-700">dokpa@gmail.com</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#005246]/10 text-[#005246]">
                <Phone size={22} />
              </div>
              <span className="text-gray-700">+91 8119984614</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#005246]/10 text-[#005246]">
                <MapPin size={22} />
              </div>
              <span className="text-gray-700">
                Tawang, Arunachal Pradesh, India
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT – FORM */}
        <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-lg border">
          <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#005246] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#005246] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#005246] outline-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#005246] text-white py-3 rounded-lg font-semibold hover:bg-[#00735f] transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
