import type { MetadataRoute } from "next";
import tours from "@/data/tours";
import { articles } from "@/data/articles";
import homestays from "@/data/homestays";

const baseUrl = "https://www.drokpa.in";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes = [
        "",
        "/about",
        "/contact",
        "/activities",
        "/articles",
        "/ilp",
        "/our-story",
        "/route-planner",
        "/company-details",
        "/privacy",
        "/terms",
    ].map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.7,
    }));

    const tourRoutes = tours.map((tour) => ({
        url: `${baseUrl}/tours/${tour.id}`,
        lastModified: now,
    }));

    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: now,
    }));

    const homestayRoutes = homestays.map((homestay) => ({
        url: `${baseUrl}/homestays/${homestay.id}`,
        lastModified: now,
    }));

    return [...staticRoutes, ...tourRoutes, ...articleRoutes, ...homestayRoutes];
}