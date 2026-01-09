import React from 'react';
import { Car, Utensils, Compass, FileX, MapPin, Users, Route, User } from 'lucide-react';

interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function WhyDroppa() {
  const features: Feature[] = [
    {
      id: 1,
      icon: <Car className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Comfortable Stay",
      description: "Clean and cozy homestays with warm hospitality."
    },
    {
      id: 2,
      icon: <Utensils className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Eat Like a Local",
      description: "Delicious homemade meals with authentic local flavors."
    },
    {
      id: 3,
      icon: <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Private Transport",
      description: "Safe and reliable private vehicles for your journey."
    },
    {
      id: 4,
      icon: <Route className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Smart Routes",
      description: "Plan efficient routes to explore more in less time."
    },
    {
      id: 5,
      icon: <FileX className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "No Paperwork",
      description: "Hassle-free digital bookings—no documents required."
    },
    {
      id: 6,
      icon: <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Local Guidance",
      description: "Explore hidden gems with our local travel experts."
    },
    {
      id: 7,
      icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Meet Locals",
      description: "Connect with local communities and culture."
    },
    {
      id: 8,
      icon: <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Authentic Journeys",
      description: "Discover places the way they truly are."
    }
  ];

  return (
    <div className="min-h-screen sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl w-[95%] mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="inline-block mb-3 sm:mb-4">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded">
              WHY DROPPA?
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            We bring perfection to<br />
            your not so perfect plan.
          </h1>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              {/* Icon */}
              <div className="mb-4 sm:mb-5 md:mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Line */}
              <div className="mt-4 sm:mt-5 md:mt-6 h-1 w-0 bg-orange-500 rounded-full group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}