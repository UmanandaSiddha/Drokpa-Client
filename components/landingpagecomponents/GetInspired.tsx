import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  description?: string;
  image: string;
  size: 'large' | 'small';
}

export default function GetInspired() {
  const articles: Article[] = [
    {
      id: 1,
      title: "Where Seven Lakes Guard the Himalayas.",
      description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
      size: "large"
    },
    {
      id: 2,
      title: "Trails That Test, Views That Reward.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      size: "small"
    },
    {
      id: 3,
      title: "Silence, Snow, and Sacred Ground.",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop",
      size: "small"
    },
    {
      id: 4,
      title: "Mechuka: Where the Mountains Breathe.",
      image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop",
      size: "small"
    },
    {
      id: 5,
      title: "Floating Over Ziro's Dreamscape.",
      image: "https://images.unsplash.com/photo-1586276393635-5ecd8a851acc?w=600&h=400&fit=crop",
      size: "small"
    }
  ];

  const largeArticle = articles.find(a => a.size === 'large');
  const smallArticles = articles.filter(a => a.size === 'small');

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl w-[95%] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="inline-block mb-4">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded">
              GET INSPIRED.
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Large Featured Article */}
          {largeArticle && (
            <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer lg:row-span-2">
              <div className="relative h-[400px] sm:h-[500px] lg:h-full">
                <img
                  src={largeArticle.image}
                  alt={largeArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    {largeArticle.title}
                  </h2>
                  {largeArticle.description && (
                    <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 leading-relaxed max-w-xl">
                      {largeArticle.description}
                    </p>
                  )}
                  <button className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Small Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
            {smallArticles.map((article) => (
              <div
                key={article.id}
                className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-64 sm:h-72 lg:h-56">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Articles Button */}
        <div className="flex justify-center mt-10 sm:mt-12 md:mt-16">
          <button className="group flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-white border-2 border-gray-300 hover:border-gray-900 text-gray-900 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 hover:shadow-lg">
            View All Articles
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}