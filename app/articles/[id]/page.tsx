import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import ArticlePageClient from "../../../client/ArticleClient";

type ArticlePageProps = {
    params: {
        id: string;
    };
};

export function generateMetadata({ params }: ArticlePageProps): Metadata {
    const article = articles.find((item) => item.id === params.id);

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

export default function ArticlePage({ params }: ArticlePageProps) {
    const article = articles.find((item) => item.id === params.id);

    if (!article) {
        notFound();
    }

    return <ArticlePageClient />;
}
