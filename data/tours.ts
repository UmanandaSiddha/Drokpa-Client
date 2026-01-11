export interface Tour {
    id: number;
    title: string;
    duration: string;
    image: string;
    rating: number;
    description: string;
    features: string[];
    price: number;
    originalPrice: number;
    discount: string;
}

const tours: Tour[] = [
    {
        id: 1,
        title: "Seven Lakes Trek",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
        rating: 4.9,
        description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        features: ["Sight Seeing", "2:00 hr Trek", "Day Hike"],
        price: 7899,
        originalPrice: 10000,
        discount: "25% off"
    },
    {
        id: 2,
        title: "Ziro, Arunachal Pradesh",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 4.67,
        description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        features: ["Sight Seeing", "2:00 hr Trek", "Day Hike"],
        price: 7899,
        originalPrice: 10000,
        discount: "25% off"
    },
    {
        id: 3,
        title: "Seven Lakes Trek",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
        rating: 4.8,
        description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        features: ["Sight Seeing", "2:00 hr Trek", "Day Hike"],
        price: 7899,
        originalPrice: 10000,
        discount: "25% off"
    },
    {
        id: 4,
        title: "Sela Pass",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 4.75,
        description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        features: ["Sight Seeing", "2:00 hr Trek", "Day Hike"],
        price: 7899,
        originalPrice: 10000,
        discount: "25% off"
    },
    {
        id: 5,
        title: "Sela Pass",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 4.75,
        description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        features: ["Sight Seeing", "2:00 hr Trek", "Day Hike"],
        price: 7899,
        originalPrice: 10000,
        discount: "25% off"
    },
    {
        id: 6,
        title: "Sela Pass",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 4.75,
        description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        features: ["Sight Seeing", "2:00 hr Trek", "Day Hike"],
        price: 7899,
        originalPrice: 10000,
        discount: "25% off"
    },
    {
        id: 7,
        title: "Sela Pass",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 4.75,
        description: "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        features: ["Sight Seeing", "2:00 hr Trek", "Day Hike"],
        price: 7899,
        originalPrice: 10000,
        discount: "25% off"
    },
];

export default tours;