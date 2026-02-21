import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const subjectivity = localFont({
	src: [
		{
			path: "../fonts/subjectivity/Subjectivity-Thin.otf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../fonts/subjectivity/Subjectivity-Light.otf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../fonts/subjectivity/Subjectivity-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../fonts/subjectivity/Subjectivity-Medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../fonts/subjectivity/Subjectivity-Bold.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../fonts/subjectivity/Subjectivity-ExtraBold.otf",
			weight: "800",
			style: "normal",
		},
		{
			path: "../fonts/subjectivity/Subjectivity-Black.otf",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--font-subjectivity",
});

export const metadata: Metadata = {
	title: {
		default: "Drokpa - Your Local Travel Buddy in Arunachal Pradesh",
		template: "%s | Drokpa",
	},
	description: "Discover authentic travel experiences in Arunachal Pradesh. Explore local homestays, guided treks, cultural activities, and exclusive experiences curated by locals.",
	keywords: [
		"Arunachal Pradesh travel",
		"homestays in Arunachal Pradesh",
		"trekking Arunachal Pradesh",
		"local travel experiences",
		"adventure tourism",
		"ILP Arunachal Pradesh",
		"travel buddy",
		"authentic travel",
	],
	openGraph: {
		title: "Drokpa - Your Local Travel Buddy in Arunachal Pradesh",
		description: "Discover authentic travel experiences in Arunachal Pradesh. Explore local homestays, guided treks, cultural activities, and exclusive experiences curated by locals.",
		images: [
			{
				url: "https://www.drokpa.in/og.png",
				width: 1200,
				height: 630,
				alt: "Drokpa - Your Local Travel Buddy",
				type: "image/png",
			},
		],
		url: "https://www.drokpa.in",
		siteName: "Drokpa",
		type: "website",
		locale: "en_IN",
	},
	twitter: {
		card: "summary_large_image",
		title: "Drokpa - Your Local Travel Buddy",
		description: "Discover authentic travel experiences in Arunachal Pradesh",
		images: ["https://www.drokpa.in/og.png"],
		creator: "@drokpa",
	},
	alternates: {
		canonical: "https://www.drokpa.in",
	},
	authors: [
		{
			name: "Drokpa",
			url: "https://www.drokpa.in",
		},
	],
	creator: "Drokpa",
	publisher: "Drokpa",
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
	},
	icons: {
		icon: "/favicon.ico",
	},
	category: "Travel & Tourism",
	verification: {
		google: "your-google-verification-code",
	},
};


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${subjectivity.variable} antialiased overflow-x-hidden`}
				style={{ "--font-mona-sans": '"Mona Sans", sans-serif' } as React.CSSProperties}
			>
				<Providers>
					<SiteChrome>{children}</SiteChrome>
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
