import { Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";

export const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: "500",
});

//font for the nav bar title; change this as per requirement
export const kabelBlack = localFont({
  src: "./Kabel Black Regular/Kabel Black Regular.otf",
  variable: "--font-kabel-black",
  weight: "400",
});
