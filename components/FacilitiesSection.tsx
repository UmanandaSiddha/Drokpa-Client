"use client";

import { DrokpaGreenLogo } from "@/assets";
import {
	Bed,
	Utensils,
	Car,
	Route,
	FileCheck2,
	MapPin,
	Users
} from "lucide-react";
import Image from "next/image";

const facilities = [
	{ icon: <Bed size={48} />, title: "Comfortable Stay", desc: "Clean and cozy homestays with warm hospitality." },
	{ icon: <Utensils size={48} />, title: "Eat Like a Local", desc: "Delicious homemade meals with authentic local flavors." },
	{ icon: <Car size={48} />, title: "Private Transport", desc: "Safe and reliable private vehicles for your journey." },
	{
		icon: <Route size={48} />,
		title: "Smart Routes",
		desc: "Plan efficient routes to explore more in less time."
	},
	{ icon: <FileCheck2 size={48} />, title: "No Paperwork", desc: "Hassle-free digital bookings—no documents required." },
	{ icon: <MapPin size={48} />, title: "Local Guidance", desc: "Explore hidden gems with our local travel experts." },
	{ icon: <Users size={48} />, title: "Meet Locals", desc: "Connect with local communities and culture." },
];

const FacilitiesSection = () => {
	return (
		<section
			className="py-16"
			style={{
				background: "linear-gradient(to bottom, #FFF0CA, #FFFFFF)",
				color: "#005246",
			}}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

				{/*  TITLE SECTION  */}
				<div className="relative w-full py-6">
					<h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#005246] text-center sm:text-left sm:absolute sm:left-20 md:left-32 lg:left-40">Here's What</h2>

					<h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-wide text-center mt-8 sm:mt-2 text-[#005246]">
						Drokpa
					</h1>

					<h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#005246] text-center sm:text-right mt-4 sm:mt-0 sm:absolute sm:right-20 md:right-32 lg:right-40">
						bring's to your Trip
					</h2>

					<div className="h-12 sm:h-20"></div>
				</div>

				{/* DIVIDER WITH LOGO */}
				<div className="w-full my-8 flex items-center justify-center">
					<div className="w-[45%] border-t border-green-800" />

					<div className="flex justify-center items-center px-4">
						<Image src={DrokpaGreenLogo} alt="logo" width={48} height={48} />
					</div>

					<div className="w-[45%] border-t border-green-800" />
				</div>

				{/*  FACILITIES GRID */}
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
					{facilities.map((item, index) => (
						<div
							key={index}
							className={`flex flex-col items-center text-center p-4 sm:p-6 rounded-xl
        ${index === facilities.length - 1 ? "col-span-2 md:col-span-1 mx-auto" : ""}
      `}
						>
							<div className="mb-4 text-[#005246]">{item.icon}</div>
							<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
								{item.title}
							</h3>
							<p className="text-xs sm:text-sm md:text-base opacity-80">
								{item.desc}
							</p>
						</div>
					))}
				</div>

			</div>
		</section>
	);
};

export default FacilitiesSection;
