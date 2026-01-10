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
    <section className="py-16 px-8">
      <div className="max-w-8xl w-[95%] mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full" />
          <span className="text-sm font-semibold tracking-wide">
            GET INSPIRED.
          </span>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-14">
          
          {/* LEFT FEATURE */}
          {largeArticle && (
            <div>
              <img
                src={largeArticle.image}
                alt={largeArticle.title}
                className="w-full h-[720px] object-cover rounded-2xl"
              />

              <h2 className="mt-8 text-[34px] font-bold leading-tight text-emerald-900">
                {largeArticle.title}
              </h2>

              <p className="mt-4 max-w-md text-gray-600 leading-relaxed">
                {largeArticle.description}
              </p>

              <button className="mt-6 inline-flex items-center px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm font-medium">
                Read More
              </button>
            </div>
          )}

          {/* RIGHT GRID */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-12">
            {smallArticles.map(article => (
              <div key={article.id}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-65 object-cover rounded-2xl"
                />

                <h3 className="mt-3 text-xl font-semibold leading-snug text-black">
                  {article.title}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
