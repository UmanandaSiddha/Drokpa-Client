"use client";

import React, { useState } from 'react';
import { ChevronRight, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      console.log('Email submitted:', email);
      setEmail('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* CTA Banner */}
      <div className="max-w-8xl w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Background Mountain Illustration */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute bottom-0 left-0 w-full h-full opacity-30" viewBox="0 0 1200 400" preserveAspectRatio="none">
              <path d="M0,400 L0,200 L300,100 L600,250 L900,50 L1200,200 L1200,400 Z" fill="currentColor" className="text-gray-900"/>
              <path d="M100,400 L100,300 L250,250 L400,320 L550,200 L700,280 L850,180 L1000,260 L1150,200 L1200,240 L1200,400 Z" fill="currentColor" className="text-gray-800 opacity-50"/>
            </svg>
            {/* Decorative dots pattern */}
            <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
              <div className="grid grid-cols-8 gap-2">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 px-6 sm:px-10 md:px-16 py-10 sm:py-12 md:py-16">
            {/* Left Quote Section */}
            <div className="flex-1 max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                "Where prayer flags color the wind and mountains remember."
              </h2>
            </div>

            {/* Right CTA Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl max-w-md w-full">
              {/* Progress Bar */}
              <div className="flex gap-2 mb-6">
                <div className="h-1 flex-1 bg-blue-500 rounded-full"></div>
                <div className="h-1 flex-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* Text Content */}
              <div className="mb-6">
                <p className="text-base sm:text-lg text-gray-900 leading-relaxed mb-2">
                  <span className="font-semibold">Explore Arunachal's mountains, cultures, and quiet paths.</span>
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  15% off all treks.
                </p>
              </div>

              {/* CTA Button */}
              <button className="w-full px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
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
            <div className="lg:col-span-1">
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
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="sm:col-span-1">
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Contact Us</a></li>
                <li><a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Experiences</a></li>
                <li><a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Treks</a></li>
                <li><a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Route Planner</a></li>
                <li><a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Blogs</a></li>
                <li><a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">Our Story</a></li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="sm:col-span-1">
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                    <Instagram className="w-5 h-5" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                    <Linkedin className="w-5 h-5" />
                    Linkedin
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                    <Youtube className="w-5 h-5" />
                    Youtube
                  </a>
                </li>
              </ul>
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