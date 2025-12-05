"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Mountain,
  Users,
  Phone,
  Mail,
  Heart,
} from "lucide-react";
import { homestays, locations, HomestayType } from "@/data/homestays";

const Homestays: React.FC = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "parking":
      case "car":
        return <Car className="w-4 h-4" />;
      case "meals":
      case "organic food":
      case "local cuisine":
      case "organic meals":
        return <Coffee className="w-4 h-4" />;
      case "mountain view":
      case "valley view":
        return <Mountain className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const filteredHomestays =
    selectedLocation === "all"
      ? homestays
      : homestays.filter((homestay) => homestay.location === selectedLocation);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleHomestayClick = (homestayId: number) => {
    router.push(`/homestays/${homestayId}`);
  };

  return (
    <div className="w-full bg-linear-to-br from-gray-50 to-white py-16 sm:py-20 lg:py-24">
      <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Authentic <span className="text-[#005246]">Homestays</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay with local families and experience the warmth of Arunachal
            hospitality
          </p>

          {/* Location Filter */}
          {/* <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedLocation === location.id
                    ? "bg-[#005246] text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg"
                }`}
              >
                {location.name}
                <span className="ml-2 text-xs opacity-75">
                  ({location.count})
                </span>
              </button>
            ))}
          </div> */}
        </div>

        {/* Homestays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredHomestays.map((homestay) => (
            <div
              key={homestay.id}
              onClick={() => handleHomestayClick(homestay.id)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Featured Badge */}
                {homestay.featured && (
                  <div className="absolute top-4 left-4 bg-[#005246] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(homestay.id);
                  }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(homestay.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Location Badge */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {locations.find((loc) => loc.id === homestay.location)?.name}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#005246] transition-colors">
                    {homestay.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-bold text-[#005246]">
                      {homestay.price}
                    </div>
                    <div className="text-xs text-gray-500">per night</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {homestay.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({homestay.reviews} reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {homestay.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {homestay.amenities.slice(0, 4).map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                {/* Host Info */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Hosted by {homestay.host}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <a
                          href={`tel:${homestay.contact.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-[#005246] hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                        <a
                          href={`mailto:${homestay.contact.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-[#005246] hover:underline"
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHomestayClick(homestay.id);
                  }}
                  className="w-full bg-[#005246] text-white font-semibold py-3 rounded-xl hover:bg-[#00735f] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {/* <div className="text-center mt-12">
          <button className="bg-white text-[#005246] border-2 border-[#005246] font-semibold px-8 py-3 rounded-full hover:bg-[#005246] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
            Load More Homestays
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Homestays;
