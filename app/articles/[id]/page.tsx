import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import ArticlePageClient from "../../../client/ArticleClient";

type ArticlePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { id } = await params;
    const article = articles.find((item) => item.id === id);

    if (!article) {
        return {
            title: "Article Not Found | Drokpa",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return {
        title: `${article.title} | Drokpa`,
        description: article.description,
        alternates: {
            canonical: `https://www.drokpa.in/articles/${article.id}`,
        },
        openGraph: {
            title: article.title,
            description: article.description,
            url: `https://www.drokpa.in/articles/${article.id}`,
            images: [article.image],
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id } = await params;
    const article = articles.find((item) => item.id === id);

    if (!article) {
        notFound();
    }

    return <ArticlePageClient />;
}
