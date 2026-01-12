"use client";

import React, { useState } from 'react';
import { ChevronRight, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import img1 from "@/assets/footer-image1.png";
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      console.log('Email submitted:', email);
      setEmail('');
    }
  };

  return (
    <div className="bg-linear-to-br from-gray-50 to-white">
      {/* CTA Banner */}
      <div className="max-w-8xl w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-[32px] overflow-hidden shadow-2xl min-h-[440px] md:min-h-[500px]">

          {/* Background */}
          <Image
            src={img1}
            alt="Mountains"
            fill
            className="object-cover mix-blend-multiply"
            priority
          />

          {/* Content wrapper */}
          <div className="relative z-10 flex w-full justify-between px-16 pt-14">

            {/* LEFT TEXT — TOP LEFT */}
            <div className="max-w-xl">
              <h2 className="text-[32px] sm:text-[38px] md:text-4xl font-semibold text-black leading-tight">
                “Where prayer flags color the wind and mountains remember.”
              </h2>
            </div>

            {/* RIGHT CARD — BIG & TOP ALIGNED */}
            <div className="bg-white rounded-4xl shadow-xl p-8 w-[320px] min-h-100 flex flex-col justify-between">

              {/* Progress bar */}
              <div className="flex gap-2">
                <span className="h-1.5 w-12 bg-blue-500 rounded-full"></span>
                <span className="h-1.5 w-12 bg-gray-300 rounded-full"></span>
              </div>

              {/* Text */}
              <div>
                <p className="text-3xl font-bold text-gray-700 mb-3">
                  Explore Arunachal’s mountains, cultures, and quiet paths.
                </p>

                <p className="text-2xl font-bold text-gray-700">
                  15% off all treks.
                </p>
              </div>

              {/* Button */}
              <button className="w-[60%] bg-orange-500 hover:bg-orange-600 text-black font-medium py-3 rounded-xl transition">
                Explore All
              </button>
            </div>

          </div>
        </div>
      </div>



      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-8xl w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Newsletter Section */}
            <div className="lg:col-span-1 pr-10">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Join the<br />Community
              </h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Enter Email"
                  className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  onClick={handleSubmit}
                  className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* Links Section (Quick + Social) */}
            <div className="lg:col-span-2 pl-10 ml-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 border-l border-gray-300 pl-8">

                {/* Quick Links */}
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Contact Us</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Experiences</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Treks</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Route Planner</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Blogs</a></li>
                  <li><a href="#" className="text-gray-700 hover:text-emerald-600 font-medium">Our Story</a></li>
                </ul>

                {/* Social Links */}
                <ul className="space-y-3 border-l border-gray-300 pl-8">
                  <li>
                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
                      <Facebook className="w-5 h-5" />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
                      <Instagram className="w-5 h-5" />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
                      <Linkedin className="w-5 h-5" />
                      Linkedin
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium">
                      <Youtube className="w-5 h-5" />
                      Youtube
                    </a>
                  </li>
                </ul>

              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
              <span>©Drokpa 2025. All rights reserved.</span>
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Company Details</a>
            </div>
            <div className="flex items-center gap-2">
              <span>Designed by</span>
              <span className="font-bold text-gray-900">UBY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}