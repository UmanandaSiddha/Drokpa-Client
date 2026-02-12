import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";

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
	title: "Drokpa",
	description: "Created by Siddha",
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
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
