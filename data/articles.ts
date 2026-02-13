import { Inspired1, Inspired2, Inspired3, Inspired4, Inspired5 } from "@/assets";

export interface Article {
    id: string;
    title: string;
    description: string;
    image: string;
    readTime: string;
    tags: string[];
    location: string;
    content: string[];
}

export const articles: Article[] = [
    {
        id: "seven-lakes",
        title: "Where Seven Lakes Guard the Himalayas.",
        description:
            "Seven high-altitude lakes cradle Himalayan peaks, offering solitude, reflection, and a trek that feels both challenging and deeply sacred.",
        image: Inspired1.src,
        readTime: "7 min read",
        tags: ["Trek", "Lakes", "Sacred"],
        location: "Tawang, Arunachal",
        content: [
            "The seven lakes sit like scattered mirrors, each reflecting a different mood of the mountains. On clear days, ridgelines repeat endlessly, and the wind carries a thin, bright hush that feels ceremonial.",
            "The route climbs steadily through dwarf rhododendrons and open grassland, then narrows into granite steps carved by snowfall. In late afternoon, clouds sweep low, and the color of the water changes from steel to deep green.",
            "Locals speak of the lakes as resting places for the elements. You notice it in small things: the light feels slower, your breath finds a calm rhythm, and every footstep is cushioned by silence.",
        ],
    },
    {
        id: "trails-that-test",
        title: "Trails That Test, Views That Reward.",
        description:
            "A study of endurance on high passes and the kind of summit panoramas that reset your sense of scale.",
        image: Inspired2.src,
        readTime: "5 min read",
        tags: ["Trek", "Pass", "Panorama"],
        location: "Sela Range",
        content: [
            "There is a clarity to hard climbs. The path is honest, the mountain is patient, and every step insists you earn the view.",
            "When the ridge opens, the valley drops away like a page turning. Snowfields stretch across the horizon, and your attention narrows to breath, light, and distance.",
            "These are the trails that leave you strong and quiet, with a memory of sky that lasts long after your boots are clean.",
        ],
    },
    {
        id: "silence-snow-sacred",
        title: "Silence, Snow, and Sacred Ground.",
        description:
            "A winter passage through old monasteries, cedar forests, and the kind of snow that makes every sound feel softer.",
        image: Inspired3.src,
        readTime: "6 min read",
        tags: ["Winter", "Monastery", "Culture"],
        location: "Dirang",
        content: [
            "Snow falls differently here. It is more deliberate, more vertical, as if the sky is laying down a blessing one flake at a time.",
            "Paths wind past wooden monasteries and prayer wheels that click in the cold. The cedar forest holds the scent of resin and smoke.",
            "By evening, the valley quiets into an almost sacred stillness. You understand why people return to this route again and again.",
        ],
    },
    {
        id: "mechuka-breathe",
        title: "Mechuka: Where the Mountains Breathe.",
        description:
            "Wide valley floors, braided rivers, and alpine light that turns every ridge into a soft silhouette.",
        image: Inspired4.src,
        readTime: "4 min read",
        tags: ["Valley", "Rivers", "Landscape"],
        location: "Mechuka",
        content: [
            "Mechuka feels like a long exhale. The valley is wide, the light is gentle, and the river braids the land into silver ribbons.",
            "You can hear yak bells, distant laughter, and the thrum of water over stones. It is a place that invites long walks and unhurried meals.",
            "By dusk, the hills blush with pink and gold, and the mountains seem to breathe right alongside you.",
        ],
    },
    {
        id: "ziro-dreamscape",
        title: "Floating Over Ziro's Dreamscape.",
        description:
            "Early mist drifts above rice terraces while the town wakes slowly, framed by pine and soft light.",
        image: Inspired5.src,
        readTime: "5 min read",
        tags: ["Valley", "Culture", "Dawn"],
        location: "Ziro",
        content: [
            "Ziro at dawn looks unreal, like someone has set a veil over the terraces just long enough for you to notice the quiet artistry of the land.",
            "As the sun rises, the mist lifts in slow folds. Farmers move through the fields, and the air smells of damp earth and pine.",
            "It is a gentle kind of grandeur, one you feel in your chest more than you see with your eyes.",
        ],
    },
];
