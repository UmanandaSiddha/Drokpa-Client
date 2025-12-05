export interface Activity {
  id: number;
  title: string;
  image: string;
  shortInfo: string;
  details: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: "Monastery Walk",
    image:
      "https://images.unsplash.com/photo-1605904583059-7880dad25595?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shortInfo: "Explore sacred monasteries.",
    details:
      "Experience the peaceful aura of ancient monasteries, interact with monks, and learn about Buddhist philosophy.",
  },
  {
    id: 2,
    title: "Mountain Trek",
    image:
      "https://plus.unsplash.com/premium_photo-1677002259522-111b3e74786f?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shortInfo: "Explore scenic trails.",
    details:
      "Journey through breathtaking landscapes, lush forests, and serene mountain paths, perfect for nature lovers.",
  },
  {
    id: 3,
    title: "Traditional Paper Making",
    image:
      "https://images.unsplash.com/photo-1719563014708-85b38508ee52?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shortInfo: "Witness local traditions.",
    details:
      "Watch artisans craft handmade paper using ancient techniques passed down through generations.",
  },
  {
    id: 4,
    title: "Cultural Program",
    image:
      "https://images.unsplash.com/photo-1584137283390-2284026dc0e0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shortInfo: "Celebrate culture and tradition.",
    details:
      "Enjoy vibrant performances that bring local folklore and traditional costumes to life.",
  },
  {
    id: 5,
    title: "The Mago Trek",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shortInfo: "Soar above the landscapes.",
    details:
      "Take in panoramic views from above during a peaceful sunrise hot air balloon ride.",
  },
  {
    id: 6,
    title: "Photowalk Through Village",
    image:
      "https://images.unsplash.com/photo-1745389501846-847843861794?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shortInfo: "Peaceful and Heart Soothing Villages.",
    details:
      "Navigate exciting Villages and Explore the Things You have never seen.",
  },
  {
    id: 7,
    title: "Local Market Tour",
    image:
      "https://images.unsplash.com/photo-1728819748487-817bf96f4dba?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    shortInfo: "Taste /Dress and shop Local.",
    details:
      "Explore bustling markets filled with handicrafts, spices, and delicious street local food.",
  },
];
