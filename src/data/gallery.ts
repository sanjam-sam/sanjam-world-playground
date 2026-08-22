import cafePortrait from "@/assets/IMG_4203.jpeg.asset.json";
import indoorPortrait from "@/assets/FullSizeRender.jpeg.asset.json";
import lakeBoat from "@/assets/IMG_2480.jpeg.asset.json";

/**
 * Photo gallery slots.
 *
 * To use a real photo: upload it as a CDN asset, import the pointer at the top
 * of this file, and set `src` on the matching slot. Leave `src` undefined and
 * the card renders a styled placeholder instead — nothing breaks.
 */

export type Photo = {
  id: string;
  title: string;
  caption: string;
  /** Optional imported image. Undefined renders a placeholder card. */
  src?: string;
  /** Describe the photo for screen readers once a real image is added. */
  alt?: string;
  /** Card shape in the masonry grid. */
  shape?: "tall" | "wide" | "square";
};

export const photos: Photo[] = [
  {
    id: "01",
    title: "Coffee-shop pause",
    caption: "Wood grain, warm lamps and one more message before the day starts.",
    src: cafePortrait.url,
    alt: "Sanjam standing in a wood-panelled cafe, reading his phone under warm lamps.",
    shape: "tall",
  },
  {
    id: "02",
    title: "Cedar-lit evening",
    caption: "Sweater on the shoulders, cedar ceiling overhead, nowhere to rush.",
    src: indoorPortrait.url,
    alt: "Sanjam in a brown long-sleeve tee with a cream sweater over his shoulders, under a cedar ceiling.",
    shape: "square",
  },
  {
    id: "03",
    title: "Nainital, mid-lake",
    caption: "Hills on both sides, yellow oars, and the quietest hour of the trip.",
    src: lakeBoat.url,
    alt: "Sanjam sitting in a yellow rowing boat on a mountain lake with forested hills behind him.",
    shape: "tall",
  },
  { id: "04", title: "Late-night desk", caption: "Where most of this was built.", shape: "wide" },
  { id: "05", title: "Mountain detour", caption: "Wrong turn, better view.", shape: "square" },
  { id: "06", title: "Street food run", caption: "Nine rupees of pure joy.", shape: "square" },
  { id: "07", title: "Rain on glass", caption: "Monsoon, from the dry side.", shape: "tall" },
  { id: "08", title: "Friends, blurry", caption: "Nobody stood still. Perfect.", shape: "wide" },
  {
    id: "09",
    title: "Neon alley",
    caption: "Colours I keep trying to recreate in CSS.",
    shape: "square",
  },
  { id: "10", title: "Morning chai", caption: "The actual project dependency.", shape: "square" },
];

