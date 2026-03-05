import type { MetadataRoute } from "next";
import { tourService } from "@/services/tour.service";
import { homestayService } from "@/services/homestay.service";
import { articles } from "@/data/articles";

const baseUrl = "https://www.drokpa.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

    // Note: generate slug-based URLs for both Tours and Treks
    // (keeps sitemap consistent with /tours/[slug] and /treks/[slug]).
    let tourRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await tourService.getTours({ limit: 1000 });
        tourRoutes = (res.data || [])
            .filter((t) => Boolean(t.slug))
            .map((t) => ({
                url: `${baseUrl}/${t.type === "TREK" ? "treks" : "tours"}/${t.slug}`,
                lastModified: now,
            }));
    } catch {
        tourRoutes = [];
    }

    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: now,
    }));

    let homestayRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await homestayService.getHomestays({ limit: 1000 });
        homestayRoutes = (res.data || [])
            .filter((h) => Boolean(h.slug))
            .map((h) => ({
                url: `${baseUrl}/homestays/${h.slug}`,
                lastModified: now,
            }));
    } catch {
        homestayRoutes = [];
    }

    return [...staticRoutes, ...tourRoutes, ...articleRoutes, ...homestayRoutes];
}