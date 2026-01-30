export interface Homestay {
    id: number;
    name: string;
    title: string; // For carousel compatibility
    duration: string;
    image: string;
    rating: number;
    reviews: number;
    description: string;
    amenities: string[];
    features: string[]; // For carousel compatibility
    price: number;
    originalPrice: number;
    discount: string;
    location: string;
    host: string;
    contact: {
        phone: string;
        email: string;
    };
    featured?: boolean;
}

const homestays: Homestay[] = [
    {
        id: 1,
        name: "Mountain View Homestay",
        title: "Mountain View Homestay",
        duration: "Per Night",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        rating: 4.8,
        reviews: 127,
        description: "A cozy homestay nestled in the mountains with breathtaking views and warm hospitality. Experience authentic Arunachal culture while enjoying modern comforts.",
        amenities: ["WiFi", "Mountain View", "Parking", "Meals", "Hot Water"],
        features: ["Mountain View", "Home Cooked Meals", "WiFi"],
        price: 2500,
        originalPrice: 3000,
        discount: "20% off",
        location: "Tawang",
        host: "Tenzin Dorje",
        contact: {
            phone: "+91 98765 43210",
            email: "mountainview@drokpa.com"
        },
        featured: true
    },
    {
        id: 2,
        name: "Riverside Retreat",
        title: "Riverside Retreat",
        duration: "Per Night",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        rating: 4.9,
        reviews: 89,
        description: "Peaceful homestay by the river, perfect for those seeking tranquility and natural beauty. Wake up to the sound of flowing water and birds chirping.",
        amenities: ["Riverside", "Garden", "Parking", "WiFi", "Local Cuisine"],
        features: ["Riverside", "Garden", "Parking"],
        price: 2200,
        originalPrice: 2800,
        discount: "25% off",
        location: "Ziro",
        host: "Nima Tsering",
        contact: {
            phone: "+91 98765 43211",
            email: "riverside@drokpa.com"
        },
        featured: false
    },
    {
        id: 3,
        name: "Traditional Arunachal Home",
        title: "Traditional Arunachal Home",
        duration: "Per Night",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        rating: 4.7,
        reviews: 156,
        description: "Experience authentic local culture in this traditional homestay with modern amenities. Learn about local traditions and enjoy home-cooked meals.",
        amenities: ["Traditional", "Cultural Experience", "Local Food", "WiFi", "Parking"],
        features: ["Traditional", "Cultural Experience", "Local Food"],
        price: 2000,
        originalPrice: 2500,
        discount: "15% off",
        location: "Bomdila",
        host: "Sonam Wangchuk",
        contact: {
            phone: "+91 98765 43212",
            email: "traditional@drokpa.com"
        },
        featured: false
    },
    {
        id: 4,
        name: "Forest Edge Homestay",
        title: "Forest Edge Homestay",
        duration: "Per Night",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        rating: 4.85,
        reviews: 203,
        description: "Wake up to the sounds of nature in this serene homestay at the edge of the forest. Perfect for nature lovers and bird watchers.",
        amenities: ["Forest View", "Nature Walk", "Bird Watching", "WiFi", "Parking", "Organic Food"],
        features: ["Forest View", "Nature Walk", "Bird Watching"],
        price: 2800,
        originalPrice: 3500,
        discount: "30% off",
        location: "Dirang",
        host: "Pema Lhamo",
        contact: {
            phone: "+91 98765 43213",
            email: "forestedge@drokpa.com"
        },
        featured: true
    },
    {
        id: 5,
        name: "Valley View Homestay",
        title: "Valley View Homestay",
        duration: "Per Night",
        image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        rating: 4.6,
        reviews: 94,
        description: "Stunning valley views from every room in this comfortable and welcoming homestay. Enjoy panoramic views of the surrounding mountains.",
        amenities: ["Valley View", "Sunrise View", "Terrace", "WiFi", "Parking", "Meals"],
        features: ["Valley View", "Sunrise View", "Terrace"],
        price: 2400,
        originalPrice: 3000,
        discount: "20% off",
        location: "Tawang",
        host: "Karma Dorje",
        contact: {
            phone: "+91 98765 43214",
            email: "valleyview@drokpa.com"
        },
        featured: false
    },
    {
        id: 6,
        name: "Heritage Homestay",
        title: "Heritage Homestay",
        duration: "Per Night",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
        rating: 4.75,
        reviews: 178,
        description: "A beautifully preserved heritage property offering a glimpse into local history and culture. Experience the charm of traditional architecture.",
        amenities: ["Heritage", "Historical", "Guided Tours", "WiFi", "Parking", "Local Cuisine"],
        features: ["Heritage", "Historical", "Guided Tours"],
        price: 3000,
        originalPrice: 3800,
        discount: "25% off",
        location: "Itanagar",
        host: "Dawa Tsering",
        contact: {
            phone: "+91 98765 43215",
            email: "heritage@drokpa.com"
        },
        featured: true
    },
    {
        id: 7,
        name: "Sunset Point Homestay",
        title: "Sunset Point Homestay",
        duration: "Per Night",
        image: "https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=800&h=600&fit=crop",
        rating: 4.9,
        reviews: 142,
        description: "Watch spectacular sunsets from this elevated homestay with panoramic mountain views. Perfect for photography enthusiasts and nature lovers.",
        amenities: ["Sunset View", "Mountain View", "Photography", "WiFi", "Parking", "Terrace"],
        features: ["Sunset View", "Mountain View", "Photography"],
        price: 3200,
        originalPrice: 4000,
        discount: "20% off",
        location: "Ziro",
        host: "Tashi Namgyal",
        contact: {
            phone: "+91 98765 43216",
            email: "sunsetpoint@drokpa.com"
        },
        featured: false
    },
];

export default homestays;
