export interface HomestayType {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  amenities: string[];
  host: string;
  contact: {
    phone: string;
    email: string;
  };
  featured: boolean;
}

export const homestays: HomestayType[] = [
  {
    id: 1,
    name: "Mountain View Homestay",
    location: "tawang",
    image:
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.8,
    reviews: 124,
    price: "₹2,500",
    description:
      "Experience authentic Monpa culture with stunning monastery views",
    amenities: ["Wifi", "Parking", "Meals", "Mountain View"],
    host: "Tenzin Norbu",
    contact: {
      phone: "+91 98765 43210",
      email: "tenzin@mountainview.com",
    },
    featured: true,
  },
  {
    id: 2,
    name: "Peaceful Valley Stay",
    location: "dirang",
    image:
      "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.7,
    reviews: 89,
    price: "₹2,000",
    description: "Cozy homestay surrounded by apple orchards and hot springs",
    amenities: ["Wifi", "Hot Springs", "Organic Food", "Garden"],
    host: "Karma Lhamo",
    contact: {
      phone: "+91 98765 43211",
      email: "karma@peacefulvalley.com",
    },
    featured: false,
  },
  {
    id: 3,
    name: "Himalayan Heritage Home",
    location: "bomdila",
    image:
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.9,
    reviews: 156,
    price: "₹2,800",
    description:
      "Traditional architecture with modern comforts and craft workshops",
    amenities: ["Wifi", "Cultural Tours", "Handicrafts", "Library"],
    host: "Lobsang Tashi",
    contact: {
      phone: "+91 98765 43212",
      email: "lobsang@heritage.com",
    },
    featured: true,
  },
];

export const locations = [
  { id: "all", name: "All Locations", count: 6 },
  { id: "tawang", name: "Tawang", count: 2 },
  { id: "bomdila", name: "Bomdila", count: 2 },
  { id: "dirang", name: "Dirang", count: 2 },
];