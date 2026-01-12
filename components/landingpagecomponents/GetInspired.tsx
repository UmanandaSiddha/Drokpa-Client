import React from "react";

interface Article {
  id: number;
  title: string;
  description?: string;
  image: string;
  size: "large" | "small";
}

export default function GetInspired() {
  const articles: Article[] = [
    {
      id: 1,
      title: "Where Seven Lakes Guard the Himalayas.",
      description:
        "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1300&fit=crop",
      size: "large",
    },
    {
      id: 2,
      title: "Trails That Test, Views That Reward.",
      image:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&h=600&fit=crop",
      size: "small",
    },
    {
      id: 3,
      title: "Silence, Snow, and Sacred Ground.",
      image:
        "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=900&h=600&fit=crop",
      size: "small",
    },
    {
      id: 4,
      title: "Mechuka: Where the Mountains Breathe.",
      image:
        "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&h=600&fit=crop",
      size: "small",
    },
    {
      id: 5,
      title: "Floating Over Ziro’s Dreamscape.",
      image:
        "https://images.unsplash.com/photo-1586276393635-5ecd8a851acc?w=900&h=600&fit=crop",
      size: "small",
    },
  ];

  const largeArticle = articles.find(a => a.size === "large");
  const smallArticles = articles.filter(a => a.size === "small");

 return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-sm" />
          <span className="text-sm font-bold tracking-wide uppercase">
            GET INSPIRED.
          </span>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT FEATURE */}
          {largeArticle && (
            <div className="group">
              <div className="relative overflow-hidden rounded-xl cursor-pointer">
                <img
                  src={largeArticle.image}
                  alt={largeArticle.title}
                  className="w-full h-[520px] object-cover"
                />
              </div>
              
              <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900">
                {largeArticle.title}
              </h2>

              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {largeArticle.description}
              </p>

              <button className="mt-4 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center px-5 py-2 bg-[#686766] hover:bg-gray-600 text-white rounded text-sm font-medium">
                Read More
              </button>
            </div>
          )}

          {/* RIGHT GRID */}
          <div className="grid grid-cols-2 gap-6">
            {smallArticles.map(article => (
              <div key={article.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-[250px] object-cover"
                  />
                </div>

                <h3 className="mt-3 text-xl font-bold leading-snug text-gray-900">
                  {article.title}
                </h3>
                
                {/* Read More button - appears on hover */}
                <button className="mt-2 px-5 py-2 cursor-pointer bg-[#686766] hover:bg-gray-600 text-white rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Read More
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <button className="text-sm px-6 py-2 rounded-sm cursor-pointer text-gray-500 hover:text-gray-700 bg-[#F4F4F4] inline-flex items-center gap-1 font-medium">
            View All Articles
            <span className="text-lg">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
