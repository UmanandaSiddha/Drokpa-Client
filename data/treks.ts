export interface Guide {
    id: number;
    name: string;
    image: string;
    experience: string;
    specialization: string;
    rating: number;
    languages: string[];
    bio: string;
}

export interface Trek {
    id: number;
    title: string;
    duration: string;
    image: string;
    rating: number;
    description: string;
    difficulty: "Easy" | "Moderate" | "Difficult" | "Challenging";
    maxAltitude: string;
    distance: string;
    bestSeason: string;
    features: string[];
    price: number;
    originalPrice: number;
    discount: string;
    guide: Guide;
}

const treks: Trek[] = [
    {
        id: 1,
        title: "Bailey Trail Trek",
        duration: "7 Days - 6 Nights",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
        rating: 4.9,
        description: "Experience the historic Bailey Trail, a legendary route through the Eastern Himalayas. Trek through pristine forests, cross suspension bridges, and witness breathtaking mountain vistas while following the path of one of India's most iconic trails.",
        difficulty: "Challenging",
        maxAltitude: "4,200m",
        distance: "65 km",
        bestSeason: "March - May, September - November",
        features: ["Mountain Views", "Historic Trail", "Cultural Experience", "Wildlife Spotting"],
        price: 15999,
        originalPrice: 20000,
        discount: "20% off",
        guide: {
            id: 1,
            name: "Tashi Dorjee",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            experience: "12 Years",
            specialization: "High Altitude Treks",
            rating: 4.9,
            languages: ["English", "Hindi", "Monpa"],
            bio: "Tashi has been leading treks in Arunachal Pradesh for over a decade. Born and raised in Tawang, he has intimate knowledge of the terrain and local culture. He's certified in wilderness first aid and has successfully led over 200 expeditions."
        }
    },
    {
        id: 2,
        title: "Seven Lakes Trek",
        duration: "5 Days - 4 Nights",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
        rating: 4.8,
        description: "Discover seven pristine alpine lakes nestled in the heart of the Eastern Himalayas. This sacred trail offers a spiritual journey through untouched wilderness, with each lake revealing its own unique beauty and mystical charm.",
        difficulty: "Moderate",
        maxAltitude: "3,800m",
        distance: "45 km",
        bestSeason: "April - June, September - October",
        features: ["Alpine Lakes", "Spiritual Trail", "Photography", "Camping"],
        price: 12999,
        originalPrice: 16000,
        discount: "25% off",
        guide: {
            id: 2,
            name: "Pemba Sherpa",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            experience: "10 Years",
            specialization: "Alpine Lakes & Photography",
            rating: 4.8,
            languages: ["English", "Hindi", "Sherpa", "Nepali"],
            bio: "Pemba is an expert photographer and trekking guide who specializes in capturing the beauty of Himalayan landscapes. His deep understanding of the region's ecology and culture enriches every trek he leads."
        }
    },
    {
        id: 3,
        title: "Gorichen Peak Base Camp",
        duration: "8 Days - 7 Nights",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 4.9,
        description: "Challenge yourself with a trek to the base camp of Gorichen Peak, Arunachal Pradesh's highest mountain. Experience the raw beauty of glaciers, moraines, and towering peaks in one of India's most remote trekking destinations.",
        difficulty: "Challenging",
        maxAltitude: "4,800m",
        distance: "75 km",
        bestSeason: "May - June, September",
        features: ["Glacier Views", "High Altitude", "Remote Wilderness", "Challenging Terrain"],
        price: 19999,
        originalPrice: 25000,
        discount: "20% off",
        guide: {
            id: 3,
            name: "Karma Wangdi",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
            experience: "15 Years",
            specialization: "High Altitude Expeditions",
            rating: 5.0,
            languages: ["English", "Hindi", "Monpa", "Tibetan"],
            bio: "Karma is one of the most experienced high-altitude guides in the region. With numerous successful expeditions to his credit, including multiple ascents of major Himalayan peaks, he brings unmatched expertise to every trek."
        }
    },
    {
        id: 4,
        title: "Mechuka Valley Trek",
        duration: "6 Days - 5 Nights",
        image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop",
        rating: 4.7,
        description: "Explore the enchanting Mechuka Valley, often called 'The Land of the Memba'. Trek through lush meadows, traditional villages, and alongside the turquoise Yargyap Chu river, experiencing the unique Memba culture.",
        difficulty: "Moderate",
        maxAltitude: "3,200m",
        distance: "50 km",
        bestSeason: "March - May, September - November",
        features: ["Cultural Immersion", "Valley Views", "River Trails", "Village Stays"],
        price: 13999,
        originalPrice: 17500,
        discount: "20% off",
        guide: {
            id: 4,
            name: "Norbu Lama",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
            experience: "9 Years",
            specialization: "Cultural & Valley Treks",
            rating: 4.7,
            languages: ["English", "Hindi", "Memba", "Adi"],
            bio: "Norbu grew up in Mechuka and has deep connections with the local communities. His treks offer authentic cultural experiences, including homestays and interactions with local families."
        }
    },
    {
        id: 5,
        title: "Namdapha Forest Trail",
        duration: "9 Days - 8 Nights",
        image: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop",
        rating: 4.8,
        description: "Journey through India's easternmost national park, home to the rare snow leopard, red panda, and clouded leopard. This unique trek combines biodiversity exploration with adventure in one of the world's richest tropical forests.",
        difficulty: "Moderate",
        maxAltitude: "3,500m",
        distance: "70 km",
        bestSeason: "October - April",
        features: ["Wildlife Safari", "Biodiversity", "Jungle Camping", "Bird Watching"],
        price: 17999,
        originalPrice: 22000,
        discount: "18% off",
        guide: {
            id: 5,
            name: "Rinchen Lepcha",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
            experience: "11 Years",
            specialization: "Wildlife & Forest Treks",
            rating: 4.9,
            languages: ["English", "Hindi", "Lepcha", "Assamese"],
            bio: "Rinchen is a trained naturalist and wildlife enthusiast. His expertise in tracking and identifying flora and fauna makes him the perfect guide for experiencing Namdapha's incredible biodiversity."
        }
    },
    {
        id: 6,
        title: "Dirang Valley Circuit",
        duration: "4 Days - 3 Nights",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 4.6,
        description: "A gentle trek perfect for beginners, exploring the scenic Dirang Valley. Walk through apple orchards, hot springs, and traditional Monpa villages, with views of snow-capped peaks in the distance.",
        difficulty: "Easy",
        maxAltitude: "2,800m",
        distance: "30 km",
        bestSeason: "March - November",
        features: ["Easy Trek", "Hot Springs", "Apple Orchards", "Monasteries"],
        price: 9999,
        originalPrice: 12000,
        discount: "17% off",
        guide: {
            id: 6,
            name: "Sonam Tenzin",
            image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
            experience: "7 Years",
            specialization: "Beginner Treks & Cultural Tours",
            rating: 4.7,
            languages: ["English", "Hindi", "Monpa", "Dzongkha"],
            bio: "Sonam is known for his patience and encouraging approach, making him ideal for first-time trekkers. His knowledge of local Monpa culture and traditions adds rich context to the journey."
        }
    }
];

export default treks;
